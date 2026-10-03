import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const dist = new URL("../dist/", import.meta.url);

test("dist/index.html is built and has a title", async () => {
  const html = await readFile(new URL("index.html", dist), "utf8");
  assert.match(html, /<title>[^<]+<\/title>/);
});
