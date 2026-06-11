/* =========================================================================
   Bearvil shared components — vanilla Web Components, no build step.
   Works on GitHub Pages (or any static host) as-is.

   Usage on any page:
     <script src="/assets/components.js" defer></script>

     <site-nav></site-nav>                      → menu toggle + side nav + overlay
     <night-sky clouds particles stars="140">   → sky, stars, horizon
       <div class="mist" style="..."></div>     → optional page-specific mist layers
     </night-sky>

   Extra behaviors (opt-in via data attributes):
     <a data-copy-email href="mailto:...">      → click copies address, shows .copied-toast
     <main id="content" data-font-reveal>       → fades in after display font loads
   ========================================================================= */
'use strict';

/* ------------------------------------------------------------------ *
 *  Shared styles — injected once, single source of truth
 * ------------------------------------------------------------------ */
const SHARED_CSS = `
/* SKY */
.sky {
  position: fixed; inset: 0;
  background: radial-gradient(ellipse 120% 80% at 50% 110%,
    #1a3a6e 0%, #0d1f40 35%, #07090f 70%);
  animation: skyBreath 20s ease-in-out infinite alternate;
}
@keyframes skyBreath {
  0%   { filter: brightness(0.9); }
  100% { filter: brightness(1.1); }
}

/* STARS */
.stars { position: fixed; inset: 0; pointer-events: none; }
.star {
  position: absolute; border-radius: 50%; background: white;
  animation: twinkle var(--d) ease-in-out infinite alternate var(--dl);
}
@keyframes twinkle {
  0%   { opacity: 0.05; transform: scale(0.7); }
  100% { opacity: var(--o); transform: scale(1.1); }
}

/* CLOUDS */
.clouds { position: fixed; inset: 0; pointer-events: none; overflow: hidden; }
.cloud {
  position: absolute;
  background: radial-gradient(ellipse at 40% 50%, rgba(100,160,255,0.12), transparent 70%);
  border-radius: 50%;
  filter: blur(var(--blur));
  animation: cloudDrift var(--spd) linear infinite var(--dl);
}
@keyframes cloudDrift {
  from { transform: translateX(var(--x0)); }
  to   { transform: translateX(var(--x1)); }
}

/* MIST */
.mist {
  position: fixed; left: -5%; width: 110%; border-radius: 50%;
  background: radial-gradient(ellipse at 50% 50%, rgba(74,158,255,0.08), transparent 65%);
  filter: blur(50px); pointer-events: none;
  animation: mistMove var(--ms) ease-in-out infinite alternate;
}
@keyframes mistMove {
  0%   { transform: translateX(-2%) scaleX(1);    opacity: var(--mo); }
  100% { transform: translateX(2%)  scaleX(1.03); opacity: calc(var(--mo)*1.4); }
}

/* HORIZON */
.horizon {
  position: fixed; bottom: 0; left: 0; width: 100%; height: 40%;
  background: linear-gradient(0deg, rgba(74,158,255,0.12) 0%, rgba(74,158,255,0.04) 40%, transparent 100%);
  pointer-events: none;
}

/* PARTICLES */
.particles { position: fixed; inset: 0; pointer-events: none; overflow: hidden; z-index: 5; }
.particle {
  position: absolute; border-radius: 50%; background: rgba(74,158,255,0.5);
  animation: rise var(--pd) ease-in infinite var(--pde);
}
@keyframes rise {
  0%   { transform: translateY(110vh) translateX(0) scale(0); opacity: 0; }
  8%   { opacity: 0.6; transform: translateY(90vh) translateX(var(--px)) scale(1); }
  90%  { opacity: 0.15; }
  100% { transform: translateY(-10vh) translateX(calc(var(--px)*2)) scale(0.2); opacity: 0; }
}

/* NAV TOGGLE — floating circle, top-left */
.nav-toggle {
  position: fixed; top: 1.6rem; left: 1.6rem; z-index: 40;
  width: 52px; height: 52px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: rgba(74,158,255,0.08);
  border: 1px solid rgba(126,207,255,0.25);
  backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
  cursor: pointer;
  transition: background 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
}
.nav-toggle:hover {
  background: rgba(74,158,255,0.16);
  border-color: rgba(126,207,255,0.5);
  transform: scale(1.05);
}
.nav-toggle span {
  position: absolute; left: 50%; top: 50%;
  width: 20px; height: 1.6px; border-radius: 2px;
  background: var(--white, #e8f0fe);
  transform: translate(-50%, -50%);
  transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.25s ease;
}
.nav-toggle span:nth-child(1) { transform: translate(-50%, -7px); }
.nav-toggle span:nth-child(3) { transform: translate(-50%, 7px); }
body.nav-open .nav-toggle span:nth-child(1) { transform: translate(-50%, -50%) rotate(45deg); }
body.nav-open .nav-toggle span:nth-child(2) { opacity: 0; }
body.nav-open .nav-toggle span:nth-child(3) { transform: translate(-50%, -50%) rotate(-45deg); }

/* SIDE NAV — hidden off-screen to the left */
.side-nav {
  position: fixed; top: 0; left: 0; z-index: 35;
  width: min(300px, 80vw); height: 100%;
  padding: 6.5rem 2.2rem 2.2rem;
  background: rgba(7,12,24,0.78);
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  border-right: 1px solid rgba(126,207,255,0.15);
  transform: translateX(-100%);
  visibility: hidden;
  transition: transform 0.5s cubic-bezier(0.16,1,0.3,1), visibility 0s 0.5s;
}
body.nav-open .side-nav {
  transform: translateX(0);
  visibility: visible;
  transition: transform 0.5s cubic-bezier(0.16,1,0.3,1), visibility 0s 0s;
}

.side-nav ul { list-style: none; margin: 0; padding: 0; }
.side-nav li { margin: 0.2rem 0; }
.side-nav a {
  display: block; padding: 0.65rem 0;
  font-size: 1rem; font-weight: 300; letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(180,200,230,0.6);
  text-decoration: none;
  transition: color 0.3s ease, padding-left 0.3s ease;
}
.side-nav a:hover, .side-nav a:focus-visible { color: var(--accent2, #7ecfff); padding-left: 0.4rem; }
.side-nav a[aria-current="page"] { color: var(--accent2, #7ecfff); }

/* SUBMENU — Privacy Policies */
.sub-toggle {
  display: flex; align-items: center; gap: 0.55em;
  width: 100%; padding: 0.65rem 0;
  background: none; border: none; cursor: pointer;
  font-family: inherit;
  font-size: 1rem; font-weight: 300; letter-spacing: 0.22em;
  text-transform: uppercase; text-align: left;
  color: rgba(180,200,230,0.6);
  transition: color 0.3s ease, padding-left 0.3s ease;
}
.sub-toggle:hover, .sub-toggle:focus-visible { color: var(--accent2, #7ecfff); padding-left: 0.4rem; }
.sub-toggle .chev {
  flex: none;
  transition: transform 0.35s cubic-bezier(0.16,1,0.3,1);
}
.has-sub.open .sub-toggle .chev { transform: rotate(180deg); }

.sub-menu {
  list-style: none; overflow: hidden;
  max-height: 0; opacity: 0;
  transition: max-height 0.45s cubic-bezier(0.16,1,0.3,1), opacity 0.35s ease;
}
.has-sub.open .sub-menu { max-height: 8rem; opacity: 1; }
.sub-menu li { margin: 0; }
.sub-menu a {
  padding: 0.45rem 0 0.45rem 1.3rem;
  font-size: 0.82rem;
  color: rgba(180,200,230,0.45);
  border-left: 1px solid rgba(126,207,255,0.18);
}
.sub-menu a:hover, .sub-menu a:focus-visible { padding-left: 1.7rem; }

/* OVERLAY — dims page when nav open */
.nav-overlay {
  position: fixed; inset: 0; z-index: 30;
  background: rgba(3,6,14,0.5);
  opacity: 0; pointer-events: none;
  transition: opacity 0.5s ease;
}
body.nav-open .nav-overlay { opacity: 1; pointer-events: auto; }

/* ACCESSIBILITY — reduced motion: stop only continuous background drift */
@media (prefers-reduced-motion: reduce) {
  .particle { display: none; }
  .cloud { animation: none; }
  .star { animation: none; opacity: var(--o); }
  .sky { animation: none; }
  .mist { animation: none; opacity: var(--mo); }
}
`;

(function injectSharedStyles() {
  if (document.getElementById('bearvil-shared-styles')) return;
  const style = document.createElement('style');
  style.id = 'bearvil-shared-styles';
  style.textContent = SHARED_CSS;
  document.head.appendChild(style);
})();

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
 *  <night-sky> — animated background: sky, stars, horizon.
 *  Attributes:
 *    stars="140"  desktop star count (mobile gets ~55%); default 110
 *    clouds       add drifting clouds
 *    particles    add rising particles (skipped if reduced motion)
 *  Page-specific .mist layers may be placed as children; they keep
 *  their position in the paint order (above sky/stars, below horizon).
 * ------------------------------------------------------------------ */
class NightSky extends HTMLElement {
  connectedCallback() {
    if (this.dataset.rendered) return;
    this.dataset.rendered = 'true';
    this.setAttribute('aria-hidden', 'true');

    // SKY + STARS — inserted before any existing children (e.g. .mist)
    const sky = document.createElement('div');
    sky.className = 'sky';

    const stars = document.createElement('div');
    stars.className = 'stars';
    const desktopCount = parseInt(this.getAttribute('stars'), 10) || 110;
    const starCount = isSmallScreen ? Math.round(desktopCount * 0.55) : desktopCount;
    let starHtml = '';
    for (let i = 0; i < starCount; i++) {
      const sz = (Math.random() * 2 + 0.4).toFixed(2);
      starHtml += `<div class="star" style="width:${sz}px;height:${sz}px;left:${(Math.random()*100).toFixed(2)}%;top:${(Math.random()*70).toFixed(2)}%;--d:${(Math.random()*4+2).toFixed(1)}s;--dl:-${(Math.random()*6).toFixed(1)}s;--o:${(Math.random()*0.6+0.2).toFixed(2)};"></div>`;
    }
    stars.innerHTML = starHtml; // single DOM write

    this.prepend(stars);
    this.prepend(sky);

    // CLOUDS
    if (this.hasAttribute('clouds')) {
      const clouds = document.createElement('div');
      clouds.className = 'clouds';
      [
        { w:500, h:200, top:10, blur:'65px', spd:'100s', x0:'-25%', x1:'115%', dl:'-20s' },
        { w:350, h:150, top:20, blur:'50px', spd:'75s',  x0:'110%', x1:'-20%', dl:'-40s' },
        { w:600, h:220, top:6,  blur:'80px', spd:'130s', x0:'-30%', x1:'120%', dl:'-60s' },
        { w:280, h:120, top:32, blur:'40px', spd:'60s',  x0:'108%', x1:'-18%', dl:'-10s' },
      ].forEach(c => {
        const el = document.createElement('div');
        el.className = 'cloud';
        el.style.cssText = `width:${c.w}px;height:${c.h}px;top:${c.top}%;--blur:${c.blur};--spd:${c.spd};--x0:${c.x0};--x1:${c.x1};--dl:${c.dl};`;
        clouds.appendChild(el);
      });
      stars.after(clouds);
    }

    // HORIZON — after the mist children
    const horizon = document.createElement('div');
    horizon.className = 'horizon';
    this.appendChild(horizon);

    // PARTICLES
    if (this.hasAttribute('particles') && !reducedMotion) {
      const particles = document.createElement('div');
      particles.className = 'particles';
      let pHtml = '';
      for (let i = 0; i < 18; i++) {
        const sz = (Math.random() * 3 + 1).toFixed(2);
        pHtml += `<div class="particle" style="width:${sz}px;height:${sz}px;left:${(Math.random()*100).toFixed(2)}%;--pd:${(Math.random()*14+9).toFixed(1)}s;--pde:-${(Math.random()*14).toFixed(1)}s;--px:${(Math.random()*60-30).toFixed(0)}px;"></div>`;
      }
      particles.innerHTML = pHtml;
      this.appendChild(particles);
    }
  }
}
customElements.define('night-sky', NightSky);

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
    document.fonts.load('600 1em "Cormorant Garamond"').then(() => {
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
