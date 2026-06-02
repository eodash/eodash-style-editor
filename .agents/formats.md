# Format registry & extent calculation

Files: `formats/formatRegistry.js`, `formats/flatgeobuf.js`, `formats/geojson.js`, `formats/geotiff.js`, `utils/layerGenerator.js`
(`formats/index.js` exists but is **empty**.)

## What handlers actually do

A handler's only job is to **compute the layer's geographic extent** (so the map can auto-fit) and cache it. They do **not** fetch or transform the geometry for rendering — `eox-map`/OpenLayers does that from `source.url`. Extent is needed up front because the map centers/zooms before the data finishes loading.

After extent calculation, `processLayers` applies the editor style as an override (see below).

## Dispatch is by Map key, NOT by `supports()`

```js
export function getFormatHandler(sourceType) {
  return formatHandlers.get(sourceType) || formatHandlers.get('default')
}
```

Registry keys: `'FlatGeoBuf'`, `'GeoJSON'`, `'GeoTIFF'`, `'default'`.

In `processLayers`, dispatch prefers `layer.source.format`, falling back to `layer.source.type`:
```js
handler = layer.source?.format
  ? getFormatHandler(layer.source.format)
  : getFormatHandler(layer.source?.type)
```

So a layer resolves a handler only if `source.format` or `source.type` **exactly equals** a registry key (case-sensitive). Examples:
- `{ source: { type:'Vector', format:'GeoJSON' } }` → `GeoJSONHandler` (via format)
- `{ source: { type:'FlatGeoBuf', url } }` → `FlatGeoBufHandler` (via type)
- `{ source: { type:'GeoTIFF', sources:[…] } }` → `GeoTIFFHandler`
- anything else (e.g. plain `type:'Vector'` with no format) → `DefaultHandler` (passthrough, no extent)

> ⚠️ **The `supports(sourceType)` methods on every handler are dead code.** Nothing calls them — dispatch is pure key lookup. Don't rely on them; the lowercase/`'vector'` aliases they declare have no effect. See [issues.md](./issues.md).

## The style-override step (this is where variables burn)

After `handler.processLayer(layer)`, if an `editorStyle` was passed, `processLayers` overrides the layer style by type:

- **Vector**: `style = updateVectorLayerStyle(editorStyle)` (variables **burned in**). Also writes `properties.layerConfig = { schema: style.jsonform ?? style.schema, style: {...processed, variables: editorStyle.variables}, legend }` — the layercontrol reads variables from `layerConfig.style.variables`.
- **WebGLTile**: `style = { ...existingLayerStyle, ...editorStyle }` (**merged, not burned**). Raster shaders keep `["var",...]` expressions live; variables are updated at runtime via `layer.updateStyleVariables()` (see [map-view.md](./map-view.md)). Merging preserves variables the editor style might omit.

This asymmetry (Vector burns, WebGLTile merges) is deliberate and is why the two layer types take different update paths downstream.

## Per-format extent calculators

All return an extent in **EPSG:3857** `[minX, minY, maxX, maxY]`, or `null`/`undefined` on failure. A missing extent is non-fatal — the layer still loads, the map just falls back to a default view (`center [15,48], zoom 7`). Each handler also short-circuits if the layer already has a valid 4-element `extent` (set `properties.__extentCalculated = true`).

### FlatGeoBuf — `flatgeobuf.js`
- Uses `flatgeobuf/lib/mjs/geojson.js::deserialize`, which in v4.x returns an **AsyncGenerator** — iterate with `for await … of`, **not** `featureCollection.features` (a common past bug).
- Reprojects each coordinate 4326→3857 via `proj4` while walking geometries recursively (`traverseCoordinates`).
- **Two module-level caches**: `bufferCache` (raw `ArrayBuffer` per URL) and `extentCache` (computed extent per URL). Prevents duplicate network fetches across re-processing.
- Also exports `getFgbBuffer` and `getFgbAsGeoJSON`; `getFgbAsGeoJSON` is currently **unused** (dead export).

### GeoJSON — `geojson.js`
- `fetch` → `.json()` → walk all features. Handles every geometry type incl. `GeometryCollection` recursively (`extractCoordinates`).
- Reprojects via OpenLayers `ol/proj::transform` (not raw proj4). **No cache** here.

### GeoTIFF — `geotiff.js`
- `geotiff::fromUrl` → `getImage()` → `getBoundingBox()`; reads `getGeoKeys()` for the source EPSG.
- Registers proj4 with OL (`ol/proj/proj4::register`) and pre-defines `EPSG:32636` (Sentinel-2 UTM zone 36). Handles 4326, 3857, arbitrary `EPSG:<code>`, and a heuristic fallback for COGs with unclear projection (coords > 180/90 ⇒ assume already projected, pass through).
- Heavily `console.log`-instrumented.

## layerGenerator.js (utilities)

- `detectDataFormat(url)` — extension/substring sniff. **Returns `'FlatGeoBuf'`, `'GeoJSON'`, `'GeoTIFF'`, or `'Unknown'`.** Note the exact casing `FlatGeoBuf` — mismatches elsewhere cause a real bug (see [issues.md](./issues.md)).
- `generateLayerSource(url, format)` / `generateMapLayer({...})` — build layer objects for the legacy non-`.layers` path. `generateMapLayers` (plural) is a **dead export**.
- `validateDataUrl(url)` — `fetch(url, { method:'HEAD' })`, returns `response.ok`. Used by `MapToolbar` before loading `?url=` data.

## Adding a new format

1. `const H = Object.create(FormatHandler); H.processLayer = async (layer) => {…compute extent…}`.
2. `registerFormatHandler('MyType', H)` — the key must match what examples put in `source.format`/`source.type`.
3. Skip `supports()` — it's vestigial.