import { createHash } from "node:crypto";

// Short content hash for cache-busting asset file names.
export function shortHash(buffer) {
  return createHash("sha256").update(buffer).digest("hex").slice(0, 8);
}

// CSP hash source for an inline script: 'sha256-<base64>'.
export function cspHash(source) {
  return `sha256-${createHash("sha256").update(source, "utf8").digest("base64")}`;
}
