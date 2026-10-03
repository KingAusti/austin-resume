import { html } from "../../scripts/lib/html.mjs";

export function footer({ resume, site, build }) {
  const { basics } = resume;
  return html`
    <footer class="site-footer">
      <div class="wrap footer-grid">
        <ul class="links" aria-label="Contact">
          <li><a href="mailto:${basics.email}">${basics.email}</a></li>
          ${basics.profiles.map((p) => html`<li><a href="${p.url}" rel="me noopener">${p.network}</a></li>`)}
        </ul>
        <ul class="links mono" aria-label="Site">
          <li><a href="${site.repo}" rel="noopener">source</a></li>
          <li><a href="/resume.json">resume.json</a></li>
          <li>built from <a href="${build.commitUrl}" rel="noopener">${build.shortSha}</a> · ${build.date}${build.preview ? html` · preview ${build.preview}` : null}</li>
        </ul>
      </div>
    </footer>
  `;
}
