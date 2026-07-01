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

## `<top-nav>`

A fixed top bar: the Bearvil logo on the left, inline links on the right, a
**Privacy Policies** dropdown, and — on small screens — a hamburger that opens a
fullscreen menu. Styled for the light theme; all colors come from tokens.

```html
<top-nav></top-nav>
```

- Links are defined **once** in `NAV_LINKS` and `PRIVACY_LINKS` at the top of
  `components.js`. Every page that includes the script picks them up — edit them in
  one place.
- The link matching the current path gets `aria-current="page"`.
- The **Privacy Policies** dropdown opens on hover/focus and on click; its entries
  come from `PRIVACY_LINKS` and open in a new tab.
- Below ~720px the inline links are replaced by a hamburger that toggles a
  fullscreen menu listing every link.
- The bar adds a frosted, condensed `.scrolled` state once the page is scrolled
  past 40px. (Short pages whose content fits in one viewport never scroll, so they
  simply keep the resting state.)
- Accessibility: keyboard operable, `aria-expanded` on the toggles, `Escape`
  closes the dropdown and the mobile menu (returning focus to the hamburger),
  visible focus throughout, and motion gated by `prefers-reduced-motion`.

Because the bar is `position: fixed`, pages need top clearance so content doesn't
sit under it. This is handled **globally** in `base.css`: every main-site `body`
gets `padding-top: calc(var(--topnav-h) + var(--space-6))` (the bar height token
plus breathing room), so content always clears the bar — no per-page offset
needed. To change the reserved height, edit `--topnav-h` in `tokens.css`. (For the
sticky-footer body layout that places `<site-footer>` at the bottom, see
[styling.md](styling.md).)

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
water shimmer, and drifting wave bands. Sits behind all content. Takes no
attributes.

```html
<calm-sea></calm-sea>
```

- The gradient, sun, shimmer, and waves are pure CSS (in `components.css`); the
  component only injects the layers.
- Respects `prefers-reduced-motion`: continuous motion stops, leaving the calm
  gradient.

## `<site-footer>`

A slim frosted footer bar that mirrors the `<top-nav>` surface, so the nav and
footer bookend the page. Place it once, just before `</body>`. Styled for the
light theme; all colors come from tokens.

```html
<site-footer></site-footer>
```

- **Links come from the same source as the nav.** It reuses `NAV_LINKS` and
  `PRIVACY_LINKS` from `components.js`, so adding a page or a privacy policy in one
  place updates the nav and the footer together. The privacy links open in a new
  tab; the link matching the current path gets `aria-current="page"`.
- Layout: the Bearvil logo lockup on the left; the site links (including a
  **Style guide** link to `/styleguide`), the privacy links, and a `mailto:` email
  on the right; a thin bottom strip with `© <year> Bearvil`. All entries share the
  same text-link styling.
  The year is filled in at runtime via `new Date().getFullYear()` (inside the
  external script, so the strict CSP is unaffected). The footer email is a plain
  `mailto:` link — the click-to-copy behavior (`data-copy-email`) is used only on
  the contact page.
- Below ~720px the brand and links stack and center.
- For the sticky-footer body layout that keeps it at the bottom of the viewport,
  see [styling.md](styling.md).
- Styled in `components.css`. Privacy-policy pages are standalone and do **not**
  use the footer.

## Behaviors (opt-in via data attributes)

### `data-copy-email`

```html
<a data-copy-email href="mailto:bearvil.co@gmail.com">bearvil.co@gmail.com</a>
```

Clicking copies the address to the clipboard, then shows success feedback for
~1.8s before reverting. There are two opt-in feedback styles (a page picks
whichever element it places near the link); repeat clicks restart the timer
rather than stacking. Falls back to the normal `mailto:` link when the Clipboard
API is unavailable.

- **Pill toast** — place a `.copied-toast` near the link (a pill styled in
  `ui.css`; the shared `.show` state lives in `base.css`). It fades in, then out.
  The page positions its own `.copied-toast`. Used on the **home** page.

  ```html
  <a data-copy-email href="mailto:bearvil.co@gmail.com">…</a>
  <span class="copied-toast" role="status">Copied</span>
  ```

- **Hint swap** — place an element with `data-copy-hint` near the link (e.g. the
  "Click to copy" hint). On copy its text is swapped to `data-copied-label`
  (default "Copied to clipboard") and it gets the `.is-copied` class for styling;
  both revert after the delay. Used on the **contact** page instead of a pill.

  ```html
  <a data-copy-email href="mailto:bearvil.co@gmail.com">…</a>
  <p class="hint" data-copy-hint data-copied-label="Copied to clipboard" role="status">Click to copy</p>
  ```

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
