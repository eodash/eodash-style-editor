import { ref, computed } from 'vue'
import { generateMapLayer, detectDataFormat } from '../utils/layerGenerator.js'
import { processLayers } from '../formats/formatRegistry.js'
import { updateVectorLayerStyle } from '../utils/styleProcessor.js'
import { useLoading } from './useLoading.js'

const currentExample = ref(null)
const currentExampleStyle = ref(null)
const dataLayers = ref([])

const { startMapLoading, stopMapLoading } = useLoading()

export function useExamples() {
  const setCurrentExample = async (example) => {
    console.log('[useExamples] setCurrentExample called for:', example.name)
    console.log('[useExamples] example.layers:', example.layers)
    startMapLoading()

    currentExample.value = example
    currentExampleStyle.value =
      typeof example.style === 'string' ? JSON.parse(example.style) : example.style

if (example) {
      if (example.layers) {
        console.log('[useExamples] Using new layer format, calling processLayers with', example.layers.length, 'layers')
// Use the new layer definitions with format registry, applying editor style
        // processLayers already handles style application correctly for all layer types
        const processedLayers = await processLayers(example.layers, currentExampleStyle.value)
        console.log('[useExamples] processLayers returned', processedLayers.length, 'layers')
        dataLayers.value = processedLayers
        console.log('[useExamples] dataLayers.value set')
      } else {
        // Fallback to legacy approach
        const format = detectDataFormat(example.dataUrl)

        const layer = generateMapLayer({
          dataUrl: example.dataUrl,
          name: example.name,
          style: currentExampleStyle.value,
          id: 'example-layer',
          format: format,
        })

        dataLayers.value = [layer]
      }
    } else {
      dataLayers.value = []
    }

    // Stop loading after a brief delay to let map update
    setTimeout(() => {
      stopMapLoading()
    }, 1000)
  }

  const addLayer = (layerConfig) => {
    const layer = generateMapLayer(layerConfig)
    dataLayers.value.push(layer)
    return layer
  }

  const removeLayer = (layerId) => {
    dataLayers.value = dataLayers.value.filter((layer) => layer.id !== layerId)
  }

  const clearAllLayers = () => {
    dataLayers.value = []
  }

  const updateCurrentStyle = async (newStyle) => {
    console.log('updateCurrentStyle called')
    // Don't show loading indicator for style-only updates
    currentExampleStyle.value = newStyle

    // Re-process layers with the new style
    if (currentExample.value?.layers) {
      // Use current dataLayers which have calculated extents, not original example layers
      const layersWithExtents = dataLayers.value.length > 0 ? dataLayers.value : currentExample.value.layers
// processLayers already handles style application correctly for all layer types
      const processedLayers = await processLayers(layersWithExtents, newStyle)
      dataLayers.value = processedLayers
    } else if (currentExample.value) {
      // Update legacy layer style
      const updatedLayers = dataLayers.value.map((layer) => {
        const updatedLayer = { ...layer }

        if (layer.type === 'Vector') {
          // Process variables in style for Vector layers
          const processedStyle = updateVectorLayerStyle(newStyle)
          updatedLayer.style = processedStyle

          if (!updatedLayer.properties.layerConfig) {
            updatedLayer.properties.layerConfig = {}
          }
          // Include variables in the style object where eox-layercontrol expects them
          const styleWithVariables = {
            ...processedStyle,
            variables: newStyle.variables || {}
          }

          updatedLayer.properties.layerConfig = {
            ...updatedLayer.properties.layerConfig,
            schema: newStyle.jsonform || newStyle.schema,
            style: styleWithVariables,  // Style now includes variables
            legend: newStyle.legend
          }
        } else if (layer.type === 'WebGLTile') {
          // For WebGLTile, keep the style with variables intact
          updatedLayer.style = newStyle

          if (!updatedLayer.properties.layerConfig) {
            updatedLayer.properties.layerConfig = {}
          }

          updatedLayer.properties.layerConfig = {
            ...updatedLayer.properties.layerConfig,
            schema: newStyle.jsonform || newStyle.schema,
            style: newStyle,  // Keep original style with variables
            legend: newStyle.legend
          }
        }
        return updatedLayer
      })
      dataLayers.value = updatedLayers
    }
  }

  const clearCurrentExample = () => {
    currentExample.value = null
    currentExampleStyle.value = null
    clearAllLayers()
  }

  const setCustomDataLayers = async (layers) => {
    startMapLoading()

    // Clear current example since we're loading custom data
    currentExample.value = null

    // Default style if no example style exists
    const defaultStyle = {
      'fill-color': 'rgba(0, 123, 255, 0.2)',
      'stroke-color': '#007bff',
      'stroke-width': 2
    }

    // Use current style or default
    const styleToApply = currentExampleStyle.value || defaultStyle

    // If no current style, set the default as current
    if (!currentExampleStyle.value) {
      currentExampleStyle.value = defaultStyle
    }

    // Process the layers with the style
    // processLayers already handles style application correctly for all layer types
    const processedLayers = await processLayers(layers, styleToApply)
    dataLayers.value = processedLayers

    // Stop loading after a brief delay to let map update
    setTimeout(() => {
      stopMapLoading()
    }, 1000)
  }

  return {
    currentExample: computed(() => currentExample.value),
    currentExampleStyle: computed(() => currentExampleStyle.value),
    dataLayers: computed(() => dataLayers.value),
    setCurrentExample,
    addLayer,
    removeLayer,
    clearAllLayers,
    clearCurrentExample,
    updateCurrentStyle,
    setCustomDataLayers,
  }
}
