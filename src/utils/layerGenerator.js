/**
 * Utility functions for generating EOX map layers from various data formats
 */

/**
 * Detects data format based on URL or file extension
 * @param {string} dataUrl - The URL or path to the data file
 * @returns {string} - Detected format: 'FlatGeobuf', 'GeoJSON', 'GeoTIFF', or 'Unknown'
 */
export function detectDataFormat(dataUrl) {
  const url = dataUrl.toLowerCase()

  // Check file extensions
  if (url.endsWith('.fgb')) {
    return 'FlatGeoBuf'
  }
  if (url.endsWith('.geojson') || url.endsWith('.json')) {
    return 'GeoJSON'
  }
  if (url.endsWith('.tif') || url.endsWith('.tiff') || url.endsWith('.geotiff')) {
    return 'GeoTIFF'
  }

  // Check for common patterns in URLs
  if (url.includes('geojson') || url.includes('json')) {
    return 'GeoJSON'
  }
  if (url.includes('tiff') || url.includes('geotiff')) {
    return 'GeoTIFF'
  }
  if (url.includes('fgb') || url.includes('flatgeobuf')) {
    return 'FlatGeoBuf'
  }

  return 'Unknown'
}

/**
 * Generates appropriate layer source configuration based on data format
 * @param {string} dataUrl - URL to the data
 * @param {string} format - Data format (detected or specified)
 * @returns {Object} - EOX map layer source configuration
 */
export function generateLayerSource(dataUrl, format) {
  const detectedFormat = format || detectDataFormat(dataUrl)

  switch (detectedFormat) {
    case 'FlatGeoBuf':
      return {
        type: 'Vector',
        url: dataUrl,
        format: 'FlatGeoBuf',
      }

    case 'GeoJSON':
      return {
        type: 'Vector',
        url: dataUrl,
        format: 'GeoJSON',
      }

    case 'GeoTIFF':
      return {
        type: 'GeoTIFF',
        url: dataUrl,
      }

    default:
      // Fallback to GeoJSON for unknown formats
      return {
        type: 'Vector',
        url: dataUrl,
        format: 'GeoJSON',
      }
  }
}

/**
 * Generates a complete EOX map layer configuration
 * @param {Object} options - Layer generation options
 * @param {string} options.dataUrl - URL to the data
 * @param {string} options.name - Layer name/title
 * @param {Object} options.style - Style configuration for the layer
 * @param {string} [options.format] - Force specific data format
 * @param {string} [options.id] - Custom layer ID
 * @param {Object} [options.properties] - Additional layer properties
 * @returns {Object} - Complete EOX map layer configuration
 */
export function generateMapLayer({ dataUrl, name, style, format, id, properties = {} }) {
  const detectedFormat = format || detectDataFormat(dataUrl)
  const source = generateLayerSource(dataUrl, detectedFormat)

  // Determine layer type based on data format
  const layerType = detectedFormat === 'GeoTIFF' ? 'WebGLTile' : 'Vector'

  const layer = {
    type: layerType,
    source,
    id: id || `layer-${Date.now()}`,
    title: name,
    properties: {
      visible: true,
      ...properties,
    },
  }

  // Add style configuration if provided
  if (style) {
    if (layerType === 'Vector') {
      // For vector layers, set both layer.style and complete layerConfig
      layer.style = style
      if (!layer.properties.layerConfig) {
        layer.properties.layerConfig = {}
      }
      // Include variables in the style object where eox-layercontrol expects them
      const styleWithVariables = {
        ...style,
        variables: style?.variables || {}
      }

      layer.properties.layerConfig = {
        ...layer.properties.layerConfig,
        schema: style?.jsonform || style?.schema,
        style: styleWithVariables,  // Style now includes variables
        legend: style?.legend
      }
    } else if (layerType === 'WebGLTile') {
      // For raster layers, style might be applied differently
      // This depends on EOX map's raster styling capabilities
      layer.style = style
    }
  }

  return layer
}

/**
 * Generates multiple layers for complex datasets
 * @param {Array} datasets - Array of dataset configurations
 * @returns {Array} - Array of EOX map layer configurations
 */
export function generateMapLayers(datasets) {
  return datasets.map((dataset, index) => {
    return generateMapLayer({
      ...dataset,
      id: dataset.id || `layer-${index}-${Date.now()}`,
    })
  })
}

/**
 * Utility to validate if a URL is accessible
 * @param {string} url - URL to validate
 * @returns {Promise<boolean>} - True if URL is accessible
 */
export async function validateDataUrl(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    return response.ok
  } catch (error) {
    console.warn('URL validation failed:', url, error)
    return false
  }
}
