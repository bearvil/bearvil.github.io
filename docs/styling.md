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
| `tokens.css` | **The single source of truth** — every design token: primitive palette, semantic tokens for the light theme (`:root`), the dark theme overrides (`:root[data-theme="dark"]`), then type, spacing, radius, motion, z-index and layout. Everything else consumes these. See [design-system.md](design-system.md) and [theming.md](theming.md). |
| `base.css` | Foundation shared by every main page: reset, base typography, the sticky-footer `html/body` layout, focus styles, the `.content` and `.page-sections` layouts, the `.stack` / `.btn-row` utilities, the `fadeInUp` keyframe, shared text utilities (`.gradient-text`, `.sun-text`, `.sr-only`, `.copied-toast`), the `.theme-switching` rule that disables transitions during a theme swap, and the i18n rules (`.i18n-pending body` hidden while a dictionary loads, upright `<em>` in Chinese/Japanese, `word-break: auto-phrase` for Japanese, `text-wrap: balance` on headings). |
| `components.css` | Visual styles for the shared Web Components (`<top-nav>` incl. the `.theme-toggle` and the `<lang-switch>` language menu, `<main-background>`, `<home-background>`, `<site-footer>`). |
| `ui.css` | Reusable UI primitives as utility classes: `.btn` (+ variants/sizes), `.card` (+ `--soft`/`--interactive`/`--feature`/`--link`), `.field` (forms), `.badge`, `.checklist`, `.metric`, `.data-list`, `.faq-list`/`.faq-item` (accordion), toast appearance. |
| `patterns.css` | Composed, section-level blocks built from the primitives: `.section-head`, `.feature-row` (+ `--reverse`), `.feature-visual`, `.metric-grid`, `.card-grid` (+ `--3`), `.split-section`, and the app blocks `.app-icon`, `.app-id`, `.app-showcase`, `.app-spotlight`, `.data-list__value`, `.app-tile`, `.card__index`, `.cta-band`. The "organism" layer above `ui.css`. |
| `<page>.css` | Styles unique to one page: `index.css` (only `.home` and the `.hero` block), `contact.css` (email card, note, `.contact-links` privacy row), `404.css` (code, message, `.not-found__actions`), `styleguide.css`. Pages built entirely from `.page-sections` + the shared primitives/patterns (Work, About) need no page-specific file — only add one once a page has a genuine one-off style. |

**No raw hex or `rgba()` colors outside `tokens.css`.** If a stylesheet needs a
color that has no token yet, add a semantic token (with a dark value) first —
see [theming.md](theming.md#adding-a-token).

The only inline styles in the site HTML are the `<noscript><style>` fallbacks
(Home, Work, About) and `style` attributes on demo elements in the styleguide.

## Cascade order

Each page first loads `theme.js` and `i18n/boot.js` synchronously (they set
`<html data-theme>` and `<html lang>` before the first paint), then links its
stylesheets in this order in `<head>`:

```html
<script src="/assets/theme.js"></script>                     <!-- sync, before any CSS -->
<script src="/assets/i18n/boot.js"></script>                 <!-- sync, right after theme.js -->
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
`<page>.css` are optional — link `patterns.css` on pages using any composed
pattern (today: Home, Work, About, Contact and the styleguide; only 404 skips
it), and skip a `<page>.css` file entirely if the page needs no styles beyond
the shared layers.

## Page layout — sticky footer

Every main-site `body` is a **flex column** at least one viewport tall
(`min-height: 100dvh`), with `padding-top` reserving room for the fixed
`<top-nav>`. Inside it, the page's main content layer is `flex: 1` so it grows to
fill the space, and `<site-footer>` sits last at the bottom. The result: when
content fits in one screen the footer rests at the bottom with no gap; when it
doesn't, the page scrolls normally and the footer follows the content.
`<main-background>` stays `position: fixed` behind everything; on Home,
`<home-background>` is `position: absolute` and one viewport tall, so it sits
behind the hero only and scrolls away with it.

There are two content-layer shapes, both in `base.css`:

- **`.content`** — centered single hero (used by the Contact and 404 pages).
  Content is centered both axes, `text-align: center`.
- **`.page-sections`** — left-aligned column of stacked `<section>`s (used by
  Home, Work, and About). Max-width `--content-max`, consistent `gap` between sections,
  and the same font-gated reveal (`opacity: 0` + `data-font-reveal`) as
  `.content`. Use `.stack` inside a section to space a header from its body,
  and `.btn-row` to group buttons (e.g. a primary + secondary CTA).

(There used to be a `body.is-fixed` no-scroll lock for the single-screen pages;
it was removed when the footer was added — all pages now use this one layout.)

## Design tokens — the single source of truth

All tokens are declared once in `tokens.css` as CSS custom properties.
Because custom properties inherit down the whole DOM, **changing a token in this one
file re-themes every page and component automatically** — nothing is hardcoded.

Tokens are layered:

1. **Primitive palette** — raw scales (`--turquoise-500`, `--orange-300`,
   `--sand-100`, `--night-950`, …). Don't reference these in components.
2. **Semantic tokens (light)** — what components actually use (`--color-primary`,
   `--color-surface`, `--color-text`, `--gradient-brand`, …), plus component
   aliases such as `--btn-primary-bg`.
3. **Dark theme** — `:root[data-theme="dark"]` re-points the semantic tokens.
   A component styled with semantic tokens gets dark mode for free.

```css
/* use semantic / component tokens, not primitives or raw hexes */
.thing { color: var(--color-text); background: var(--color-surface); }
.thing a { color: var(--color-primary-strong); }   /* not --color-primary-fill */
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
| `.card` (+ `--interactive`/`--soft`/`--feature`/`--link`) | ui.css | Cards. `--soft` is a quieter card on `--color-surface-2` with no shadow; `--interactive` lifts and tints its border on hover/focus (no lift with reduced motion); `--link` makes an `<a class="card">` fully clickable (`display: block`). |
| `.field` (+ `.field__label/__input/__help/__error`, `.field--invalid`) | ui.css | Form fields. |
| `.badge` (+ semantic variants) | ui.css | Badges / tags / pills. |
| `.checklist` (+ `__item`/`__icon`) | ui.css | Ticked feature list. |
| `.metric` (+ `__label`/`__value`/`__unit`/`__bar`/`__bar-fill`) | ui.css | Compact KPI tile with optional progress bar. |
| `.data-list` (+ `__item`/`__name`) | ui.css | Status rows (name + `.badge`) inside a panel. `.data-list__value` (patterns.css) is a right-aligned text value instead of a badge. |
| `.faq-list` / `.faq-item` (+ `__q`/`__icon`/`__a`) | ui.css | Zero-JS accordion built on native `<details>/<summary>`. |
| `.section-head` (+ `--center`, `__eyebrow`/`__title`/`__sub`) | patterns.css | Reusable section header; `<em>` in the title is the accent phrase. |
| `.feature-row` (+ `--reverse`, `__content`/`__visual`/`__eyebrow`/`__title`/`__desc`) | patterns.css | Alternating text + visual showcase row. |
| `.feature-visual` / `.metric-grid` | patterns.css | Framed mockup panel and a two-up grid of metrics inside it. |
| `.card-grid` (+ `--3`) | patterns.css | Responsive grid of standalone `.card` elements — 2-up by default, `--3` for equal-weight rows (e.g. the Home principles). Both collapse to one column below 720px. |
| `.split-section` (+ `__aside`/`__main`) | patterns.css | Static aside + content two-column layout (doesn't alternate); used for FAQs and long-form intros. |
| `.app-icon` (+ `--md`/`--lg`) | patterns.css | Store-style rounded-square app icon (56 / 72 / 136px, corner `--radius-icon`). Icons live in `assets/apps/`. |
| `.app-id` (+ `__name`/`__meta`) | patterns.css | Icon + app name + category line; the header of an app tile or showcase. |
| `.app-showcase` | patterns.css | Add to a `.feature-row` that presents one app (Work page); gives the anchor (`#frend-ai`, `#touchy-fingies`, `#dicty`) scroll clearance under the fixed nav. |
| `.app-spotlight` (+ `__label`) | patterns.css | Big icon on a soft radial glow inside the `.feature-visual` panel, above the "privacy at a glance" `.data-list`. |
| `.app-tile` (+ `__body`/`__more`) | patterns.css | Compact whole-card link to an app (Home). Use with `.card .card--interactive .card--link`. |
| `.card__index` | patterns.css | Small accent number ("01") above a card title — the Home principles. |
| `.cta-band` (+ `__text`/`__title`) | patterns.css | Closing call-to-action panel on `--color-primary-fill` with white text and a `.btn-row` (Home, Work). Stacks full-width on mobile. |

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
