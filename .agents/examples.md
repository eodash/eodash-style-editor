# Examples, style schema & dataset loading

Files: `examples/*`, `components/MapToolbar.vue`

## Example structure

`examples/examples.js` aggregates the bundled examples (`[cerulean, geojson, cropCircles]`). Each `examples/<name>/index.js` exports:

```js
import style from './style.json'
export default {
  id: 'africa',            // used in ?example=<id> and for dropdown keys
  name: 'Countries of Africa',
  format: 'geojson',       // dropdown tag + format-matching (see issues.md — strings are inconsistent)
  dataUrl: '/eodash-style-editor/data/geojson/africa.json',
  style,                   // the editable style object
  layers: [ /* eox-map layer defs, each also carrying `style` and optional `interactions` */ ],
}
```

Bundled examples:
- **cerulean** — remote FGB, `format: 'fgb'`, huge `legend` (294-line style.json, `boundTo` conditional legends), no `variables`.
- **geojson** — local `/eodash-style-editor/data/...` GeoJSON, has `variables.strokeWidth` + `jsonform` slider + `tooltip`.
- **crop_circles** — Sentinel-2 COG (`WebGLTile`/GeoTIFF), `variables.bandNDivisor` driving an OL `color` expression.

`format` mismatch with the FGB URL-load path is a real bug — see [issues.md](./issues.md).

> `examples/tooltipTest/` contains only a `style.json`, no `index.js`, and is **not** in `examples.js` — an **orphan**, not loaded.

## Style schema (the JSON users edit)

`style.json` is an OpenLayers flat style with EOX extensions. Recognized top-level keys:

| Key | Purpose |
|-----|---------|
| OL style props (`stroke-color`, `stroke-width`, `fill-color`, `color`, …) | Standard OpenLayers flat-style / WebGL expression syntax. May contain `["var","key"]`. |
| `variables` | `{ key: value }` knobs. Referenced via `["var","key"]`. Vector → burned in; WebGLTile → live (see [formats.md](./formats.md)). |
| `jsonform` | JSON-schema that generates the layercontrol config form (`type:'number'`, `format:'range'`, min/max, etc.). |
| `legend` | Array of `color-legend-element` configs (`range`, `domain`, `scaleType`, `markType`, optional `boundTo` for conditional legends). |
| `tooltip` | Array `[{ id, title, appendix }]` or object map; consumed by `MapView::tooltipPropertyTransform`. |

`jsonform`/`schema` and `legend` are split off into `properties.layerConfig` during processing for eox-layercontrol.

## Loading paths (MapToolbar.vue)

The map's top toolbar. Two ways data enters:

1. **Examples dropdown** → `selectExample()` → `setCurrentExample()`, and pushes `?example=<id>` to the URL (`history.pushState`, deletes any `?url`).
2. **"Load new dataset" URL input** → `loadUrlData()`: validates URL format, `validateDataUrl` (HEAD), `detectDataFormat`, builds a layer (`WebGLTile` for GeoTIFF else `Vector`), looks up a matching example's style by `format`, calls `updateCurrentStyle(style)` then `setCustomDataLayers([layer])`, pushes `?url=<url>` (deletes `?example`).

`?example` and `?url` are **mutually exclusive**; `?url` wins. `autoSelectFromURL()` (on mount) replays whichever param is present.

> `loadUrlData` and `autoSelectFromURL` contain ~80 lines of **duplicated** layer-building + style-lookup logic, and the FGB `format` comparison there doesn't match `detectDataFormat`'s output or the example's `format` field. Both in [issues.md](./issues.md).

`currentDataName` computed drives the toolbar label: example name, else filename parsed from the first layer's `source.url`.

## Adding an example

1. `mkdir examples/<name>/`, add `style.json` and `index.js` (shape above).
2. Import + add it to the array in `examples.js`.
3. Put local data under `public/...` using the `/eodash-style-editor/` base prefix in `dataUrl`/`source.url`.
4. Ensure `source.format`/`source.type` matches a format-registry key exactly (see [formats.md](./formats.md)).
