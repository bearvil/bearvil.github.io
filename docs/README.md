# Bearvil — Documentation

Detailed documentation for the Bearvil site. The top-level [README](../README.md)
is the overview and quick start; everything here goes deeper into **how the site
is built** and **how to extend it**.

## Contents

| Doc | What it covers |
|---|---|
| [Architecture](architecture.md) | How the site is structured: static, GitHub Pages, no build step, file layout, the CSS layering model, routing. |
| [Design system](design-system.md) | The token-driven theme: palette, type scale, accessibility rationale, and how to retheme from one config file. Live reference: [`/styleguide.html`](../styleguide.html). |
| [Shared components](components.md) | Reference for the Web Components in `assets/components.js` (`<top-nav>`, `<main-background>`, `<home-background>`) and the opt-in behaviors. |
| [Styling](styling.md) | Where styles live, the CSS cascade order, the shared utility & primitive classes, and the no-build (plain CSS) rule. |

### Guides (how to do X)

- [Adding a page](guides/adding-a-page.md)
- [Adding a privacy policy](guides/adding-a-privacy-policy.md)

## Conventions

Project rules — language, GitHub Pages compatibility, file size, the
`privacy-policies/` exception, and the documentation rule that keeps these docs
current — live in [CLAUDE.md](../CLAUDE.md).

> Keep this index updated: when you add a new doc, add a row above and link it.
