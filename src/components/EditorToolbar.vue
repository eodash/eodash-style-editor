<template>
  <div class="editor-toolbar">
    <!-- Data Status Display -->
    <div class="toolbar-row main-toolbar">
      <div class="toolbar-content main-content">
        <span class="data-status" :class="{ 'has-data': currentDataName }">
          <svg
            v-if="currentDataName"
            class="data-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <title>vector-polyline</title>
            <path
              d="M2 3V9H4.95L6.95 15H6V21H12V16.41L17.41 11H22V5H16V9.57L10.59 15H9.06L7.06 9H8V3M4 5H6V7H4M18 7H20V9H18M8 17H10V19H8Z"
            />
          </svg>
          {{ currentDataName || 'No data loaded' }}
        </span>
      </div>
    </div>

    <!-- ACE Editor Toolbar -->
    <div class="toolbar-row editor-actions">
      <div class="toolbar-content"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useExamples } from '../composables/useExamples.js'

const { currentExample, dataLayers } = useExamples()

// Compute the current data name/path
const currentDataName = computed(() => {
  if (currentExample.value) {
    // If an example is loaded, show its name
    return currentExample.value.name
  } else if (dataLayers.value && dataLayers.value.length > 0) {
    // If custom data is loaded, try to extract filename from URL
    const firstLayer = dataLayers.value.find((layer) => layer.source?.url)
    if (firstLayer?.source?.url) {
      const url = firstLayer.source.url
      // Extract filename from URL path
      const filename = url.split('/').pop().split('?')[0]
      return filename || 'Custom data'
    }
  }
  return null
})
</script>

<style scoped>
/* Use EOxUI */
@import url('@eox/ui/style.css');

.editor-toolbar {
  position: fixed;
  top: 0;
  left: 0;
  width: calc(var(--sidebar-width, 300px) - 12px);
  height: 80px; /* Two rows of 40px each */
  z-index: 1000;
  display: flex;
  flex-direction: column;
  pointer-events: none; /* Allow clicks to pass through empty areas */
  background: white;
}

.toolbar-row {
  height: 40px;
  background: transparent;
  display: flex;
  align-items: center;
}

.toolbar-content {
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 8px;
  gap: 4px;
  pointer-events: auto; /* Re-enable pointer events for toolbar content */
}

.main-content {
  display: flex;
  justify-content: space-between;
  gap: 0;
}

.data-status {
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.5); /* Gray for "No data loaded" */
  user-select: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: calc(var(--sidebar-width, 300px) - 32px);
  display: flex;
  align-items: center;
  gap: 6px;
}

.data-status.has-data {
  color: #004170; /* EOX blue for loaded data */
  font-weight: 500; /* Medium weight */
}

.data-icon {
  width: 24px;
  height: 24px;
  fill: currentColor;
  flex-shrink: 0;
}

.icon-button {
  max-height: 32px;
  height: 32px;
  max-width: 32px;
  width: 32px;
  padding: 0;
  margin: 0;
  background: transparent !important;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.icon-button:hover {
  background: rgba(0, 0, 0, 0.05) !important;
}

.icon-button:active {
  background: rgba(0, 0, 0, 0.1) !important;
}

.icon-button .icon {
  width: 18px;
  height: 18px;
  fill: rgba(0, 0, 0, 0.7);
}

.toolbar-separator {
  width: 1px;
  height: 20px;
  background: rgba(0, 0, 0, 0.15);
  margin: 0 2px;
}

@media (prefers-color-scheme: dark) {
  .icon-button:hover {
    background: rgba(255, 255, 255, 0.1) !important;
  }

  .icon-button:active {
    background: rgba(255, 255, 255, 0.15) !important;
  }

  .icon-button .icon {
    fill: rgba(255, 255, 255, 0.8);
  }

  .toolbar-separator {
    background: rgba(255, 255, 255, 0.15);
  }

  .data-status {
    color: rgba(255, 255, 255, 0.5);
  }

  .data-status.has-data {
    color: #5a9fd4; /* Lighter EOX blue for dark mode */
  }
}
</style>
