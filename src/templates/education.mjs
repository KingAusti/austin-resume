import { html } from "../../scripts/lib/html.mjs";
import { fmtDate } from "../../scripts/lib/format.mjs";
import { section } from "./section.mjs";

export function education({ resume }, index) {
  const schools = resume.education ?? [];
  const certs = resume.certificates ?? [];
  return section(
    { id: "education", title: "Education", index },
    html`
      ${schools.map(
        (e) => html`
          <article class="edu" data-reveal>
            <h3 class="edu-title">${e.studyType}, ${e.area}</h3>
            <p class="edu-org">${e.institution}</p>
            <p class="edu-meta mono">${e["x-status"] ?? fmtDate(e.endDate)}</p>
          </article>
        `,
      )}
      <h3 class="subhead">Certifications</h3>
      <ul class="certs" data-reveal>
        ${certs.map((c) => html`<li><span class="cert-name">${c.name}</span> <span class="cert-meta mono">${c.issuer} · ${c.date}</span></li>`)}
      </ul>
    `,
  );
}
