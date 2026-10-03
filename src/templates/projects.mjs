import { html } from "../../scripts/lib/html.mjs";
import { section } from "./section.mjs";

function project(p) {
  const live = p.url && p.url !== p["x-repo"];
  return html`
    <article class="project" data-reveal>
      <h3 class="project-title"><a href="${p["x-repo"]}" rel="noopener">${p.name}<span class="arrow" aria-hidden="true"> ↗</span></a></h3>
      <p class="project-desc">${p.description}</p>
      <p class="project-meta mono">
        ${(p.keywords ?? []).join(" · ")}
        ${live ? html`<span class="sep"> — </span><a href="${p.url}" rel="noopener">live</a>` : null}
      </p>
    </article>
  `;
}

export function projects({ resume }, index) {
  return section({ id: "projects", title: "Projects", index }, html`${(resume.projects ?? []).map(project)}`);
}
