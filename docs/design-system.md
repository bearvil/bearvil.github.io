# Design system

The Bearvil site is built on a **token-driven design system**: one config file
defines every color, type step, and scale, and everything else inherits from it.
This page documents the palette, the principles, and how to change the theme.

**Live reference:** [`/styleguide.html`](../styleguide.html) renders every token and
component from the real tokens — open it to see the current theme.

## Theme

Light, airy **Caribbean / beach**: turquoise (the sea) as the primary, pastel orange
(the sun) as the accent, warm sand neutrals, and deep teal-ink text. Balanced roughly
**60 / 30 / 10** — neutrals dominate, turquoise structures, orange accents.

Typography is **Nunito** (rounded, friendly) for everything.

## Single source of truth

All tokens live in [`assets/css/tokens.css`](../assets/css/tokens.css) as CSS custom
properties on `:root`. Because custom properties inherit through the whole DOM,
**editing one value there re-themes the entire site** — pages and components read the
tokens, nothing is hardcoded.

Tokens are layered so you can retheme at the right level:

1. **Primitive scales** — the raw palette (`--turquoise-500`, `--orange-300`,
   `--sand-100`, `--ink-900`). Change these to shift the actual hues.
2. **Semantic aliases** — what components use (`--color-primary`, `--color-surface`,
   `--color-text`, `--color-accent`, `--color-link`, …). Re-point these to remap roles
   without touching components.
3. **Component aliases** — convenience handles (`--btn-primary-bg`, `--btn-accent-text`).

## Palette

| Role | Token | Hex |
|---|---|---|
| Page background | `--color-bg` (`--sand-100`) | `#fbf9f4` |
| Surface (cards) | `--color-surface` | `#ffffff` |
| Subtle panel | `--color-surface-2` (`--sand-200`) | `#f2eee6` |
| Border (subtle) | `--color-border-subtle` (`--sand-200`) | `#f2eee6` |
| Border | `--color-border` (`--sand-300`) | `#e5e0d6` |
| Text | `--color-text` (`--ink-900`) | `#143a40` |
| Muted text | `--color-text-muted` (`--ink-500`) | `#5a7a7e` |
| Subtle text | `--color-text-subtle` (`--ink-300`) | `#8aa3a5` |
| Primary (sea) | `--color-primary` (`--turquoise-500`) | `#18a8ba` |
| Primary fill | `--color-primary-fill` (`--turquoise-700`) | `#0d7583` |
| Accent (sun) | `--color-accent` (`--orange-400`) | `#ff9e5c` |
| Link | `--color-link` (`--turquoise-700`) | `#0d7583` |
| Success / Warning / Danger | `--color-success` / `-warning` / `-danger` | `#3dae6b` / `#f2b441` / `#e5564b` |

Full 50→800 turquoise and orange scales, plus the sand and ink scales, are in
`tokens.css` and visualized in the styleguide.

## Accessibility — why two turquoise roles

Pastel colors with white text are a classic contrast failure. The system avoids it:

- **Turquoise has two jobs.** Light tones (`500` and below) are for the sea, focus
  rings, borders, soft backgrounds, and gradients. The deep "lagoon" tone
  (`700` `#0d7583`) is used for **solid fills that carry white text** — it passes
  WCAG AA for body text.
- **The orange CTA uses dark teal-ink text** (`--color-accent-text` = `#143a40`) on
  pastel orange, which is high-contrast and makes the accent button the visual hero.

Keep this split when adding components: never put white text on light turquoise, and
prefer dark text on the orange accent.

## Other scales

- **Type** (`--text-*`): ~1.25 modular scale, `xs` 12 → `5xl` 52px. Weights
  `--font-weight-normal/semibold/bold/extra` (400/600/700/800).
- **Spacing** (`--space-1`…`8`): 4px base — 4, 8, 12, 16, 24, 32, 48, 64.
- **Radius** (`--radius-sm/md/lg/pill`): 6 / 12 / 20 / 999px.
- **Shadow** (`--shadow-sm/md/lg`, `--shadow-focus`): soft, low-contrast for light bg.
- **Motion** (`--transition-fast/base`, `--ease-out-expo`) and **z-index**
  (`--z-background/content/overlay/nav/nav-toggle/toast`).
- **Layout** (`--topnav-h`): height of the fixed `<top-nav>` bar; scrollable
  pages reserve this much top space (plus breathing room) in `base.css`.

## How to change the theme

- **Tweak a hue:** edit the primitive scale in `tokens.css` (e.g. make the sea
  greener by shifting `--turquoise-*`). The styleguide and all pages update at once.
- **Remap a role:** point a semantic alias at a different primitive (e.g.
  `--color-accent: var(--orange-300)` for a softer CTA).
- **Add a component:** style it with semantic/component tokens only — then it inherits
  any future theme change for free. Add a demo to `styleguide.html`.

## Components

UI primitives (buttons, cards, form fields, badges, toast) are CSS-only utility
classes in [`ui.css`](../assets/css/ui.css). Shared interactive pieces (`<top-nav>`,
the `<calm-sea>` background) are Web Components — see [components.md](components.md).
All of them consume the tokens above.
