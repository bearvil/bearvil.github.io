# Spec — `<main-background>` + `<home-background>` components

**Date:** 2026-07-12
**Status:** Implemented, with a revision — see note below
**Topic:** Split the shared `<calm-sea>` background into two reusable background
components — a renamed "main" background used on every page except Home, and a
new background used only on Home.

> **Revision (same day):** the WebGL noise-gradient technique described in
> Decision 3 and Design sections B/C below was built, but couldn't be reliably
> verified in this environment and — per direct feedback — wasn't animating as
> intended. It was replaced with a much simpler placeholder: three CSS-animated
> SVG wave layers over a turquoise gradient, no canvas/WebGL at all. Sections B
> and C are kept for the record; the shipped implementation is the simplified
> one described in `docs/components.md`.

## Goal

Today every page uses the same `<calm-sea>` background. Going forward:

- `<main-background>` — the existing sand→turquoise gradient (sun glow + wave
  bands), renamed but otherwise unchanged, used on `contact.html`, `404.html`,
  `work.html`, `about.html`, `styleguide.html`.
- `<home-background>` — a new, distinct animated background used only on
  `index.html`.

## Background / constraints

- Shared UI is built as vanilla Web Components in
  [`assets/components.js`](../../../assets/components.js); visual styles live in
  [`assets/css/components.css`](../../../assets/css/components.css).
- Must stay zero-build, zero-dependency, and GitHub Pages compatible — no
  bundlers, no third-party JS libraries. Must keep the strict CSP (`script-src
  'self'`, no inline scripts) and respect `prefers-reduced-motion`.
- `<calm-sea>`'s "water shimmer" diagonal-stripe layer was already removed in a
  prior change (see git history) — not part of this spec.

## Decisions (from brainstorming)

1. **Naming:** `<calm-sea>` is renamed to `<main-background>` (element, JS class,
   CSS block `.sea` → `.main-bg`). The new element is `<home-background>`.
2. **Independent implementations:** `<home-background>` is a fully separate
   custom element and CSS block, not extended/shared from `<main-background>`.
   The two are expected to diverge further once more Home-specific design
   direction arrives, so no shared abstraction is introduced now.
3. **Home background technique:** reproduce the effect from
   `https://gradients.juangarcia.ch/?amount=0.23&speed=0.14&fx=2.3&fy=6`, which
   is a Three.js tool that colors a plane mesh per-vertex by layering simplex
   noise (the public-domain Ashima/McEwan `snoise` GLSL function): starting from
   a base color, it mixes toward each of 4 accent colors wherever that color's
   own noise field crosses a threshold, animated over time. The fragment shader
   just outputs the interpolated color — no lighting/shading model involved.
   - Reimplemented as a **plain WebGL fullscreen-quad fragment shader** (raw
     `canvas.getContext('webgl')`, hand-written GLSL, no Three.js or any other
     library) evaluating the same logic per-pixel instead of per-vertex —
     avoids a ~600KB 3D library dependency entirely while looking at least as
     smooth as the original.
   - Uniforms map 1:1 to the reference URL's params: `uAmount = 0.23`,
     `uSpeed = 0.14`, `uFrequency = (2.3, 6)`.
   - Colors (5 slots, replacing the tool's default preset) come from Bearvil
     tokens: base `--turquoise-50`, then `--turquoise-200`, `--turquoise-500`,
     `--turquoise-700`, `--orange-300` (sun accent).
4. **Home page wiring:** `index.html` switches from `<calm-sea>` to
   `<home-background>` now (not staged behind a later design handoff).
5. **Reduced motion:** on `prefers-reduced-motion: reduce`, render one static
   frame and stop the animation loop entirely (no continued GPU/CPU cost) —
   consistent with how `<main-background>`'s sun/wave layers freeze their CSS
   animations.
6. **Graceful degradation:** if WebGL is unavailable, `<home-background>` renders
   nothing; the page's own background color (from `base.css`/tokens) shows
   through. Same degrade path `<calm-sea>` already has today when JS is
   disabled.

## Design

### A. `<main-background>` (rename)

- `assets/components.js`: `class CalmSea` → `class MainBackground`,
  `customElements.define('calm-sea', ...)` → `customElements.define('main-background', ...)`.
- `assets/css/components.css`: `.sea` → `.main-bg`, `.sea__sun` → `.main-bg__sun`,
  `.sea__wave` → `.main-bg__wave`; same for the `prefers-reduced-motion` rule.
- Update every page (`contact.html`, `404.html`, `work.html`, `about.html`,
  `styleguide.html`) from `<calm-sea></calm-sea>` to
  `<main-background></main-background>`.
- No visual or behavioral change — pure rename.

### B. `<home-background>` (new)

New class in `assets/components.js`:

- `connectedCallback` creates a `<canvas class="home-bg">`, appends it, and
  initializes a WebGL context.
- Vertex shader: passthrough fullscreen triangle/quad.
- Fragment shader: the `snoise` function (verbatim public-domain
  implementation) plus the color-mixing loop described above, ported to operate
  on screen-space UV instead of vertex `uv`/`position`.
- Uniforms: `uAmount`, `uSpeed`, `uFrequency` (vec2), `uColor[5]` (vec3 array),
  `uTime`, `uResolution` (vec2, for aspect-correct UVs).
- JS reads the 5 colors from the page's computed CSS custom properties (so the
  shader stays token-driven, not hardcoded hex) and converts them to 0–1 RGB
  floats once at init.
- Animation loop: `requestAnimationFrame`, advancing `uTime`; on
  `matchMedia('(prefers-reduced-motion: reduce)')` render exactly one frame and
  never start the loop.
- Resize: listen for viewport resize (debounced), resize the canvas backing
  store and update `uResolution` + the WebGL viewport.
- `aria-hidden="true"`, `pointer-events: none`, `position: fixed; inset: 0;
  z-index: var(--z-background)` — same containing pattern as
  `<main-background>`.

### C. Styles (`components.css`)

- `.home-bg` (the `<canvas>`): `position: fixed; inset: 0; width: 100%; height:
  100%; z-index: var(--z-background); display: block;`. No other visual CSS
  needed — the shader owns all coloring.

### D. Rollout

- `index.html`: replace `<calm-sea></calm-sea>` with
  `<home-background></home-background>`; update the head-comment reference.
- Other five pages: replace `<calm-sea>` with `<main-background>`.

### E. Documentation updates (same change)

- `docs/components.md`: replace the `<calm-sea>` section with
  `<main-background>`; add a `<home-background>` section describing the WebGL
  technique, params, and color source.
- `README.md`: update the component list/table, the "Adding a new site page"
  step, and the landing-page feature bullet.
- `docs/architecture.md`, `docs/design-system.md`, `docs/styling.md`: update
  `<calm-sea>` references to `<main-background>` (and note `<home-background>`
  where relevant).
- Clean up two stale leftovers from the earlier shimmer removal: the
  `glints="22"` / "shimmer" mention in the `components.js` header comment, and
  the "water shimmer" mentions in `README.md`.

## Out of scope

- Any further redesign of `<home-background>`'s colors/params beyond what's
  specified here (the user may iterate after seeing it live).
- Extracting shared canvas/WebGL helper code between `<main-background>` and
  `<home-background>` — they're independent by design (Decision 2).
- Changing `<main-background>`'s visuals in any way.

## Acceptance criteria

- All six pages load with no console errors; `index.html` shows the new
  animated WebGL gradient, the other five show the unchanged sand→turquoise
  gradient under the `<main-background>` name.
- `<home-background>` animates continuously, matches the given amount/speed/
  frequency params, and uses only the five specified token colors.
- `prefers-reduced-motion: reduce` freezes `<home-background>` to a static frame
  and stops its render loop.
- No `calm-sea`, `sea__`, `glints`, or "shimmer" references remain anywhere in
  the repo.
- No inline scripts; CSP unchanged; no third-party libraries added; no build
  step; works as a static GitHub Pages site.
- Docs updated in the same change.
