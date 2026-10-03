import { html } from "../../scripts/lib/html.mjs";

export function hero({ resume, site }) {
  const { basics } = resume;
  const tagline = [...(basics["x-tagline"] ?? [])];
  const place = [`${basics.location.city}, ${basics.location.region}`, basics["x-work-mode"]].filter(Boolean).join(" · ");

  return html`
    <section class="hero wrap" aria-labelledby="name">
      <p class="kicker">${basics.label}</p>
      <h1 id="name">${basics.name}</h1>
      <p class="tagline mono">${tagline.join(" · ")}<span class="sep"> — </span><span class="place">${place}</span></p>
      <p class="summary">${basics.summary}</p>
      <ul class="links" aria-label="Contact">
        <li><a href="mailto:${basics.email}">${basics.email}</a></li>
        ${basics.profiles.map((p) => html`<li><a href="${p.url}" rel="me noopener">${p.network}<span class="arrow" aria-hidden="true"> ↗</span></a></li>`)}
        ${site.pdf ? html`<li><a href="${site.pdf}">Resume (PDF)<span class="arrow" aria-hidden="true"> ↓</span></a></li>` : null}
        <li class="mono" data-pdf-phone hidden></li>
      </ul>
    </section>
  `;
}
