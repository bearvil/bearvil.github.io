# Bearvil — bearvil.github.io

Official Bearvil website, hosted on [GitHub Pages](https://pages.github.com/) at **https://bearvil.github.io**.

## Structure

```
.
├── index.html                          # Landing page (night-sky animation, side nav)
├── contact.html                        # Contact page (email with click-to-copy)
├── 404.html                            # Custom 404 page, served for all missing paths
├── assets/
│   └── components.js                   # Shared Web Components (nav, background, behaviors)
├── privacy-policies/
│   ├── touchy-fingies-pp.html          # Privacy policy for the Touchy Fingies app
│   └── frend-ai-pp.html                # Privacy policy for the Frend AI app
└── README.md
```

Everything is plain static HTML/CSS/JS — no build step, no frameworks, no dependencies beyond Google Fonts.

## Shared components

Site pages (`index.html`, `contact.html`, `404.html`) share their navigation, animated background, styles, and behaviors through a single file, `assets/components.js` — vanilla [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components), no build step, portable to any static host. Privacy policy pages are intentionally standalone (each carries its own app branding) and don't use it.

Include it in `<head>`:

```html
<script src="/assets/components.js" defer></script>
```

Available components and behaviors:

| Usage | What it does |
|---|---|
| `<site-nav></site-nav>` | Menu toggle, slide-in side nav (with Privacy Policies submenu), overlay. Links are defined once in `NAV_LINKS` / `PRIVACY_LINKS` in `components.js`; the current page gets `aria-current="page"`. |
| `<night-sky stars="140" clouds particles>` | Animated background: sky, twinkling stars, horizon; optional drifting `clouds` and rising `particles`. Page-specific `.mist` layers can be placed as children. Mobile gets ~55% of the `stars` count. |
| `<a data-copy-email href="mailto:...">` | Click copies the address and shows the nearest `.copied-toast`; falls back to `mailto:`. |
| `data-font-reveal` attribute | Element starts hidden (`opacity: 0` in page CSS) and fades in once the display font loads. Pair with a `<noscript>` fallback. |

Shared CSS for these components is injected by the script itself — pages only keep their page-specific styles.

### Adding a new page

1. Copy the `<head>` of an existing page (CSP, fonts, favicon, `components.js` include); adjust title/description/canonical/og tags.
2. Add `<site-nav></site-nav>` and `<night-sky>` at the top of `<body>`.
3. Write page content in `<main class="content">` with page-specific styles inline.
4. If the page should appear in the menu, add it to `NAV_LINKS` in `assets/components.js` — every page picks it up automatically.

## Pages

| URL | File | Status |
|---|---|---|
| `/` | `index.html` | Live |
| `/privacy-policies/touchy-fingies-pp` | `privacy-policies/touchy-fingies-pp.html` | Live |
| `/privacy-policies/frend-ai-pp` | `privacy-policies/frend-ai-pp.html` | Live |
| `/contact` | `contact.html` | Live |
| `/work`, `/about` | — | Planned (404 for now) |

GitHub Pages serves extensionless URLs (`/privacy-policies/touchy-fingies-pp` → `touchy-fingies-pp.html`) and automatically uses the root `404.html` for any missing path.

## Features

- **Animated landing page** — night sky with twinkling stars, drifting clouds, mist, and rising particles; content fades in only after the display font has loaded (no flash of unstyled text).
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
