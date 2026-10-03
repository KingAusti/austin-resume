// Validate resume.json: JSON Resume schema plus the house rules the templates
// and the one-page PDF depend on. Exits non-zero (and so fails CI) on any error.

import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import Ajv from "ajv";
import addFormats from "ajv-formats";

export const PHONE_RE = /\b\d{3}[.\-\s]?\d{3}[.\-\s]?\d{4}\b/;

const DISPLAY = ["featured", "full", "compact", "earlier"];
const HIGHLIGHT_BUDGET = { featured: 7, full: 4, compact: 2, earlier: 0 };

export function validateResume(resume, schema, { release = false } = {}) {
  const errors = [];

  const ajv = new Ajv({ strict: false, allErrors: true });
  addFormats(ajv); // the schema uses the "email" and "uri" formats
  if (!ajv.validate(schema, resume)) {
    for (const e of ajv.errors) errors.push(`schema: ${e.instancePath || "/"} ${e.message}`);
  }

  const text = JSON.stringify(resume);

  if (resume.basics?.phone) errors.push("basics.phone must not be set; the phone number is PDF-only via RESUME_PHONE");
  if (PHONE_RE.test(text)) errors.push("a phone-number-like value appears in resume.json");

  if ((text.match(/\*\*/g) || []).length % 2 !== 0) errors.push("unbalanced ** emphasis markers");

  if (release && /\bTODO\b/.test(text)) errors.push("TODO placeholders remain (RELEASE=1)");

  const work = resume.work ?? [];
  const featured = work.filter((w) => w["x-display"] === "featured");
  if (featured.length !== 1) errors.push(`exactly one work entry must be x-display: featured (found ${featured.length})`);

  work.forEach((w, i) => {
    const where = `work[${i}] (${w.position} · ${w.name})`;
    const display = w["x-display"];
    if (!DISPLAY.includes(display)) errors.push(`${where}: x-display must be one of ${DISPLAY.join(", ")}`);
    const count = w.highlights?.length ?? 0;
    const budget = HIGHLIGHT_BUDGET[display];
    if (budget !== undefined && count > budget) errors.push(`${where}: ${count} highlights exceeds the ${display} budget of ${budget}`);
    if (w.endDate && w.startDate > w.endDate) errors.push(`${where}: startDate is after endDate`);
  });

  (resume.projects ?? []).forEach((p, i) => {
    if (!/^https:\/\/github\.com\//.test(p["x-repo"] ?? "")) errors.push(`projects[${i}] (${p.name}): x-repo must be a github.com URL`);
  });

  const site = resume["x-site"] ?? {};
  for (const key of ["title", "description", "repo"]) {
    if (!site[key]) errors.push(`x-site.${key} is required`);
  }
  if (site.description && site.description.length > 160) errors.push(`x-site.description is ${site.description.length} chars; keep it ≤ 160`);

  const expected = `${resume.basics?.url}/resume.json`;
  if (resume.meta?.canonical !== expected) errors.push(`meta.canonical must be ${expected}`);

  return errors;
}

export async function loadAndValidate(rootUrl, options) {
  const [resume, schema] = await Promise.all([
    readFile(new URL("resume.json", rootUrl), "utf8").then(JSON.parse),
    readFile(new URL("schema/resume.schema.json", rootUrl), "utf8").then(JSON.parse),
  ]);
  return { resume, errors: validateResume(resume, schema, options) };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { errors } = await loadAndValidate(new URL("..", import.meta.url), { release: !!process.env.RELEASE });
  if (errors.length) {
    console.error(`resume.json: ${errors.length} problem(s)\n  - ${errors.join("\n  - ")}`);
    process.exit(1);
  }
  console.log("resume.json is valid");
}
