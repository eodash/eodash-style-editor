<template>
  <eox-layercontrol
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

    // Update the current style which will propagate to all layers and the editor
    updateCurrentStyle(updatedStyle)

    console.log('Style updated with new variables:', updatedStyle.variables)

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
watch(currentExampleStyle, async (newStyle, oldStyle) => {
  // Skip if the change came from the layer control itself
  if (isUpdatingFromLayerControl) return

  // Skip if no layer control ref
  if (!layerControlRef.value) return

  // Skip if the entire style hasn't actually changed (prevent infinite loops)
  // This compares the full style object, not just variables
  const newStyleStr = JSON.stringify(newStyle || {})
  const oldStyleStr = JSON.stringify(oldStyle || {})
  if (newStyleStr === oldStyleStr) {
    return
  }

  console.log('Style changed from editor, variables:', newStyle?.variables)

  // Give the layers time to update first
  await nextTick()

  // Force the layer control to update with the new data
  // The requestUpdate() method is a Lit lifecycle method that forces a re-render
  if (isMounted && layerControlRef.value?.requestUpdate) {
    layerControlRef.value.requestUpdate()
    console.log('Triggered layer control update')
  }
})

// Watch for layer changes and force update if needed
watch(dataLayers, async (newLayers) => {
  // Skip if the change came from the layer control itself
  if (isUpdatingFromLayerControl) return

  console.log('Layers updated with new config')

  // Wait for DOM updates
  await nextTick()

  // Force layer control to re-read the layer configuration
  if (isMounted && layerControlRef.value?.requestUpdate) {
    layerControlRef.value.requestUpdate()
    console.log('Forced layer control refresh after layer update')
  }
}, { deep: true })

defineExpose({ layerControlRef })
</script>

<style scoped>
/* No component-specific styles needed - positioning handled by parent */
</style>
