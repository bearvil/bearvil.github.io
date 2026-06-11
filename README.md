# Bearvil — bearvil.github.io

Official Bearvil website, hosted on [GitHub Pages](https://pages.github.com/) at **https://bearvil.github.io**.

## Structure

```
.
├── index.html                          # Landing page (night-sky animation, side nav)
├── 404.html                            # Custom 404 page, served for all missing paths
├── privacy-policies/
│   ├── touchy-fingies-pp.html          # Privacy policy for the Touchy Fingies app
│   └── frend-ai-pp.html                # Privacy policy for the Frend AI app
└── README.md
```

Everything is plain static HTML/CSS/JS — no build step, no frameworks, no dependencies beyond Google Fonts.

## Pages

| URL | File | Status |
|---|---|---|
| `/` | `index.html` | Live |
| `/privacy-policies/touchy-fingies-pp` | `privacy-policies/touchy-fingies-pp.html` | Live |
| `/privacy-policies/frend-ai-pp` | `privacy-policies/frend-ai-pp.html` | Live |
| `/work`, `/about`, `/contact` | — | Planned (404 for now) |

GitHub Pages serves extensionless URLs (`/privacy-policies/touchy-fingies-pp` → `touchy-fingies-pp.html`) and automatically uses the root `404.html` for any missing path.

## Features

- **Animated landing page** — night sky with twinkling stars, drifting clouds, mist, and rising particles; content fades in only after the display font has loaded (no flash of unstyled text).
- **Side navigation** — slide-in menu with an expandable *Privacy Policies* submenu.
- **Click-to-copy email** — falls back to a regular `mailto:` link when the Clipboard API is unavailable.
- **Accessibility** — keyboard-friendly nav with visible focus styles and correct ARIA attributes; `prefers-reduced-motion` stops the continuous background motion; content is visible without JavaScript.
- **Performance** — fonts loaded via `preconnect` + `<link>` (non render-blocking), inline SVG favicon (no extra request), reduced particle/star counts on small screens, single-write DOM construction for stars.
- **Security** — Content-Security-Policy meta tag (only Google Fonts allowed as an external origin), strict referrer policy, no third-party scripts.

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
2. Add a link to the *Privacy Policies* submenu in `index.html`.

## Contact

bearvil.co@gmail.com
