// Build: assemble the deployable site into dist/.
//
// Placeholder stage: copies the hand-written index.html, css/ and js/ as-is.
// The resume.json-driven build replaces this in the next PR; the pipeline
// around it (lint → build → test → preview/deploy) is what this PR proves.

import { cp, mkdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const dist = new URL("../dist/", import.meta.url);

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

// Skip dotfiles (.DS_Store and friends) so they never become deployed assets.
const notDotfile = (src) => !src.split("/").pop().startsWith(".");

for (const entry of ["index.html", "css", "js"]) {
  await cp(new URL(entry, `file://${root}`), new URL(entry, dist), { recursive: true, filter: notDotfile });
}

console.log(`built → ${fileURLToPath(dist)}`);
