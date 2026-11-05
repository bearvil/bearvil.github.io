/* =========================================================================
   Bearvil shared components — vanilla Web Components, no build step.
   Works on GitHub Pages (or any static host) as-is.

   Usage on any page (link the component styles too):
     <link rel="stylesheet" href="/assets/css/components.css" />
     <script src="/assets/components.js" defer></script>

     <top-nav></top-nav>                        → fixed top bar: logo, links,
                                                   privacy dropdown, language menu
                                                   (<lang-switch>, i18n.js), theme
                                                   toggle, mobile menu
     <main-background></main-background>        → flat, subtle background color
                                                   (used on every page but Home)
     <home-background></home-background>        → animated wave sky behind the
                                                   Home hero (Home page only)

   Extra behaviors (opt-in via data attributes):
     <a data-copy-email href="mailto:...">      → click copies address; feedback via a
                                                   nearby .copied-toast or [data-copy-hint]
     <main id="content" data-font-reveal>       → fades in after display font loads

   Visual styles for these components live in /assets/css/components.css.
   ========================================================================= */
'use strict';

/* ------------------------------------------------------------------ *
 *  <top-nav> — fixed top bar: logo, inline links, privacy dropdown,
 *  and a hamburger that opens a fullscreen menu on small screens.
 *  Edit the links in ONE place here; every page picks them up.
 * ------------------------------------------------------------------ */
const NAV_LINKS = [
  { href: '/',        label: 'Home',    key: 'nav.home' },
  { href: '/work',    label: 'Apps',    key: 'nav.work' },
  { href: '/about',   label: 'About',   key: 'nav.about' },
  { href: '/contact', label: 'Contact', key: 'nav.contact' },
];

const PRIVACY_LINKS = [
  { href: '/privacy-policies/touchy-fingies-pp', label: 'Touchy Fingies' },
  { href: '/privacy-policies/frend-ai-pp',       label: 'Frend AI' },
  { href: '/privacy-policies/dicty-pp',          label: 'Dicty' },
];

/* Theme toggle icons — the moon shows in light theme (switch to dark) and the
   sun in dark theme; visibility is handled in components.css. */
const THEME_ICONS =
  '<svg class="theme-toggle__icon theme-toggle__moon" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>' +
  '<svg class="theme-toggle__icon theme-toggle__sun" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';

const CHEVRON = '<svg class="chev" width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 3.5 L5 6.5 L8 3.5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/* Returns a predicate that marks the link matching the current path with
   aria-current="page". Shared by <top-nav> and <site-footer>. */
function currentPathMatcher() {
  const path = location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
  return href => ((href.replace(/\/$/, '') || '/') === path ? ' aria-current="page"' : '');
}

class TopNav extends HTMLElement {
  connectedCallback() {
    if (this.dataset.rendered) return;
    this.dataset.rendered = 'true';

    const current = currentPathMatcher();

    const navItems = NAV_LINKS.map(l =>
      `<li><a href="${l.href}"${current(l.href)} data-i18n="${l.key}">${l.label}</a></li>`
    ).join('');

    const privacyItems = PRIVACY_LINKS.map(l =>
      `<li><a href="${l.href}" target="_blank" rel="noopener">${l.label}</a></li>`
    ).join('');

    const mobileItems =
      NAV_LINKS.map(l => `<a href="${l.href}"${current(l.href)} data-i18n="${l.key}">${l.label}</a>`).join('') +
      `<span class="topnav-mobile-label" data-i18n="nav.privacy">Privacy Policies</span>` +
      PRIVACY_LINKS.map(l => `<a href="${l.href}" target="_blank" rel="noopener">${l.label}</a>`).join('');

    this.innerHTML = `
      <header class="topnav" role="banner">
        <div class="topnav-inner">
          <a class="topnav-logo" href="/">
            <img src="/assets/Bearvil-logo-transparent.png" alt="" aria-hidden="true" />
            <span>Bearvil</span>
          </a>
          <ul class="topnav-links" role="list">
            ${navItems}
            <li class="topnav-has-sub">
              <button class="topnav-sub-toggle" id="topnav-privacy-toggle" aria-expanded="false" aria-controls="topnav-privacy">
                <span data-i18n="nav.privacy">Privacy Policies</span> ${CHEVRON}
              </button>
              <ul class="topnav-sub" id="topnav-privacy">${privacyItems}</ul>
            </li>
          </ul>
          <div class="topnav-actions">
            <lang-switch></lang-switch>
            <button class="theme-toggle" type="button">${THEME_ICONS}</button>
            <button class="topnav-burger" id="topnav-burger" aria-label="Menu" data-i18n-attr="aria-label:nav.menu" aria-expanded="false" aria-controls="topnav-mobile">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </header>
      <!-- Kept OUTSIDE the frosted .topnav header: an ancestor with
           backdrop-filter becomes the containing block for position:fixed
           descendants, which would clip this fullscreen menu to the bar. -->
      <nav class="topnav-mobile" id="topnav-mobile" aria-label="Mobile navigation" aria-hidden="true">
        ${mobileItems}
      </nav>
    `;

    const header   = this.querySelector('.topnav');
    const burger    = this.querySelector('#topnav-burger');
    const mobile    = this.querySelector('#topnav-mobile');
    const subWrap   = this.querySelector('.topnav-has-sub');
    const subToggle = this.querySelector('#topnav-privacy-toggle');
    const themeBtn  = this.querySelector('.theme-toggle');

    // Light/dark toggle — the initial theme was already set by theme.js.
    syncThemeToggle(themeBtn);
    themeBtn.addEventListener('click', () => {
      applyTheme(currentTheme() === 'dark' ? 'light' : 'dark', true);
    });

    // Translucent/condensed bar once the page is scrolled.
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // Privacy dropdown — click/keyboard toggle (hover/focus handled in CSS).
    const closeSub = () => {
      subWrap.classList.remove('open');
      subToggle.setAttribute('aria-expanded', 'false');
    };
    subToggle.addEventListener('click', () => {
      const open = subWrap.classList.toggle('open');
      subToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', e => { if (!subWrap.contains(e.target)) closeSub(); });

    // Fullscreen mobile menu.
    const closeMobile = returnFocus => {
      if (!burger.classList.contains('open')) return;
      burger.classList.remove('open');
      mobile.classList.remove('open');
      mobile.setAttribute('aria-hidden', 'true');
      burger.setAttribute('aria-expanded', 'false');
      if (returnFocus) burger.focus();
    };
    burger.addEventListener('click', () => {
      const open = burger.classList.toggle('open');
      mobile.classList.toggle('open', open);
      mobile.setAttribute('aria-hidden', open ? 'false' : 'true');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mobile.querySelectorAll('a').forEach(a => a.addEventListener('click', () => closeMobile(false)));

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') { closeSub(); closeMobile(true); }
    });
  }
}
customElements.define('top-nav', TopNav);

/* ------------------------------------------------------------------ *
 *  <site-footer> — slim footer bar: brand lockup, the same nav +
 *  privacy links as <top-nav>, an email link, and a dynamic copyright
 *  year. Reuses NAV_LINKS / PRIVACY_LINKS so links live in one place.
 * ------------------------------------------------------------------ */
const FOOTER_EMAIL = 'bearvil.info@gmail.com';

class SiteFooter extends HTMLElement {
  connectedCallback() {
    if (this.dataset.rendered) return;
    this.dataset.rendered = 'true';

    const current = currentPathMatcher();
    const year = new Date().getFullYear();

    const navItems = NAV_LINKS.map(l =>
      `<a href="${l.href}"${current(l.href)} data-i18n="${l.key}">${l.label}</a>`
    ).join('');

    const privacyItems = PRIVACY_LINKS.map(l =>
      `<a href="${l.href}" target="_blank" rel="noopener">${l.label}</a>`
    ).join('');

    this.innerHTML = `
      <footer class="site-footer" role="contentinfo">
        <div class="site-footer-inner">
          <a class="site-footer-brand" href="/">
            <img src="/assets/Bearvil-logo-transparent.png" alt="" aria-hidden="true" />
            <span>Bearvil</span>
          </a>
          <nav class="site-footer-links" aria-label="Footer">
            ${navItems}
            <span class="site-footer-sep" aria-hidden="true"></span>
            ${privacyItems}
            <span class="site-footer-sep" aria-hidden="true"></span>
            <a href="mailto:${FOOTER_EMAIL}">${FOOTER_EMAIL}</a>
          </nav>
        </div>
        <div class="site-footer-bottom">
          <small>&copy; ${year} Bearvil</small>
        </div>
      </footer>
    `;
  }
}
customElements.define('site-footer', SiteFooter);

/* ------------------------------------------------------------------ *
 *  Theme — light/dark. theme.js (loaded in <head>) sets the initial
 *  <html data-theme> before paint; these helpers switch it at runtime,
 *  remember an explicit choice, follow the system setting while there is
 *  no explicit choice, and keep <meta name="theme-color"> in sync.
 * ------------------------------------------------------------------ */
const THEME_KEY = 'bearvil-theme';

function currentTheme() {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

function storedTheme() {
  try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
}

function applyTheme(theme, persist) {
  const root = document.documentElement;
  // Suppress colour transitions for one frame so the whole page swaps at once.
  root.classList.add('theme-switching');
  root.setAttribute('data-theme', theme);
  if (persist) {
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* storage blocked */ }
  }
  syncThemeColor();
  document.querySelectorAll('.theme-toggle').forEach(syncThemeToggle);
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('theme-switching')));
}

function syncThemeToggle(btn) {
  const toDark = currentTheme() !== 'dark';
  const fallback = `Switch to ${toDark ? 'dark' : 'light'} theme`;
  // bearvilT comes from i18n.js (loaded after this file); English otherwise.
  const label = typeof bearvilT === 'function'
    ? bearvilT(toDark ? 'theme.toDark' : 'theme.toLight', fallback) : fallback;
  btn.setAttribute('aria-label', label);
  btn.setAttribute('title', label);
}

function syncThemeColor() {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) return;
  const bg = getComputedStyle(document.documentElement).getPropertyValue('--color-bg').trim();
  if (bg) meta.setAttribute('content', bg);
}

function initTheme() {
  syncThemeColor();
  if (!window.matchMedia) return;
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (storedTheme() !== 'light' && storedTheme() !== 'dark') applyTheme(e.matches ? 'dark' : 'light', false);
  });
}

/* ------------------------------------------------------------------ *
 *  <main-background> — a single flat, subtle color, used on every page
 *  except Home.
 * ------------------------------------------------------------------ */
class MainBackground extends HTMLElement {
  connectedCallback() {
    if (this.dataset.rendered) return;
    this.dataset.rendered = 'true';
    this.setAttribute('aria-hidden', 'true');

    const bg = document.createElement('div');
    bg.className = 'main-bg';
    this.appendChild(bg);
  }
}
customElements.define('main-background', MainBackground);

/* ------------------------------------------------------------------ *
 *  <home-background> — animated wave sky behind the Home hero. Three
 *  masked wave layers drift horizontally at different speeds/opacities
 *  over a theme-aware gradient — plain CSS animation, no canvas/WebGL.
 * ------------------------------------------------------------------ */
const HOME_BG_WAVE_LAYERS = [
  { cls: 'home-bg__wave--back',  spd: '26s' },
  { cls: 'home-bg__wave--mid',   spd: '18s' },
  { cls: 'home-bg__wave--front', spd: '12s' },
];

class HomeBackground extends HTMLElement {
  connectedCallback() {
    if (this.dataset.rendered) return;
    this.dataset.rendered = 'true';
    this.setAttribute('aria-hidden', 'true');

    const bg = document.createElement('div');
    bg.className = 'home-bg';

    HOME_BG_WAVE_LAYERS.forEach(w => {
      const el = document.createElement('div');
      el.className = `home-bg__wave ${w.cls}`;
      el.style.setProperty('--spd', w.spd);
      bg.appendChild(el);
    });

    this.appendChild(bg);
  }
}
customElements.define('home-background', HomeBackground);

/* ------------------------------------------------------------------ *
 *  Email copy-to-clipboard — any <a data-copy-email href="mailto:...">
 *  On success it gives feedback for 1.8s in one of two opt-in ways and
 *  then reverts; falls back to mailto when the Clipboard API is absent:
 *    • .copied-toast  — a pill near the link is shown (index page).
 *    • [data-copy-hint] — the nearest hint's text is swapped to its
 *      data-copied-label and gets .is-copied (contact page).
 * ------------------------------------------------------------------ */
const COPY_FEEDBACK_MS = 1800;

function initEmailCopy() {
  document.querySelectorAll('a[data-copy-email]').forEach(link => {
    const address = (link.getAttribute('href') || '').replace(/^mailto:/, '');
    if (!address) return;
    link.addEventListener('click', e => {
      if (!navigator.clipboard || !window.isSecureContext) return; // let mailto work
      e.preventDefault();
      navigator.clipboard.writeText(address).then(() => {
        showCopyFeedback(link);
      }).catch(() => {
        window.location.href = 'mailto:' + address;
      });
    });
  });
}

/* Reveal the feedback for COPY_FEEDBACK_MS, then revert. A timer stored on
   each element lets repeat clicks restart the countdown instead of stacking. */
function showCopyFeedback(link) {
  const near = sel => link.querySelector(sel) ||
                      (link.parentElement && link.parentElement.querySelector(sel));

  const toast = near('.copied-toast');
  if (toast) {
    toast.classList.add('show');
    clearTimeout(toast._copyTimer);
    toast._copyTimer = setTimeout(() => toast.classList.remove('show'), COPY_FEEDBACK_MS);
  }

  const hint = near('[data-copy-hint]');
  if (hint) {
    if (hint.dataset.idleLabel == null) hint.dataset.idleLabel = hint.textContent;
    hint.textContent = hint.dataset.copiedLabel || 'Copied to clipboard';
    hint.classList.add('is-copied');
    clearTimeout(hint._copyTimer);
    hint._copyTimer = setTimeout(() => {
      hint.textContent = hint.dataset.idleLabel;
      hint.classList.remove('is-copied');
    }, COPY_FEEDBACK_MS);
  }
}

/* ------------------------------------------------------------------ *
 *  Font-gated reveal — any element with data-font-reveal starts at
 *  opacity:0 (set in page CSS) and fades in once the display font is
 *  ready. Pair with <noscript> fallback that forces opacity:1.
 * ------------------------------------------------------------------ */
function initFontReveal() {
  const el = document.querySelector('[data-font-reveal]');
  if (!el) return;
  let revealed = false;
  const reveal = () => {
    if (revealed) return;
    revealed = true;
    el.style.animation = 'fadeInUp 2.8s cubic-bezier(0.16,1,0.3,1) forwards';
  };
  if (document.fonts && document.fonts.load) {
    document.fonts.load('800 1em "Inter"').then(() => {
      requestAnimationFrame(() => requestAnimationFrame(reveal));
    }).catch(() => setTimeout(reveal, 800));
  } else {
    setTimeout(reveal, 400); // no Font Loading API — reveal shortly
  }
  setTimeout(reveal, 2000); // hard fallback
}

function init() {
  initTheme();
  initEmailCopy();
  initFontReveal();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
