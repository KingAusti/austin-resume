import { html, jsonBlock, raw } from "../../scripts/lib/html.mjs";

// Applies the saved theme before first paint and marks the document as JS-capable.
// The build hashes this exact text into the Content-Security-Policy, so any edit
// here changes the hash automatically. Keep it dependency-free and tiny.
export const THEME_SCRIPT =
  '(function(){try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t)}}catch(e){}document.documentElement.classList.add("js")})();';

export function head({ resume, site, siteUrl, assets, build, title, description, path = "/" }) {
  const { basics } = resume;
  const pageUrl = `${siteUrl}${path}`;
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: basics.name,
    jobTitle: basics.label,
    url: siteUrl,
    email: `mailto:${basics.email}`,
    address: { "@type": "PostalAddress", addressLocality: basics.location.city, addressRegion: basics.location.region, addressCountry: basics.location.countryCode },
    sameAs: basics.profiles.map((p) => p.url),
  };

  return html`
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title}</title>
    <meta name="description" content="${description}">
    ${build.preview ? html`<meta name="robots" content="noindex">` : null}
    <link rel="canonical" href="${pageUrl}">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <meta name="theme-color" media="(prefers-color-scheme: light)" content="#faf9f6">
    <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0f0f0e">
    <meta property="og:type" content="profile">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:url" content="${pageUrl}">
    ${site.ogImage ? html`<meta property="og:image" content="${siteUrl}${site.ogImage}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">` : null}
    <meta name="twitter:card" content="summary_large_image">
    <link rel="preload" href="${assets.fonts.inter}" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="${assets.fonts.mono}" as="font" type="font/woff2" crossorigin>
    <link rel="stylesheet" href="${assets.css}">
    <link rel="alternate" type="application/json" href="/resume.json" title="JSON Resume">
    <script>${raw(THEME_SCRIPT)}</script>
    <script type="application/ld+json">${jsonBlock(person)}</script>
  `;
}
