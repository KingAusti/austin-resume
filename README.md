# austin-resume

Personal portfolio/resume site for Austin Henry — Infrastructure Engineer.

Built as a static single-page site with no frameworks or build tooling. Just HTML, CSS, and vanilla JS.

## Structure

```
index.html   — single-page resume (hero, stats, experience, skills, education)
css/style.css — all styles, design tokens, animations, responsive layout
js/main.js   — nav scroll behavior, typewriter, intersection observers, counters
.github/
  workflows/
    lint.yml      — HTMLHint, Stylelint, ESLint on push/PR to main
    security.yml  — Gitleaks secret scan + CodeQL (JS) on push/PR + weekly cron
```

## Deployment

Served via a **Cloudflare Worker** that handles static asset delivery at the edge. No origin server, no nonsense.

## Local development

No build step — open `index.html` directly in a browser, or serve it:

```bash
npx serve .
# or
python3 -m http.server
```

## CI

Two GitHub Actions workflows run on every push and PR to `main`:

| Workflow | What it checks |
|---|---|
| `lint` | HTML (htmlhint), CSS (stylelint), JS (eslint) |
| `security` | Secret scanning (Gitleaks), dependency review (PRs only), CodeQL JS analysis |

---

> hey, if you're reading this far into a stranger's resume repo — i respect the thoroughness.
> that's exactly the kind of energy i bring to infrastructure work.
> shoot me an email: info@austinhenry.dev
