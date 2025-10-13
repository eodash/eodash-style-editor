import { getFgbExtent } from './flatgeobuf.js'
import { getGeoJSONExtent } from './geojson.js'
import { getGeoTIFFExtent } from './geotiff.js'
import { updateVectorLayerStyle } from '../utils/styleProcessor.js'

/**
 * Format handler registry using prototype pattern
 * Each handler defines how to process layers for a specific format
 */

const FormatHandler = {
  /**
   * Process a layer with format-specific logic
   * @param {Object} layer - The layer configuration
   * @returns {Promise<Object>} - Processed layer
   */
  async processLayer(layer) {
    return layer // Default: return unchanged
  },

  /**
   * Check if this handler supports the given source type
   * @param {string} sourceType - The source type to check
   * @returns {boolean}
   */
  // eslint-disable-next-line no-unused-vars
  supports(sourceType) {
    return false
  },
}

const FlatGeoBufHandler = Object.create(FormatHandler)
FlatGeoBufHandler.supports = (sourceType) => sourceType === 'FlatGeoBuf' || sourceType === 'flatgeobuf'
FlatGeoBufHandler.processLayer = async function (layer) {
  const processedLayer = { ...layer }

  // Skip extent calculation if layer already has an extent
  if (layer.extent && Array.isArray(layer.extent) && layer.extent.length === 4) {
    processedLayer.extent = layer.extent
    processedLayer.properties = {
      ...processedLayer.properties,
      __extentCalculated: true
    }
  } else if (layer.source?.url) {
    try {
      const extent = await getFgbExtent(layer.source.url)

      if (extent) {
        processedLayer.extent = extent
        // Add a visible marker that we can check
        processedLayer.properties = {
          ...processedLayer.properties,
          __extentCalculated: true
        }
      } else {
        console.warn('FGB extent calculation returned undefined for:', layer.source.url)
        // Continue processing without extent - the layer will still work without it
      }
    } catch (error) {
      console.error('FGB extent calculation failed:', error.message)
    }
  }

  return processedLayer
}

// GeoJSON handler for extent calculation
const GeoJSONHandler = Object.create(FormatHandler)
GeoJSONHandler.supports = (sourceType) => {
  const type = sourceType?.toLowerCase()
  return type === 'geojson' || type === 'vector'
}
GeoJSONHandler.processLayer = async function (layer) {
  const processedLayer = { ...layer }

  // Check if this is actually a GeoJSON source (Vector type with GeoJSON format or GeoJSON source type)
  const isGeoJSON =
    layer.source?.format === 'GeoJSON' ||
    layer.source?.type === 'GeoJSON' ||
    (layer.source?.type === 'Vector' && layer.source?.url?.toLowerCase().includes('json'))

  if (!isGeoJSON) {
    // Not a GeoJSON layer, return unchanged
    return processedLayer
  }

  // Skip extent calculation if layer already has an extent
  if (layer.extent && Array.isArray(layer.extent) && layer.extent.length === 4) {
    processedLayer.extent = layer.extent
    processedLayer.properties = {
      ...processedLayer.properties,
      __extentCalculated: true
    }
  } else if (layer.source?.url) {
    try {
      const extent = await getGeoJSONExtent(layer.source.url)

      if (extent) {
        processedLayer.extent = extent
        // Add a visible marker that we can check
        processedLayer.properties = {
          ...processedLayer.properties,
          __extentCalculated: true
        }
        console.log('GeoJSON extent calculated:', extent)
      } else {
        console.warn('GeoJSON extent calculation returned null for:', layer.source.url)
        // Continue processing without extent - the layer will still work without it
      }
    } catch (error) {
      console.error('GeoJSON extent calculation failed:', error.message)
    }
  }

  return processedLayer
}

// GeoTIFF handler for extent calculation
const GeoTIFFHandler = Object.create(FormatHandler)
GeoTIFFHandler.supports = (sourceType) => {
  const type = sourceType?.toLowerCase()
  return type === 'geotiff'
}
GeoTIFFHandler.processLayer = async function (layer) {
  const processedLayer = { ...layer }

  // Skip extent calculation if layer already has an extent
  if (layer.extent && Array.isArray(layer.extent) && layer.extent.length === 4) {
    processedLayer.extent = layer.extent
    processedLayer.properties = {
      ...processedLayer.properties,
      __extentCalculated: true
    }
  } else {
    // Handle both url and sources array structures
    const url = layer.source?.url || layer.source?.sources?.[0]?.url

    if (url) {
      try {
        const extent = await getGeoTIFFExtent(url)

        if (extent) {
          processedLayer.extent = extent
          // Add a visible marker that we can check
          processedLayer.properties = {
            ...processedLayer.properties,
            __extentCalculated: true
          }
          console.log('GeoTIFF extent calculated:', extent)
        } else {
          console.warn('GeoTIFF extent calculation returned null for:', url)
          // Continue processing without extent - the layer will still work without it
        }
      } catch (error) {
        console.error('GeoTIFF extent calculation failed:', error.message)
      }
    }
  }

  return processedLayer
}

// Default handler for unsupported formats
const DefaultHandler = Object.create(FormatHandler)
DefaultHandler.supports = () => true // Catches all

// Registry hashmap
const formatHandlers = new Map([
  ['FlatGeoBuf', FlatGeoBufHandler],
  ['GeoJSON', GeoJSONHandler],
  ['GeoTIFF', GeoTIFFHandler],
  ['default', DefaultHandler],
])

/**
 * Get the appropriate handler for a source type
 * @param {string} sourceType - The source type
 * @returns {Object} - Format handler
 */
export function getFormatHandler(sourceType) {
  return formatHandlers.get(sourceType) || formatHandlers.get('default')
}

/**
 * Register a new format handler
 * @param {string} sourceType - The source type to handle
 * @param {Object} handler - The handler instance
 */
export function registerFormatHandler(sourceType, handler) {
  formatHandlers.set(sourceType, handler)
}

/**
 * Process all layers using appropriate format handlers
 * @param {Array} layers - Array of layer configurations
 * @param {Object} [editorStyle] - Style from editor that overrides layer styles
 * @returns {Promise<Array>} - Array of processed layers
 */
export async function processLayers(layers, editorStyle = null) {
  console.log('[formatRegistry] processLayers called with', layers.length, 'layers')
  const processedLayers = []

  for (const layer of layers) {
    console.log('[formatRegistry] Processing layer:', layer.properties?.title, 'type:', layer.type, 'source.type:', layer.source?.type, 'source.format:', layer.source?.format)

    // Determine the correct handler based on source format or type
    let handler
    if (layer.source?.format) {
      console.log('[formatRegistry] Using format:', layer.source.format)
      // Use format if specified (e.g., FlatGeoBuf, GeoJSON)
      handler = getFormatHandler(layer.source.format)
    } else {
      console.log('[formatRegistry] Using source type:', layer.source?.type)
      // Fall back to source type
      handler = getFormatHandler(layer.source?.type)
    }
    console.log('[formatRegistry] Selected handler:', handler.constructor.name || 'DefaultHandler')
    console.log('[formatRegistry] Calling handler.processLayer...')
    let processedLayer = await handler.processLayer(layer)
    console.log('[formatRegistry] handler.processLayer completed')

    // Ensure layer has proper ID structure
    if (!processedLayer.id && processedLayer.properties?.id) {
      processedLayer.id = processedLayer.properties.id
    }
    if (!processedLayer.id) {
      processedLayer.id = `layer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }

    // Override layer style with editor style if provided
    if (editorStyle) {
      if (processedLayer.type === 'Vector') {
        // Process variables in the style first for Vector layers
        const processedStyle = updateVectorLayerStyle(editorStyle)

        processedLayer = {
          ...processedLayer,
          style: processedStyle
        }

        // Also set complete layerConfig for eox-map compatibility
        if (!processedLayer.properties.layerConfig) {
          processedLayer.properties.layerConfig = {}
        }

        // Include variables in the style object where eox-layercontrol expects them
        const styleWithVariables = {
          ...processedStyle,
          variables: editorStyle.variables || {}
        }

        processedLayer.properties.layerConfig = {
          ...processedLayer.properties.layerConfig,
          schema: editorStyle.jsonform || editorStyle.schema,
          style: styleWithVariables,  // Style now includes variables
          legend: editorStyle.legend
        }
      } else if (processedLayer.type === 'WebGLTile') {
        // For WebGLTile layers, MERGE editor style with existing style to preserve variables
        // If the layer already has a style with variables, don't lose them!
        const mergedStyle = {
          ...(processedLayer.style || {}),  // Keep existing style (including variables from layer definition)
          ...editorStyle  // Override with editor style (but this preserves variables if editor doesn't have them)
        }
        processedLayer = {
          ...processedLayer,
          style: mergedStyle
        }

        // Also add to layerConfig for consistency
        if (!processedLayer.properties) {
          processedLayer.properties = {}
        }
        if (!processedLayer.properties.layerConfig) {
          processedLayer.properties.layerConfig = {}
        }

        processedLayer.properties.layerConfig = {
          ...processedLayer.properties.layerConfig,
          style: mergedStyle,  // Use merged style here too
          schema: editorStyle.jsonform || editorStyle.schema,
          legend: editorStyle.legend
        }
      }
    }

    processedLayers.push(processedLayer)
  }
  return processedLayers
}
