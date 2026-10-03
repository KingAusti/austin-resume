// Tiny static server for dist/ so headless Chromium loads the built page exactly as
// production serves it (root-relative asset URLs, real font files). Used by pdf.mjs
// and og.mjs; never deployed.

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".pdf": "application/pdf",
};

export function serve(root) {
  const server = createServer(async (req, res) => {
    let pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    if (pathname.endsWith("/")) pathname += "index.html";
    let file = path.normalize(path.join(root, pathname));
    if (!file.startsWith(root)) {
      res.writeHead(403).end();
      return;
    }
    try {
      await stat(file);
    } catch {
      res.statusCode = 404;
      file = path.join(root, "404.html");
    }
    try {
      const body = await readFile(file);
      res.setHeader("Content-Type", TYPES[path.extname(file)] ?? "application/octet-stream");
      // og.mjs loads the fonts from a page.setContent() document (origin about:blank).
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.end(body);
    } catch {
      res.writeHead(404).end("not found");
    }
  });

  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({
        url: `http://127.0.0.1:${port}`,
        close: () => new Promise((done) => server.close(done)),
      });
    });
  });
}
