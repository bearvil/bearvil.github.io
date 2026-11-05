# Theming (light / dark)

The main site has a **light** and a **dark** theme. Both are driven entirely by
the design tokens in [`assets/css/tokens.css`](../assets/css/tokens.css); no
other stylesheet knows which theme is active. This page explains how the theme
is chosen, how it switches at runtime, and how to add or change a token so it
works in both themes.

For the palette itself and the token roles, see [design-system.md](design-system.md).
Privacy-policy pages are standalone and are **not** themed by this system.

## How the active theme is chosen

The theme is a single attribute on the root element:

```html
<html data-theme="light">   <!-- or "dark" -->
```

It is set by [`assets/theme.js`](../assets/theme.js), a tiny script that runs
**before the first paint**, so the page never flashes the wrong theme. Order of
precedence:

1. the visitor's stored choice — `localStorage` key `bearvil-theme`
   (`"light"` or `"dark"`, written by the nav toggle);
2. the system preference — `prefers-color-scheme: dark`;
3. otherwise `light`.

`theme.js` must be loaded **synchronously** (no `defer`/`async`) in `<head>`,
**before the stylesheets**:

```html
<meta name="color-scheme" content="light dark" />
<meta name="theme-color" content="#fbf9f4" />
…
<!-- Theme: sets <html data-theme> before first paint (must stay sync, first) -->
<script src="/assets/theme.js"></script>
…
<link rel="stylesheet" href="/assets/css/tokens.css" />
```

It is an external same-origin file, so it is allowed by the page CSP
(`script-src 'self'`) without any inline script.

**Without JavaScript** no `data-theme` attribute is set and the site renders the
default light theme (the `:root` tokens).

## Switching at runtime

The rest of the theme logic lives in [`assets/components.js`](../assets/components.js):

| Piece | What it does |
|---|---|
| Theme toggle in `<top-nav>` | A round `.theme-toggle` button inside `.topnav-actions` (next to the hamburger). Shows a moon in light theme and a sun in dark theme — the icon is the theme you would switch **to**. Its `aria-label`/`title` read "Switch to dark theme" / "Switch to light theme". |
| `applyTheme(theme, persist)` | Sets `data-theme`, stores the choice in `bearvil-theme` when `persist` is true (the toggle passes `true`), updates every toggle's label and the `theme-color` meta. |
| `syncThemeColor()` | Copies the computed `--color-bg` into `<meta name="theme-color">`, so the mobile browser chrome matches the page. |
| `initTheme()` | Runs on load: syncs `theme-color`, then listens for system `prefers-color-scheme` changes and follows them **only while there is no stored choice**. Once the visitor uses the toggle, their pick wins. |

While swapping, `applyTheme` adds the `.theme-switching` class to `<html>` for
two animation frames. A rule in `base.css` disables all transitions under that
class, so every surface changes color at once instead of fading at different
speeds.

The toggle has no "reset to system" option. To go back to following the system
setting, remove the `bearvil-theme` key from the browser's local storage.

## How `tokens.css` is organised

```
:root {
  1. Primitive palette     raw scales (turquoise, orange, sand, ink, night, mist, states)
  2. Semantic tokens       LIGHT theme values — the default
}
:root[data-theme="dark"] {
  3. Dark theme            re-points ONLY semantic tokens
}
:root {
  4–9. Type, spacing, radius, motion, z-index, layout — theme-independent
}
```

Rules:

- Components and pages use **only semantic tokens** (`--color-*`,
  `--gradient-*`, `--shadow-*`, …), never primitives such as `--turquoise-500`.
- **No raw hex or `rgba()` values outside `tokens.css`.** If a color is
  missing, add a semantic token for it (below).
- The dark block re-points semantic tokens and nothing else. Primitives,
  type, spacing and other scales are shared by both themes.

## Adding a token

1. **Need a new hue?** Add it to the primitive palette (section 1) if none of the
   existing scales fits — for example `--orange-700`. Skip this if an existing
   primitive works.
2. **Add the semantic token** to section 2 (light theme), named for its role,
   not its color:

   ```css
   /* 2. SEMANTIC TOKENS — LIGHT THEME */
   --color-highlight: var(--orange-100);
   ```

3. **Give it a dark value** in section 3, `:root[data-theme="dark"]`:

   ```css
   :root[data-theme="dark"] {
     --color-highlight: rgba(255, 158, 92, 0.14);
   }
   ```

   If the light value already works on the dark background, you can leave it
   out of section 3 — the dark theme then inherits the light value (this is how
   `--color-success`, `--color-warning` and `--color-danger` share one hue).
   Only skip it after checking it in dark mode.

4. **Use it** in the stylesheet: `background: var(--color-highlight);`
5. **Check both themes** (see below) and, if the token is part of the visible
   palette, add a swatch to [`styleguide.html`](../styleguide.html) and a row to
   the palette table in [design-system.md](design-system.md).

Tips:

- **Tinted backgrounds in dark mode** usually work best as a low-alpha version of
  the hue (`rgba(…, 0.08–0.18)`) rather than a solid dark shade, so they sit
  naturally on `--color-bg` and `--color-surface`.
- **Shadows** take their color from `--shadow-color`, an RGB triplet
  (`20, 58, 64` light, `0, 0, 0` dark). Write new shadows as
  `rgba(var(--shadow-color), <alpha>)` so they follow the theme.
- **Composite tokens** (gradients, the Home sky) are defined in both blocks with
  their own stops, because a gradient that reads well on sand is too bright on
  night teal.
- **Images that only work on light** can get a filter token. The logo uses
  `--logo-filter` (`none` in light, an invert + hue-rotate in dark), applied on
  the nav, footer and Home hero logo.

## Text on color — pick the right primary token

- `--color-primary-strong` — primary-colored **text** (nav hover and
  current-page states, secondary buttons, badges, checklist ticks). Light: `--turquoise-700`; dark:
  `--turquoise-300`, so it stays readable on both backgrounds.
- `--color-primary-fill` — **solid backgrounds that carry white text** (primary
  button, `.cta-band`). It stays `--turquoise-700` in both themes.

Never use `--color-primary-fill` as a text color: in dark mode it would be dark
teal on a dark background. The same split exists for the accent:
`--color-accent-strong` is accent-colored text (heading `<em>` accents, card
index numbers); `--color-accent` is the orange CTA fill with
`--color-accent-text` (dark ink) on top.

## The Home background

`<home-background>` paints `--home-sky` (a gradient) behind the Home hero and
three drifting wave layers colored by `--wave-back`, `--wave-mid` and
`--wave-front`. Each wave is a plain colored block cut to shape by a CSS
`mask-image` (an inline SVG data URI), so the waves follow the theme without
separate artwork. `--wave-front` is set to `--color-bg`, which makes the hero
blend into the page sections below it in either theme. See
[components.md](components.md#home-background).

## Testing both themes

- Use the toggle in the nav, then reload: the choice must persist and the page
  must not flash the other theme on load.
- Clear the `bearvil-theme` key, then switch the OS (or DevTools "Emulate CSS
  prefers-color-scheme") between light and dark: the page should follow it live.
- Open [`/styleguide`](../styleguide.html) in both themes; it renders every token
  and primitive from the real stylesheets.
- Check focus rings, badges, form error states and the `.cta-band` in dark mode —
  they use the state and primary tokens that change most between themes.
