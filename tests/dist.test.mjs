// Checks against the built output in dist/. Run `npm run build` first.

import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { test } from "node:test";
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

test("the only inline script is the theme script and its CSP hash is in _headers", async () => {
  const html = await read("index.html");
  const inline = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
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

test("assets are content-hashed", async () => {
  for (const dir of ["css", "js", "fonts"]) {
    for (const file of await readdir(new URL(dir, dist))) {
      assert.match(file, /\.[0-9a-f]{8}\.\w+$/, `${dir}/${file} is not content-hashed`);
    }
  }
});
