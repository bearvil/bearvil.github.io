# Guide: Adding a privacy policy

Privacy-policy pages are **the exception** to the site's conventions. Each is a
**standalone, self-contained file** with its own app branding, structure, and styles.
They do **not** use the shared components or shared CSS — they are loaded directly
when selected from the menu.

## Steps

1. **Create the file** at `privacy-policies/<app-name>-pp.html`. It owns everything
   it needs: its own `<head>`, its own styles (inline or its own stylesheet under
   `privacy-policies/`), and its own markup. Do **not** add `<site-nav>`,
   `<calm-sea>`, or link the site's `assets/css/*` files.

2. **Register it in the menu** by adding an entry to `PRIVACY_LINKS` in
   [`assets/components.js`](../../assets/components.js):

   ```js
   const PRIVACY_LINKS = [
     { href: '/privacy-policies/touchy-fingies-pp', label: 'Touchy Fingies' },
     { href: '/privacy-policies/<app-name>-pp',     label: '<App Name>' },
   ];
   ```

   The Privacy Policies submenu updates on every page automatically. These links
   open in a new tab.

3. **Test locally** by opening the file directly, e.g.
   `http://localhost:8000/privacy-policies/<app-name>-pp.html`. The extensionless
   URL works once deployed to GitHub Pages.

## Why standalone?

Each policy mirrors the branding of the app it belongs to, so it intentionally has
its own look and structure independent of the main site. Keep these files
self-contained — don't wire them into the shared component or CSS system.
