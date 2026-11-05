# Design system

The Bearvil site is built on a **token-driven design system**: one config file
defines every color, type step, and scale, and everything else inherits from it.
This page documents the palette, the principles, and how to change the theme.

**Live reference:** [`/styleguide.html`](../styleguide.html) renders every token and
component from the real tokens — open it to see the current theme (it follows the
light/dark toggle like every other page).

## Theme

**Caribbean / beach**, in two variants:

- **Light** (default) — turquoise (the sea) as the primary, pastel orange (the
  sun) as the accent, warm sand neutrals and deep teal-ink text.
- **Dark** — the same turquoise and orange on deep "night lagoon" teal
  neutrals, with light mist text.

Both are balanced roughly **60 / 30 / 10** — neutrals dominate, turquoise
structures, orange accents. How the active theme is picked and switched, and how
to give a token a dark value: [theming.md](theming.md).

Typography is **Inter** (neutral, geometric, highly legible) for everything.

## Single source of truth

All tokens live in [`assets/css/tokens.css`](../assets/css/tokens.css) as CSS custom
properties. Because custom properties inherit through the whole DOM, **editing one
value there re-themes the entire site**. No raw hex or `rgba()` values live outside
this file.

The file has three color layers, then the theme-independent scales:

1. **Primitive palette** (`:root`) — raw scales: `--turquoise-50…900`,
   `--orange-50…600`, `--sand-50…400`, `--ink-300…900`, the dark neutrals
   `--night-600…950` and `--mist-100/300/500`, and state hues
   `--green-*`, `--amber-*`, `--coral-*` (300 / 500 / 700). Components never use
   these directly.
2. **Semantic tokens — light** (`:root`) — what components use
   (`--color-bg`, `--color-surface`, `--color-text`, `--color-primary`,
   `--gradient-brand`, `--shadow-md`, …), plus a few component aliases
   (`--btn-primary-bg`, `--btn-accent-text`, …).
3. **Dark theme** (`:root[data-theme="dark"]`) — re-points **only** semantic
   tokens.
4. **Type, spacing, radius, motion, z-index, layout** (`:root`) — shared by
   both themes.

## Palette (semantic tokens)

| Role | Token | Light | Dark |
|---|---|---|---|
| Page background | `--color-bg` | `--sand-100` `#fbf9f4` | `--night-950` `#08171a` |
| Background wash (`<main-background>`) | `--color-bg-tint` | `--turquoise-50` `#ebfafc` | `--night-950` |
| Surface (cards) | `--color-surface` | `#ffffff` | `--night-900` `#0d2125` |
| Subtle panel | `--color-surface-2` | `--sand-200` `#f2eee6` | `--night-800` `#132c31` |
| Frosted nav/footer | `--color-frost` / `--color-frost-strong` | bg @ 60% / 88% | bg @ 60% / 88% |
| Border (subtle) | `--color-border-subtle` | `#eaf1ef` | `#17333a` |
| Border | `--color-border` | `--sand-300` `#dce6e1` | `--night-700` `#1d3b40` |
| Border (strong) | `--color-border-strong` | `--sand-400` `#b3b9b2` | `--night-600` `#2a4f55` |
| Border (frosted) | `--color-border-frosted` | `rgba(20, 58, 64, .16)` | `rgba(166, 191, 192, .16)` |
| Text | `--color-text` | `--ink-900` `#143a40` | `--mist-100` `#e6f1f0` |
| Muted text | `--color-text-muted` | `--ink-500` `#5a7a7e` | `--mist-300` `#a6bfc0` |
| Subtle text | `--color-text-subtle` | `--ink-300` `#8aa3a5` | `--mist-500` `#73908f` |
| Text on solid fills | `--color-text-on-fill` | `#ffffff` | `#ffffff` |
| Primary (sea) | `--color-primary` | `--turquoise-500` | `--turquoise-400` |
| Primary-colored text | `--color-primary-strong` | `--turquoise-700` `#0d7583` | `--turquoise-300` `#65d4de` |
| Primary fill (under white text) | `--color-primary-fill` | `--turquoise-700` | `--turquoise-700` |
| Primary tints | `--color-primary-soft` / `-softer` | `--turquoise-100` / `-50` | turquoise @ 16% / 8% |
| Accent (sun, CTA fill) | `--color-accent` | `--orange-400` `#ff9e5c` | `--orange-400` |
| Accent-colored text | `--color-accent-strong` | `--orange-600` `#e5702c` | `--orange-400` |
| Accent tint | `--color-accent-soft` | `--orange-100` | orange @ 14% |
| Text on accent | `--color-accent-text` | `--ink-900` | `--ink-900` |
| Link | `--color-link` / `-hover` | `--turquoise-700` / `-800` | `--turquoise-300` / `-200` |
| Focus | `--color-focus` | `--turquoise-500` | `--turquoise-400` |
| States (base hue) | `--color-success` / `-warning` / `-danger` | `#3dae6b` / `#f2b441` / `#e5564b` | same |
| State tints | `--color-*-soft` | hue @ 16–20% | hue @ 16–18% |
| State text | `--color-*-text` | `--green/amber/coral-700` | `--green/amber/coral-300` |
| Invalid-field ring | `--color-danger-ring` | coral @ 30% | coral @ 40% |

Other theme-aware tokens:

| Token | Used by |
|---|---|
| `--gradient-brand` | `.gradient-text` (wordmark / 404 code) |
| `--gradient-sun` | `.sun-text` |
| `--gradient-meter` | `.metric__bar-fill` (one value for both themes) |
| `--home-sky`, `--wave-back`, `--wave-mid`, `--wave-front` | `<home-background>` sky and the three wave layers; `--wave-front` = `--color-bg` |
| `--logo-filter` | Logo `<img>` in the nav, footer and Home hero (recolors it in dark) |
| `--shadow-color`, `--shadow-sm/md/lg`, `--shadow-focus` | Elevation and focus rings |

Full primitive scales are in `tokens.css` and visualized in the styleguide.

Borders are intentionally cooled toward ink/turquoise rather than pure sand, so
they read as part of the palette instead of plain beige. `--color-border-frosted`
is a separate low-alpha hairline for the translucent `<top-nav>`/`<site-footer>`:
it stays visible over both the light and the teal ends of the background behind
the frost.

## Accessibility — two tokens per brand color

Pastel colors with white text are a classic contrast failure, and a color that
reads well on sand can vanish on night teal. The system splits each brand color
into a **text** token and a **fill** token:

- **Primary text vs. fill.** `--color-primary-strong` is for primary-colored
  text; it moves from `--turquoise-700` (light) to `--turquoise-300` (dark).
  `--color-primary-fill` is the deep "lagoon" `--turquoise-700` and is only for
  **solid backgrounds that carry white text** (primary button, `.cta-band`).
  Light turquoise (`500` and below) is for borders, focus rings, tints and
  gradients.
- **Accent text vs. fill.** The orange CTA (`--color-accent`) carries **dark
  teal-ink text** (`--color-accent-text`) in both themes; orange text uses
  `--color-accent-strong`.
- **State badges** use a soft tint plus a dedicated readable text shade
  (`--color-success-soft` + `--color-success-text`, …) per theme.

Keep this split when adding components: never put white text on light turquoise,
never use a `-fill` token as a text color, and prefer dark text on the orange
accent.

## Other scales

- **Type** (`--text-*`): ~1.25 modular scale, `xs` 12 → `5xl` 52px, plus
  `--text-display` (`clamp(2.5rem, 6vw, 4.5rem)`) for the Home hero headline.
  Weights `--font-weight-normal/semibold/bold/extra` (400/600/700/800).
  Tracking `--tracking-tighter/tight/normal/wide/wider`.
- **Spacing** (`--space-1`…`9`): 4px base — 4, 8, 12, 16, 24, 32, 48, 64, 96.
- **Radius**: `--radius-sm/md/lg/xl/pill` = 6 / 12 / 20 / 28 / 999px, and
  `--radius-icon` (`22.5%`, the app-icon "squircle" corner, relative to size).
- **Shadow** (`--shadow-sm/md/lg`, `--shadow-focus`): each pairs a tight "contact"
  layer with a soft, wide "ambient" layer; the color comes from `--shadow-color`
  so dark mode gets deeper, neutral shadows.
- **Motion** (`--transition-fast/base`, `--ease-out-expo`) and **z-index**
  (`--z-background/content/overlay/nav/nav-toggle/toast`).
- **Layout**: `--topnav-h` (fixed `<top-nav>` height, reserved as top padding in
  `base.css`), `--content-max` (1080px, the `.page-sections` column) and
  `--chrome-max` (1160px, nav and footer inner width).

## How to change the theme

- **Tweak a hue:** edit a primitive scale in `tokens.css` (e.g. shift
  `--turquoise-*` to make the sea greener). Both themes and the styleguide update.
- **Remap a role:** point a semantic token at a different primitive in section 2
  (light) and/or section 3 (dark).
- **Add a token:** add it to section 2 and give it a dark value in section 3 —
  step by step in [theming.md](theming.md#adding-a-token).
- **Add a component:** style it with semantic tokens only, check it in both
  themes, and add a demo to `styleguide.html`.

## Components

UI primitives (buttons, cards, form fields, badges, toast, …) are CSS-only classes
in [`ui.css`](../assets/css/ui.css); composed section blocks are in
[`patterns.css`](../assets/css/patterns.css) — see [styling.md](styling.md).
Shared interactive pieces (`<top-nav>` with the theme toggle, the backgrounds,
`<site-footer>`) are Web Components — see [components.md](components.md). All of
them consume the tokens above.
