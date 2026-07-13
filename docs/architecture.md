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
index.html            # Landing page
contact.html          # Contact page
404.html              # Custom not-found page (served for any missing path)
styleguide.html       # Living style guide / component playground (internal)
assets/
  components.js       # Shared Web Components + behaviors (JS only)
  css/
    tokens.css        # Design tokens — the single source of truth
    base.css          # Reset, base typography, shared layout & text utilities
    components.css     # Styles for the shared Web Components
    ui.css             # UI primitives (buttons, cards, forms, badges, toast)
    index.css          # Landing-page styles
    contact.css        # Contact-page styles
    404.css            # 404-page styles
    styleguide.css     # Style-guide layout
  *.png               # Logo assets
privacy-policies/     # Standalone policy pages (see the exception below)
docs/                 # This documentation
```

## Two kinds of page

1. **Main site pages** (`index.html`, `contact.html`, `404.html`, future pages).
   They share navigation, animated background, base styles, and behaviors through
   `assets/components.js` and the stylesheets under `assets/css/`. These are the
   pages the conventions in [CLAUDE.md](../CLAUDE.md) apply to.

2. **Privacy-policy pages** (`privacy-policies/*.html`). **The exception.** Each is
   a fully standalone file with its own app branding, structure, and styles. It does
   not use the shared components or shared CSS — it is just loaded directly when
   selected from the menu. See [adding a privacy policy](guides/adding-a-privacy-policy.md).

## How a main page is composed

```
<head>
  …meta, CSP, fonts…
  tokens.css → base.css → components.css → ui.css → <page>.css   (cascade order matters)
  components.js (deferred)
</head>
<body>                           ← flex column, min-height 100dvh (sticky footer)
  <top-nav></top-nav>                    ← injected fixed top bar (logo, links, dropdown)
  <main-background></main-background>    ← injected animated background (Home uses <home-background>)
  <main class="content">…</main> ← page content (flex: 1, fills the middle)
  <site-footer></site-footer>    ← injected slim footer, sits at the bottom
</body>
```

The `body` is a sticky-footer flex column: `.content` grows to fill the space
between the fixed nav and the footer, so short pages show the footer at the
bottom with no gap and tall pages scroll. See [styling.md](styling.md#page-layout--sticky-footer).

`components.js` defines the custom elements; when the browser parses
`<top-nav>` / `<main-background>` / `<home-background>` / `<site-footer>` it
builds their DOM. Visual styles for those elements live in
`assets/css/components.css` (not injected by JS). Design
tokens come first in the cascade from `tokens.css`. See [design-system.md](design-system.md),
[components.md](components.md) and [styling.md](styling.md) for detail.

## Routing (GitHub Pages)

- **Extensionless URLs** resolve to the matching `.html`
  (`/privacy-policies/touchy-fingies-pp` → `…-pp.html`).
- The root **`404.html`** is served automatically for any missing path.
- Use **root-relative paths** (`/assets/...`) so links resolve from any depth.

These are GitHub Pages behaviors and won't reproduce on a plain local file server.

## Security

Each main page ships a strict **Content-Security-Policy** meta tag:
`script-src 'self'` (no third-party or inline scripts), Google Fonts as the only
external origin, strict referrer policy. Keep scripts in external files and don't
weaken the CSP without a concrete reason. `'unsafe-inline'` remains in `style-src`
only to allow the `<noscript>` fallback and the inline `style` attributes on
`.mist` background layers.
