# Layer control & map buttons

Files: `components/LayerControl.vue`, `components/MapButtons.vue`

`eox-layercontrol` shows the layer list plus a config form generated from the style's `jsonform` schema. The form lets users tweak `style.variables` with sliders/inputs; this component keeps that form and `currentExampleStyle` in sync **both ways**.

## Wiring

- Rendered by `App.vue` inside a `#layercontrol` floating card, shown/hidden via `useLayerControl().isLayerControlVisible` (toggled by the button in `MapButtons.vue`).
- `App.vue::connectLayerControl()` links the control to the map by setting `layerControlRef.for = mapComponent.mapRef` (after `nextTick`, re-run whenever the panel becomes visible).
- Tools enabled: `['config', 'legend']`. `idProperty="id"`, `titleProperty="title"`.

## Forward: form edit → store

`@change="handleGenericChange"` fires on form input:
1. Bail if `isUpdatingFromLayerControl` (echo guard) or no `currentExampleStyle`.
2. Bail if `event.detail` is empty (would wipe variables) or if values equal current `style.variables` (no real change).
3. Build `updatedStyle = { ...currentExampleStyle, variables: { ...formData } }` and call `updateCurrentStyle(updatedStyle)`.
4. Set `isUpdatingFromLayerControl = true`, reset after `setTimeout(…, 100)`.

The new variables flow through the store and reach the editor and map via the normal style fan-out.

## Reverse: store → control

`watch(currentExampleStyle, …)` distinguishes two change kinds using `previousStyleState` (cached `variables` + `jsonform`):

- **Schema (`jsonform`) changed** → the form structure itself differs. Force a **full teardown**: set local `isLayerControlVisible=false`, `nextTick`, set it back `true` → `eox-layercontrol` is destroyed and recreated fresh (with a 100 ms settle delay first). Reconnects `.for = mapRef` on the visibility watcher afterward.
- **Variables only** → no rebuild; call `layerControlRef.value.requestUpdate()` to re-render with new values.

Schema changes are rare (they mean the style's `jsonform` block was edited); the rebuild is the heavy path and the reason teardown/reconnect logic exists.

## Naming trap

This component has its **own local** `const isLayerControlVisible = ref(true)` used purely for the teardown-toggle above. It **shadows the name** of the global `useLayerControl().isLayerControlVisible` (panel show/hide) but is a different ref. Don't conflate them. Flagged in [issues.md](./issues.md).

## MapButtons.vue

Thin: one button bound to `useLayerControl().toggleLayerControl`, swapping a layers / layers-off MDI icon on `isLayerControlVisible`. Fixed top-right. Contains a large commented-out CSS block (dead).
