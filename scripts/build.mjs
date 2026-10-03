// Build: resume.json + src/ → dist/, the directory Cloudflare Workers serves.
//
//   1. validate resume.json (schema + house rules)         → fail fast on bad content
//   2. copy self-hosted fonts, CSS and JS with content hashes in their file names
//   3. render index.html and 404.html from the templates
//   4. copy static files and resume.json verbatim
//   5. write _headers (strict CSP that whitelists the inline theme script by hash)
//   6. assert: no inline styles, no phone number, every local link resolves, size budget

import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadAndValidate, PHONE_RE } from "./validate.mjs";
import { cspHash, shortHash } from "./lib/hash.mjs";
import { buildInfo } from "./lib/git.mjs";
import { page } from "../src/templates/page.mjs";
import { notFound } from "../src/templates/not-found.mjs";
import { THEME_SCRIPT } from "../src/templates/head.mjs";
import { headers } from "../src/headers.mjs";

const rootUrl = new URL("..", import.meta.url);
const root = fileURLToPath(rootUrl);
const src = path.join(root, "src");
const dist = path.join(root, "dist");

const SITE_URL = process.env.SITE_URL || "https://resume.austinhenry.dev";
const RELEASE = Boolean(process.env.RELEASE);
const BUDGET_BYTES = 150 * 1024;
const CSS_ORDER = ["tokens", "fonts", "base", "layout", "components", "print"];
const FONTS = {
  inter: "node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  mono: "node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2",
};
// Produced by later pipeline steps (PDF render, OG image), so they may be absent at build time.
const DEFERRED_ASSETS = new Set(["/resume.pdf", "/og.png"]);

const sizes = [];

async function emit(relative, content) {
  const target = path.join(dist, relative);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, content);
  sizes.push([relative, Buffer.byteLength(content)]);
  return `/${relative}`;
}

async function emitHashed(dir, name, content) {
  const ext = path.extname(name);
  const base = name.slice(0, -ext.length);
  return emit(`${dir}/${base}.${shortHash(content)}${ext}`, content);
}

// --- 1. content -------------------------------------------------------------

const { resume, errors } = await loadAndValidate(rootUrl, { release: RELEASE });
if (errors.length) {
  console.error(`resume.json: ${errors.length} problem(s)\n  - ${errors.join("\n  - ")}`);
  process.exit(1);
}
const site = resume["x-site"];
const build = buildInfo({ repo: site.repo, previewName: process.env.PREVIEW_NAME });

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

// --- 2. assets --------------------------------------------------------------

const fonts = {};
for (const [key, file] of Object.entries(FONTS)) {
  const buf = await readFile(path.join(root, file));
  fonts[key] = await emitHashed("fonts", path.basename(file).replace("-normal", ""), buf);
}

let css = "";
for (const name of CSS_ORDER) {
  css += (await readFile(path.join(src, "css", `${name}.css`), "utf8")) + "\n";
}
css = css.replace(/__INTER_URL__/g, fonts.inter).replace(/__MONO_URL__/g, fonts.mono);
const cssUrl = await emitHashed("css", "style.css", css);

const jsUrl = await emitHashed("js", "main.js", await readFile(path.join(src, "js", "main.js")));

// --- 3. pages ---------------------------------------------------------------

const ctx = { resume, site, siteUrl: SITE_URL, assets: { css: cssUrl, js: jsUrl, fonts }, build };
const indexHtml = String(page(ctx));
await emit("index.html", indexHtml);
await emit("404.html", String(notFound(ctx)));

// --- 4. static --------------------------------------------------------------

for (const entry of await readdir(path.join(src, "static"))) {
  if (entry.startsWith(".")) continue;
  await cp(path.join(src, "static", entry), path.join(dist, entry));
  sizes.push([entry, (await stat(path.join(dist, entry))).size]);
}
await emit("resume.json", JSON.stringify(resume, null, 2) + "\n");

// --- 5. headers -------------------------------------------------------------

await emit("_headers", headers({ cspHash: cspHash(THEME_SCRIPT) }));

// --- 6. assertions ----------------------------------------------------------

const problems = [];

if (/\sstyle=/.test(indexHtml)) problems.push("index.html contains an inline style attribute (blocked by the CSP)");

for (const file of ["index.html", "404.html", "resume.json"]) {
  if (PHONE_RE.test(await readFile(path.join(dist, file), "utf8"))) problems.push(`${file} contains a phone number`);
}

const ids = new Set([...indexHtml.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
for (const [, url] of indexHtml.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
  if (url.startsWith("#")) {
    if (!ids.has(url.slice(1))) problems.push(`broken anchor ${url}`);
  } else if (url.startsWith("/") && !url.startsWith("//")) {
    const clean = url.split(/[?#]/)[0];
    if (DEFERRED_ASSETS.has(clean)) continue;
    const target = path.join(dist, clean === "/" ? "index.html" : clean);
    try {
      await stat(target);
    } catch {
      problems.push(`broken local link ${url}`);
    }
  }
}

const weighed = sizes.filter(([f]) => /^(index\.html|css\/|js\/|fonts\/)/.test(f));
const total = weighed.reduce((n, [, size]) => n + size, 0);
if (total > BUDGET_BYTES) problems.push(`page weight ${total} B exceeds the ${BUDGET_BYTES} B budget`);

if (problems.length) {
  console.error(`build: ${problems.length} problem(s)\n  - ${problems.join("\n  - ")}`);
  process.exit(1);
}

// --- summary ----------------------------------------------------------------

const width = Math.max(...sizes.map(([f]) => f.length));
for (const [file, size] of sizes) console.log(`  ${file.padEnd(width)}  ${String(size).padStart(7)} B`);
console.log(`  ${"page weight (html+css+js+fonts)".padEnd(width)}  ${String(total).padStart(7)} B  of ${BUDGET_BYTES} B`);
console.log(`built ${build.shortSha}${build.preview ? ` (preview ${build.preview})` : ""} → ${dist}`);
