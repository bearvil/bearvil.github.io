/* =========================================================================
   theme.js — sets <html data-theme="light|dark"> BEFORE the first paint so
   the page never flashes the wrong theme.

   Load it in <head>, synchronously (no defer/async), before the stylesheets:
     <script src="/assets/theme.js"></script>

   Order of precedence: the visitor's stored choice (the nav toggle) → the
   system preference (prefers-color-scheme) → light. The toggle itself and
   live system-change handling live in components.js (<top-nav>).
   ========================================================================= */
(function () {
  'use strict';
  var stored = null;
  try { stored = localStorage.getItem('bearvil-theme'); } catch (e) { /* storage blocked */ }
  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  var theme = (stored === 'light' || stored === 'dark') ? stored : (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
})();
