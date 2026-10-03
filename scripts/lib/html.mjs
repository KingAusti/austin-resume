// Minimal HTML templating: a tagged template that escapes every interpolation
// unless it is already rendered markup (a Raw), an array of either, or empty.

class Raw {
  constructor(s) {
    this.s = s;
  }
  toString() {
    return this.s;
  }
}

export const raw = (s) => new Raw(String(s));

export function escape(value) {
  return String(value).replace(/[&<>"']/g, (c) => ESCAPES[c]);
}

const ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

function render(value) {
  if (value == null || value === false) return "";
  if (value instanceof Raw) return value.s;
  if (Array.isArray(value)) return value.map(render).join("");
  return escape(value);
}

export function html(strings, ...values) {
  let out = "";
  strings.forEach((s, i) => {
    out += s;
    if (i < values.length) out += render(values[i]);
  });
  return new Raw(out);
}

// Serialise a value for an inline JSON data block (`<script type="application/ld+json">`).
export function jsonBlock(value) {
  return raw(JSON.stringify(value, null, 0).replace(/</g, "\\u003c"));
}
