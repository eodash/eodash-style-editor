# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm run dev`
- **Build for production**: `npm run build`
- **Preview production build**: `npm run preview`
- **Lint code**: `npm run lint` (auto-fixes issues)
- **Format code**: `npm run format`

## Project Architecture

This is a Vue 3 + Vite application that provides a style editor for geospatial data visualization using EOX web components.

### Core Components

The application is built around three main EOX web components:
- `@eox/map` - Interactive map component (OpenLayers-based)
- `@eox/layercontrol` - Layer management UI
- `@eox/jsonform` - Form component with code editor capabilities

### Application Structure

- **Main Layout** (`src/App.vue`): Split-pane interface with resizable sidebar
  - Left sidebar: Contains code editor (via `eox-jsonform`) and fixed overlay toolbar
  - Right main area: Map view (`eox-map`)
  - Top-right overlay: Layer control panel (`eox-layercontrol`)

- **Sidebar Resizing**: Custom drag-to-resize implementation using mouse events and `requestAnimationFrame`
  - CSS variable `--sidebar-width` is updated on document root for global access
  - Fixed positioned components (EditorToolbar, CodeEditor) respond to width changes

### Fixed Positioning Architecture

**EditorToolbar.vue**:
- `position: fixed` with `z-index: 1000`
- Two-row overlay (80px total height) with white background
- Top row: Logo text and settings icon (space-between layout)
- Bottom row: Editor action buttons (copy, paste, etc.)
- Width responds to `--sidebar-width` CSS variable
- `pointer-events: none` on container, `pointer-events: auto` on content

**CodeEditor.vue**:
- `position: fixed` starting at `top: 40px` (overlaps toolbar by 40px to hide eox-jsonform whitespace)
- Height: `calc(100vh - 80px)` to account for toolbar
- Width responds to `--sidebar-width` CSS variable
- No padding - toolbar overlays the blank eox-jsonform space

### Style Examples System

Examples are organized in `src/examples/`:
- Each example exports name, dataUrl, and style configuration
- Style definitions are stored as JSON files (e.g., `cerulean/style.json`)
- Examples are aggregated in `src/examples/examples.js`

**Example Loading Architecture:**
- `useExamples.js` composable manages example state reactively
- MapToolbar dropdown triggers example selection via `setCurrentExample()`
- MapView component dynamically adds layers using format registry system
- CodeEditor displays example styles as formatted JSON in ACE editor with real-time updates
- Format handlers process layers with specialized logic (e.g., FGB extent calculation)

**Data Format Support:**
- **FlatGeobuf** (`.fgb`) - Efficient binary vector format
- **GeoJSON** (`.geojson`, `.json`) - Standard vector format
- **GeoTIFF** (`.tif`, `.tiff`, `.geotiff`) - Raster imagery format
- Auto-detection based on URL/file extension with fallback to GeoJSON

### Format Registry System

**Architecture (`src/formats/formatRegistry.js`):**
- Prototype-based handler pattern using Object.create()
- HashMap registry for format-specific processing logic
- Extensible design for adding new format handlers

**Format Handlers:**
- `FormatHandler` - Base prototype with `processLayer()` and `supports()` methods
- `FlatGeoBufHandler` - Specialized handler that calculates FGB extents using `getFgbExtent()`
- `DefaultHandler` - Fallback for unsupported formats

**Key Functions:**
- `processLayers(layers, editorStyle)` - Processes layers with format handlers and applies editor style
- `getFormatHandler(sourceType)` - Returns appropriate handler for
- `registerFormatHandler(sourceType, handler)` - Registers new format handlers

**Benefits:**
- Eliminates duplicate URL fetching (extent calculation reuses layer data)
- Clean separation of format-specific logic
- Editor style always overrides example/layer styles
- Easy to extend for new data formats

**FGB Processing Details:**
- `getFgbExtent()` handles FlatGeoBuf deserialization correctly (iterates over features, not featureCollection.features)
- Transforms coordinates from EPSG:4326 to EPSG:3857 for proper extent calculation
- Robust error handling for malformed, empty, or inaccessible FGB data
- Graceful fallback when extent calculation fails - layers still load without extent

### Key Technical Details

- **Vite Configuration**: Optimizes EOX dependencies, uses `@` alias for `src/`
- **Component Lifecycle**: Uses `onMounted` + `nextTick` to ensure DOM ready before connecting layer control to map
- **Web Component Integration**: Direct property assignment for eox-map layers to avoid Vue attribute coercion
- **Layer Sanitization**: Deep clones layers to remove Vue reactivity proxies and ensures all layers have required properties for eox-map compatibility
- **Style Compatibility**: Detects complex custom styles and removes them to prevent OpenLayers errors, allowing eox-map to use default styling
- **Styling**: Mix of scoped component styles and fixed positioning for complex layout

### Style Management Flow

**Editor as Source of Truth:**
- CodeEditor captures real-time changes via direct ACE editor access
- `handleDirectAceChange()` parses JSON and calls `updateCurrentStyle()` on valid changes
- `useExamples.updateCurrentStyle()` re-processes layers with new style
- Both new layer definitions and legacy layers receive editor style override

**Bidirectional Synchronization:**
- LayerControl form changes update style variables via `handleGenericChange` event handler
- CodeEditor watcher responds to external style changes and updates ACE editor content
- Variables are stored in `layerConfig.style.variables` for proper eox-layercontrol integration

**Style Update Sequence:**
1. **Initial Load**: Example style → editor → layers (with format processing)
2. **User Edit**: Editor change → JSON parse → `updateCurrentStyle()` → layer re-processing
3. **Layer Update**: Format handlers apply editor style override to all data layers
4. **Map Refresh**: MapView computed property triggers with updated layers

**Key Functions:**
- `setCurrentExample(example)` - Loads example and applies editor style to layers
- `updateCurrentStyle(newStyle)` - Re-processes all layers with new editor style
- `processLayers(layers, editorStyle)` - Applies editor style override during format processing

### ACE Editor Integration

**Direct ACE Access Pattern:**
- Uses `querySelector("eox-jsonform").editor.editors["root.code"]["ace_editor_instance"]` for direct access
- Bypasses eox-jsonform event system for better performance and control
- Immediate folding application prevents Flash of Unwanted Structure (FOUS)

**Code Folding Management:**
- `initializeDefaultFolds()` - Collapses JSON sections at depth > 1 immediately
- `collapseAllExcept(exemptRange)` - Auto-collapse behavior when expanding sections
- `handleFoldChange()` - Tracks fold state changes for interactive behavior
- **No delays**: Folding applied immediately to prevent visual glitches

**Responsive Configuration:**
- CodeEditor uses ResizeObserver for dynamic dimension tracking
- ACE config calculated from container height: `fontSize * 1.4` line-height ratio
- Reactive `maxLines` and `maxPixelHeight` based on available space
- Font configuration: `fontSize: 15, fontFamily: "'IBM Plex Mono'"`
- Minimum constraints: 200px height, 10 lines to ensure usability
- Theme switching: monokai (dark) / textmate (light) based on system preference

**Implementation Pattern:**
```javascript
const editorConfig = computed(() => {
  const fontSize = 14
  const lineHeight = Math.ceil(fontSize * 1.4)
  const availableHeight = containerHeight.value - padding
  const maxLines = Math.floor(availableHeight / lineHeight)

  return {
    maxPixelHeight: Math.max(200, availableHeight),
    maxLines: Math.max(10, maxLines),
    // ... other config
  }
})
```

**Event Handling:**
- **Debounced Updates**: 650ms debounce using lodash/debounce to prevent excessive style updates while typing
- **Real-time Feedback**: ACE editor `change` events provide immediate response without overwhelming the system
- **Focus Control**: Available via `.textInput.getElement().focus()` for programmatic focus management
- **Error Handling**: Graceful handling of JSON parse errors during editing (silently ignored until valid)

## Dependencies

### EOX Components
- `@eox/map`: Map visualization with dynamic layer support
- `@eox/layercontrol`: Layer management UI
- `@eox/jsonform`: Form/code editor with ACE integration

**EOX Map Layer Configuration:**
- Supports multiple layer types: Vector (for geospatial vectors) and WebGLTile (for rasters)
- Base layers (OSM) + dynamic example layers managed through reactive arrays
- Layer structure: `{ type, source: { type, url, format }, id, title, style, properties }`
- **Deduplication Logic**: Automatically detects and prevents duplicate base layers (e.g., OSM) when examples include their own base layers
- **Vue Integration**: Uses direct property assignment (`mapRef.value.layers = layersArray`) to avoid Vue coercing arrays to strings in web components

**Layer Generation Utilities (`src/utils/layerGenerator.js`):**
- `detectDataFormat(url)` - Auto-detects format from URL/extension
- `generateLayerSource(url, format)` - Creates appropriate source config
- `generateMapLayer(options)` - Complete layer with styling and properties
- `validateDataUrl(url)` - Async URL accessibility validation

**Usage Pattern:**
```javascript
const layer = generateMapLayer({
  dataUrl: 'https://example.com/data.fgb',
  name: 'My Layer',
  style: { /* EOX style config */ },
  id: 'custom-layer-id'
})
```

### Development Stack
- Vue 3 with Composition API
- Vite for build tooling
- ESLint + Prettier for code quality
- Vue DevTools integration

## IDE Setup

Recommended VS Code extensions (see `.vscode/extensions.json`):
- Vue.volar (Vue language support)
- ESLint
- Prettier
- EditorConfig

Auto-formatting and ESLint fixes on save are enabled by default.

## Development Philosophy

**KISS Principle**: Start simple, iterate based on evidence, avoid over-engineering upfront.

1. Log actual data structures before building complex logic
2. Make minimal, testable changes
3. Refine based on real behavior, not assumptions

## Project-wide Guidelines

- Search for information selectively to keep the context window small
- Search relevant `eox-` prefixed dependencies to get more detailed information about how the general components work internally, if you hit a wall with the code within this repository
- When debugging layout issues, remember that EditorToolbar and CodeEditor use fixed positioning and respond to `--sidebar-width` CSS variable changes
- For ACE editor issues, use direct access pattern rather than trying to work through eox-jsonform events
- Apply code folding immediately without delays to prevent visual glitches

## Git Commit Guidelines

When creating git commits, follow these conventions:

### Commit Message Format
- **Main semantic commit line**: Use lowercase only (e.g., `feat: add new feature`, `fix: resolve styling issue`)
- **Structure**: `<type>: <description>` where type is lowercase (feat, fix, docs, style, refactor, test, chore)

### Changelog Format
Use [Keep a Changelog](https://keepachangelog.com/) format for detailing changes in commits:

```
- **Added** - for new features
- **Changed** - for changes in existing functionality
- **Deprecated** - for soon-to-be removed features
- **Removed** - for now removed features
- **Fixed** - for any bug fixes
- **Security** - in case of vulnerabilities
```

### Example Commit Message
```
fix: resolve layer styling persistence during editing

**Fixed:**
- Layer colors now persist when editing styles in code editor
- Variable preprocessing correctly replaces ["var", "key"] expressions
- Style updates maintain proper eox-map layer configuration

**Added:**
- updateVectorLayerStyle function for processing style variables
- Variable preprocessing in formatRegistry and useExamples composables

**Changed:**
- Layer styling pipeline now processes variables before applying to map
```

## Important Instructions

Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.
