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
| `base.css` | Foundation shared by every main page: reset, base typography, the sticky-footer `html/body` layout, focus styles, the `.content` and `.page-sections` layouts, the `.stack` utility, the `fadeInUp` keyframe, and shared text utilities (`.gradient-text`, `.sun-text`, `.sr-only`, `.copied-toast`). |
| `components.css` | Visual styles for the shared Web Components (`<top-nav>`, `<main-background>`, `<home-background>`, `<site-footer>`). |
| `ui.css` | Reusable UI primitives as utility classes: `.btn` (+ variants/sizes), `.card`, `.field` (forms), `.badge`, `.checklist`, `.metric`, `.data-list`, `.faq-list`/`.faq-item` (accordion), toast appearance. |
| `patterns.css` | Composed, section-level blocks built from the primitives: `.section-head`, `.feature-row` (+ `--reverse`), `.feature-visual`, `.metric-grid`, `.card-grid` (+ `--3`), `.split-section`. Used by the Home, Work, and About pages; the "organism" layer above `ui.css`. |
| `<page>.css` | Styles unique to one page (`index.css`, `contact.css`, `404.css`, `styleguide.css`). Pages built entirely from `.page-sections` + the shared primitives/patterns (Work, About) need no page-specific file at all — only add one once a page has a genuine one-off style. |

The only inline style kept in HTML is the `<noscript>` fallback on the landing page.

## Cascade order

Each page links its stylesheets in this order in `<head>`:

```html
<link rel="stylesheet" href="/assets/css/tokens.css" />
<link rel="stylesheet" href="/assets/css/base.css" />
<link rel="stylesheet" href="/assets/css/components.css" />
<link rel="stylesheet" href="/assets/css/ui.css" />
<link rel="stylesheet" href="/assets/css/patterns.css" />   <!-- only if the page uses composed patterns -->
<link rel="stylesheet" href="/assets/css/<page>.css" />     <!-- only if the page needs its own styles -->
```

Tokens first (defines the variables every other file reads), then base, then the
shared components, then UI primitives, then the composed patterns, and the page's
own styles last so it can override anything above it. Both `patterns.css` and
`<page>.css` are optional — link `patterns.css` on pages using `.section-head` /
`.feature-row` / `.split-section` (Work, About, the styleguide today), and skip a
`<page>.css` file entirely if the page needs no styles beyond the shared layers.

## Page layout — sticky footer

Every main-site `body` is a **flex column** at least one viewport tall
(`min-height: 100dvh`), with `padding-top` reserving room for the fixed
`<top-nav>`. Inside it, the page's main content layer is `flex: 1` so it grows to
fill the space, and `<site-footer>` sits last at the bottom. The result: when
content fits in one screen the footer rests at the bottom with no gap; when it
doesn't, the page scrolls normally and the footer follows the content. The
background (`<main-background>` or, on Home, `<home-background>`) stays
`position: fixed` behind everything.

There are two content-layer shapes, both in `base.css`:

- **`.content`** — centered single hero (used by the landing, contact, and 404
  pages). Content is centered both axes, `text-align: center`.
- **`.page-sections`** — left-aligned column of stacked `<section>`s (used by
  Home, Work, and About). A fixed max-width, consistent `gap` between sections,
  and the same font-gated reveal (`opacity: 0` + `data-font-reveal`) as
  `.content`. Use `.stack` inside a section to space a header from its body,
  and `.btn-row` to group buttons (e.g. a primary + secondary CTA).

(There used to be a `body.is-fixed` no-scroll lock for the single-screen pages;
it was removed when the footer was added — all pages now use this one layout.)

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
| `.content` | base.css | In-flow centered content layer; grows (`flex: 1`) to fill the space between the fixed nav and the footer. |
| `.page-sections` | base.css | Left-aligned column of stacked sections — the alternative to `.content` for multi-section pages (Work, About). |
| `.stack` | base.css | Vertical flex column with a consistent gap; spaces a header from its body inside a `.page-sections` section. |
| `.btn-row` | base.css | Horizontal group of buttons (primary + secondary CTA), wraps on narrow screens. |
| `.gradient-text` | base.css | Teal→turquoise text treatment for the wordmark/headings (readable on the light background). |
| `.sun-text` | base.css | Warm orange→turquoise accent text (use sparingly). |
| `.btn` (+ `--primary`/`--accent`/`--secondary`/`--ghost`/`--link`, `--sm`/`--lg`) | ui.css | Buttons. |
| `.card` (+ `--interactive`/`--soft`/`--feature`/`--link`) | ui.css | Cards. `--link` makes an `<a class="card">` fully clickable (`display: block`). |
| `.field` (+ `.field__label/__input/__help/__error`, `.field--invalid`) | ui.css | Form fields. |
| `.badge` (+ semantic variants) | ui.css | Badges / tags / pills. |
| `.checklist` (+ `__item`/`__icon`) | ui.css | Ticked feature list. |
| `.metric` (+ `__label`/`__value`/`__unit`/`__bar`/`__bar-fill`) | ui.css | Compact KPI tile with optional progress bar. |
| `.data-list` (+ `__item`/`__name`) | ui.css | Status rows (name + `.badge`) inside a panel. |
| `.faq-list` / `.faq-item` (+ `__q`/`__icon`/`__a`) | ui.css | Zero-JS accordion built on native `<details>/<summary>`. |
| `.section-head` (+ `--center`, `__eyebrow`/`__title`/`__sub`) | patterns.css | Reusable section header; `<em>` in the title is the accent phrase. |
| `.feature-row` (+ `--reverse`, `__content`/`__visual`/`__eyebrow`/`__title`/`__desc`) | patterns.css | Alternating text + visual showcase row. |
| `.feature-visual` / `.metric-grid` | patterns.css | Framed mockup panel and a two-up grid of metrics inside it. |
| `.card-grid` (+ `--3`) | patterns.css | Responsive grid of standalone `.card` elements — 2-up by default, `--3` for equal-weight rows (e.g. quick links). |
| `.split-section` (+ `__aside`/`__main`) | patterns.css | Static aside + content two-column layout (doesn't alternate); used for FAQs and long-form intros. |
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
