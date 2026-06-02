# .agents — feature context

Feature-scoped deep dives for agents working in this repo. Each file is verified against source, not the (previously stale) prose docs. Start from the root `CLAUDE.md` for the overview, then open the file for the area you're touching.

| File | Covers | Key files |
|------|--------|-----------|
| [state-management.md](./state-management.md) | The singleton store, the variable-burn invariant, style processing, loading/visibility state | `composables/useExamples.js`, `utils/styleProcessor.js`, `composables/useLoading.js`, `composables/useLayerControl.js` |
| [formats.md](./formats.md) | Format-handler dispatch, extent calculation per format, caching, projections | `formats/formatRegistry.js`, `formats/{flatgeobuf,geojson,geotiff}.js`, `utils/layerGenerator.js` |
| [code-editor.md](./code-editor.md) | ACE editor integration, debounce, focus-guarded reverse sync, folding | `components/CodeEditor.vue` |
| [map-view.md](./map-view.md) | The 4-path style watcher, layer sanitization, auto-fit, tooltips | `components/MapView.vue` |
| [layer-control.md](./layer-control.md) | Bidirectional form↔style sync, schema-vs-variable rebuild | `components/LayerControl.vue`, `components/MapButtons.vue` |
| [examples.md](./examples.md) | Example + style schema, URL params, dataset loading UI | `examples/*`, `components/MapToolbar.vue` |
| [issues.md](./issues.md) | **Known bugs + tech debt, verified.** Read before touching style/variable flow, format strings, or MapToolbar | repo-wide |

## The single most important fact

`updateCurrentStyle()` must reprocess from `currentExample.value.layers` (original, with `["var","key"]` refs intact), **never** from `dataLayers.value` (variables already burned in). See [state-management.md](./state-management.md). Most regressions in this codebase trace back to violating this.