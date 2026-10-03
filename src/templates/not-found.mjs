import { html } from "../../scripts/lib/html.mjs";
import { head } from "./head.mjs";
import { nav } from "./nav.mjs";
import { footer } from "./footer.mjs";

export function notFound(ctx) {
  const title = `Not found — ${ctx.resume.basics.name}`;
  return html`<!DOCTYPE html>
<html lang="en">
<head>
${head({ ...ctx, title, description: "That page does not exist.", path: "/404" })}
</head>
<body id="top">
  <a class="skip-link" href="#main">Skip to content</a>
  ${nav(ctx)}
  <main id="main">
    <section class="hero wrap" aria-labelledby="nf">
      <p class="kicker mono">404</p>
      <h1 id="nf">Not found</h1>
      <p class="summary">There is nothing at this address. The resume is at <a href="/">the front page</a>.</p>
    </section>
  </main>
  ${footer(ctx)}
  <script type="module" src="${ctx.assets.js}"></script>
</body>
</html>
`;
}
