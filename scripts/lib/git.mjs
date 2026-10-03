import { execFileSync } from "node:child_process";

// Build provenance stamped into the footer. CI passes BUILD_SHA explicitly (the PR
// head sha, since the merge sha a PR workflow checks out does not exist on GitHub).
export function buildInfo({ repo, previewName }) {
  let sha = process.env.BUILD_SHA || "";
  if (!sha) {
    try {
      sha = execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
    } catch {
      sha = "";
    }
  }
  const date = new Date().toISOString().slice(0, 10);
  return {
    sha,
    shortSha: sha ? sha.slice(0, 7) : "dev",
    commitUrl: sha ? `${repo}/commit/${sha}` : repo,
    date,
    preview: previewName || "",
  };
}
