# Bearvil — Documentation

Detailed documentation for the Bearvil site. The top-level [README](../README.md)
is the overview and quick start; everything here goes deeper into **how the site
is built** and **how to extend it**.

## Contents

| Doc | What it covers |
|---|---|
| [Architecture](architecture.md) | How the site is structured: static, GitHub Pages, no build step, file layout, the CSS layering model, routing. |
| [Design system](design-system.md) | The token-driven design system: palette (light and dark values), type and other scales, accessibility rationale, and how to retheme from one config file. Live reference: [`/styleguide.html`](../styleguide.html). |
| [Theming](theming.md) | Light/dark theme: how `theme.js` picks the theme, the nav toggle and runtime helpers, how `tokens.css` is organised, and how to add a token and give it a dark value. |
| [Languages (i18n)](i18n.md) | The seven-language selector: how `boot.js` picks the language, how `i18n.js` applies `data-i18n` keys, the `<lang-switch>` menu, how to add a translatable string or a language, and SEO limits. |
| [Shared components](components.md) | Reference for the Web Components in `assets/components.js` (`<top-nav>` with the theme toggle, `<main-background>`, `<home-background>`, `<site-footer>`), the theme helpers, and the opt-in behaviors. |
| [Styling](styling.md) | Where styles live, the CSS cascade order, the page layouts, the shared utility, primitive and pattern classes, and the no-build (plain CSS) rule. |

### Guides (how to do X)

- [Adding a page](guides/adding-a-page.md)
- [Adding a privacy policy](guides/adding-a-privacy-policy.md)

## Conventions

> Keep this index updated: when you add a new doc, add a row above and link it.
