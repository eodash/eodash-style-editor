<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'

import MapView from './components/MapView.vue'
import LayerControl from './components/LayerControl.vue'
import CodeEditor from './components/CodeEditor.vue'
import MapToolbar from './components/MapToolbar.vue'
import MapButtons from './components/MapButtons.vue'
import { useLayerControl } from './composables/useLayerControl.js'

import '@eox/map'
import '@eox/map/dist/eox-map-advanced-layers-and-sources.js'
import '@eox/layercontrol'
import '@eox/jsonform'

const mapComponent = ref(null)
const layerControlComponent = ref(null)
const asideWidth = ref(300)

// Layer control visibility
const { isLayerControlVisible } = useLayerControl()
const isDragging = ref(false)
let animationId = null

const startResize = () => {
  isDragging.value = true
  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
}

const handleResize = (e) => {
  if (!isDragging.value) return

  // Cancel previous animation frame
  if (animationId) {
    cancelAnimationFrame(animationId)
  }

  // Use requestAnimationFrame for smooth updates
  animationId = requestAnimationFrame(() => {
    const newWidth = Math.max(200, Math.min(800, e.clientX))
    asideWidth.value = newWidth
    animationId = null
  })
}

const stopResize = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
  document.body.style.cursor = 'default'
  document.body.style.userSelect = 'auto'

  // Cancel any pending animation frame
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
}

// Connect LayerControl to map whenever both are available
const connectLayerControl = async () => {
  await nextTick()
  if (layerControlComponent.value?.layerControlRef && mapComponent.value?.mapRef) {
    layerControlComponent.value.layerControlRef.for = mapComponent.value.mapRef
  }
}

onMounted(connectLayerControl)

// Watch for LayerControl visibility changes and connect when it becomes visible
watch(isLayerControlVisible, (isVisible) => {
  if (isVisible) {
    // Wait a tick for the component to be rendered
    nextTick(() => {
      connectLayerControl()
    })
  }
})

// Update CSS variable on document root when sidebar width changes
watch(asideWidth, (newWidth) => {
  document.documentElement.style.setProperty('--sidebar-width', newWidth + 'px')
}, { immediate: true })
</script>

<template>
  <header></header>

  <div id="layercontrol" class="card" :style="{ display: isLayerControlVisible ? 'block' : 'none' }">
    <LayerControl ref="layerControlComponent" />
  </div>

  <MapButtons />

  <aside :style="{ width: asideWidth + 'px' }">
    <div class="sidebar-content">
      <CodeEditor />
    </div>
    <div class="resize-handle" @mousedown="startResize"></div>
  </aside>

  <div
    id="map"
    :style="{
      left: asideWidth + 'px',
      width: `calc(100vw - ${asideWidth}px)`,
      '--sidebar-width': asideWidth + 'px',
    }"
  >
    <MapView ref="mapComponent" />
    <MapToolbar />
  </div>
</template>

<style scoped>
/* This import is a must for any components that utilize EOxUI */
@import url('@eox/ui/style.css');
/* Import local IBM Plex Mono font */
@import url('./fonts/fonts.css');

#map {
  position: fixed;
  top: 0;
  bottom: 0;
  transition: none;
}

#layercontrol {
  position: fixed;
  right: 60px;
  top: 70px;
  width: 300px;
  height: 400px;
  z-index: 2000;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  overflow: hidden; /* Ensure content respects border-radius */
  overflow-y: auto; /* Allow vertical scrolling for content */
  padding: 8px 6px 16px 6px; /* Give the content some breathing room, extra bottom for scrolling */

  /* Light theme */
  background: rgba(var(--eox-theme-light-surface-container), 0.9);
  color: rgb(var(--eox-theme-light-on-surface));
  border: 1px solid rgba(var(--eox-theme-light-outline-variant), 0.3);

  /* Set CSS variables for internal components */
  --surface: var(--eox-theme-light-surface);
  --on-surface: var(--eox-theme-light-on-surface);
  --surface-container: var(--eox-theme-light-surface-container);
  --on-surface-container: var(--eox-theme-light-on-surface);
  --primary: var(--eox-theme-light-primary);
  --on-primary: var(--eox-theme-light-on-primary);
  --outline: var(--eox-theme-light-outline);
  --outline-variant: var(--eox-theme-light-outline-variant);
}

@media (prefers-color-scheme: dark) {
  #layercontrol {
    /* Dark theme */
    background: rgba(var(--eox-theme-dark-surface-container), 0.9);
    color: rgb(var(--eox-theme-dark-on-surface));
    border: 1px solid rgba(var(--eox-theme-dark-outline-variant), 0.3);

    /* Set CSS variables for internal components */
    --surface: var(--eox-theme-dark-surface);
    --on-surface: var(--eox-theme-dark-on-surface);
    --surface-container: var(--eox-theme-dark-surface-container);
    --on-surface-container: var(--eox-theme-dark-on-surface);
    --primary: var(--eox-theme-dark-primary);
    --on-primary: var(--eox-theme-dark-on-primary);
    --outline: var(--eox-theme-dark-outline);
    --outline-variant: var(--eox-theme-dark-outline-variant);
  }
}

aside {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  background: #fff;
  transition: none;
  display: flex;
  flex-direction: row;
}

@media (prefers-color-scheme: dark) {
  aside {
    background: #1e1e1e;
    color: #fff;
  }

  .resize-handle {
    background: rgba(255, 255, 255, 0.05);
  }

  .resize-handle::before {
    background: #666;
  }

  .resize-handle:hover {
    background: rgba(255, 255, 255, 0.08);
  }

  .resize-handle:hover::before {
    background: #888;
  }
}

.sidebar-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.resize-handle {
  position: relative;
  top: 0;
  bottom: 0;
  width: 12px;
  background: rgba(0, 0, 0, 0.05);
  cursor: col-resize;
  transition: all 0.2s ease;
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.resize-handle::before {
  content: '';
  width: 3px;
  height: 80px;
  background: #999;
  border-radius: 2px;
}

.resize-handle:hover {
  background: rgba(0, 0, 0, 0.08);
}

.resize-handle:hover::before {
  background: #777;
}

.flex-grow {
  flex: 1;
  min-height: 0;
}
</style>
