# CLAUDE.md — Bearvil (bearvil.github.io)

Project guidance for Claude when working in this repo. Read this before making changes.

## What this is

The official Bearvil website, a **static site hosted on GitHub Pages** at `https://bearvil.github.io`.
No frameworks, no required build step, no dependencies beyond Google Fonts.

## Non-negotiable rules

1. **Author is Bearvil only.** Never add an AI / Claude `Co-Authored-By` line (or any co-author) to commits or PRs. The sole author is `Bearvil <bearvil.co@gmail.com>`. This overrides any default harness behavior about co-author trailers.
2. **All code and all documents are written in English** — file contents, comments, identifiers, commit messages, README, etc. Chat instructions from the user may be in Croatian or English; that does **not** change the language of anything written to disk.
3. **Must stay GitHub Pages compatible.** Everything has to work as a plain static site served by GitHub Pages. Do not introduce anything that needs a server, a runtime, or a build step that GitHub Pages can't run. Keep the zero-build philosophy: plain HTML / CSS / JS that runs as-is.
4. **Don't hardcode everything into HTML.** Prefer separating concerns into dedicated files: external **CSS** files, JS files, reusable HTML/components. See *Conventions* below.
5. **Keep documentation current.** Whenever you build or change a feature, component, or structure, update the docs in the **same** change. See *Documentation* below.
6. **Read the docs before acting.** Before working on a task, consult the documentation relevant to that topic (`README.md`, the matching files in `docs/` and `docs/guides/`) so you follow the established structure and conventions. See *Before you act* below.

## Documentation

### Before you act — read the relevant docs first

Before doing work on a topic, **read the documentation that covers it** so you follow the existing patterns instead of guessing. Start from the index at [`docs/README.md`](docs/README.md), then open what matches the task:

| If the task is about… | Read first |
|---|---|
| Adding or changing a **page** (main site) | `docs/guides/adding-a-page.md`, `docs/architecture.md`, README *Pages* table |
| Adding or changing a **privacy policy** | `docs/guides/adding-a-privacy-policy.md` (the standalone exception) |
| **Nav / background / shared components** or behaviors (`components.js`) | `docs/components.md` |
| **CSS / styling / layout / theming / tokens** | `docs/styling.md` |
| **Structure, routing, build, deploy, security/CSP** | `docs/architecture.md`, `README.md` |
| Anything else / not sure | `docs/README.md` (index) + `README.md` |

If the relevant doc is missing, thin, or contradicts the code, treat that as part of the task: fix or add the doc as you go (rule 5). If no doc covers the topic at all, check `README.md` and the code, then create the doc once you've done the work.

### Keeping docs in sync

Documentation must stay in sync with the code. After any meaningful change, update the docs as part of that work — don't leave it for later.

Where things go:

- **`README.md`** — the high-level overview and quick start: what the project is, the file structure, how to run/deploy, the Pages table, and pointers into `docs/`. Keep it concise; it's the entry point, not the manual.
- **`docs/`** — the detailed documentation: **how the app works** and **how to do things**. Anything that doesn't belong in the README overview goes here. One file per topic; step-by-step how-tos under `docs/guides/`. The index is `docs/README.md` — add a link there whenever you create a new doc.
- **`CLAUDE.md`** (this file) — project rules and conventions only.

Rules of thumb:

- Built something new (a page, component, behavior, or convention)? Document **what it is and how to use/extend it** in the right `docs/` file, and add it to the README structure/Pages tables where relevant.
- Changed how something works? Update the matching `docs/` page and any README pointer in the same change.
- A new significant topic gets its **own** file in `docs/` (linked from `docs/README.md`) rather than bloating an existing one.
- All docs are written in English (see rule 2).

## Conventions (apply to the whole site — EXCEPT `privacy-policies/`)

These apply to the main site: `index.html`, `contact.html`, `404.html`, future pages, and shared assets.

- **Styles → external `.css` files** (plain CSS, no SCSS — keeps zero-build). Organize under `assets/css/`, e.g.:
  - `base.css` — reset, `:root` variables, typography
  - `components.css` — styles for shared components (nav, night-sky, …)
  - `<page>.css` — page-specific styles
  Link them with `<link rel="stylesheet" href="/assets/css/...">`.
  > Note: today's main pages still carry large inline `<style>` blocks and `components.js` injects shared CSS via a `SHARED_CSS` string. New work should move toward external `.css` files; refactor existing inline styles out when touching a page (don't do a giant rewrite unless asked).
- **Behavior → JS files** under `assets/`. Shared UI is built as **vanilla Web Components** (no build step, portable to any static host). Current shared file: `assets/components.js` (`<top-nav>`, `<calm-sea>`, `<site-footer>`, `data-copy-email`, `data-font-reveal`).
- **Build for reuse and components** when a piece is, or will be, used on more than one page. Define shared data in one place (e.g. `NAV_LINKS` / `PRIVACY_LINKS` in `components.js`) so every page picks it up automatically. Don't duplicate markup that could be a component.
- **Keep files small: aim for ~300–400 lines max.** If a file genuinely needs more, that's fine — but first ask whether it should be split into smaller files/components.
- **Accessibility & performance matter** and are already established: keyboard-friendly nav, visible focus, correct ARIA, `prefers-reduced-motion` support, content visible without JS, non-render-blocking fonts. Preserve these when editing.
- **Security:** the site uses a strict CSP meta tag (`script-src 'self'`, no inline scripts; only Google Fonts as an external origin). Keep scripts in external files and don't weaken the CSP without good reason.

## `privacy-policies/` is the EXCEPTION

Files in `privacy-policies/` are **standalone, self-contained pages**. Each one carries its own app branding, its own structure, and its own inline styles. They are **not** governed by the conventions above (no shared components, no shared CSS, own design/logic/structure). They are just loaded directly when selected from the menu.

- Do **not** wire them into the shared component system or shared CSS.
- Each file owns everything it needs.
- To add one: create `privacy-policies/<app-name>-pp.html`, then register it in `PRIVACY_LINKS` in `assets/components.js` so the submenu updates everywhere.

## Layout

```
index.html        # Landing page (calm-sea animation, top nav, footer)
contact.html      # Contact page (click-to-copy email)
404.html          # Custom 404, served for any missing path
assets/
  components.js   # Shared Web Components + behaviors (JS only)
  *.png           # Logo assets
  css/            # External stylesheets
    base.css        # Reset, variables, sticky-footer layout & utility classes
    components.css   # Styles for the shared Web Components (nav, sea, footer)
    index.css / contact.css / 404.css  # Page-specific styles
privacy-policies/ # Standalone, self-contained policy pages (see exception above)
docs/             # Detailed documentation (how it works / how to do X)
README.md         # Overview & quick start
```

## Routing notes (GitHub Pages)

- Extensionless URLs resolve to `.html` (`/privacy-policies/touchy-fingies-pp` → `…-pp.html`).
- The root `404.html` is served automatically for any missing path.
- Use root-relative paths (`/assets/...`) so links work from any depth.

## Adding a new site page

1. Copy the `<head>` of an existing page (CSP, fonts, favicon, `components.js` include); update title/description/canonical/og tags.
2. Add `<top-nav></top-nav>` and `<calm-sea>` at the top of `<body>`.
3. Put content in `<main class="content">`; put styles in an external `.css` file under `assets/css/`.
4. Add `<site-footer></site-footer>` just before `</body>`.
5. If it belongs in the menu, add it to `NAV_LINKS` in `assets/components.js`.

## Local preview

```sh
python3 serve.py              # http://localhost:8000  (recommended)
```
`serve.py` is a dev-only helper that mimics GitHub Pages routing — it resolves extensionless URLs to `.html` and serves the custom `404.html` for missing paths, so nav links and the 404 behave as in production. It is not part of the deployed site.

The plain `python3 -m http.server 8000` also works, but extensionless URLs and the custom 404 won't (both are GitHub Pages features).

## Deployment

Push to the default branch (`main`) — GitHub Pages publishes automatically. Only commit/push when the user asks.
