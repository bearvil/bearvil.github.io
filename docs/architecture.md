# Architecture

How the Bearvil site is put together.

## Overview

A **static website** — plain HTML, CSS, and JavaScript — hosted on **GitHub Pages**
at `https://bearvil.github.io`. There is **no build step**, no framework, and no
dependency beyond Google Fonts. Every file is served exactly as it sits in the repo.

This is a deliberate constraint: anything added must keep working as a plain static
site that GitHub Pages can serve as-is.

## File layout

```
index.html            # Home — wave hero, app tiles, principles, CTA band
work.html             # Our apps — Frend AI, Touchy Fingies and Dicty showcases
about.html            # About — studio story, values, FAQ
contact.html          # Contact — click-to-copy email, privacy links
404.html              # Custom not-found page (served for any missing path)
styleguide.html       # Living style guide / component playground (internal, noindex)
assets/
  theme.js            # Sets <html data-theme> before first paint (sync, in <head>)
  components.js       # Shared Web Components + behaviors + theme helpers
  i18n/
    boot.js           # Picks the language, sets <html lang> (sync, after theme.js)
    i18n.js           # Applies translations, <lang-switch> (defer, after components.js)
    hr.js de.js es.js it.js zh.js ja.js   # Dictionaries (English = the HTML itself)
  css/
    tokens.css        # Design tokens (light + dark) — the single source of truth
    base.css          # Reset, base typography, shared layout & text utilities
    components.css    # Styles for the shared Web Components
    ui.css            # UI primitives (buttons, cards, forms, badges, toast, …)
    patterns.css      # Composed section blocks (section-head, feature-row, app blocks, cta-band, …)
    index.css         # Home hero styles
    contact.css       # Contact-page styles
    404.css           # 404-page styles
    styleguide.css    # Style-guide layout
  apps/               # App icons (256×256 PNG): frend-ai.png, touchy-fingies.png, dicty.png
  og-image.png        # Social preview image (1200×630)
  favicon.png         # Favicon (256×256 PNG)
  Bearvil-logo*.png   # Logo assets
privacy-policies/     # Standalone policy pages (see the exception below)
docs/                 # This documentation
serve.py              # Dev-only local preview server (not deployed)
```

## Two kinds of page

1. **Main site pages** (`index.html`, `work.html`, `about.html`, `contact.html`,
   `404.html`, `styleguide.html`, future pages). They share the theme, language,
   navigation, background, base styles, and behaviors through `assets/theme.js`,
   `assets/i18n/`, `assets/components.js` and the stylesheets under `assets/css/`. These are the
   pages the site conventions apply to.

2. **Privacy-policy pages** (`privacy-policies/*.html`). **The exception.** Each is
   a fully standalone file with its own app branding, structure, and styles. It does
   not use the shared components or shared CSS — it is just loaded directly when
   selected from the menu. See [adding a privacy policy](guides/adding-a-privacy-policy.md).

## How a main page is composed

```
<head>
  …meta (CSP, color-scheme "light dark", theme-color), SEO/social tags…
  theme.js (sync — sets <html data-theme> before first paint)
  i18n/boot.js (sync — sets <html lang>, starts loading the dictionary)
  fonts
  tokens.css → base.css → components.css → ui.css → [patterns.css] → [<page>.css]
  components.js (deferred)
  i18n/i18n.js (deferred — translates [data-i18n], defines <lang-switch>)
</head>
<body>                                   ← flex column, min-height 100dvh (sticky footer)
  <top-nav></top-nav>                    ← fixed top bar (logo, links, dropdown, language menu, theme toggle)
  <main-background></main-background>    ← flat background (Home uses <home-background>)
  <main class="page-sections">…</main>   ← page content (or .content for a centered hero)
  <site-footer></site-footer>            ← slim footer, sits at the bottom
</body>
```

The `body` is a sticky-footer flex column: the `<main>` layer grows to fill the
space between the fixed nav and the footer, so short pages show the footer at the
bottom with no gap and tall pages scroll. See [styling.md](styling.md#page-layout--sticky-footer).

`components.js` defines the custom elements; when the browser parses
`<top-nav>` / `<main-background>` / `<home-background>` / `<site-footer>` it
builds their DOM. Visual styles for those elements live in
`assets/css/components.css` (not injected by JS). Design
tokens come first in the cascade from `tokens.css`. The light/dark theme is a
`data-theme` attribute on `<html>` that `tokens.css` reacts to — see
[theming.md](theming.md). The language is `<html lang>`, and translations are
applied client-side — see [i18n.md](i18n.md). See [design-system.md](design-system.md),
[components.md](components.md) and [styling.md](styling.md) for detail.

## Routing (GitHub Pages)

- **Extensionless URLs** resolve to the matching `.html`
  (`/privacy-policies/touchy-fingies-pp` → `…-pp.html`).
- The root **`404.html`** is served automatically for any missing path.
- Use **root-relative paths** (`/assets/...`) so links resolve from any depth.

These are GitHub Pages behaviors and won't reproduce on a plain local file server.

## SEO and social previews

- Public pages (Home, Work, About, Contact) carry `og:site_name`, `og:title`,
  `og:description`, `og:url` and `og:image` (`/assets/og-image.png`, 1200×630,
  with `og:image:width`/`height`), plus `twitter:card` =
  `summary_large_image` and `twitter:image`. Image URLs are absolute
  (`https://bearvil.github.io/…`), as social crawlers require.
- `404.html` and `styleguide.html` are `noindex` and have no Open Graph / Twitter tags.
- Every main page declares `<meta name="color-scheme" content="light dark">`;
  the static `theme-color` (`#fbf9f4`) is updated at runtime to the active
  theme's `--color-bg`.
- Translation is client-side, so **only the English version is indexed**; there
  are no per-language URLs or `hreflang` tags, and the `og:*` tags stay English.
  See [i18n.md](i18n.md#seo-and-limitations).

## Security

Each main page ships a strict **Content-Security-Policy** meta tag:
`script-src 'self'` (no third-party or inline scripts), Google Fonts as the only
external origin, strict referrer policy. Keep scripts in external files and don't
weaken the CSP without a concrete reason. `theme.js`, `components.js` and the
`assets/i18n/` scripts (including the dictionaries `boot.js` injects) are
same-origin files, so they need no CSP change. `'unsafe-inline'` remains in
`style-src` only to allow the `<noscript><style>` fallbacks and the inline
`style` attributes on styleguide demo elements. `img-src 'self' data:` also
covers the inline SVG data URIs used as wave masks in `components.css`.
