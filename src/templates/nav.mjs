import { html } from "../../scripts/lib/html.mjs";

export const SECTIONS = [
  { id: "work", label: "Work" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
];

const SUN = html`<svg class="icon icon-sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4"/></svg>`;
const MOON = html`<svg class="icon icon-moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>`;

export function nav({ resume, site }) {
  const { basics } = resume;
  return html`
    <header class="site-header">
      <nav class="site-nav wrap" aria-label="Site">
        <a class="brand" href="#top">${basics.name}</a>
        <ul class="nav-links">
          ${SECTIONS.map((s) => html`<li><a href="#${s.id}">${s.label}</a></li>`)}
        </ul>
        <div class="nav-actions">
          ${site.pdf ? html`<a class="button" href="${site.pdf}">Resume <span class="mono">PDF</span></a>` : null}
          <button id="theme-toggle" class="icon-button" type="button" aria-label="Toggle dark mode" aria-pressed="false">
            ${SUN}${MOON}
          </button>
        </div>
      </nav>
    </header>
  `;
}
