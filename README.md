# Bearvil — bearvil.github.io

Official Bearvil website, hosted on [GitHub Pages](https://pages.github.com/) at **https://bearvil.github.io**.

## Structure

```
.
├── index.html                          # Home — wave hero, app tiles, principles, CTA band
├── work.html                           # Our apps — Frend AI, Touchy Fingies and Dicty showcases (#frend-ai, #touchy-fingies, #dicty)
├── about.html                          # About — one-person studio story, values, FAQ
├── contact.html                        # Contact — click-to-copy email, FAQ cross-link, privacy-policy links
├── 404.html                            # Custom 404 page, served for all missing paths
├── styleguide.html                     # Living style guide / component playground (internal, noindex)
├── assets/
│   ├── theme.js                        # Sets light/dark theme before first paint (sync, in <head>)
│   ├── components.js                   # Shared Web Components (nav + theme toggle, backgrounds, footer, behaviors)
│   ├── i18n/
│   │   ├── boot.js                     # Picks the language before first paint (sync, after theme.js)
│   │   ├── i18n.js                     # Applies translations, <lang-switch> menu (defer, after components.js)
│   │   └── hr.js de.js es.js it.js zh.js ja.js  # Dictionaries (English is the HTML itself)
│   ├── apps/                           # App icons, 256×256 PNG (frend-ai.png, touchy-fingies.png, dicty.png)
│   ├── og-image.png                    # Social preview image, 1200×630
│   ├── favicon.png                     # Favicon, 256×256 PNG
│   ├── Bearvil-logo*.png               # Logo assets
│   └── css/
│       ├── tokens.css                  # Design tokens (light + dark) — the single source of truth
│       ├── base.css                    # Reset, base typography, layouts (.content, .page-sections), text utilities
│       ├── components.css              # Styles for the shared Web Components
│       ├── ui.css                      # UI primitives (buttons, cards, forms, badges, checklist, metric, data-list, FAQ, toast)
│       ├── patterns.css                # Composed blocks (section-head, feature-row, card-grid, split-section, app blocks, cta-band)
│       ├── index.css                   # Home hero styles
│       ├── contact.css                 # Contact-page styles
│       ├── 404.css                     # 404-page styles
│       └── styleguide.css              # Style-guide layout
├── privacy-policies/
│   ├── touchy-fingies-pp.html          # Privacy policy for the Touchy Fingies app
│   ├── frend-ai-pp.html                # Privacy policy for the Frend AI app
│   └── dicty-pp.html                   # Privacy policy for the Dicty app
├── docs/                               # Detailed documentation (see below)
├── serve.py                            # Dev-only local preview (mimics GitHub Pages routing)
├── .gitignore                          # Ignores macOS and editor files
└── README.md
```

Everything is plain static HTML/CSS/JS — no build step, no frameworks, no dependencies beyond Google Fonts.

## Documentation

This README is the overview. Deeper, "how it works / how to do X" documentation
lives in [`docs/`](docs/README.md):

- [Architecture](docs/architecture.md) — structure, GitHub Pages, page composition, routing, SEO, security.
- [Design system](docs/design-system.md) — palette (light and dark), type and other scales, accessibility. Live: [`/styleguide.html`](styleguide.html).
- [Theming](docs/theming.md) — how the light/dark theme works and how to add a theme-aware token.
- [Languages (i18n)](docs/i18n.md) — the seven-language selector, translating new text, adding a language.
- [Shared components](docs/components.md) — `<top-nav>`, `<main-background>`, `<home-background>`, `<site-footer>`, theme helpers, behaviors.
- [Styling](docs/styling.md) — where styles live, the cascade, layouts, utility, primitive and pattern classes.
- Guides: [adding a page](docs/guides/adding-a-page.md) · [adding a privacy policy](docs/guides/adding-a-privacy-policy.md)

## Shared components

All main pages (Home, Work, About, Contact, 404, styleguide) share the theme, language, navigation, background, footer and behaviors through `assets/theme.js` (sets the theme before first paint), `assets/i18n/` (language and translations) and `assets/components.js` — vanilla [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components), no build step. Privacy policy pages are intentionally standalone (each carries its own app branding) and use none of them.

```html
<script src="/assets/theme.js"></script>                 <!-- sync, before the stylesheets -->
<script src="/assets/i18n/boot.js"></script>             <!-- sync, right after theme.js -->
<link rel="stylesheet" href="/assets/css/tokens.css" />  <!-- then base, components, ui, [patterns], [page] -->
<script src="/assets/components.js" defer></script>
<script src="/assets/i18n/i18n.js" defer></script>       <!-- after components.js -->
```

| Usage | What it does |
|---|---|
| `<top-nav></top-nav>` | Fixed top bar: logo, inline links (Home, Apps, About, Contact), a Privacy Policies dropdown, the `<lang-switch>` language menu, a light/dark theme toggle, and a hamburger → fullscreen menu on small screens. Links are defined once in `NAV_LINKS` / `PRIVACY_LINKS` in `components.js`. |
| `<main-background></main-background>` | Flat, subtle background wash. Every page except Home. |
| `<home-background></home-background>` | Animated wave sky behind the Home hero only (one viewport tall, scrolls away). Waves are token-colored, so they follow the theme; frozen on `prefers-reduced-motion`. |
| `<site-footer></site-footer>` | Slim frosted footer: brand lockup, the nav + privacy links, a `mailto:` email, `© <year> Bearvil`. |
| `<a data-copy-email href="mailto:...">` | Click copies the address and shows feedback; falls back to `mailto:`. |
| `data-font-reveal` attribute | Content fades in once the display font loads. Pair with a `<noscript>` fallback. |

All colors and scales are tokens in `tokens.css` (with a dark-theme block), and no raw colors live anywhere else — see [design system](docs/design-system.md), [theming](docs/theming.md) and [styling](docs/styling.md). Two page layouts live in `base.css`: `.content` (centered single hero — Contact, 404) and `.page-sections` (stacked sections — Home, Work, About).

To add a page, follow [docs/guides/adding-a-page.md](docs/guides/adding-a-page.md) (copy an existing `<head>` incl. `theme.js` and the i18n scripts, pick a layout, add `data-i18n` keys and translations, add the chrome, register it in `NAV_LINKS`, update the docs).

## Pages

| URL | File | Status |
|---|---|---|
| `/` | `index.html` | Live |
| `/privacy-policies/touchy-fingies-pp` | `privacy-policies/touchy-fingies-pp.html` | Live |
| `/privacy-policies/frend-ai-pp` | `privacy-policies/frend-ai-pp.html` | Live |
| `/privacy-policies/dicty-pp` | `privacy-policies/dicty-pp.html` | Live |
| `/contact` | `contact.html` | Live |
| `/work` | `work.html` | Live |
| `/about` | `about.html` | Live |
| `/styleguide` | `styleguide.html` | Live (internal, `noindex`, not linked from the nav or footer) |

GitHub Pages serves extensionless URLs (`/privacy-policies/touchy-fingies-pp` → `touchy-fingies-pp.html`) and automatically uses the root `404.html` for any missing path.

## Features

- **Light and dark theme** — follows the system setting by default; the nav toggle stores an explicit choice. Set before the first paint, so there is no theme flash. See [theming](docs/theming.md).
- **Seven languages** — English, Croatian, German, Spanish, Italian, Chinese and Japanese, picked from the browser languages or the nav menu, translated client-side with no English flash. Only English is indexed by search engines. See [i18n](docs/i18n.md).
- **Token-driven design system** — "Caribbean / beach" palette (turquoise + pastel orange on warm sand, or on deep night teal in dark), Inter type. Every color and scale is a CSS custom property in one file (`tokens.css`). A living [`styleguide.html`](styleguide.html) renders every token and component.
- **Real app pages** — Home tiles and Work showcases for Frend AI, Touchy Fingies and Dicty, with app icons, "privacy at a glance" facts and privacy-policy links.
- **Top navigation** — fixed top bar with inline links, a *Privacy Policies* dropdown, the theme toggle, and a fullscreen hamburger menu on small screens.
- **Click-to-copy email** — falls back to a regular `mailto:` link when the Clipboard API is unavailable.
- **Social previews** — Open Graph and `summary_large_image` Twitter cards with a shared 1200×630 image on the public pages.
- **Accessibility** — keyboard-friendly nav with visible focus styles and correct ARIA attributes; separate text and fill tokens keep contrast in both themes; `prefers-reduced-motion` stops the wave motion and card lift; content is visible without JavaScript.
- **Performance** — fonts loaded via `preconnect` + `<link>` (non render-blocking), tiny synchronous theme script, CSS-only animated background (no canvas/WebGL), explicit image dimensions.
- **Security** — Content-Security-Policy meta tag (only Google Fonts allowed as an external origin; `script-src 'self'` — no inline scripts), strict referrer policy, no third-party scripts.

## Development

No tooling required. Open `index.html` in a browser, or serve locally:

```sh
python3 serve.py            # http://localhost:8000  (recommended)
```

`serve.py` is a dev-only helper that mimics GitHub Pages routing: it resolves
extensionless URLs to their `.html` file (`/contact` → `contact.html`) and serves
the custom `404.html` for missing paths — so the nav links and 404 behave exactly
as they do in production. It is not part of the deployed site.

The plain `python3 -m http.server 8000` also works, but extensionless URLs 404 and
the custom 404 page isn't served (both are GitHub Pages features).

## Deployment

Push to the default branch — GitHub Pages publishes automatically.

## Adding a new privacy policy

1. Add `privacy-policies/<app-name>-pp.html`.
2. Add it to `PRIVACY_LINKS` in `assets/components.js` — the submenu updates on every page automatically.

## Contact

bearvil.info@gmail.com
