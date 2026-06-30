# Design System — Caribbean / Beach Theme

Plan and living progress tracker for redesigning the Bearvil site around a
token-driven, reusable design system. Status is updated as work progresses.

**Status:** Complete · 2026-06-28

## Goal

Replace the dark "night-sky" theme with a light, airy **Caribbean / beach**
look built on a **single source of truth** for design tokens. Changing a token
in one file propagates everywhere through CSS custom properties (inheritance).
Deliver a reusable component set and a live `styleguide.html` playground.

Decisions locked during brainstorming:

- **Mood:** light, airy beach (was dark night-sky).
- **Palette:** turquoise (Caribbean sea) primary + pastel orange (sun) accent,
  warm sand neutrals, deep teal-ink text. Pastel, not garish. 60/30/10 balance.
- **Typography:** Nunito for everything (rounded, friendly).
- **Background:** new `<calm-sea>` Web Component (animated sand→sea gradient,
  gentle shimmer, soft sun glow; respects `prefers-reduced-motion`).
- **Components:** tokens + type scale, buttons (variants), header/hero + nav,
  cards, form fields, badges, toast.
- **Playground:** `styleguide.html` at repo root (not in main nav).

## Accessibility note (drives palette usage)

Pastel + white text is a classic contrast failure. Therefore:

- Turquoise has two roles: light tones (sea, focus ring, borders, soft
  backgrounds, gradients) and a deep "lagoon" tone (700) for solid button fills
  carrying white text (passes WCAG AA).
- Orange CTA uses dark teal-ink text on pastel orange — high contrast, sunny,
  makes orange the visual hero (the 10% accent).

## Palette

Neutrals (sand/paper): `bg #FBF9F4` · `surface #FFFFFF` · `surface-2 #F2EEE6` · `border #E5E0D6`
Text (teal-ink): `text #143A40` · `text-muted #5A7A7E` · `text-subtle #8AA3A5`

Turquoise 50→800: `#ECFBF9 #CFF4F0 #A6E9E3 #6FD9D1 #3CC7C0 #1FB2AB #149A94 #0E7E79 #0C615E`
(accent/sea/focus = 500 `#1FB2AB`; white-text fill = 700 `#0E7E79`)

Orange 50→600: `#FFF4EC #FFE6D3 #FFCFAC #FFB783 #FF9E5C #FB8742 #E5702C`
(CTA fill = `#FFB783`/`#FF9E5C` with dark teal-ink text)

Semantic: success `#3DAE6B` · warning `#F2B441` · danger `#E5564B` · info = turquoise

## Architecture (inheritance / reuse)

```
assets/css/tokens.css      Single source of truth — :root config:
                           --color-*, --space-*, --radius-*, --shadow-*,
                           --font-*, --text-* scale, --transition-*,
                           semantic aliases (--btn-primary-bg, --surface, …)
assets/css/base.css        Reset + typography + layout — consumes tokens
assets/css/components.css   All shared component styles — consume tokens
assets/components.js        Web Components: <site-nav>, <calm-sea> (+ <night-sky> until migrated)
styleguide.html            Live playground / reference (root, not in nav)
```

Scales: spacing (4px base: 4/8/12/16/24/32/48/64), radius (sm/md/lg/pill),
shadow (sm/md/lg, soft), type (~1.25 modular), z-index.

## Build order & progress

- [x] 1. Write this plan/progress doc
- [x] 2. `assets/css/tokens.css` — single source of truth
- [x] 3. Refactor `assets/css/base.css` to consume tokens + Nunito
- [x] 4. Component styles: buttons, cards, form fields, badges, toast, nav (light)
      — UI primitives split into `assets/css/ui.css`; Web Components in `components.css`
- [x] 5. `<calm-sea>` Web Component in `assets/components.js` (replaced `<night-sky>`)
- [x] 6. `styleguide.html` playground (all tokens + components, live)
- [x] 7. Migrate `index.html` / `contact.html` / `404.html` to the new theme
- [x] 8. Update docs: `styling.md`, `components.md`, new `design-system.md`, `README.md`,
      plus `architecture.md`, `docs/README.md`, and both guides (night-sky → calm-sea,
      tokens + ui.css in the cascade)

**Status: complete.**

## Notes / log

- 2026-06-28: Plan approved; doc created. Starting implementation.
- 2026-06-28: Built tokens.css, base.css, components.css (calm-sea + light nav),
  ui.css (buttons/cards/forms/badges/toast), `<calm-sea>` component, styleguide.html.
- 2026-06-28: Migrated index/contact/404 + their page CSS to tokens + Nunito.
  Removed `<night-sky>` (and its CSS) since all pages now use `<calm-sea>`.
- 2026-06-28: Verified all pages + styleguide render in browser, no console errors.
  Implementation note: UI primitives live in a dedicated `ui.css` (not `components.css`)
  to keep each file focused and within the ~300–400 line guideline.
