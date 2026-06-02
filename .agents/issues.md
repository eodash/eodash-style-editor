# Known issues & tech debt

Verified against source on branch `vue`. Grouped by severity. Each entry: what, where, why it matters, fix sketch.

---

## Correctness bugs

### 1. FGB URL-loads get the wrong style (three-way format-string mismatch)
**Where:** `components/MapToolbar.vue` `loadUrlData` + `autoSelectFromURL`; `utils/layerGenerator.js::detectDataFormat`; `examples/cerulean/index.js`.
**What:** `detectDataFormat()` returns `'FlatGeoBuf'`. The example lookup compares `format === 'FlatGeobuf'` (lowercase b). The cerulean example declares `format: 'fgb'`. None of the three align, so loading an FGB via the URL box never finds its example style and silently falls back to the GeoJSON default.
**Fix:** Pick one canonical token (suggest `'FlatGeoBuf'`) and use it in `detectDataFormat` output, the `examples.find(...)` comparisons, and every example's `format` field. While here, align `'geojson'`/`'geotiff'`/`'fgb'` casing project-wide.

### 2. `proj4` is an undeclared dependency
**Where:** `components/MapView.vue`, `formats/flatgeobuf.js`, `formats/geotiff.js` all `import proj4`.
**What:** `proj4` is **not** in `package.json`; it resolves only transitively through `@eox/map`. If that transitive dep changes, imports break with no warning.
**Fix:** `npm i proj4` to declare it explicitly.

### 3. Duplicate template ref `dropdownButtonRef`
**Where:** `components/MapToolbar.vue:67` (the "Load new dataset" button) and `:84` (the "Examples" button) both use `ref="dropdownButtonRef"`.
**What:** Both can be rendered at once, so the ref resolves to whichever mounted last. `toggleDropdown` uses it for `getBoundingClientRect`, so dropdown positioning can anchor to the wrong button.
**Fix:** Give them distinct refs; use the Examples button's ref for positioning.

---

## Dead code

### 4. `supports()` handler methods are never called
**Where:** `formats/formatRegistry.js` — every handler defines `supports(sourceType)`, but `getFormatHandler` dispatches purely via `Map.get(key)`. The lowercase/`'vector'` aliases they declare have no effect.
**Fix:** Either delete `supports()` and document key-based dispatch, or make `getFormatHandler` actually iterate `supports()` (would also fix some casing fragility). Pick one; the current half-state is misleading.

### 5. Unused exports / functions
- `formats/flatgeobuf.js::getFgbAsGeoJSON` — exported, never imported.
- `utils/layerGenerator.js::generateMapLayers` (plural) — exported, never imported.
- `components/MapView.vue::recompileWebGLTileLayer` — defined; the watcher uses inline `olLayer.setStyle` instead.
- `components/MapToolbar.vue::handleImportData` — TODO stub, never wired to UI.
- `components/MapView.vue::sanitizeLayer` — `sanitized.source.type = 'FlatGeoBuf'` self-assignment (no-op).
- `formats/index.js` — empty file.

### 6. Orphan example
**Where:** `examples/tooltipTest/` has only `style.json`, no `index.js`, not in `examples.js`. Either wire it up or delete it.

### 7. Commented-out CSS block
**Where:** `components/MapButtons.vue` carries a large commented `.map-button` style block. Remove.

---

## Tech debt / fragility

### 8. ~85 `console.log`/debug statements in production code
**Where:** `MapView.vue`, `useExamples.js`, `CodeEditor.vue`, `formatRegistry.js`, `LayerControl.vue`, the three `formats/*.js`.
**Why:** Console noise, minor perf, leaks internal data shapes. **Fix:** strip, or gate behind a `DEBUG` flag / Vite `import.meta.env.DEV`.

### 9. `setTimeout`-based reentrancy guards
**Where:** `isUpdatingFromExternal` (CodeEditor, 100 ms), `isUpdatingFromLayerControl` (LayerControl, 100 ms), the ACE-readiness `setTimeout(100)` (CodeEditor), the 1 s loading floor and 100 ms layercontrol-rebuild settle.
**Why:** Timing-dependent coordination between editor ↔ store ↔ layercontrol. Works, but races are possible on slow machines and it's hard to reason about. **Fix:** prefer explicit `nextTick`/flush-based or promise-sequenced coordination; if a sync bug appears (double-fire or dropped update), suspect these first.

### 10. `MapView` style watcher complexity
**Where:** `components/MapView.vue` `watch(mapLayers)` ~150 lines, 4 branches, manual deep-clone diffing (`lastLayerData`).
**Why:** Highest-risk code; any change to style processing must be re-validated against all four paths (see [map-view.md](./map-view.md)). **Fix (optional):** extract the classify-change logic into a pure helper returning a discriminated `{ kind, payload }`, leaving the watcher to just dispatch.

### 11. `sanitizeLayer` deep-clones every layer each update
**Where:** `MapView.vue::sanitizeLayer` `JSON.parse(JSON.stringify(layer))` per layer per `mapLayers` change. Necessary to drop Vue proxies, but O(layers × size) on every style keystroke-debounce. Fine at today's 1–2 layers; revisit if layer counts grow.

### 12. Duplicated dataset-loading logic
**Where:** `MapToolbar.vue` `loadUrlData` vs `autoSelectFromURL` — ~80 near-identical lines (layer build + format→example-style lookup). **Fix:** extract a `buildLayerFromUrl(url)` + `styleForFormat(format)` helper used by both.

### 13. Shadowed `isLayerControlVisible`
**Where:** `LayerControl.vue` declares a local `ref(true)` named `isLayerControlVisible` (internal rebuild toggle) that shadows the global `useLayerControl().isLayerControlVisible` (panel visibility). Different refs, same name. **Fix:** rename the local to e.g. `isControlMounted`.

### 14. No tests
No test runner, no tests. The style/variable invariant (see [state-management.md](./state-management.md)) and the four `MapView` update paths are exactly the kind of logic that regresses silently — they'd benefit from unit coverage on `updateVectorLayerStyle`, `processLayers`, and `onlyVariablesChanged`.

---

## Quick wins (low risk, high signal)
- Declare `proj4` (#2).
- Canonicalize format strings (#1) — fixes a user-visible bug.
- Strip/gate `console.log`s (#8).
- Delete dead code (#4–#7).
