// Cloudflare Workers static-assets `_headers` file. Applies to asset responses only.

export function headers({ cspHash }) {
  const csp = [
    "default-src 'none'",
    `script-src 'self' '${cspHash}'`,
    "style-src 'self'",
    "font-src 'self'",
    "img-src 'self' data:",
    "connect-src 'self'",
    "base-uri 'none'",
    "form-action 'none'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");

  return `/*
  Content-Security-Policy: ${csp}
  Strict-Transport-Security: max-age=63072000; includeSubDomains
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Resource-Policy: same-origin

/css/*
  Cache-Control: public, max-age=31536000, immutable

/js/*
  Cache-Control: public, max-age=31536000, immutable

/fonts/*
  Cache-Control: public, max-age=31536000, immutable

/resume.json
  Content-Type: application/json; charset=utf-8
  Access-Control-Allow-Origin: *

/resume.pdf
  Content-Disposition: inline; filename="Austin-Henry-Resume.pdf"
`;
}
