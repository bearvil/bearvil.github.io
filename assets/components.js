/* =========================================================================
   Bearvil shared components — vanilla Web Components, no build step.
   Works on GitHub Pages (or any static host) as-is.

   Usage on any page (link the component styles too):
     <link rel="stylesheet" href="/assets/css/components.css" />
     <script src="/assets/components.js" defer></script>

     <site-nav></site-nav>                      → menu toggle + side nav + overlay
     <calm-sea glints="22"></calm-sea>           → light Caribbean background:
                                                   sand→sea gradient, sun, shimmer, waves

   Extra behaviors (opt-in via data attributes):
     <a data-copy-email href="mailto:...">      → click copies address, shows .copied-toast
     <main id="content" data-font-reveal>       → fades in after display font loads

   Visual styles for these components live in /assets/css/components.css.
   ========================================================================= */
'use strict';

const isSmallScreen = window.matchMedia('(max-width: 600px)').matches;

/* ------------------------------------------------------------------ *
 *  <site-nav> — menu toggle + side navigation + overlay
 *  Edit the links in ONE place here; every page picks them up.
 * ------------------------------------------------------------------ */
const NAV_LINKS = [
  { href: '/',        label: 'Home' },
  { href: '/work',    label: 'Work' },
  { href: '/about',   label: 'About' },
  { href: '/contact', label: 'Contact' },
];

const PRIVACY_LINKS = [
  { href: '/privacy-policies/touchy-fingies-pp', label: 'Touchy Fingies' },
  { href: '/privacy-policies/frend-ai-pp',       label: 'Frend AI' },
];

class SiteNav extends HTMLElement {
  connectedCallback() {
    if (this.dataset.rendered) return;
    this.dataset.rendered = 'true';

    const path = location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
    const links = NAV_LINKS.map(l => {
      const lPath = l.href.replace(/\/$/, '') || '/';
      const current = lPath === path ? ' aria-current="page"' : '';
      return `<li><a href="${l.href}"${current}>${l.label}</a></li>`;
    }).join('');

    const privacy = PRIVACY_LINKS.map(l =>
      `<li><a href="${l.href}" target="_blank" rel="noopener">${l.label}</a></li>`
    ).join('');

    this.innerHTML = `
      <button class="nav-toggle" id="nav-toggle" aria-label="Menu" aria-expanded="false" aria-controls="side-nav">
        <span></span><span></span><span></span>
      </button>
      <nav class="side-nav" id="side-nav" aria-label="Main navigation">
        <ul>
          ${links}
          <li class="has-sub">
            <button class="sub-toggle" id="privacy-toggle" aria-expanded="false" aria-controls="privacy-sub">
              Privacy Policies
              <svg class="chev" width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 3.5 L5 6.5 L8 3.5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <ul class="sub-menu" id="privacy-sub">${privacy}</ul>
          </li>
        </ul>
      </nav>
      <div class="nav-overlay" id="nav-overlay" aria-hidden="true"></div>
    `;

    const navToggle = this.querySelector('#nav-toggle');
    const navOverlay = this.querySelector('#nav-overlay');

    const closeNav = (returnFocus) => {
      if (!document.body.classList.contains('nav-open')) return;
      document.body.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
      const sub = this.querySelector('.has-sub.open');
      if (sub) {
        sub.classList.remove('open');
        sub.querySelector('.sub-toggle').setAttribute('aria-expanded', 'false');
      }
      if (returnFocus) navToggle.focus();
    };

    navToggle.addEventListener('click', () => {
      const open = document.body.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) {
        const first = this.querySelector('.side-nav a');
        if (first) first.focus();
      }
    });
    navOverlay.addEventListener('click', () => closeNav(false));

    const privacyToggle = this.querySelector('#privacy-toggle');
    privacyToggle.addEventListener('click', () => {
      const open = privacyToggle.parentElement.classList.toggle('open');
      privacyToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    this.querySelectorAll('.side-nav a').forEach(a => a.addEventListener('click', () => closeNav(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(true); });
  }
}
customElements.define('site-nav', SiteNav);

/* ------------------------------------------------------------------ *
 *  <calm-sea> — light "Caribbean" animated background.
 *  Layers: sand→sea gradient (CSS), soft sun, water shimmer, wave bands,
 *  and a few sun glints on the water.
 *  Attributes:
 *    glints="22"  desktop glint count (mobile gets ~55%); default 18
 *  Continuous motion respects prefers-reduced-motion (handled in CSS).
 * ------------------------------------------------------------------ */
class CalmSea extends HTMLElement {
  connectedCallback() {
    if (this.dataset.rendered) return;
    this.dataset.rendered = 'true';
    this.setAttribute('aria-hidden', 'true');

    const sea = document.createElement('div');
    sea.className = 'sea';

    // Soft sun + water shimmer
    const sun = document.createElement('div');
    sun.className = 'sea__sun';
    const shimmer = document.createElement('div');
    shimmer.className = 'sea__shimmer';
    sea.appendChild(sun);
    sea.appendChild(shimmer);

    // Wave bands near the waterline
    [
      { top: 56, h: 220, spd: '20s', dl: '0s' },
      { top: 68, h: 180, spd: '15s', dl: '-4s' },
      { top: 80, h: 160, spd: '24s', dl: '-9s' },
    ].forEach(w => {
      const el = document.createElement('div');
      el.className = 'sea__wave';
      el.style.cssText = `top:${w.top}%;height:${w.h}px;--spd:${w.spd};--dl:${w.dl};`;
      sea.appendChild(el);
    });

    // Sun glints — sparkles on the upper water
    const glints = document.createElement('div');
    glints.className = 'sea__glints';
    const desktopCount = parseInt(this.getAttribute('glints'), 10) || 18;
    const count = isSmallScreen ? Math.round(desktopCount * 0.55) : desktopCount;
    let html = '';
    for (let i = 0; i < count; i++) {
      const sz = (Math.random() * 2.2 + 0.8).toFixed(2);
      html += `<div class="glint" style="width:${sz}px;height:${sz}px;left:${(Math.random()*100).toFixed(2)}%;top:${(Math.random()*45+45).toFixed(2)}%;--d:${(Math.random()*3+2).toFixed(1)}s;--dl:-${(Math.random()*5).toFixed(1)}s;--o:${(Math.random()*0.5+0.4).toFixed(2)};"></div>`;
    }
    glints.innerHTML = html; // single DOM write
    sea.appendChild(glints);

    this.appendChild(sea);
  }
}
customElements.define('calm-sea', CalmSea);

/* ------------------------------------------------------------------ *
 *  Email copy-to-clipboard — any <a data-copy-email href="mailto:...">
 *  Shows the nearest .copied-toast for 1.8s. Falls back to mailto.
 * ------------------------------------------------------------------ */
function initEmailCopy() {
  document.querySelectorAll('a[data-copy-email]').forEach(link => {
    const address = (link.getAttribute('href') || '').replace(/^mailto:/, '');
    if (!address) return;
    link.addEventListener('click', e => {
      if (!navigator.clipboard || !window.isSecureContext) return; // let mailto work
      e.preventDefault();
      navigator.clipboard.writeText(address).then(() => {
        const toast = link.querySelector('.copied-toast') ||
                      (link.parentElement && link.parentElement.querySelector('.copied-toast'));
        if (toast) {
          toast.classList.add('show');
          setTimeout(() => toast.classList.remove('show'), 1800);
        }
      }).catch(() => {
        window.location.href = 'mailto:' + address;
      });
    });
  });
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
    document.fonts.load('800 1em "Nunito"').then(() => {
      requestAnimationFrame(() => requestAnimationFrame(reveal));
    }).catch(() => setTimeout(reveal, 800));
  } else {
    setTimeout(reveal, 400); // no Font Loading API — reveal shortly
  }
  setTimeout(reveal, 2000); // hard fallback
}

function init() {
  initEmailCopy();
  initFontReveal();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
