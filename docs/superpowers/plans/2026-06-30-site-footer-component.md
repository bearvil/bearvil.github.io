# `<site-footer>` Component Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a shared, token-styled `<site-footer>` web component to every main-site page and convert the centered pages to a scrolling sticky-footer layout.

**Architecture:** A new vanilla Web Component in `assets/components.js` (alongside `<top-nav>`/`<calm-sea>`) that reuses the existing `NAV_LINKS`/`PRIVACY_LINKS` arrays, styled in `assets/css/components.css`. The main-site `<body>` becomes a sticky-footer flex column; `.content` goes from `position:fixed` to an in-flow centered block; the `is-fixed` single-screen lock is retired.

**Tech Stack:** Plain HTML, CSS (custom properties / tokens), vanilla JS Web Components. No build step. GitHub Pages static hosting.

## Global Constraints

- Author is **Bearvil only** — no AI/Claude co-author trailer on any commit.
- All on-disk content in **English**.
- Must stay **GitHub Pages compatible**: zero-build, static HTML/CSS/JS, no server/runtime.
- Strict **CSP**: external scripts only (`script-src 'self'`), **no inline JS**. Google Fonts is the only external origin.
- Styles in external CSS; behavior in `assets/components.js`. Nothing hardcoded that belongs in a token.
- Keep accessibility: keyboard-operable, visible focus, correct ARIA, content visible without JS.
- `prefers-reduced-motion`: color/opacity transitions OK; suppress transform-driven motion.
- No automated test framework exists (static site). "Verify" steps = local preview via `python3 serve.py` + browser/devtools inspection.
- Only commit when these steps say to; do not push (user pushes/deploys).

---

### Task 1: Add the `<site-footer>` component (JS)

**Files:**
- Modify: `assets/components.js` (add shared path-helper + `SiteFooter` class)

**Interfaces:**
- Consumes: existing `NAV_LINKS`, `PRIVACY_LINKS` constants already at top of `components.js`.
- Produces: a registered custom element `site-footer`, and a module-level helper
  `currentPathMatcher()` returning `href => string` (the `aria-current` matcher),
  refactored out of `TopNav` so both components share it.

- [ ] **Step 1: Extract the path matcher helper**

In `assets/components.js`, just below the `CHEVRON` constant, add:

```js
/* Returns a predicate that marks the link matching the current path with
   aria-current="page". Shared by <top-nav> and <site-footer>. */
function currentPathMatcher() {
  const path = location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
  return href => ((href.replace(/\/$/, '') || '/') === path ? ' aria-current="page"' : '');
}
```

Then in `TopNav.connectedCallback`, replace the two lines:

```js
    const path = location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
    const current = href => ((href.replace(/\/$/, '') || '/') === path ? ' aria-current="page"' : '');
```

with:

```js
    const current = currentPathMatcher();
```

- [ ] **Step 2: Add the `SiteFooter` class**

After the `customElements.define('top-nav', TopNav);` line (and its comment block), add:

```js
/* ------------------------------------------------------------------ *
 *  <site-footer> — slim footer bar: brand lockup, the same nav +
 *  privacy links as <top-nav>, an email link, and a dynamic copyright
 *  year. Reuses NAV_LINKS / PRIVACY_LINKS so links live in one place.
 * ------------------------------------------------------------------ */
const FOOTER_EMAIL = 'bearvil.co@gmail.com';

class SiteFooter extends HTMLElement {
  connectedCallback() {
    if (this.dataset.rendered) return;
    this.dataset.rendered = 'true';

    const current = currentPathMatcher();
    const year = new Date().getFullYear();

    const navItems = NAV_LINKS.map(l =>
      `<a href="${l.href}"${current(l.href)}>${l.label}</a>`
    ).join('');

    const privacyItems = PRIVACY_LINKS.map(l =>
      `<a href="${l.href}" target="_blank" rel="noopener">${l.label}</a>`
    ).join('');

    this.innerHTML = `
      <footer class="site-footer" role="contentinfo">
        <div class="site-footer-inner">
          <a class="site-footer-brand" href="/">
            <img src="/assets/Bearvil-logo-transparent.png" alt="" aria-hidden="true" />
            <span>Bearvil</span>
          </a>
          <nav class="site-footer-links" aria-label="Footer">
            ${navItems}
            <span class="site-footer-sep" aria-hidden="true"></span>
            ${privacyItems}
            <a href="mailto:${FOOTER_EMAIL}">${FOOTER_EMAIL}</a>
          </nav>
        </div>
        <div class="site-footer-bottom">
          <small>&copy; ${year} Bearvil</small>
        </div>
      </footer>
    `;
  }
}
customElements.define('site-footer', SiteFooter);
```

- [ ] **Step 3: Verify the component registers and renders**

Run: `python3 serve.py` and open `http://localhost:8000/styleguide` (it already scrolls).
Temporarily add `<site-footer></site-footer>` before `</body>` of `styleguide.html` if not yet added (Task 4 makes it permanent).
Expected: a footer renders at the bottom with brand, Home/Work/About/Contact, the two privacy links, the email, and `© <currentYear> Bearvil`. No console errors; CSP not violated (no inline-script warnings).

- [ ] **Step 4: Commit**

```bash
git add assets/components.js
git commit -m "Add <site-footer> web component reusing shared nav links"
```

---

### Task 2: Footer styles (CSS)

**Files:**
- Modify: `assets/css/components.css` (append a `.site-footer` block)

**Interfaces:**
- Consumes: design tokens from `tokens.css`; the `.site-footer*` class names emitted by Task 1.
- Produces: visual styling for `<site-footer>`.

- [ ] **Step 1: Append the footer styles**

Add to the end of `assets/css/components.css`:

```css
/* =========================================================================
   <site-footer> — slim frosted footer bar. Mirrors the <top-nav> frosted
   surface so the nav and footer bookend the page. Tokens only.
   ========================================================================= */
site-footer { display: block; position: relative; z-index: var(--z-content); }

.site-footer {
  background: rgba(251, 249, 244, 0.6);   /* --sand-100 @ 60% — frosted */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-top: 1px solid var(--color-border);
}
.site-footer-inner {
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: var(--space-3) var(--space-5);
  max-width: 1160px; margin: 0 auto;
  padding: var(--space-5) var(--space-6) var(--space-4);
}

.site-footer-brand {
  display: inline-flex; align-items: center; gap: var(--space-2);
  font-family: var(--font-heading);
  font-size: var(--text-lg); font-weight: var(--font-weight-extra);
  letter-spacing: var(--tracking-tight);
  color: var(--color-text);
}
.site-footer-brand:hover { color: var(--color-text); }
.site-footer-brand img { height: 24px; width: auto; display: block; }

.site-footer-links {
  display: flex; align-items: center; flex-wrap: wrap;
  gap: var(--space-2) var(--space-4);
}
.site-footer-links a {
  font-size: var(--text-sm); font-weight: var(--font-weight-semibold);
  color: var(--color-text-muted);
  transition: color var(--transition-base);
}
.site-footer-links a:hover,
.site-footer-links a:focus-visible { color: var(--color-primary-fill); }
.site-footer-links a[aria-current="page"] { color: var(--color-primary-fill); }

/* Hairline divider between the site links and the privacy/email group. */
.site-footer-sep {
  width: 1px; height: 1em; background: var(--color-border-strong);
}

.site-footer-bottom {
  max-width: 1160px; margin: 0 auto;
  padding: 0 var(--space-6) var(--space-5);
  font-size: var(--text-xs); color: var(--color-text-subtle);
}

@media (max-width: 720px) {
  .site-footer-inner { justify-content: center; text-align: center; }
  .site-footer-links { justify-content: center; }
  .site-footer-sep { display: none; }
  .site-footer-bottom { text-align: center; }
}
```

- [ ] **Step 2: Verify styling**

Reload `http://localhost:8000/styleguide`.
Expected: frosted bar with top border, brand left + links right on desktop; centered/stacked below 720px; link hover turns primary-fill; visible focus ring on keyboard tab; readable contrast over the sand background.

- [ ] **Step 3: Commit**

```bash
git add assets/css/components.css
git commit -m "Style <site-footer> as a slim frosted bar from tokens"
```

---

### Task 3: Sticky-footer scrolling layout (base.css)

**Files:**
- Modify: `assets/css/base.css`

**Interfaces:**
- Consumes: `--topnav-h`, spacing tokens.
- Produces: a scrolling body layout where `.content` centers in remaining space and the footer sits at the bottom. Retires `body.is-fixed`.

- [ ] **Step 1: Replace the body / is-fixed / .content rules**

In `assets/css/base.css`, replace this block:

```css
/* Full-viewport, no-scroll pages (landing, 404) opt in with this class on body. */
body.is-fixed { height: 100%; overflow: hidden; }

/* Scrollable pages reserve room for the fixed <top-nav> (its height plus
   breathing space) so content never sits under the bar when scrolled. The
   centered .is-fixed pages don't scroll, so they're excluded. */
body:not(.is-fixed) { padding-top: calc(var(--topnav-h) + var(--space-6)); }
```

with:

```css
/* Main-site pages are a sticky-footer flex column: content fills the space
   between the fixed <top-nav> and the footer, and the page scrolls when the
   content is taller than the viewport. padding-top clears the fixed nav;
   box-sizing:border-box keeps it inside min-height so there's no overflow. */
body {
  display: flex; flex-direction: column;
  min-height: 100vh; min-height: 100dvh;
  padding-top: calc(var(--topnav-h) + var(--space-6));
}
```

Then replace the `.content` rule:

```css
.content {
  position: fixed; inset: 0; z-index: var(--z-content);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  text-align: center; padding: var(--space-6);
}
```

with:

```css
.content {
  flex: 1 0 auto; z-index: var(--z-content);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  text-align: center; padding: var(--space-6);
}
```

> Note: the comment above `.content` ("position: fixed; inset:0 ... Each page
> controls its own reveal") should drop the "position:fixed" wording. Update it
> to: "in-flow centered content layer; grows to fill the space above the footer."

- [ ] **Step 2: Verify layout on a centered page**

Open `http://localhost:8000/contact` (after Task 4 removes `is-fixed` and adds the footer; if testing before Task 4, temporarily remove `is-fixed` from `contact.html` and add the footer to check).
Expected: the email card stays centered in the first view; the footer rests at the bottom edge; on a short window the page scrolls and nothing sits under the nav.

- [ ] **Step 3: Commit**

```bash
git add assets/css/base.css
git commit -m "Switch main-site body to a scrolling sticky-footer layout"
```

---

### Task 4: Roll the footer onto all pages

**Files:**
- Modify: `index.html`, `contact.html`, `404.html` (remove `class="is-fixed"`, add footer)
- Modify: `styleguide.html` (add footer)

**Interfaces:**
- Consumes: `<site-footer>` (Task 1), its styles (Task 2), the layout (Task 3).

- [ ] **Step 1: `index.html`**

Change `<body class="is-fixed">` to `<body>`. Add `<site-footer></site-footer>` immediately before `</body>` (after `</main>`).

- [ ] **Step 2: `contact.html`**

Change `<body class="is-fixed">` to `<body>`. Add `<site-footer></site-footer>` immediately before `</body>` (after `</main>`).

- [ ] **Step 3: `404.html`**

Change `<body class="is-fixed">` to `<body>`. Add `<site-footer></site-footer>` immediately before `</body>` (after `</main>`).

- [ ] **Step 4: `styleguide.html`**

Add `<site-footer></site-footer>` immediately before `</body>` (after the closing `</div>` of `.sg-wrap`). The body has `class="sg"` — leave it; the new shared body flex layout places the footer after `.sg-wrap`.

- [ ] **Step 5: Verify all four pages**

With `python3 serve.py` running, open `/`, `/contact`, `/404` (visit a missing path, e.g. `/nope`), and `/styleguide`.
Expected on each: footer present at the bottom with correct links; current page's nav link shows `aria-current` styling; no horizontal scroll; no console/CSP errors. Test with `prefers-reduced-motion` enabled — no transform motion regressions.

- [ ] **Step 6: Commit**

```bash
git add index.html contact.html 404.html styleguide.html
git commit -m "Add <site-footer> to all main pages; drop is-fixed lock"
```

---

### Task 5: Documentation

**Files:**
- Modify: `docs/components.md` (new `<site-footer>` section; fix the `is-fixed` note)
- Modify: `docs/styling.md` and/or `docs/architecture.md` (layout: scrolling sticky-footer instead of `is-fixed`)
- Modify: `CLAUDE.md` ("Adding a new site page" + Layout block)
- Modify: `README.md` (structure / Pages table + footer mention)

**Interfaces:** docs only; must match the shipped behavior from Tasks 1-4.

- [ ] **Step 1: `docs/components.md`**

Add a `## <site-footer>` section after `<calm-sea>`: what it is (slim frosted footer), usage (`<site-footer></site-footer>`), that it reuses `NAV_LINKS`/`PRIVACY_LINKS`, the dynamic copyright year, the plain `mailto:` email, and that it's styled in `components.css`. Correct the `<top-nav>` paragraph that says "the centered `body.is-fixed` pages don't scroll" — describe the sticky-footer scrolling layout instead.

- [ ] **Step 2: `docs/styling.md` / `docs/architecture.md`**

Update any description of the `is-fixed` single-screen, no-scroll pattern to the new sticky-footer flex layout (body is a flex column, `.content` grows, footer at the bottom, pages scroll when needed). Note `is-fixed` is removed.

- [ ] **Step 3: `CLAUDE.md`**

In "Adding a new site page", add a step: place `<site-footer></site-footer>` before `</body>`. Drop `is-fixed` from any example. In the Layout block, mention the footer component.

- [ ] **Step 4: `README.md`**

Add `<site-footer>` to the components list/structure and any Pages/anatomy table; remove stale `is-fixed` references.

- [ ] **Step 5: Verify docs match code**

Re-read each edited doc; confirm class names, file paths, and behavior match Tasks 1-4. No `is-fixed` left implying no-scroll.

- [ ] **Step 6: Commit**

```bash
git add docs/components.md docs/styling.md docs/architecture.md CLAUDE.md README.md
git commit -m "Document <site-footer> and the scrolling sticky-footer layout"
```

---

## Self-Review notes

- **Spec coverage:** component (T1), styles (T2), scroll layout + `is-fixed` retirement (T3), rollout to all four pages (T4), docs (T5). All spec sections covered.
- **No social icons / no copy-to-clipboard / no multi-column** — honored (out of scope).
- **Type/name consistency:** `currentPathMatcher()`, `site-footer`, `.site-footer*`, `FOOTER_EMAIL` used consistently across T1/T2.
- **CSP:** dynamic year is set inside external `components.js` — no inline script.
