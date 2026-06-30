# Bearvil — bearvil.github.io

Official Bearvil website, hosted on [GitHub Pages](https://pages.github.com/) at **https://bearvil.github.io**.

## Structure

```
.
├── index.html                          # Landing page (calm-sea background, side nav)
├── contact.html                        # Contact page (email with click-to-copy)
├── 404.html                            # Custom 404 page, served for all missing paths
├── styleguide.html                     # Living style guide / component playground
├── assets/
│   ├── components.js                   # Shared Web Components (nav, background, behaviors)
│   └── css/
│       ├── tokens.css                  # Design tokens — the single source of truth
│       ├── base.css                    # Reset, base typography, shared layout & text utilities
│       ├── components.css              # Styles for the shared Web Components
│       ├── ui.css                      # UI primitives (buttons, cards, forms, badges, toast)
│       ├── index.css                   # Landing-page styles
│       ├── contact.css                 # Contact-page styles
│       ├── 404.css                     # 404-page styles
│       └── styleguide.css              # Style-guide layout
├── privacy-policies/
│   ├── touchy-fingies-pp.html          # Privacy policy for the Touchy Fingies app
│   └── frend-ai-pp.html                # Privacy policy for the Frend AI app
├── docs/                               # Detailed documentation (see below)
├── CLAUDE.md                           # Project rules & conventions
└── README.md
```

Everything is plain static HTML/CSS/JS — no build step, no frameworks, no dependencies beyond Google Fonts.

## Documentation

This README is the overview. Deeper, "how it works / how to do X" documentation
lives in [`docs/`](docs/README.md):

- [Architecture](docs/architecture.md) — structure, GitHub Pages, CSS layering, routing.
- [Design system](docs/design-system.md) — token-driven theme: palette, type scale, how to retheme. Live: [`/styleguide.html`](styleguide.html).
- [Shared components](docs/components.md) — `<site-nav>`, `<calm-sea>`, and the behaviors.
- [Styling](docs/styling.md) — where styles live, the cascade, utility & primitive classes.
- Guides: [adding a page](docs/guides/adding-a-page.md) · [adding a privacy policy](docs/guides/adding-a-privacy-policy.md)

Project rules and conventions are in [CLAUDE.md](CLAUDE.md).

## Shared components

Site pages (`index.html`, `contact.html`, `404.html`) share their navigation, animated background, styles, and behaviors through a single file, `assets/components.js` — vanilla [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components), no build step, portable to any static host. Privacy policy pages are intentionally standalone (each carries its own app branding) and don't use it.

Include it in `<head>`, alongside the design tokens and the component styles:

```html
<link rel="stylesheet" href="/assets/css/tokens.css" />
<link rel="stylesheet" href="/assets/css/components.css" />
<script src="/assets/components.js" defer></script>
```

Available components and behaviors:

| Usage | What it does |
|---|---|
| `<site-nav></site-nav>` | Menu toggle, slide-in side nav (with Privacy Policies submenu), overlay. Links are defined once in `NAV_LINKS` / `PRIVACY_LINKS` in `components.js`; the current page gets `aria-current="page"`. |
| `<calm-sea glints="22">` | Light "Caribbean" animated background: sand→sea gradient, soft sun glow, water shimmer, wave bands, and sun glints. Mobile gets ~55% of the `glints` count. Respects `prefers-reduced-motion`. |
| `<a data-copy-email href="mailto:...">` | Click copies the address and shows the nearest `.copied-toast`; falls back to `mailto:`. |
| `data-font-reveal` attribute | Element starts hidden (`opacity: 0` in page CSS) and fades in once the display font loads. Pair with a `<noscript>` fallback. |

Styles are kept in external CSS files under `assets/css/`, with **all design tokens in one file** (`tokens.css`) that everything else inherits from — change a token and the whole site re-themes. See the [design system](docs/design-system.md) and [styling](docs/styling.md) docs. Each main page links `tokens.css → base.css → components.css → ui.css → <page>.css` in its `<head>`.

### Adding a new page

1. Copy the `<head>` of an existing page (CSP, fonts, favicon, CSS links, `components.js` include); adjust title/description/canonical/og tags.
2. Point the page-specific stylesheet link at a new `assets/css/<page>.css`.
3. Add `<site-nav></site-nav>` and `<calm-sea></calm-sea>` at the top of `<body>`.
4. Write page content in `<main class="content">`; put its styles in `assets/css/<page>.css`, using the design tokens.
5. If the page should appear in the menu, add it to `NAV_LINKS` in `assets/components.js` — every page picks it up automatically.

## Pages

| URL | File | Status |
|---|---|---|
| `/` | `index.html` | Live |
| `/privacy-policies/touchy-fingies-pp` | `privacy-policies/touchy-fingies-pp.html` | Live |
| `/privacy-policies/frend-ai-pp` | `privacy-policies/frend-ai-pp.html` | Live |
| `/contact` | `contact.html` | Live |
| `/styleguide` | `styleguide.html` | Live (internal, `noindex`) |
| `/work`, `/about` | — | Planned (404 for now) |

GitHub Pages serves extensionless URLs (`/privacy-policies/touchy-fingies-pp` → `touchy-fingies-pp.html`) and automatically uses the root `404.html` for any missing path.

## Features

- **Token-driven design system** — light "Caribbean / beach" theme (turquoise + pastel orange on warm sand, Nunito type). Every color and scale is a CSS custom property in one file (`tokens.css`); change a token and the whole site re-themes. A living [`styleguide.html`](styleguide.html) renders every token and component.
- **Animated landing page** — `<calm-sea>` background (sand→sea gradient, soft sun, water shimmer, gentle waves); content fades in only after the display font has loaded (no flash of unstyled text).
- **Side navigation** — slide-in menu with an expandable *Privacy Policies* submenu.
- **Click-to-copy email** — falls back to a regular `mailto:` link when the Clipboard API is unavailable.
- **Accessibility** — keyboard-friendly nav with visible focus styles and correct ARIA attributes; `prefers-reduced-motion` stops the continuous background motion; content is visible without JavaScript.
- **Performance** — fonts loaded via `preconnect` + `<link>` (non render-blocking), inline SVG favicon (no extra request), reduced particle/star counts on small screens, single-write DOM construction for stars.
- **Security** — Content-Security-Policy meta tag (only Google Fonts allowed as an external origin; `script-src 'self'` — no inline scripts), strict referrer policy, no third-party scripts.

## Development

No tooling required. Open `index.html` in a browser, or serve locally:

```sh
python3 -m http.server 8000
# http://localhost:8000
```

Note: extensionless URLs and the custom 404 page are GitHub Pages features and won't work with a plain local file server.

## Deployment

Push to the default branch — GitHub Pages publishes automatically.

## Adding a new privacy policy

1. Add `privacy-policies/<app-name>-pp.html`.
2. Add it to `PRIVACY_LINKS` in `assets/components.js` — the submenu updates on every page automatically.

## Contact

bearvil.co@gmail.com
