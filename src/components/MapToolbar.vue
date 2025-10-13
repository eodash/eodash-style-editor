<template>
  <div class="map-toolbar">
    <div class="row no-gap">
      <nav class="group connected primary-container">
        <button
          class="primary left-round small"
          style="
            background: #004170bb !important;
            backdrop-filter: blur(10px);
            color: #fff !important;
          "
        >
          <svg
            class="data-icon"
            style="transform: scale(0.8) translateX(2px)"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <title>vector-polyline</title>
            <path
              d="M2 3V9H4.95L6.95 15H6V21H12V16.41L17.41 11H22V5H16V9.57L10.59 15H9.06L7.06 9H8V3M4 5H6V7H4M18 7H20V9H18M8 17H10V19H8Z"
            />
          </svg>
          <span v-if="currentDataName" class="max data-filename">{{ currentDataName }}</span>
          <span v-else class="data-no-file">No data loaded</span>
        </button>
        <!-- URL Input Mode -->
        <div v-if="isUrlInputMode" class="url-input-group">
          <input
            v-model="urlInput"
            type="url"
            placeholder="Enter dataset URL..."
            class="url-input"
            @keyup.enter="loadUrlData"
            @keyup.escape="cancelUrlInput"
            :disabled="isLoadingUrl"
          />
          <button
            class="primary small"
            @click="loadUrlData"
            :disabled="!urlInput || isLoadingUrl"
            style="
              background: #004170bb !important;
              backdrop-filter: blur(10px);
              color: #fff !important;
            "
          >
            {{ isLoadingUrl ? 'Loading...' : 'Load' }}
          </button>
          <button
            class="secondary small"
            @click="cancelUrlInput"
            :disabled="isLoadingUrl"
            style="
              background: #004170bb !important;
              backdrop-filter: blur(10px);
              color: #fff !important;
            "
          >
            Cancel
          </button>
        </div>

        <!-- Default Button -->
        <button
          v-else
          ref="dropdownButtonRef"
          class="primary right-round small"
          @click="enterUrlInputMode"
          style="
            background: #004170bb !important;
            backdrop-filter: blur(10px);
            color: #fff !important;
          "
        >
          Load new dataset
        </button>
      </nav>
    </div>

    <div class="dropdown-container">
      <nav class="group connected primary-container">
        <button
          ref="dropdownButtonRef"
          class="primary round small"
          @click="toggleDropdown"
          :class="{ active: isDropdownOpen }"
          style="
            background: #004170bb !important;
            backdrop-filter: blur(10px);
            color: #fff !important;
          "
        >
          Examples
          <i class="dropdown-arrow"
            ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <title>chevron-down</title>
              <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" /></svg
          ></i>
        </button>
      </nav>

      <Teleport to="body">
        <div v-if="isDropdownOpen" class="dropdown-menu" :style="dropdownPosition" @click.stop>
          <div
            v-for="example in examples"
            :key="example.id || example.name"
            class="dropdown-item"
            @click="selectExample(example)"
          >
            {{ example.name }}
            <span v-if="example.format" class="format-tag">{{ example.format.toUpperCase() }}</span>
          </div>
        </div>
      </Teleport>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import examples from '../examples/examples.js'
import { useExamples } from '../composables/useExamples.js'
import { validateDataUrl, detectDataFormat } from '../utils/layerGenerator.js'

const isDropdownOpen = ref(false)
const dropdownButtonRef = ref(null)
const dropdownPosition = ref({})
const { setCurrentExample, currentExample, dataLayers, currentExampleStyle, clearCurrentExample, setCustomDataLayers } = useExamples()

// URL input mode state
const isUrlInputMode = ref(false)
const urlInput = ref('')
const isLoadingUrl = ref(false)
const urlError = ref('')

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

// Handle import data button click
const handleImportData = () => {
  // TODO: Implement file picker dialog
  console.log('Import data clicked')
  // For now, just log - actual implementation would open a file picker
  // or modal dialog for importing data
}

// URL input mode functions
const enterUrlInputMode = () => {
  isUrlInputMode.value = true
  urlInput.value = ''
  urlError.value = ''
  // Focus the input after the next tick
  setTimeout(() => {
    const input = document.querySelector('.url-input')
    if (input) input.focus()
  }, 50)
}

const cancelUrlInput = () => {
  isUrlInputMode.value = false
  urlInput.value = ''
  urlError.value = ''
  isLoadingUrl.value = false
}

const loadUrlData = async () => {
  if (!urlInput.value || isLoadingUrl.value) return

  isLoadingUrl.value = true
  urlError.value = ''

  try {
    // Validate URL format
    let validUrl
    try {
      validUrl = new URL(urlInput.value)
    } catch {
      throw new Error('Invalid URL format')
    }

    // Validate that the URL is accessible
    const isValid = await validateDataUrl(urlInput.value)
    if (!isValid) {
      throw new Error('Unable to access the URL. Please check if the URL is correct and accessible.')
    }

    // Detect data format
    const format = detectDataFormat(urlInput.value)

    // Extract filename from URL for display
    const filename = urlInput.value.split('/').pop().split('?')[0] || 'Custom dataset'

    // Generate the new layer matching the example structure
    const layerId = `custom-layer-${Date.now()}`
    const newLayer = {
      type: format === 'GeoTIFF' ? 'WebGLTile' : 'Vector',
      id: layerId, // Add id at root level too
      properties: {
        id: layerId,
        title: filename,
        visible: true
      },
      source: {
        type: format === 'GeoTIFF' ? 'GeoTIFF' : 'Vector',
        url: urlInput.value,
        format: format === 'GeoTIFF' ? undefined : format
      },
      // Add a basic style for vector layers
      style: format !== 'GeoTIFF' ? {
        'stroke-color': '#007bff',
        'stroke-width': 2,
        'fill-color': 'rgba(0, 123, 255, 0.2)'
      } : undefined
    }

    // Use the new setCustomDataLayers function to handle the layer
    // MapView will add OSM base layer automatically
    await setCustomDataLayers([newLayer])

    // Update URL with the data URL parameter (mutually exclusive with example)
    const url = new URL(window.location)
    url.searchParams.delete('example') // Remove example param if it exists
    url.searchParams.set('url', urlInput.value)
    window.history.pushState({}, '', url)

    // Exit input mode
    isUrlInputMode.value = false
    const loadedUrl = urlInput.value // Store before clearing
    urlInput.value = ''

    console.log(`Successfully loaded data from: ${loadedUrl}`)
  } catch (error) {
    console.error('Error loading URL data:', error)
    urlError.value = error.message || 'Failed to load data from URL'
    // You might want to show this error in the UI
    alert(urlError.value)
  } finally {
    isLoadingUrl.value = false
  }
}

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value

  // Calculate position ONCE when opening, not reactively
  if (isDropdownOpen.value && dropdownButtonRef.value) {
    const buttonRect = dropdownButtonRef.value.getBoundingClientRect()
    dropdownPosition.value = {
      position: 'fixed',
      top: `${buttonRect.bottom + 8}px`,
      right: `${window.innerWidth - buttonRect.right}px`,
      minWidth: '200px',
    }
  } else {
    dropdownPosition.value = {}
  }
}

const closeDropdownOnClickOutside = (event) => {
  if (!event.target.closest('.dropdown-container')) {
    isDropdownOpen.value = false
  }
}

// Auto-load from URL query parameters (example or url)
const autoSelectFromURL = async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const exampleParam = urlParams.get('example')
  const urlParam = urlParams.get('url')

  // URL parameter takes precedence over example
  if (urlParam) {
    // Load custom URL data
    try {
      // Validate URL format
      let validUrl
      try {
        validUrl = new URL(urlParam)
      } catch {
        console.error('Invalid URL format in query parameter:', urlParam)
        return
      }

      // Validate that the URL is accessible
      const isValid = await validateDataUrl(urlParam)
      if (!isValid) {
        console.error('Unable to access URL from query parameter:', urlParam)
        return
      }

      // Detect data format
      const format = detectDataFormat(urlParam)

      // Extract filename from URL for display
      const filename = urlParam.split('/').pop().split('?')[0] || 'Custom dataset'

      // Generate the new layer
      const layerId = `custom-layer-${Date.now()}`
      const newLayer = {
        type: format === 'GeoTIFF' ? 'WebGLTile' : 'Vector',
        id: layerId,
        properties: {
          id: layerId,
          title: filename,
          visible: true
        },
        source: {
          type: format === 'GeoTIFF' ? 'GeoTIFF' : 'Vector',
          url: urlParam,
          format: format === 'GeoTIFF' ? undefined : format
        },
        style: format !== 'GeoTIFF' ? {
          'stroke-color': '#007bff',
          'stroke-width': 2,
          'fill-color': 'rgba(0, 123, 255, 0.2)'
        } : undefined
      }

      // Load the custom data layer
      await setCustomDataLayers([newLayer])
      console.log(`Auto-loaded data from URL parameter: ${urlParam}`)
    } catch (error) {
      console.error('Error auto-loading URL data:', error)
    }
  } else if (exampleParam) {
    // Find example by ID
    const example = examples.find((ex) => ex.id === exampleParam)

    if (example) {
      setCurrentExample(example)
    } else {
      console.warn(
        `Example "${exampleParam}" not found. Available examples:`,
        examples.map((ex) => ex.name),
      )
    }
  }
}

// Update URL when example is selected
const selectExample = (example) => {
  isDropdownOpen.value = false
  setCurrentExample(example)

  // Set URL parameter using example ID (mutually exclusive with url param)
  const url = new URL(window.location)
  url.searchParams.delete('url') // Remove url param if it exists
  if (example.id) {
    url.searchParams.set('example', example.id)
  } else {
    url.searchParams.delete('example')
  }
  window.history.pushState({}, '', url)
}

onMounted(() => {
  document.addEventListener('click', closeDropdownOnClickOutside)
  autoSelectFromURL()
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdownOnClickOutside)
})
</script>

<style scoped>
/* This import is a must for any components that utilize EOxUI */
@import url('@eox/ui/style.css');

.map-toolbar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  z-index: 5000;
}

/* Data status button styling */
.data-status-button {
  min-width: 140px;
  max-width: 280px;
  cursor: default !important;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95) !important;
}

.data-filename {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.data-no-file {
  color: var(--on-surface-variant);
  font-style: italic;
}

/* Button transparency and blur styling */
.map-toolbar button {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  background: #004170ee !important;
}

.map-toolbar button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.map-toolbar .data-status-button:hover {
  transform: none !important;
  box-shadow: none !important;
}

@media (prefers-color-scheme: dark) {
  .map-toolbar button {
    background: rgba(30, 30, 30, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff;
  }

  .map-toolbar button:hover:not(:disabled) {
    background: rgba(45, 45, 45, 0.9);
  }

  .data-status-button {
    background: rgba(40, 40, 40, 0.95) !important;
  }
}

/* MDI Icon styling */
.mdi-icon {
  width: 20px;
  height: 20px;
  fill: currentColor;
  vertical-align: middle;
}

.dropdown-container {
  position: relative;
}

.dropdown-arrow {
  margin-left: 8px;
  font-size: 12px;
  transition: transform 0.2s ease;
}

button.active .dropdown-arrow {
  transform: rotate(180deg);
}

.dropdown-menu {
  background: #ffffff;
  border: 2px solid #007bff;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  overflow: hidden;
}

.dropdown-item {
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  color: #333;
  font-size: 14px;
  line-height: 1.4;
  white-space: nowrap;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background: rgba(0, 0, 0, 0.05);
}

.dropdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.format-tag {
  font-size: 10px;
  background: #007bff;
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-weight: bold;
  margin-left: 8px;
}

@media (prefers-color-scheme: dark) {
  .dropdown-menu {
    background: rgba(45, 45, 45, 0.95);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .dropdown-item {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff;
  }

  .dropdown-item:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}

/* URL Input Styling */
.url-input-group {
  display: flex;
  gap: 8px;
  align-items: center;
  flex: 1;
  max-width: 400px;
}

.url-input {
  flex: 1;
  padding: 8px 12px;
  border: 2px solid #007bff;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;
  color: #333;
}

.url-input:focus {
  border-color: #0056b3;
}

.url-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.url-input::placeholder {
  color: #999;
}

@media (prefers-color-scheme: dark) {
  .url-input {
    background: rgba(30, 30, 30, 0.95);
    color: #fff;
    border-color: rgba(255, 255, 255, 0.2);
  }

  .url-input:focus {
    border-color: #007bff;
  }

  .url-input::placeholder {
    color: #666;
  }
}

/* Ensure buttons in URL input group align properly */
.url-input-group button {
  white-space: nowrap;
  min-width: fit-content;
}
</style>
