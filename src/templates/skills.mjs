import { html } from "../../scripts/lib/html.mjs";
import { section } from "./section.mjs";

export function skills({ resume }, index) {
  const groups = resume.skills ?? [];
  return section(
    { id: "skills", title: "Skills", index },
    html`
      <dl class="skills" data-reveal>
        ${groups.map((g) => html`<div class="skill-group"><dt>${g.name}</dt><dd>${g.keywords.join(", ")}</dd></div>`)}
      </dl>
    `,
  );
}
