// Progressive enhancement only: theme toggle, current-section nav state, reveal-on-scroll.
// Everything on the page works without this file.

const root = document.documentElement;
const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

/* Theme toggle ---------------------------------------------------------- */

function effectiveTheme() {
  return root.dataset.theme || (darkQuery.matches ? "dark" : "light");
}

const toggle = document.getElementById("theme-toggle");

function syncToggle() {
  toggle.setAttribute("aria-pressed", String(effectiveTheme() === "dark"));
}

toggle.addEventListener("click", () => {
  const next = effectiveTheme() === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  try {
    localStorage.setItem("theme", next);
  } catch {
    /* private mode or storage disabled: the choice just won't persist */
  }
  syncToggle();
});

darkQuery.addEventListener("change", syncToggle);
syncToggle();

/* Current section in the nav -------------------------------------------- */

const navLinks = new Map(
  [...document.querySelectorAll(".nav-links a[href^='#']")].map((a) => [a.getAttribute("href").slice(1), a]),
);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      for (const [id, link] of navLinks) {
        if (id === entry.target.id) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      }
    }
  },
  { rootMargin: "-40% 0px -55% 0px" },
);

for (const id of navLinks.keys()) {
  const el = document.getElementById(id);
  if (el) sectionObserver.observe(el);
}

/* Reveal on scroll ------------------------------------------------------ */

if (!reduceMotion.matches) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -8% 0px" },
  );
  document.querySelectorAll("[data-reveal]").forEach((el) => revealObserver.observe(el));
} else {
  document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-visible"));
}
