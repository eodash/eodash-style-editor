# Map view

File: `components/MapView.vue`

Wraps `eox-map`, owns the OpenLayers instance, and translates `dataLayers` (store) into actual map layers. The trickiest file in the repo — the `watch(mapLayers)` handler is ~150 lines and classifies every change into one of four update paths.

## Layer assembly

- `baseLayers` = a single OSM `Tile`. `mapLayers` computed = `[...dataLayers, ...baseLayers]` — **data first** because OpenLayers renders array order bottom→top, so first = on top, OSM at the bottom.
- Layers are never set via template attributes. `updateMapLayers()` does `mapRef.value.layers = mapLayers.value.map(sanitizeLayer)` (direct property assignment) inside `nextTick`.

## sanitizeLayer(layer)

Prepares each layer for `eox-map`:
- `JSON.parse(JSON.stringify(layer))` — deep clone to strip Vue reactivity proxies (eox-map chokes on proxies). Also the perf hot spot (runs per layer per update).
- Guarantees `id`, `type` (default `Vector`), and `properties.{id,title}`.
- Vector layers: copies `style` into `properties.layerConfig.style`.
- Tooltip wiring: for Vector layers, rebuilds `interactions`, adding a `select`/`pointermove` hover interaction **only if** `currentExampleStyle.value.tooltip` is set.
- Strips `undefined` values except the essential `id/type/source/properties`.

## Tooltips

`tooltipPropertyTransform(param)` (bound to `<eox-map-tooltip :propertyTransform>`) shapes hover output from `currentExampleStyle.value.tooltip`:
- Array form `[{ id, title, appendix }]` → renames keys, formats numbers to 4 dp, appends units.
- Object form → key→title mapping.
- No tooltip config → returns `param` unchanged (default behavior).

## Auto-fit view

- `mapViewParams` computed: takes the **first** data layer with a valid 4-element `extent`, derives `center` (3857→4326 via `proj4`) and `zoom` (stepwise heuristic in `calculateZoomFromExtent`). Falls back to `center [15,48], zoom 7`.
- `updateMapView` sets `mapRef.center/zoom` directly. Guarded by `hasInitializedView` and `shouldPreserveView` so style edits don't recenter the map.

## The 4-path style watcher (the important part)

`watch(mapLayers, async (newLayers) => {…})`, `immediate:false`. It diffs `newLayers` against `lastLayerData` (a deep-cloned snapshot kept across runs) to do the **minimum** work — refetching data or recompiling a shader is expensive.

First it detects a **style-only update** (same `id/type/source/extent`, different style): if so it captures the live OL `center/zoom` and sets `shouldPreserveView` so the view doesn't jump. Then it picks a path:

1. **WebGLTile shader changed** (`!onlyVariablesChanged(old.style, new.style)`, comparing styles with `variables` stripped) → call `olLayer.setStyle(newStyle)` **directly on the OpenLayers layer**. Deliberately does **not** call `updateMapLayers()`, which would make eox-map recreate the layer and refetch the raster.
2. **WebGLTile variables only** → `layer.updateStyleVariables(variables)` (fast path, recompiles uniforms not the shader). Routed through `updateGeoTIFFStyleVariables(id, vars)`.
3. **Vector style changed** → full `updateMapLayers()` (vectors are cheap; styles were already burned in upstream).
4. **First load / fallback** → `updateMapLayers()`.

After updating, if a style-only view was captured, it restores `center/zoom`, then refreshes `lastLayerData`.

### Why this matters when editing
- The Vector-burn vs WebGLTile-merge split from [formats.md](./formats.md) is what makes paths 1–2 possible: raster variables stay live so they can be pushed without a rebuild; vector variables are already concrete so the layer just re-renders.
- If you change how styles are processed, re-verify all four branches — especially that `onlyVariablesChanged` still correctly separates shader edits from variable edits, or raster editing will either flicker (needless recompiles) or go stale (missed recompiles).

## Watch out

- `recompileWebGLTileLayer` is defined but the watcher uses inline `olLayer.setStyle` instead — partially redundant.
- A `sanitized.source.type = 'FlatGeoBuf'` self-assignment is a no-op left in `sanitizeLayer`.
- Same heavy `console.log` instrumentation as the rest of the app. See [issues.md](./issues.md).
