# Design: `<top-nav>` — top-bar navigation component

**Date:** 2026-06-30
**Status:** Approved (design); pending spec review
**Source of inspiration:** `template-examples/templatemo_622_clearwave` top bar nav

## Goal

Replace the existing slide-in side navigation (`<site-nav>`) with a **fixed top-bar
navigation** modeled on the Clearwave template's header, themed entirely with Bearvil's
design tokens. Delivered as a reusable vanilla Web Component (`<top-nav>`) so every page
picks up the same nav and link list from one place.

## Scope

- New component `<top-nav>` replaces `<site-nav>` on all four pages that use it:
  `index.html`, `contact.html`, `styleguide.html`, `404.html`.
- The old side-nav implementation (JS class + CSS) is removed, not kept in parallel.
- Privacy-policy pages under `privacy-policies/` are untouched (standalone exception).

Out of scope: CTA buttons (template's "Sign in" / "Start Free Trial" are dropped), any
new pages, footer changes, restyling page content beyond the top offset needed to clear
the fixed bar.

## Component: `<top-nav>`

Vanilla Web Component, defined in `assets/components.js`, registered as `top-nav`.
Renders into light DOM (same approach as the current `SiteNav`) so it consumes the
shared token-based CSS in `assets/css/components.css`.

### Link data (single source of truth)

Reuses the existing module-level arrays in `components.js`:

- `NAV_LINKS` → `Home`, `Work`, `About`, `Contact`
- `PRIVACY_LINKS` → the privacy-policy submenu entries

No new data structures. Editing these arrays updates the nav on every page.

### Markup structure (rendered)

```
<header class="topnav" role="banner">
  <div class="topnav-inner">
    <a class="topnav-logo" href="/">
      <img src="/assets/Bearvil-logo-transparent.png" alt="" aria-hidden="true" />
      <span>Bearvil</span>
    </a>

    <!-- desktop links -->
    <ul class="topnav-links" role="list">
      <li><a href="/" aria-current="page">Home</a></li>
      ... NAV_LINKS ...
      <li class="topnav-has-sub">
        <button class="topnav-sub-toggle" aria-expanded="false" aria-controls="topnav-privacy">
          Privacy Policies <svg class="chev">…</svg>
        </button>
        <ul class="topnav-sub" id="topnav-privacy">… PRIVACY_LINKS (target=_blank) …</ul>
      </li>
    </ul>

    <!-- mobile trigger -->
    <button class="topnav-burger" aria-label="Menu" aria-expanded="false" aria-controls="topnav-mobile">
      <span></span><span></span><span></span>
    </button>
  </div>

  <!-- fullscreen mobile menu -->
  <nav class="topnav-mobile" id="topnav-mobile" aria-label="Mobile navigation">
    … NAV_LINKS …
    … PRIVACY_LINKS (target=_blank) …
  </nav>
</header>
```

The logo follows the existing brand pattern on `index.html`: the transparent logo PNG
plus a "Bearvil" wordmark. The `<img>` is decorative (`alt=""`) because the adjacent
wordmark carries the accessible name.

### Behaviors

1. **Scroll state.** On `window` scroll past ~40px, toggle `.scrolled` on the header:
   blurred translucent background (sand tint via tokens), reduced vertical padding, and a
   1px bottom border. Listener is passive.
2. **Privacy dropdown (desktop).** Opens on hover and on focus-within; also toggleable by
   click/Enter/Space on the toggle button (keyboard + touch). `aria-expanded` tracks
   state; chevron rotates. Closes on Escape and on outside click.
3. **Mobile menu.** Below the breakpoint (~720px) the desktop links + dropdown hide and
   the hamburger shows. Clicking it toggles the fullscreen overlay menu and animates the
   bars into an X (`.open`). Escape closes it; clicking any link closes it; `aria-expanded`
   tracks state.
4. **Active page.** Same logic as today: normalize `location.pathname` and mark the
   matching link with `aria-current="page"`.
5. **Reduced motion.** All transitions are gated by `prefers-reduced-motion` (handled in
   CSS), matching existing components.
6. **No-JS.** Links render server-side-equivalent only via the component; since the site
   already relies on the component for nav (current `<site-nav>` behaves the same), this
   is no regression. Content remains reachable.

### Styling

A new section in `assets/css/components.css`, replacing the `<site-nav>` block
(`.nav-toggle`, `.side-nav`, `.sub-toggle`, `.sub-menu`, `.nav-overlay`). Visual treatment
is ported from the template (fixed bar, blur-on-scroll, pill-shaped link hover, animated
hamburger, fullscreen mobile menu) but every value comes from Bearvil tokens:

- Background / surface: `--color-bg`, `--color-surface`
- Text: `--color-text`, `--color-text-muted`
- Accent (hover pill, active link): `--color-primary` and its ghost/border aliases
- Borders: `--color-border`
- Spacing, radius, z-index, easing: existing token scales (e.g. `--space-*`, `--z-nav`,
  `--ease-out-expo`)

No template variables (`--accent`, `--text-1`, `--silk`, …) are introduced.

### Layout impact

The bar is `position: fixed`. Each consuming page needs enough top offset so content
isn't hidden behind it. Audit per page:

- `index.html` (`body.is-fixed`) — verify hero/first section clears the bar.
- `contact.html`, `styleguide.html`, `404.html` — add top padding on `.content` if needed.

Add a small shared rule (e.g. a `--topnav-h` offset) rather than per-page magic numbers
where practical.

## Files changed

| File | Change |
|---|---|
| `assets/components.js` | Replace `SiteNav` class with `TopNav`; register `<top-nav>`; keep `NAV_LINKS`/`PRIVACY_LINKS` |
| `assets/css/components.css` | Replace side-nav styles with `.topnav*` styles (token-based) |
| `index.html` | `<site-nav>` → `<top-nav>`; ensure top offset |
| `contact.html` | `<site-nav>` → `<top-nav>`; ensure top offset |
| `styleguide.html` | `<site-nav>` → `<top-nav>`; ensure top offset |
| `404.html` | `<site-nav>` → `<top-nav>`; ensure top offset |
| `docs/components.md` | Document `<top-nav>` (replace `<site-nav>` section) |
| `README.md` | Update component/structure references |
| `CLAUDE.md` | Update `<site-nav>` mentions to `<top-nav>` |

## Testing / verification

- Local preview (`python3 -m http.server 8000`) on each of the 4 pages:
  - Bar is fixed, content not hidden behind it.
  - Scroll past 40px → blur + shrink applied.
  - Desktop: links hover as pills; active page marked; privacy dropdown opens on
    hover/click/keyboard and closes on Escape/outside click.
  - Mobile width: hamburger shows, opens fullscreen menu, X animation, Escape/link closes.
  - Keyboard-only pass: tab order, visible focus, dropdown operable.
  - `prefers-reduced-motion` on → no large transitions.
- CSP unchanged (no inline scripts; component stays in external JS).

## Non-goals / constraints reaffirmed

- Stay zero-build, GitHub Pages compatible.
- Author remains Bearvil only; all written content in English.
- Keep files within the ~300–400 line guideline; split if `components.js` grows too large.
