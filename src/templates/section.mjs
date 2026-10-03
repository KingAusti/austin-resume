import { html } from "../../scripts/lib/html.mjs";
import { ordinal } from "../../scripts/lib/format.mjs";

export function section({ id, title, index }, body) {
  return html`
    <section id="${id}" class="section wrap" aria-labelledby="${id}-heading">
      <div class="section-head">
        <span class="kicker mono">${ordinal(index)}</span>
        <h2 id="${id}-heading">${title}</h2>
      </div>
      <div class="section-body">${body}</div>
    </section>
  `;
}
