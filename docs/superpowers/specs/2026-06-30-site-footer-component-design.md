# Spec — `<site-footer>` component

**Date:** 2026-06-30
**Status:** Proposed — awaiting review
**Topic:** Add a shared footer component, styled from the Bearvil design system, to every main-site page.

## Goal

Add a footer to the Bearvil site, modelled on the structure of the Clearwave
template footer but rebuilt as a **slim single bar** using the Bearvil design
tokens and the existing shared-component pattern. The footer must appear on
**all main-site pages** (`index.html`, `contact.html`, `404.html`,
`styleguide.html`).

Privacy-policy pages are the documented exception and are **out of scope** — they
stay standalone and do not get the shared footer.

## Background / constraints

- Shared UI is built as vanilla Web Components in
  [`assets/components.js`](../../../assets/components.js); their styles live in
  [`assets/css/components.css`](../../../assets/css/components.css). The footer
  follows the same pattern as `<top-nav>`.
- Links are defined once in `NAV_LINKS` and `PRIVACY_LINKS` in `components.js`.
  The footer **reuses these arrays** so it stays in sync with the nav — no
  duplicated link lists.
- Today `index.html`, `contact.html`, and `404.html` use `body.is-fixed`
  (`height:100%; overflow:hidden`) with `.content` as `position:fixed; inset:0`,
  centered. These pages **do not scroll**. Only `styleguide.html` scrolls.
- Must stay zero-build and GitHub Pages compatible; must respect the strict CSP
  (external script only, no inline JS), keyboard accessibility, visible focus,
  and `prefers-reduced-motion`.

## Decisions (from brainstorming)

1. **Footer style:** slim single bar (not multi-column, no social icons — Bearvil
   has no social accounts).
2. **Behaviour on the centered pages:** the pages **become scrollable**. The
   single-screen `is-fixed` lock is retired in favour of a sticky-footer flex
   layout so the footer can sit at the bottom and the page scrolls when needed.
3. **Footer email:** a plain `mailto:` link (not the `data-copy-email`
   click-to-copy behaviour) to keep the bar simple.
4. **Copyright year:** rendered by JS so it never goes stale.

## Design

### A. The `<site-footer>` Web Component

New component in `assets/components.js`, alongside `<top-nav>` and `<calm-sea>`.

- Reuses the existing `NAV_LINKS` and `PRIVACY_LINKS` constants.
- Renders a `<footer class="site-footer" role="contentinfo">` containing:
  - **Brand lockup** (left): the logo mark + `Bearvil` wordmark — the same lockup
    markup as `.topnav-logo`, linking to `/`.
  - **Links** (right, wraps on small screens): the `NAV_LINKS` items, then the
    `PRIVACY_LINKS` items (open in a new tab, `rel="noopener"`, matching the nav),
    then a `mailto:bearvil.co@gmail.com` link.
  - **Bottom strip:** `© <year> Bearvil`, where `<year>` is filled in at runtime
    via `new Date().getFullYear()` inside the component (external JS, CSP-safe).
- The link matching the current path gets `aria-current="page"`, reusing the same
  path-normalisation logic the nav uses (factored into a small shared helper so
  the two components don't duplicate it).
- No new external dependencies.

Usage:

```html
<site-footer></site-footer>
```

### B. Footer styles (`components.css`)

A new `.site-footer` block, themed entirely with tokens:

- **Surface:** frosted translucent sand (`rgba(251,249,244,0.6)` + `backdrop-filter:
  blur(12px)`) with a 1px top border (`--color-border`) — mirrors the `<top-nav>`
  frosted bar so the nav and footer visually bookend the page.
- Sits above the `<calm-sea>` background (`z-index: var(--z-content)` or higher).
- Inner wrapper: `max-width: 1160px; margin: 0 auto; padding: 0 var(--space-6)`
  (same rhythm as `.topnav-inner`).
- Links use the muted-text → primary-fill hover treatment already used in the nav,
  at `--text-sm`.
- Bottom strip text at `--text-xs`, `--color-text-subtle`.
- Responsive: below ~720px the brand and links stack and centre.
- `prefers-reduced-motion`: only colour/opacity transitions, no transforms
  (consistent with the rest of the site and the user's reduced-motion testing).

### C. Layout change — pages become scrollable

In `base.css`:

- Retire `body.is-fixed` (it becomes unused once removed from the three pages).
  Remove the `body.is-fixed { height:100%; overflow:hidden }` rule and fold the
  top-nav clearance into the shared body layout.
- Make the main-site `body` a **sticky-footer flex column**:
  ```css
  body { display: flex; flex-direction: column; min-height: 100dvh; }
  ```
  (with `100vh` as the older-browser fallback). Keep the existing
  `padding-top: calc(var(--topnav-h) + var(--space-6))` clearance for the fixed
  nav; `box-sizing: border-box` (already global) keeps padding inside the
  min-height so no spurious overflow appears.
- Change `.content` from `position: fixed; inset: 0` to an in-flow centred block:
  ```css
  .content { flex: 1 0 auto; display: flex; flex-direction: column;
             align-items: center; justify-content: center;
             text-align: center; padding: var(--space-6); }
  ```
  Result: on a normal screen the hero still fills the first view and the footer
  rests at the bottom; on short screens the page scrolls.
- `<calm-sea>` stays a fixed, full-viewport background behind everything.
- The custom-element hosts (`<top-nav>`, `<calm-sea>`, `<site-footer>`) are flex
  items; nav and sea render `position:fixed` children so their hosts collapse to
  zero height and don't disturb the column. The footer host is set to
  `display: block` and sits last, pushed to the bottom by `.content`'s `flex: 1`.

### D. Rollout

- `index.html`, `contact.html`, `404.html`: remove `class="is-fixed"` from
  `<body>`; add `<site-footer></site-footer>` immediately before `</body>`.
- `styleguide.html`: add `<site-footer></site-footer>` before `</body>` (it
  already scrolls; the sticky-footer body layout places the footer after
  `.sg-wrap`).
- No page-specific CSS files need new rules; the footer is fully styled in
  `components.css`.

### E. Documentation updates (same change)

- `docs/components.md`: add a `<site-footer>` section (what it is, usage, that it
  reuses `NAV_LINKS`/`PRIVACY_LINKS`, the dynamic year).
- `docs/styling.md` and/or `docs/architecture.md`: update any description of the
  `is-fixed` single-screen pattern to the new sticky-footer scrolling layout.
- `docs/components.md` nav note that mentions "centered `body.is-fixed` pages
  don't scroll" — correct it.
- `CLAUDE.md` ("Adding a new site page" / Layout) and `README.md` (Pages table,
  structure): mention the footer component and drop the `is-fixed` reference.
- `docs/README.md`: no new file, but ensure cross-links stay accurate.

## Out of scope

- Social media icons (no Bearvil accounts).
- Newsletter / subscribe forms.
- Multi-column footer layout.
- Any change to privacy-policy pages.
- Click-to-copy on the footer email (the contact page keeps that behaviour).

## Acceptance criteria

- `<site-footer>` renders on all four main pages with brand, nav links, privacy
  links, email, and a dynamic copyright year.
- Footer links reflect `NAV_LINKS` / `PRIVACY_LINKS` with no duplicated lists; the
  current page's link shows `aria-current="page"`.
- `index`/`contact`/`404` now scroll; at rest the hero stays centred and the
  footer sits at the bottom of the viewport with no awkward gap.
- Footer is keyboard-navigable, has visible focus, passes contrast on the sand
  surface, and honours `prefers-reduced-motion`.
- No inline scripts; CSP unchanged; no build step; works as a static GitHub Pages
  site.
- Docs updated in the same change.
```