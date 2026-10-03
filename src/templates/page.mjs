import { html } from "../../scripts/lib/html.mjs";
import { head } from "./head.mjs";
import { nav } from "./nav.mjs";
import { hero } from "./hero.mjs";
import { work } from "./work.mjs";
import { projects } from "./projects.mjs";
import { skills } from "./skills.mjs";
import { education } from "./education.mjs";
import { footer } from "./footer.mjs";

export function page(ctx) {
  const { site } = ctx;
  const sections = [work, projects, skills, education];
  return html`<!DOCTYPE html>
<html lang="en">
<head>
${head({ ...ctx, title: site.title, description: site.description })}
</head>
<body id="top">
  <a class="skip-link" href="#main">Skip to content</a>
  ${nav(ctx)}
  <main id="main">
    ${hero(ctx)}
    ${sections.map((render, i) => render(ctx, i + 1))}
  </main>
  ${footer(ctx)}
  <script type="module" src="${ctx.assets.js}"></script>
</body>
</html>
`;
}
