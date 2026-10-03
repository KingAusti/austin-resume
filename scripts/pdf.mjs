/* global document */ // used inside page.evaluate(), which runs in the browser
// Render dist/resume.pdf from the built page's print stylesheet with headless Chromium.
//
// The phone number is never in the repo or on the web: if RESUME_PHONE is set in the
// environment (a GitHub secret in CI) it is injected into the print-only contact slot
// just before rendering. The result must be exactly one page.

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { PDFDocument } from "pdf-lib";
import { serve } from "./lib/server.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const dist = path.join(root, "dist");
const resume = JSON.parse(await readFile(path.join(dist, "resume.json"), "utf8"));
const phone = (process.env.RESUME_PHONE ?? "").trim();

const { url, close } = await serve(dist);
const browser = await chromium.launch();

try {
  const page = await browser.newPage();
  await page.emulateMedia({ media: "print" });
  await page.goto(`${url}/`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);

  if (phone) {
    await page.evaluate((value) => {
      const slot = document.querySelector("[data-pdf-phone]");
      slot.textContent = value;
      slot.hidden = false;
    }, phone);
  }

  const rendered = await page.pdf({
    format: "Letter",
    preferCSSPageSize: true,
    printBackground: true,
    tagged: true,
  });

  const doc = await PDFDocument.load(rendered);
  const { basics, skills } = resume;
  doc.setTitle(`${basics.name} — ${basics.label}`);
  doc.setAuthor(basics.name);
  doc.setSubject(basics.label);
  doc.setKeywords(skills.flatMap((group) => group.keywords));
  doc.setCreator(`${basics.url} build`);
  doc.setProducer("Chromium + pdf-lib");

  const pages = doc.getPageCount();
  const bytes = await doc.save();
  await writeFile(path.join(dist, "resume.pdf"), bytes);
  console.log(`resume.pdf: ${pages} page(s), ${bytes.byteLength} B${phone ? ", phone included" : ", no phone"}`);

  if (pages !== 1) {
    console.error("resume.pdf must be exactly one page: tighten src/css/print.css or shorten the content");
    process.exit(1);
  }
} finally {
  await browser.close();
  await close();
}
