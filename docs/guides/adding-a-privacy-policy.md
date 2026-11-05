# Guide: Adding a privacy policy

Privacy-policy pages are **the exception** to the site's conventions. Each is a
**standalone, self-contained file** with its own app branding, structure, and styles.
They do **not** use the shared components or shared CSS — they are loaded directly
when selected from the menu.

## Steps

1. **Create the file** at `privacy-policies/<app-name>-pp.html`. It owns everything
   it needs: its own `<head>`, its own styles (inline or its own stylesheet under
   `privacy-policies/`), and its own markup. Do **not** add `<top-nav>`,
   `<main-background>`, or link the site's `assets/css/*` files.

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

3. **Link it from the pages that list policies by hand.** These links are plain
   HTML, not generated from `PRIVACY_LINKS`, so add the new app to each:
   - `contact.html` — the `.contact-links` row under the email;
   - `about.html` — the "Where can I find your privacy policies?" FAQ answer
     (`data-i18n="about.a6"`). Its links live inside the translated HTML, so also
     update `about.a6` in all six dictionaries in `assets/i18n/` (see
     [i18n.md](../i18n.md));
   - `work.html` and the Home app tiles in `index.html` — only if the app gets a
     showcase/tile there (with its icon in `assets/apps/`).

4. **Test locally** with `python3 serve.py`, then open
   `http://localhost:8000/privacy-policies/<app-name>-pp` (the dev server resolves
   extensionless URLs like GitHub Pages does).

## Why standalone?

Each policy mirrors the branding of the app it belongs to, so it intentionally has
its own look and structure independent of the main site. Keep these files
self-contained — don't wire them into the shared component or CSS system.
