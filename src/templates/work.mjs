import { html } from "../../scripts/lib/html.mjs";
import { emph, range, yearRange } from "../../scripts/lib/format.mjs";
import { section } from "./section.mjs";

function role(w) {
  const display = w["x-display"];
  return html`
    <article class="role role-${display}" data-reveal>
      <header class="role-head">
        <h3 class="role-title">${w.position}</h3>
        <p class="role-org">${w.url ? html`<a href="${w.url}" rel="noopener">${w.name}</a>` : w.name}</p>
        <p class="role-meta mono">${range(w.startDate, w.endDate)}${w.location ? html` · ${w.location}` : null}</p>
      </header>
      ${w.summary ? html`<p class="role-summary">${w.summary}</p>` : null}
      ${w.highlights?.length ? html`<ul class="highlights">${w.highlights.map((h) => html`<li>${emph(h)}</li>`)}</ul>` : null}
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
