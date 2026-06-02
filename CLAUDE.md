# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Vite dev server (the user runs this; **do not start or kill it**, hot-reload picks up edits)
- `npm run build` / `npm run preview`
- `npm run lint` — ESLint with `--fix`
- `npm run format` — Prettier over `src/`

No test runner is configured; there are no tests.

Deploy note: `vite.config.js` sets `base: '/eodash-style-editor/'`. The app (and local example data under `public/`) is served from that path, not root. Branch `vue` is the active development branch.

## What this is

A Vue 3 + Vite single-page tool for **authoring OpenLayers/EOX styles** against live geospatial data. Three EOX web components do the heavy lifting; the Vue layer is glue plus shared state.

- `eox-map` — the map (OpenLayers). Layers are set via **direct property assignment** (`mapRef.value.layers = [...]`), never via template attributes — Vue would coerce the array to a string.
- `eox-jsonform` — hosts the ACE JSON editor. The code reaches **past** its event system to the raw ACE instance for performance and control.
- `eox-layercontrol` — layer panel + form-driven variable editing.

`vite.config.js` registers `isCustomElement: tag.startsWith('eox-')` so Vue doesn't try to resolve these tags as components.

## Architecture at a glance

```
examples/*  ──┐
URL ?url=   ──┤→ useExamples (singleton store) ──→ processLayers (format registry)
              │      ▲   │                              │ computes extent + burns style
ACE editor ───┘      │   └→ dataLayers ──→ MapView ──→ eox-map
LayerControl ────────┘                        (4-path style watcher)
```

**State core — `composables/useExamples.js`.** A module-level singleton store (refs declared *outside* the exported function, so every `useExamples()` call shares the same `currentExample` / `currentExampleStyle` / `dataLayers`). `useLoading.js` and `useLayerControl.js` follow the same pattern. Treat them as a hand-rolled Pinia.

**The one invariant that matters** (break it and variable editing silently fails):

> `updateCurrentStyle()` must always reprocess from `currentExample.value.layers` (the **original** layer defs, which still contain `["var","key"]` references) — never from `dataLayers.value` (already processed, variables burned in). Only the calculated `extent` is carried forward from processed layers, to avoid refetching data.

`styleProcessor.js::updateVectorLayerStyle()` is the burn-in: it stringifies the style, `replaceAll`s `["var","key"]` with the concrete value from `style.variables`, reparses. One-way and lossy by design.

**Style data flow.** Editor or LayerControl change → `updateCurrentStyle(newStyle)` → `formats/formatRegistry.js::processLayers(originalLayers, newStyle)` (computes/reuses extent per format, applies the editor style as an override — burning variables for `Vector`, merging for `WebGLTile`) → `dataLayers` updates → `MapView.vue` pushes sanitized layers onto `eox-map`.

## Deep-dive docs (read the relevant one before editing that area)

Detailed, feature-scoped context lives in `.agents/`:

- `.agents/state-management.md` — the singleton store, the invariant, `styleProcessor`, loading/visibility composables
- `.agents/formats.md` — format registry dispatch, per-format extent calculators, caching, projection handling
- `.agents/code-editor.md` — `CodeEditor.vue`, direct-ACE access, debounce, focus-guarded reverse sync, folding
- `.agents/map-view.md` — `MapView.vue` 4-path style watcher, `sanitizeLayer`, auto-fit, tooltips
- `.agents/layer-control.md` — `LayerControl.vue` bidirectional sync, schema-vs-variable rebuild logic
- `.agents/examples.md` — example/style schema (`variables`/`jsonform`/`legend`/`tooltip`), URL params, `MapToolbar` loading
- `.agents/issues.md` — **known bugs and tech debt, verified against source.** Check here before touching style/variable flow, format strings, or `MapToolbar`.

## Conventions specific to this repo

- **No business logic in templates**; extract to composables/methods/watchers. Composition API + `<script setup>` only.
- EOX layer object shape: `{ type, id, title, source: { type, url, format } | { type:'GeoTIFF', sources:[{url}] }, style, properties: { id, title, visible, layerConfig } }`. `Vector` for vectors, `WebGLTile` for rasters.
- Data layers come **first** in the `eox-map` layers array (OpenLayers renders array order bottom→top; first = on top), base OSM layer last.
- Reentrancy between editor ↔ store ↔ layercontrol is guarded with boolean flags reset on `setTimeout(…, 100)`. Timing-dependent — see `.agents/issues.md`.

## Git commit guidelines

- Conventional commits, lowercase subject: `feat: …`, `fix: …`, `chore:`, `refactor:`, `docs:`, `style:`, `test:`.
- Prefer new commits over amending. Per the user's local-only rule: **never push or use `gh` write commands.**
- Body uses [Keep a Changelog](https://keepachangelog.com/) groups: **Added / Changed / Deprecated / Removed / Fixed / Security**.

Example:
```
fix: resolve layer styling persistence during editing

**Fixed:**
- Variable preprocessing correctly replaces ["var", "key"] expressions
- Style updates maintain proper eox-map layer configuration
```