/* =========================================================================
   i18n/i18n.js — applies translations and renders the language menu.

   Load after components.js (both deferred):
     <script src="/assets/components.js" defer></script>
     <script src="/assets/i18n/i18n.js" defer></script>

   Markup contract (English in the HTML is the source text):
     <h1 data-i18n="home.title">Calm, private apps …</h1>        → innerHTML
     <meta name="description" content="…"
           data-i18n-attr="content:home.metaDesc" />              → attribute(s),
                                                                     "attr:key;attr2:key2"
   Dictionaries: /assets/i18n/<lang>.js register
     window.BEARVIL_I18N.<lang> = { "home.title": "…", … }
   boot.js has already picked the language and started loading its file.

   Exposes: bearvilT(key, fallback) for strings built in JS (components.js),
   and the <lang-switch> element used inside <top-nav>.
   ========================================================================= */
'use strict';

const LANG_KEY = 'bearvil-lang';
const LANG_NAMES = {
  en: 'English', hr: 'Hrvatski', de: 'Deutsch', es: 'Español',
  it: 'Italiano', zh: '中文', ja: '日本語',
};
const GLOBE = '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M3 12h18M12 3c2.6 2.6 3.9 5.6 3.9 9s-1.3 6.4-3.9 9c-2.6-2.6-3.9-5.6-3.9-9S9.4 5.6 12 3Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>';

function currentLang() {
  return document.documentElement.getAttribute('lang') || 'en';
}

function dictionary(lang) {
  return (window.BEARVIL_I18N && window.BEARVIL_I18N[lang]) || null;
}

/* Translate a key for the current language; English (or a missing key)
   returns the fallback. */
function bearvilT(key, fallback) {
  const dict = dictionary(currentLang());
  return (dict && dict[key]) || fallback;
}

/* Swap every [data-i18n] / [data-i18n-attr] under root to `lang`. The first
   pass remembers each element's English so switching back needs no reload. */
function applyTranslations(lang, root = document) {
  const dict = lang === 'en' ? null : dictionary(lang);

  root.querySelectorAll('[data-i18n]').forEach(el => {
    if (el.dataset.i18nEn == null) el.dataset.i18nEn = el.innerHTML;
    const value = dict && dict[el.dataset.i18n];
    el.innerHTML = value || el.dataset.i18nEn;
  });

  root.querySelectorAll('[data-i18n-attr]').forEach(el => {
    el.dataset.i18nAttr.split(';').forEach(pair => {
      const [attr, key] = pair.split(':').map(s => s.trim());
      const store = 'i18nEn' + attr.replace(/(^|-)(\w)/g, (_, __, c) => c.toUpperCase());
      if (el.dataset[store] == null) el.dataset[store] = el.getAttribute(attr) || '';
      const value = dict && dict[key];
      el.setAttribute(attr, value || el.dataset[store]);
    });
  });

  // <title> lives in <head>; keep document.title in step when scanning the page.
  const title = document.querySelector('title[data-i18n]');
  if (title && root === document) document.title = title.textContent;

  // Strings built in JS by components.js.
  if (typeof syncThemeToggle === 'function') document.querySelectorAll('.theme-toggle').forEach(syncThemeToggle);
}

/* Switch language at runtime: load the dictionary if needed, apply, remember. */
function setLanguage(lang) {
  if (!LANG_NAMES[lang]) return;
  try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* storage blocked */ }
  const finish = () => {
    document.documentElement.setAttribute('lang', lang);
    applyTranslations(lang);
    document.querySelectorAll('lang-switch').forEach(s => s.sync());
  };
  if (lang === 'en' || dictionary(lang)) { finish(); return; }
  const s = document.createElement('script');
  s.src = `/assets/i18n/${lang}.js`;
  s.onload = finish;
  document.head.appendChild(s);
}

/* ------------------------------------------------------------------ *
 *  <lang-switch> — compact globe + language-code button in the nav
 *  bar that opens a list of languages (native names). Click/keyboard
 *  toggle, Escape and outside-click close it.
 * ------------------------------------------------------------------ */
class LangSwitch extends HTMLElement {
  connectedCallback() {
    if (this.dataset.rendered) return;
    this.dataset.rendered = 'true';

    const items = (window.BEARVIL_LANGS || Object.keys(LANG_NAMES)).map(code =>
      `<li><button type="button" class="lang-switch__option" data-lang="${code}" lang="${code}">${LANG_NAMES[code]}</button></li>`
    ).join('');

    this.innerHTML = `
      <button type="button" class="lang-switch__toggle" aria-expanded="false" aria-controls="lang-switch-menu"
              data-i18n-attr="aria-label:nav.language;title:nav.language" aria-label="Language" title="Language">
        ${GLOBE}<span class="lang-switch__code"></span>
      </button>
      <ul class="lang-switch__menu" id="lang-switch-menu" role="list">${items}</ul>
    `;

    this.toggle = this.querySelector('.lang-switch__toggle');
    const close = () => { this.classList.remove('open'); this.toggle.setAttribute('aria-expanded', 'false'); };

    this.toggle.addEventListener('click', () => {
      const open = this.classList.toggle('open');
      this.toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    this.querySelectorAll('.lang-switch__option').forEach(btn =>
      btn.addEventListener('click', () => { setLanguage(btn.dataset.lang); close(); this.toggle.focus(); })
    );
    document.addEventListener('click', e => { if (!this.contains(e.target)) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

    this.sync();
  }

  /* Reflect the current language on the button and the list. */
  sync() {
    const lang = currentLang();
    this.querySelector('.lang-switch__code').textContent = lang.toUpperCase();
    this.querySelectorAll('.lang-switch__option').forEach(btn =>
      btn.setAttribute('aria-current', btn.dataset.lang === lang ? 'true' : 'false')
    );
  }
}
customElements.define('lang-switch', LangSwitch);

/* Initial pass: wait for boot.js's dictionary, translate, then reveal. */
(window.BEARVIL_I18N_READY || Promise.resolve()).then(() => {
  applyTranslations(currentLang());
  document.querySelectorAll('lang-switch').forEach(s => s.sync());
  document.documentElement.classList.remove('i18n-pending');
});
