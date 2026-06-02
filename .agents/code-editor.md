# Code editor (ACE inside eox-jsonform)

File: `components/CodeEditor.vue`

The left sidebar's JSON style editor. It hosts an `eox-jsonform` whose single `code` field is a JSON-format ACE editor, but the component **bypasses jsonform's event system** and drives the raw ACE instance directly.

## Direct ACE access

```js
const aceEditor = containerRef.value
  ?.querySelector('eox-jsonform')
  ?.editor?.editors?.['root.code']?.['ace_editor_instance']
```

Grabbed in `setupAceEditor()` after `nextTick()` **plus a `setTimeout(…, 100)`** — jsonform builds ACE asynchronously, so the timeout is a readiness hack (not guaranteed; failure path logs and clears the loader). Listener is `aceEditor.on('change', handleDirectAceChange)`; removed in `onUnmounted` via `cleanupAceEditor()`.

## Forward sync (typing → store)

`handleDirectAceChange`:
1. Skips if `isUpdatingFromExternal` (the reverse-sync guard — prevents echo).
2. `JSON.parse(ace.getValue())`.
3. Valid → `debouncedStyleUpdate(newStyle)` — lodash `debounce(updateCurrentStyle, 650)`.
4. Invalid JSON → `debouncedStyleUpdate.cancel()` so a stale-but-valid pending update can't land mid-edit; `SyntaxError` is swallowed silently.

650 ms is the live-typing debounce — long enough to avoid reprocessing layers on every keystroke.

## Reverse sync (store → editor)

`watch(currentExampleStyle, …)` rewrites ACE content when the style changes elsewhere (layercontrol, example load, `?url=` load):
- **Skips entirely while `ace.isFocused()`** — the user's keystrokes have absolute priority over external writes. This is the rule that prevents the editor fighting the user.
- Sets `isUpdatingFromExternal = true`, preserves cursor + scroll, `setValue(stringify(newStyle), -1)`, resets undo history, then clears the flag after `setTimeout(…, 100)`.
- Content is compared first (`currentContent !== newContent`) to skip no-op writes.

Formatting everywhere uses `json-stringify-pretty-compact` with `{ maxLength: 80 }` (compact arrays/objects under 80 chars on one line) — keep this consistent or diffs churn.

## Folding

- `initializeDefaultFolds()` walks lines tracking brace depth and folds nested object/array properties (depth > 1) on load, so deep styles (e.g. the 294-line cerulean `legend`) open collapsed.
- ACE configured with `foldStyle: 'markbeginend'`, `behavioursEnabled: false` (the latter stops ACE auto-inserting/reformatting brackets, which would corrupt the JSON the user is typing).
- Toolbar buttons (inside this component's template, **not** a separate toolbar component): **Format** (`handleFormat` — pretty-print + re-fold, preserves cursor/scroll) and **Fold** (`handleFold` — unfold all, re-apply defaults).

## Responsive sizing

- `ResizeObserver` on the container updates `containerHeight`; `editorConfig` computed derives `maxPixelHeight`/`minLines` from it (`fontSize 15`, line-height ×1.4, min 200px / 10 lines). `maxLines: Infinity` lets content scroll.
- Theme follows `prefers-color-scheme`: `ace/theme/monokai` (dark) / `ace/theme/textmate` (light), via a `matchMedia` listener.

## Layout note

The component is `position: fixed`, width `calc(var(--sidebar-width) - 12px)`, and intentionally overshoots (`top:0; height: calc(100vh + 40px)`) so its own 40px-tall toolbar overlays the blank strip jsonform renders above the editor. `--sidebar-width` is set on `:root` by `App.vue`'s resize drag.

## Watch out

- The component is **saturated with `console.log`** in both handlers and the watcher — see [issues.md](./issues.md).
- The `setTimeout(100)` ACE-readiness assumption and the `isUpdatingFromExternal` 100 ms reset are timing-fragile; if sync ever double-fires or drops, suspect these.