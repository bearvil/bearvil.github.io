# Styling

How CSS is organized for the main site pages.

## Plain CSS, no build

Styles are authored as **plain `.css` files** — no SCSS, no preprocessor, no build
step. This keeps the zero-build philosophy and works on GitHub Pages directly. If a
preprocessor is ever wanted, it must not break plain static hosting.

## Where styles live

All stylesheets are under [`assets/css/`](../assets/css/):

| File | Scope |
|---|---|
| `tokens.css` | **The single source of truth** — all design tokens in `:root` (colors, type scale, spacing, radius, shadow, motion, z-index). Everything else consumes these. See [design-system.md](design-system.md). |
| `base.css` | Foundation shared by every main page: reset, base typography, `html/body`, focus styles, the `.content` layout, the `fadeInUp` keyframe, and shared text utilities (`.gradient-text`, `.sun-text`, `.sr-only`, `.copied-toast`). |
| `components.css` | Visual styles for the shared Web Components (`<site-nav>`, `<calm-sea>`). |
| `ui.css` | Reusable UI primitives as utility classes: `.btn` (+ variants/sizes), `.card`, `.field` (forms), `.badge`, toast appearance. |
| `<page>.css` | Styles unique to one page (`index.css`, `contact.css`, `404.css`, `styleguide.css`). |

The only inline style kept in HTML is the `<noscript>` fallback on the landing page.

## Cascade order

Each page links its stylesheets in this order in `<head>`:

```html
<link rel="stylesheet" href="/assets/css/tokens.css" />
<link rel="stylesheet" href="/assets/css/base.css" />
<link rel="stylesheet" href="/assets/css/components.css" />
<link rel="stylesheet" href="/assets/css/ui.css" />
<link rel="stylesheet" href="/assets/css/<page>.css" />
```

Tokens first (defines the variables every other file reads), then base, then the
shared components, then UI primitives, and the page's own styles last so it can
override anything above it.

## Design tokens — the single source of truth

All tokens are declared once in `tokens.css` as CSS custom properties on `:root`.
Because custom properties inherit down the whole DOM, **changing a token in this one
file re-themes every page and component automatically** — nothing is hardcoded.

Tokens are layered:

1. **Primitive scales** — raw palette (`--turquoise-500`, `--orange-300`, `--sand-100`,
   `--ink-900`, …). Don't reference these directly in components.
2. **Semantic aliases** — what components actually use (`--color-primary`,
   `--color-surface`, `--color-text`, `--color-accent`, …). Re-point these to retheme.
3. **Component aliases** — convenience handles (`--btn-primary-bg`, `--btn-accent-text`, …).

```css
/* use semantic / component tokens, not raw hexes */
.thing { color: var(--color-text); background: var(--color-surface); }
```

Full palette, type scale, and the rationale (incl. accessibility) live in
[design-system.md](design-system.md). The live reference is
[`/styleguide.html`](../styleguide.html).

## Shared utility & primitive classes

Reuse these rather than re-declaring rules per page:

| Class | Where | Purpose |
|---|---|---|
| `.content` | base.css | Centered, full-viewport content layer. |
| `.gradient-text` | base.css | Teal→turquoise text treatment for the wordmark/headings (readable on the light background). |
| `.sun-text` | base.css | Warm orange→turquoise accent text (use sparingly). |
| `.btn` (+ `--primary`/`--accent`/`--secondary`/`--ghost`/`--link`, `--sm`/`--lg`) | ui.css | Buttons. |
| `.card` (+ `--interactive`/`--soft`/`--feature`) | ui.css | Cards. |
| `.field` (+ `.field__label/__input/__help/__error`, `.field--invalid`) | ui.css | Form fields. |
| `.badge` (+ semantic variants) | ui.css | Badges / tags / pills. |
| `.home-link` | ui.css | Back-home pill (kept as a thin alias; prefer `.btn .btn--secondary` in new markup). |

When a style appears on more than one page, promote it to a utility/primitive
instead of duplicating it.

## File size

Aim for **~300–400 lines per file**. If a stylesheet outgrows that, split it (this is
why UI primitives live in `ui.css`, separate from the Web Component styles in
`components.css`) before letting it sprawl.

## CSP note

External same-origin stylesheets (`/assets/css/*.css`) are allowed by the page CSP
(`style-src 'self'`). Adding more `.css` files needs no CSP change. See
[architecture.md](architecture.md#security).
