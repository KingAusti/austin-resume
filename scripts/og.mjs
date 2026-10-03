/* global document */ // used inside page.evaluate(), which runs in the browser
// Render dist/og.png (1200×630) for link previews, using the site's own fonts and palette.

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { escape } from "./lib/html.mjs";
import { serve } from "./lib/server.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const dist = path.join(root, "dist");
const resume = JSON.parse(await readFile(path.join(dist, "resume.json"), "utf8"));
const { basics } = resume;

const fonts = await readdir(path.join(dist, "fonts"));
const inter = fonts.find((f) => f.startsWith("inter-"));
const mono = fonts.find((f) => f.startsWith("jetbrains-mono-"));

const { url, close } = await serve(dist);
const browser = await chromium.launch();

const markup = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><style>
  @font-face { font-family: Inter; font-weight: 100 900; src: url("${url}/fonts/${inter}") format("woff2-variations"); }
  @font-face { font-family: Mono; font-weight: 100 800; src: url("${url}/fonts/${mono}") format("woff2-variations"); }
  html, body { margin: 0; }
  body { position: relative; box-sizing: border-box; width: 1200px; height: 630px; padding: 0 96px; display: flex; flex-direction: column; justify-content: center;
         background: #faf9f6; color: #17171a; font-family: Inter, sans-serif; -webkit-font-smoothing: antialiased; }
  .rule { position: absolute; left: 96px; right: 96px; height: 1px; background: #e3e1db; }
  .kicker { font-family: Mono, monospace; font-size: 22px; letter-spacing: 0.08em; text-transform: uppercase; color: #1a56db; }
  h1 { margin: 14px 0 26px; font-size: 128px; font-weight: 600; letter-spacing: -0.04em; line-height: 1; }
  .tagline { font-family: Mono, monospace; font-size: 26px; color: #5c5c66; }
  .url { position: absolute; left: 96px; bottom: 60px; font-family: Mono, monospace; font-size: 22px; color: #5c5c66; }
</style></head><body>
  <div class="rule" style="top: 72px"></div>
  <div class="kicker">${escape(basics.label)}</div>
  <h1>${escape(basics.name)}</h1>
  <div class="tagline">${escape((basics["x-tagline"] ?? []).join(" · "))}</div>
  <div class="url">${escape(basics.url.replace(/^https?:\/\//, ""))}</div>
  <div class="rule" style="bottom: 120px"></div>
</body></html>`;

try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.setContent(markup, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(dist, "og.png"), type: "png" });
  console.log("og.png: 1200×630");
} finally {
  await browser.close();
  await close();
}
