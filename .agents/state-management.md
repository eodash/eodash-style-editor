# State management

Files: `composables/useExamples.js`, `utils/styleProcessor.js`, `composables/useLoading.js`, `composables/useLayerControl.js`

## The store is a module-level singleton

`useExamples.js` declares its refs **outside** the exported function:

```js
const currentExample = ref(null)        // the loaded example object (with original layers)
const currentExampleStyle = ref(null)   // the active style being edited (source of truth)
const dataLayers = ref([])              // processed layers handed to the map
```

Every `useExamples()` call returns the **same** refs. This is intentional — it's the shared store. `CodeEditor`, `MapView`, `LayerControl`, and `MapToolbar` all call `useExamples()` and read/write the same state. `useLoading.js` (`isMapLoading`, `loadingHint`) and `useLayerControl.js` (`isLayerControlVisible`) use the identical pattern.

Exposed getters are wrapped in `computed()` so consumers get read-only reactive views; mutation happens only through the action functions.

## currentExampleStyle is the source of truth

The style object — not the layers — is canonical. Both the ACE editor and the layer-control form read from and write to `currentExampleStyle`. Layers are a *derived* artifact produced by `processLayers`.

A style object looks like (see [examples.md](./examples.md) for the full schema):
```jsonc
{
  "variables": { "strokeWidth": 2 },          // editable knobs
  "stroke-width": ["var", "strokeWidth"],     // OL expression referencing a variable
  "jsonform": { /* JSON-schema driving the layercontrol form */ },
  "legend": [ /* color-legend-element config */ ],
  "tooltip": [ /* per-property tooltip config */ ]
}
```

## THE INVARIANT (read this twice)

`styleProcessor.js::updateVectorLayerStyle(style)` **burns variables in**:
- `JSON.stringify(style)` → for each key in `style.variables`, `replaceAll("[\"var\",\"key\"]", value)` → `JSON.parse`.
- Numbers are injected unquoted; everything else quoted.
- **One-way and lossy**: after burning, `["var","strokeWidth"]` is gone, replaced by `2`. You cannot recover the variable reference from a processed layer.

Therefore `updateCurrentStyle(newStyle)` (in `useExamples.js`) **must always reprocess from `currentExample.value.layers`** — the original defs that still carry `["var","key"]`. It copies only the cached `extent` forward from `dataLayers.value[i]` so format handlers don't refetch:

```js
const layersToProcess = originalLayers.map((layer, i) => {
  const current = dataLayers.value[i]
  return current?.extent ? { ...layer, extent: current.extent } : layer
})
const processed = await processLayers(layersToProcess, newStyle)
```

If you ever reprocess from `dataLayers.value`, the first edit works and every subsequent variable edit operates on burned-in values → variables appear "stuck". This is the #1 regression source.

## updateCurrentStyle branches

`updateCurrentStyle(newStyle)` first sets `currentExampleStyle.value = newStyle` (this is what fans out to the editor and layercontrol watchers), then rebuilds layers via one of:

1. **`currentExample.value?.layers` exists** → the correct path above (reprocess originals, preserve extents).
2. **No example, but `dataLayers` populated** (custom `?url=` data) → strips `style` from each processed layer and re-runs `processLayers` so the new style/variables apply cleanly.
3. **Legacy `currentExample` without `.layers`** → manual per-layer style patching (the long `else if` block). Rarely hit; all bundled examples use the `.layers` array form.

## Actions reference

| Action | Effect |
|--------|--------|
| `setCurrentExample(example)` | Sets `currentExample` + `currentExampleStyle`, runs `processLayers(example.layers, style)` → `dataLayers`. Toggles loading with a 1s `setTimeout` floor. |
| `updateCurrentStyle(newStyle)` | The invariant-critical reprocess described above. No loading spinner (style edits are fast). |
| `setCustomDataLayers(layers)` | Clears `currentExample`, applies current-or-default style, `processLayers`. Used by `?url=` loads. |
| `addLayer` / `removeLayer` / `clearAllLayers` / `clearCurrentExample` | Direct `dataLayers` mutation helpers. |

## Loading + visibility

- `useLoading.js`: `startMapLoading()` picks a random space-themed `loadingHint`; `MapView` renders an overlay (never unmounts the map DOM). Stops are deferred ~1s to let the map settle.
- `useLayerControl.js`: `isLayerControlVisible` + `toggleLayerControl`, driven by the button in `MapButtons.vue` and consumed by `App.vue` (renders the panel) and `LayerControl.vue`.

## Gotchas

- The store persists across component unmounts (it's module-scoped). State is **not** reset on navigation; only the explicit `clear*` actions reset it.
- `useExamples.js` is heavily `console.log`-instrumented — see [issues.md](./issues.md).