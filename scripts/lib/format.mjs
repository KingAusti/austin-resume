import { escape, raw } from "./html.mjs";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// "2023-05" → "May 2023"; "2027" → "2027"; undefined → "Present"
export function fmtDate(iso) {
  if (!iso) return "Present";
  const [y, m] = iso.split("-");
  return m ? `${MONTHS[Number(m) - 1]} ${y}` : y;
}

export function range(start, end) {
  return `${fmtDate(start)} – ${fmtDate(end)}`;
}

// "2016-09", "2019-04" → "2016–19"; open-ended → "2023–"
export function yearRange(start, end) {
  const from = start.slice(0, 4);
  if (!end) return `${from}–`;
  const to = end.slice(0, 4);
  return from === to ? from : `${from}–${to.slice(2)}`;
}

// Highlight text may mark numbers with **…**; they become <strong class="num">.
export function emph(text) {
  const escaped = escape(text);
  return raw(escaped.replace(/\*\*(.+?)\*\*/g, '<strong class="num">$1</strong>'));
}

export function stripEmphasis(text) {
  return text.replace(/\*\*(.+?)\*\*/g, "$1");
}

// Two-digit zero-padded ordinal for section kickers: 1 → "01"
export function ordinal(n) {
  return String(n).padStart(2, "0");
}
