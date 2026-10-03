// Checks against the built output in dist/. Run `npm run build` first.

import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { test } from "node:test";
import { PDFDocument } from "pdf-lib";
import { cspHash } from "../scripts/lib/hash.mjs";
import { PHONE_RE } from "../scripts/validate.mjs";
import { THEME_SCRIPT } from "../src/templates/head.mjs";

const dist = new URL("../dist/", import.meta.url);
const read = (file) => readFile(new URL(file, dist), "utf8");

test("index.html is a complete document", async () => {
  const html = await read("index.html");
  assert.match(html, /^<!DOCTYPE html>/);
  assert.match(html, /<title>[^<]+<\/title>/);
  assert.match(html, /<meta name="description"/);
  assert.match(html, /<script type="application\/ld\+json">/);
  assert.match(html, /<h1 id="name">/);
});

test("no phone number is published on the web", async () => {
  for (const file of ["index.html", "404.html", "resume.json"]) {
    assert.doesNotMatch(await read(file), PHONE_RE, `${file} contains a phone number`);
  }
});

// Bodies of every <script> element with no attributes (the inline ones). Plain string
// scanning on our own build output; not an HTML sanitizer.
function inlineScripts(html) {
  const bodies = [];
  let from = 0;
  for (;;) {
    const open = html.indexOf("<script>", from);
    if (open === -1) return bodies;
    const start = open + "<script>".length;
    const close = html.indexOf("</script>", start);
    bodies.push(html.slice(start, close));
    from = close;
  }
}

test("the only inline script is the theme script and its CSP hash is in _headers", async () => {
  const html = await read("index.html");
  const inline = inlineScripts(html);
  assert.deepEqual(inline, [THEME_SCRIPT]);
  const headers = await read("_headers");
  assert.ok(headers.includes(`'${cspHash(THEME_SCRIPT)}'`), "CSP hash missing from _headers");
  assert.doesNotMatch(html, /\sstyle=/, "inline style attributes are blocked by the CSP");
});

test("resume.json is served verbatim and is tool-compatible", async () => {
  const served = JSON.parse(await read("resume.json"));
  const source = JSON.parse(await readFile(new URL("../resume.json", import.meta.url), "utf8"));
  assert.deepEqual(served, source);
  assert.equal(served.basics.phone, undefined);
  assert.ok(Array.isArray(served.work[0].highlights));
});

// Produced by `npm run pdf` / `npm run og`, which need a Playwright browser; skipped if absent.
const hasPdf = existsSync(new URL("resume.pdf", dist));
const hasOg = existsSync(new URL("og.png", dist));

test("resume.pdf is a single tagged page with metadata", { skip: !hasPdf && "run npm run pdf first" }, async () => {
  const bytes = await readFile(new URL("resume.pdf", dist));
  assert.equal(bytes.subarray(0, 5).toString(), "%PDF-");
  const doc = await PDFDocument.load(bytes);
  assert.equal(doc.getPageCount(), 1);
  assert.match(doc.getTitle(), /^Austin Henry — /);
  assert.equal(doc.getAuthor(), "Austin Henry");
});

test("og.png is a 1200×630 PNG", { skip: !hasOg && "run npm run og first" }, async () => {
  const bytes = await readFile(new URL("og.png", dist));
  assert.equal(bytes.subarray(1, 4).toString(), "PNG");
  assert.equal(bytes.readUInt32BE(16), 1200);
  assert.equal(bytes.readUInt32BE(20), 630);
});

test("assets are content-hashed", async () => {
  for (const dir of ["css", "js", "fonts"]) {
    for (const file of await readdir(new URL(dir, dist))) {
      assert.match(file, /\.[0-9a-f]{8}\.\w+$/, `${dir}/${file} is not content-hashed`);
    }
  }
});
