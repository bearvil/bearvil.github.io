# Shared components

Reusable building blocks for the main site pages, defined as vanilla
[Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)
in [`assets/components.js`](../assets/components.js). No build step; portable to any
static host. Their **visual styles** live in
[`assets/css/components.css`](../assets/css/components.css).

> Looking for buttons, cards, form fields, or badges? Those are CSS-only UI
> primitives in [`ui.css`](../assets/css/ui.css) — see [styling.md](styling.md) and
> the live [`/styleguide.html`](../styleguide.html).

To use the components on a page, load the theme script, link the tokens and the
component styles, and include the script (see the full cascade in
[styling.md](styling.md)):

```html
<script src="/assets/theme.js"></script>        <!-- sync, before the stylesheets -->
<script src="/assets/i18n/boot.js"></script>    <!-- sync, right after theme.js -->
<link rel="stylesheet" href="/assets/css/tokens.css" />
<link rel="stylesheet" href="/assets/css/components.css" />
<script src="/assets/components.js" defer></script>
<script src="/assets/i18n/i18n.js" defer></script>   <!-- after components.js -->
```

`theme.js` sets the initial light/dark theme before the first paint; the toggle
and runtime switching live in `components.js` — see [theming.md](theming.md).
`i18n/boot.js` picks the language and `i18n/i18n.js` translates the page and
defines `<lang-switch>` — see [i18n.md](i18n.md).

> Privacy-policy pages do **not** use these components — they are standalone.

## `<top-nav>`

A fixed top bar: the Bearvil logo on the left, inline links on the right, a
**Privacy Policies** dropdown, a **language menu**, a **light/dark theme
toggle**, and — on small screens — a hamburger that opens a fullscreen menu. All colors come from
semantic tokens, so it follows the active theme.

```html
<top-nav></top-nav>
```

- Links are defined **once** in `NAV_LINKS` and `PRIVACY_LINKS` at the top of
  `components.js`. Every page that includes the script picks them up — edit them in
  one place.
- The link matching the current path gets `aria-current="page"`.
- The **Privacy Policies** dropdown opens on hover/focus and on click; its entries
  come from `PRIVACY_LINKS` and open in a new tab.
- **Actions** — a `.topnav-actions` wrapper at the right end of the bar holds, in
  order, `<lang-switch>`, the theme toggle and the hamburger, so the first two
  stay visible at every width.
- **Language menu** — `<lang-switch>` is rendered here but defined in
  `assets/i18n/i18n.js` (so the page must also load that script). A globe +
  language-code pill (`EN`, `HR`, …) opens a list of languages in their native
  names. Details: [i18n.md](i18n.md#5-the-language-menu--lang-switch).
- **Theme toggle** — a round `.theme-toggle` button. It shows a moon in light
  theme and a sun in dark theme, and its `aria-label`/`title` say which theme it
  switches to (translated via `bearvilT('theme.toDark' | 'theme.toLight', …)`).
  A click calls `applyTheme(…, true)`, which stores the choice. Details:
  [theming.md](theming.md).
- **Translatable labels** — the nav links, the mobile-menu links, the "Privacy
  Policies" label and the hamburger's `aria-label` carry `data-i18n` /
  `data-i18n-attr` keys (`nav.*`), so `i18n.js` translates them. The privacy-policy
  entries (app names) are not translated.
- Below ~720px the inline links are replaced by a hamburger that toggles a
  fullscreen menu listing every link.
- The logo `<img>` uses `filter: var(--logo-filter)` so it is recolored in dark
  theme.
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

To add a menu item, add an entry to `NAV_LINKS` with an English `label` and a
translation `key`, then add that key to every dictionary in `assets/i18n/`
([i18n.md](i18n.md#adding-a-translatable-string)):

```js
const NAV_LINKS = [
  { href: '/',        label: 'Home',    key: 'nav.home' },
  { href: '/work',    label: 'Apps',    key: 'nav.work' },
  …
];
```

Note: the `/work` page is labelled **Apps** in the nav and footer (the URL and
the `nav.work` key stay `work`).

## `<main-background>`

A single flat, subtle background color (`--color-bg-tint`: a pale turquoise
wash in light theme, the page background in dark). Fixed behind all content.
Used on every page **except** Home. Takes no attributes.

```html
<main-background></main-background>
```

- The color is pure CSS (in `components.css`); the component only injects the
  layer div.

## `<home-background>`

Animated "wave sky" used only on `index.html`, behind the Home hero. A
gradient sky with three wave layers drifting horizontally at different
speeds/opacities — plain CSS animation, no canvas/WebGL.

```html
<home-background></home-background>
```

- **Hero only.** The layer is `position: absolute` at the top of the page and one
  viewport tall (`100svh`, min 620px), so it scrolls away with the hero; the
  sections below sit on the plain page background.
- **Token-colored waves.** The sky is `--home-sky`; each wave is a solid block of
  `--wave-back` / `--wave-mid` / `--wave-front`, cut to shape by a CSS
  `mask-image` (an inline SVG data URI). The drift animates `mask-position`.
  Because the colors are tokens, the waves follow the light/dark theme.
- **Seamless edge.** `--wave-front` equals `--color-bg`, so the front wave blends
  the hero into the page below it in either theme.
- The gradient and wave layers are pure CSS (in `components.css`); the
  component only injects the three wave `<div>`s.
- Respects `prefers-reduced-motion`: the drift animation stops, leaving the
  static sky + waves.
- Fully independent from `<main-background>` — no shared code.

## `<site-footer>`

A slim frosted footer bar that mirrors the `<top-nav>` surface, so the nav and
footer bookend the page. Place it once, just before `</body>`. All colors come
from semantic tokens, so it follows the active theme.

```html
<site-footer></site-footer>
```

- **Links come from the same source as the nav.** It reuses `NAV_LINKS` and
  `PRIVACY_LINKS` from `components.js`, so adding a page or a privacy policy in one
  place updates the nav and the footer together. The privacy links open in a new
  tab; the link matching the current path gets `aria-current="page"`.
- Layout: the Bearvil logo lockup on the left; the site links, the privacy
  links, and a `mailto:` email on the right; a thin bottom strip with
  `© <year> Bearvil`. All entries share the same text-link styling. The style
  guide is intentionally **not** linked (it is internal and `noindex`; open
  `/styleguide` directly).
  The year is filled in at runtime via `new Date().getFullYear()` (inside the
  external script, so the strict CSP is unaffected). The footer email is a plain
  `mailto:` link — the click-to-copy behavior (`data-copy-email`) is used only on
  the contact page.
- Below ~720px the brand and links stack and center.
- For the sticky-footer body layout that keeps it at the bottom of the viewport,
  see [styling.md](styling.md).
- Styled in `components.css`. Privacy-policy pages are standalone and do **not**
  use the footer.

## Theme helpers

Plain functions in `components.js` (not custom elements) that switch the theme at
runtime: `applyTheme(theme, persist)`, `syncThemeToggle(btn)`,
`syncThemeColor()` and `initTheme()` (called from `init()` on load). The initial
theme is set earlier by `assets/theme.js`. How they fit together, and how to add
theme-aware tokens: [theming.md](theming.md).

## Behaviors (opt-in via data attributes)

### `data-copy-email`

```html
<a data-copy-email href="mailto:bearvil.info@gmail.com">bearvil.info@gmail.com</a>
```

Clicking copies the address to the clipboard, then shows success feedback for
~1.8s before reverting. There are two opt-in feedback styles (a page picks
whichever element it places near the link); repeat clicks restart the timer
rather than stacking. Falls back to the normal `mailto:` link when the Clipboard
API is unavailable.

- **Pill toast** — place a `.copied-toast` near the link (a pill styled in
  `ui.css`; the shared `.show` state lives in `base.css`). It fades in, then out.
  The page positions its own `.copied-toast`. Not currently used on a live page
  (the contact page uses the hint-swap style below) — see the static demo in
  [`/styleguide.html`](../styleguide.html).

  ```html
  <a data-copy-email href="mailto:bearvil.info@gmail.com">…</a>
  <span class="copied-toast" role="status">Copied</span>
  ```

- **Hint swap** — place an element with `data-copy-hint` near the link (e.g. the
  "Click to copy" hint). On copy its text is swapped to `data-copied-label`
  (default "Copied to clipboard") and it gets the `.is-copied` class for styling;
  both revert after the delay. Used on the **contact** page instead of a pill.

  ```html
  <a data-copy-email href="mailto:bearvil.info@gmail.com">…</a>
  <p class="hint" data-copy-hint data-copied-label="Copied to clipboard" role="status">Click to copy</p>
  ```

### `data-font-reveal`

```html
<main class="page-sections" id="content" data-font-reveal> … </main>
```

The element starts hidden (`opacity: 0` — set on `.page-sections` in `base.css`)
and fades in once the display font (Inter) has loaded — avoiding a flash of
unstyled text. Used by Home, Work and About. Pair it with a `<noscript>` fallback
that forces `opacity: 1` so no-JS visitors still see content:

```html
<noscript><style>.page-sections { opacity: 1; }</style></noscript>
```

(The `.content` pages — Contact and 404 — don't use it; they fade in with the
`fadeInUp` CSS animation instead.)
