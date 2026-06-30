# Shared components

Reusable building blocks for the main site pages, defined as vanilla
[Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)
in [`assets/components.js`](../assets/components.js). No build step; portable to any
static host. Their **visual styles** live in
[`assets/css/components.css`](../assets/css/components.css).

> Looking for buttons, cards, form fields, or badges? Those are CSS-only UI
> primitives in [`ui.css`](../assets/css/ui.css) — see [styling.md](styling.md) and
> the live [`/styleguide.html`](../styleguide.html).

To use the components on a page, link the tokens, the component styles, and the
script (see the full cascade in [styling.md](styling.md)):

```html
<link rel="stylesheet" href="/assets/css/tokens.css" />
<link rel="stylesheet" href="/assets/css/components.css" />
<script src="/assets/components.js" defer></script>
```

> Privacy-policy pages do **not** use these components — they are standalone.

## `<site-nav>`

Menu toggle (top-left), slide-in side navigation, and a dimming overlay. Styled for
the light theme; all colors come from tokens.

```html
<site-nav></site-nav>
```

- Links are defined **once** in `NAV_LINKS` and `PRIVACY_LINKS` at the top of
  `components.js`. Every page that includes the script picks them up — edit them in
  one place.
- The link matching the current path gets `aria-current="page"`.
- The **Privacy Policies** submenu is collapsible; its entries come from
  `PRIVACY_LINKS` and open in a new tab.
- Accessibility: keyboard operable, `aria-expanded` on the toggles, `Escape`
  closes the menu and returns focus, focus moves into the panel on open.

To add a menu item, add an entry to `NAV_LINKS`:

```js
const NAV_LINKS = [
  { href: '/',        label: 'Home' },
  { href: '/work',    label: 'Work' },
  …
];
```

## `<calm-sea>`

Light "Caribbean" animated background: a sand→sea gradient with a soft sun glow,
water shimmer, drifting wave bands, and a few sun glints. Sits behind all content.

```html
<calm-sea glints="22"></calm-sea>
```

| Attribute | Effect |
|---|---|
| `glints="22"` | Desktop count of sparkles on the water (default `18`). Small screens get ~55%. |

- The gradient, sun, shimmer, and waves are pure CSS (in `components.css`); the
  component only injects the layers and the randomized glints.
- Respects `prefers-reduced-motion`: continuous motion stops, leaving the calm
  gradient.

## Behaviors (opt-in via data attributes)

### `data-copy-email`

```html
<a data-copy-email href="mailto:bearvil.co@gmail.com">bearvil.co@gmail.com</a>
```

Clicking copies the address to the clipboard and briefly shows the nearest
`.copied-toast` (a pill styled in `ui.css`; the shared show state lives in
`base.css`). Falls back to the normal `mailto:` link when the Clipboard API is
unavailable. The page positions its own `.copied-toast`.

### `data-font-reveal`

```html
<main class="content" data-font-reveal> … </main>
```

The element starts hidden (`opacity: 0`, set in the page CSS) and fades in once the
display font (Nunito) has loaded — avoiding a flash of unstyled text. Pair it with a
`<noscript>` fallback that forces `opacity: 1` so no-JS visitors still see content:

```html
<noscript><style>.content { opacity: 1; }</style></noscript>
```
