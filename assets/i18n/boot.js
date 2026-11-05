/* =========================================================================
   i18n/boot.js — picks the page language BEFORE the first paint.

   Load it in <head>, synchronously, right after theme.js:
     <script src="/assets/i18n/boot.js"></script>

   Order of precedence: the visitor's stored choice (the nav language menu)
   → the browser's preferred languages → English. English is the HTML itself;
   any other language hides the page (html.i18n-pending, see base.css), starts
   loading /assets/i18n/<lang>.js right away and exposes the load as
   window.BEARVIL_I18N_READY for i18n.js to apply. A safety timer reveals the
   page in English if the dictionary never arrives.
   ========================================================================= */
(function () {
  'use strict';
  var SUPPORTED = ['en', 'hr', 'de', 'es', 'it', 'zh', 'ja'];
  var root = document.documentElement;

  var stored = null;
  try { stored = localStorage.getItem('bearvil-lang'); } catch (e) { /* storage blocked */ }

  function fromBrowser() {
    var prefs = navigator.languages || [navigator.language || 'en'];
    for (var i = 0; i < prefs.length; i++) {
      var code = String(prefs[i]).toLowerCase().split('-')[0];
      if (SUPPORTED.indexOf(code) !== -1) return code;
    }
    return 'en';
  }

  var lang = SUPPORTED.indexOf(stored) !== -1 ? stored : fromBrowser();
  root.setAttribute('lang', lang);
  window.BEARVIL_LANGS = SUPPORTED;

  if (lang === 'en') {
    window.BEARVIL_I18N_READY = Promise.resolve();
    return;
  }

  root.classList.add('i18n-pending');
  var reveal = function () { root.classList.remove('i18n-pending'); };
  setTimeout(reveal, 2500);   // never leave the page hidden

  window.BEARVIL_I18N_READY = new Promise(function (resolve) {
    var s = document.createElement('script');
    s.src = '/assets/i18n/' + lang + '.js';
    s.onload = resolve;
    s.onerror = function () { reveal(); resolve(); };
    document.head.appendChild(s);
  });
})();
