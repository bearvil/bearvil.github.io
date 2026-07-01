# Guide: Adding a page

How to add a new **main site page** (one that shares the nav and background).
For policy pages, see [adding a privacy policy](adding-a-privacy-policy.md) instead.

## Steps

1. **Create the HTML file** at the repo root, e.g. `work.html`. Copy the `<head>`
   of an existing page (`contact.html` is a good base) so you inherit the CSP,
   fonts, favicon, and the component includes. Update:
   - `<title>`, `<meta name="description">`
   - `<link rel="canonical">` and the `og:` / `twitter:` tags

2. **Create the page stylesheet** at `assets/css/work.css` and link it last in the
   cascade, after the tokens, base, components, and UI primitives:

   ```html
   <link rel="stylesheet" href="/assets/css/tokens.css" />
   <link rel="stylesheet" href="/assets/css/base.css" />
   <link rel="stylesheet" href="/assets/css/components.css" />
   <link rel="stylesheet" href="/assets/css/ui.css" />
   <link rel="stylesheet" href="/assets/css/work.css" />
   ```

3. **Add the shared chrome** at the top of `<body>`:

   ```html
   <top-nav></top-nav>
   <calm-sea></calm-sea>
   ```

4. **Write the content** inside `<main class="content"> … </main>`, and put its
   styles in `assets/css/work.css`. Reuse the design tokens and the shared classes
   (`.gradient-text`, `.btn`, `.card`, `.field`, `.badge`, …) — see
   [styling.md](../styling.md) and [design-system.md](../design-system.md) — instead
   of duplicating rules or hardcoding colors.

5. **Add it to the menu** (if it should appear there) by adding an entry to
   `NAV_LINKS` in [`assets/components.js`](../../assets/components.js):

   ```js
   const NAV_LINKS = [
     …
     { href: '/work', label: 'Work' },
   ];
   ```

   Every page picks the new link up automatically.

6. **Test locally:**

   ```sh
   python3 -m http.server 8000   # http://localhost:8000/work.html
   ```

   Note: the extensionless URL (`/work`) and the custom 404 only work once deployed
   to GitHub Pages.

7. **Update the docs.** Add the new page to the file layout in
   [architecture.md](../architecture.md) and to the Pages table in the
   [README](../../README.md) — see the documentation rule in
   [CLAUDE.md](../../CLAUDE.md).
