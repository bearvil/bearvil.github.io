# Guide: Adding a page

How to add a new **main site page** (one that shares the theme, nav, background
and footer). For policy pages, see [adding a privacy policy](adding-a-privacy-policy.md)
instead. The example below adds a hypothetical `press.html`.

## Steps

1. **Create the HTML file** at the repo root, e.g. `press.html`. Copy the whole
   `<head>` of an existing section-based page (`about.html` is a good base) so you
   inherit the CSP, the `color-scheme` / `theme-color` metas, the favicon, the
   theme and language scripts, the fonts, and the component includes. Update:
   - `<title>` (pattern: `Press — Bearvil`) and `<meta name="description">`
   - `<link rel="canonical">` and the `og:` / `twitter:` tags (`og:url`,
     `og:title`, `og:description`; keep `og:image` pointing at
     `https://bearvil.github.io/assets/og-image.png`)
   - For an internal page, add `<meta name="robots" content="noindex" />` and
     drop the social tags (like `404.html` and `styleguide.html`).

2. **Keep the theme and language scripts first.** `theme.js` and then
   `i18n/boot.js` must stay in `<head>`, loaded **synchronously** and **before the
   stylesheets**, or the page will flash the wrong theme or English text on load:

   ```html
   <meta name="color-scheme" content="light dark" />
   <meta name="theme-color" content="#fbf9f4" />
   <link rel="icon" type="image/png" href="/assets/favicon.png" />

   <!-- Theme + language: set <html data-theme> / <html lang> before first paint (sync, first) -->
   <script src="/assets/theme.js"></script>
   <script src="/assets/i18n/boot.js"></script>
   ```

3. **Link the stylesheets** in cascade order. `patterns.css` is needed for any
   composed block (`.section-head`, `.feature-row`, `.card-grid`, `.cta-band`, …);
   a page stylesheet is optional and always last:

   ```html
   <link rel="stylesheet" href="/assets/css/tokens.css" />
   <link rel="stylesheet" href="/assets/css/base.css" />
   <link rel="stylesheet" href="/assets/css/components.css" />
   <link rel="stylesheet" href="/assets/css/ui.css" />
   <link rel="stylesheet" href="/assets/css/patterns.css" />
   <link rel="stylesheet" href="/assets/css/press.css" />   <!-- only if needed -->

   <script src="/assets/components.js" defer></script>
   <script src="/assets/i18n/i18n.js" defer></script>      <!-- after components.js -->
   ```

   `i18n.js` must come after `components.js`: it defines the `<lang-switch>`
   element that `<top-nav>` renders.

4. **Add the shared chrome** at the top of `<body>`:

   ```html
   <top-nav></top-nav>
   <main-background></main-background>
   ```

   (Only Home uses `<home-background>`.)

5. **Pick a layout and write the content.**
   - Section-based page (like Work and About):

     ```html
     <main class="page-sections" id="content" data-font-reveal>
       <header class="section-head section-head--center">
         <p class="section-head__eyebrow" data-i18n="press.eyebrow">Press</p>
         <h1 class="section-head__title" data-i18n="press.title">News about <em>Bearvil</em></h1>
         <p class="section-head__sub" data-i18n="press.sub">…</p>
       </header>
       <section class="stack"> … </section>
     </main>
     ```

     Add the no-JS fallback in `<head>`, since `data-font-reveal` starts the
     content hidden:

     ```html
     <noscript><style>.page-sections { opacity: 1; }</style></noscript>
     ```

   - Single centered hero (like Contact and 404): `<main class="content"> … </main>`,
     with a `fadeInUp` animation in the page stylesheet.

   Build from the shared primitives and patterns first (`.btn`, `.card`,
   `.badge`, `.card-grid`, `.feature-row`, `.split-section`, `.cta-band`, …) —
   see [styling.md](../styling.md). Only create `assets/css/press.css` for a
   genuine one-off style.

6. **Make the text translatable.** Write the English text in the HTML and give
   each visible string a `data-i18n` key (namespace it by page, e.g. `press.*`;
   reuse `common.*` keys for shared buttons). Translate the head too:
   `<title data-i18n="press.metaTitle">` and
   `<meta name="description" … data-i18n-attr="content:press.metaDesc">`. Then add
   every new key to **all six** dictionaries in `assets/i18n/` (`hr`, `de`, `es`,
   `it`, `zh`, `ja`), keeping the HTML tags identical. Untranslated keys fall back
   to English. Details: [i18n.md](../i18n.md#adding-a-translatable-string).

7. **Use tokens only.** No raw hex or `rgba()` values — every color comes from a
   semantic token in `tokens.css`, so the page works in both light and dark
   themes. Use `--color-primary-strong` for primary-colored text and
   `--color-primary-fill` only for solid backgrounds under white text. If you need
   a new color, add a token with a dark value: [theming.md](../theming.md).

8. **Add the footer** just before `</body>`:

   ```html
   <site-footer></site-footer>
   ```

9. **Add it to the menu** (if it should appear there) by adding an entry to
   `NAV_LINKS` in [`assets/components.js`](../../assets/components.js), with a
   translation key:

   ```js
   const NAV_LINKS = [
     { href: '/',        label: 'Home',    key: 'nav.home' },
     { href: '/work',    label: 'Apps',    key: 'nav.work' },
     { href: '/about',   label: 'About',   key: 'nav.about' },
     { href: '/contact', label: 'Contact', key: 'nav.contact' },
     { href: '/press',   label: 'Press',   key: 'nav.press' },
   ];
   ```

   Add `nav.press` to all six dictionaries. The nav, the mobile menu and the
   footer all pick the new link up automatically.

10. **Preview locally** with the dev server, which mimics GitHub Pages routing
    (extensionless URLs and the custom 404):

    ```sh
    python3 serve.py   # http://localhost:8000/press
    ```

    Check the page in **both themes** (nav toggle), in at least one other
    language plus Chinese or Japanese (language menu), at phone width, and with
    JavaScript disabled.

11. **Update the docs.** Add the new page to the file layout in
    [architecture.md](../architecture.md), to the *Structure* and *Pages* tables in
    the [README](../../README.md).
