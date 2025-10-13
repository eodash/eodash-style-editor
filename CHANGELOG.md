# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

<!--
Available headings for changelog entries:
- **Added** - for new features
- **Changed** - for changes in existing functionality
- **Deprecated** - for soon-to-be removed features
- **Removed** - for now removed features
- **Fixed** - for any bug fixes
- **Security** - in case of vulnerabilities
-->

## [0.1.0] - 2025-01-12

### Added
- Vue 3 + Vite application with EOX web components integration
- Interactive map component using @eox/map (OpenLayers-based)
- Code editor with ACE integration via @eox/jsonform component
- Layer control panel for managing map layers (@eox/layercontrol)
- Resizable sidebar with drag-to-resize functionality using mouse events
- Responsive ACE editor with dynamic sizing based on container height
- Local IBM Plex Mono font integration for code editor
- FlatGeoBuf (.fgb) data format support with automatic extent calculation
- Greenland Ice Thickness example with complex styling and variable support
- URL query parameter support (?example=greenland-ice-thickness) for auto-loading examples
- Format registry system for extensible data format handling
- Layer generation utilities for creating eox-map compatible layers
- Style variable preprocessing system for OpenLayers expression support
- Git commit guidelines with Keep a Changelog format requirements

### Changed
- Example structure now includes id, name, and format fields
- Layer control initialization to always render (hidden when not visible) for proper eox-map integration
- Layer styling pipeline to process variables before applying to map
- Example naming from "Cerulean FGB" to "Greenland Ice Thickness"

### Fixed
- FlatGeoBuf extent calculation and automatic map centering
- Layer styling persistence during code editor changes
- Invalid nested expressions in style configuration (["get", ["var", "key"]] patterns)
- Layer sanitization logic to preserve essential properties for eox-map
- Style variable preprocessing to correctly replace ["var", "key"] expressions with actual values
- Layer colors now display correctly on both initial load and during style editing
- Layer ID assignment in format registry for proper eox-map layer identification

### Technical Achievements
- Implemented prototype-based format handler pattern for extensible data processing
- Created complete layerConfig setup with schema, style, and legend properties for eox-map compatibility
- Established proper Vue 3 Composition API integration with web components
- Built responsive layout system with fixed positioning for complex UI arrangements
- Integrated ESLint + Prettier with auto-formatting on save
- Set up development workflow with hot module replacement via Vite