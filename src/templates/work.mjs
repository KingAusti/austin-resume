import { html } from "../../scripts/lib/html.mjs";
import { emph, range, yearRange } from "../../scripts/lib/format.mjs";
import { section } from "./section.mjs";

// The web page shows every highlight; the one-page PDF keeps only the first N
// (highlights are ordered by importance). Override per role with "x-print-limit".
const PRINT_LIMIT = { featured: 4, full: 3, compact: 0, earlier: 0 };

function role(w) {
  const display = w["x-display"];
  const printLimit = w["x-print-limit"] ?? PRINT_LIMIT[display];
  return html`
    <article class="role role-${display}" data-reveal>
      <header class="role-head">
        <h3 class="role-title">${w.position}</h3>
        <p class="role-org">${w.url ? html`<a href="${w.url}" rel="noopener">${w.name}</a>` : w.name}</p>
        <p class="role-meta mono">${range(w.startDate, w.endDate)}${w.location ? html` · ${w.location}` : null}</p>
      </header>
      ${w.summary ? html`<p class="role-summary">${w.summary}</p>` : null}
      ${w.highlights?.length ? html`<ul class="highlights">${w.highlights.map((h, i) => html`<li${i >= printLimit ? html` data-print-hide` : null}>${emph(h)}</li>`)}</ul>` : null}
      ${w["x-stack"]?.length ? html`<p class="stack mono" aria-label="Stack">${w["x-stack"].join(" · ")}</p>` : null}
    </article>
  `;
}

function earlier(entries) {
  if (!entries.length) return null;
  return html`
    <p class="earlier" data-reveal>
      <span class="kicker">Earlier</span>
      ${entries.map((w, i) => html`${i ? html`<span class="sep"> · </span>` : null}${w.position}, ${w.name} <span class="mono">(${yearRange(w.startDate, w.endDate)})</span>`)}
    </p>
  `;
}

export function work({ resume }, index) {
  const entries = resume.work ?? [];
  const shown = entries.filter((w) => w["x-display"] !== "earlier");
  const rest = entries.filter((w) => w["x-display"] === "earlier");
  return section({ id: "work", title: "Work", index }, html`${shown.map(role)}${earlier(rest)}`);
}
