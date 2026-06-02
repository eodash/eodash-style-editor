<template>
  <eox-layercontrol
    v-if="isLayerControlVisible"
    ref="layerControlRef"
    idProperty="id"
    titleProperty="title"
    :tools="['config', 'legend']"
    @change="handleGenericChange"
  ></eox-layercontrol>
</template>

<script setup>
import 'color-legend-element'
import { ref, watch, nextTick, onUnmounted } from 'vue'
import { useExamples } from '../composables/useExamples.js'

const layerControlRef = ref(null)
const { currentExampleStyle, updateCurrentStyle, dataLayers } = useExamples()
let isUpdatingFromLayerControl = false
let isMounted = true
const isLayerControlVisible = ref(true)
let mapRef = null // Store map reference for reconnection

// Store previous style to detect schema changes
const previousStyleState = ref({
  variables: null,
  jsonform: null
})

// Clean up on unmount
onUnmounted(() => {
  isMounted = false
})

const handleGenericChange = (event) => {
  try {
    // Skip if this change came from our own update
    if (isUpdatingFromLayerControl) return

    console.log('Form values changed:', event.detail)

    // Extract the form data from the event
    const formData = event.detail

    // Check if we have valid data and a current style
    if (!formData || !currentExampleStyle.value) {
      return
    }

    // Don't update if formData is empty - this would destroy existing variables
    if (Object.keys(formData).length === 0) {
      console.log('Form data is empty, skipping update to preserve variables')
      return
    }

    // Check if the form data is actually different from current variables
    const currentVariables = currentExampleStyle.value.variables || {}
    const hasChanges = Object.keys(formData).some(key =>
      formData[key] !== currentVariables[key]
    ) || Object.keys(currentVariables).some(key =>
      currentVariables[key] !== formData[key]
    )

    if (!hasChanges) {
      console.log('Form values unchanged, skipping update')
      return
    }

    // Mark that we're updating from layer control
    isUpdatingFromLayerControl = true

    // Create a new style object with updated variables
    const updatedStyle = {
      ...currentExampleStyle.value,
      variables: {
        ...formData  // Replace all variables with the new form data
      }
    }

    console.log('[LayerControl] currentExampleStyle.value:', currentExampleStyle.value)
    console.log('[LayerControl] updatedStyle:', updatedStyle)
    console.log('[LayerControl] updatedStyle.variables:', updatedStyle.variables)
    console.log('[LayerControl] updatedStyle["stroke-width"]:', updatedStyle['stroke-width'])

    // Update the current style which will propagate to all layers and the editor
    updateCurrentStyle(updatedStyle)

    console.log('[LayerControl] Style updated with new variables:', updatedStyle.variables)

    // Reset flag after a short delay
    setTimeout(() => {
      isUpdatingFromLayerControl = false
    }, 100)
  } catch (error) {
    console.error('Error in handleGenericChange:', error)
    isUpdatingFromLayerControl = false
  }
}

// Watch for style changes from the editor
watch(currentExampleStyle, async (newStyle) => {
  // Skip if the change came from the layer control itself
  if (isUpdatingFromLayerControl) return
  if (!newStyle) return

  // Initialize previous state on first load
  if (previousStyleState.value.variables === null && previousStyleState.value.jsonform === null) {
    previousStyleState.value = {
      variables: newStyle.variables ? JSON.parse(JSON.stringify(newStyle.variables)) : null,
      jsonform: newStyle.jsonform ? JSON.parse(JSON.stringify(newStyle.jsonform)) : null
    }
    return
  }

  // Check if jsonform (schema) changed - only recreate for schema changes
  const schemaChanged = JSON.stringify(newStyle.jsonform) !== JSON.stringify(previousStyleState.value.jsonform)

  if (schemaChanged) {
    // Update previous state
    previousStyleState.value = {
      variables: newStyle.variables ? JSON.parse(JSON.stringify(newStyle.variables)) : null,
      jsonform: newStyle.jsonform ? JSON.parse(JSON.stringify(newStyle.jsonform)) : null
    }

    // Wait for map layers to update first
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    // Remove and re-add layer control to force fresh instance
    isLayerControlVisible.value = false
    await nextTick()

    isLayerControlVisible.value = true
  } else {
    // For variable-only changes, just update the previous state
    previousStyleState.value.variables = newStyle.variables ? JSON.parse(JSON.stringify(newStyle.variables)) : null

    // Force layer control to refresh without destroying it
    await nextTick()
    if (layerControlRef.value?.requestUpdate) {
      layerControlRef.value.requestUpdate()
    }
  }
})

// Reconnect layer control when it becomes visible again after rebuild
watch(isLayerControlVisible, async (visible) => {
  if (visible && mapRef) {
    await nextTick()
    if (layerControlRef.value) {
      layerControlRef.value.for = mapRef
    }
  }
})

// Watch layerControlRef to store the map reference for reconnections
watch(layerControlRef, (newRef) => {
  if (newRef?.for && !mapRef) {
    mapRef = newRef.for
  }
})

defineExpose({ layerControlRef })
</script>

<style scoped>
/* No component-specific styles needed - positioning handled by parent */
</style>
