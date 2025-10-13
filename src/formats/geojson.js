/**
 * GeoJSON extent calculation utilities
 */

import { transform } from 'ol/proj'

/**
 * Calculate extent from GeoJSON data
 * @param {string} url - URL to the GeoJSON file
 * @returns {Promise<Array>} - Extent in EPSG:3857 [minX, minY, maxX, maxY]
 */
export async function getGeoJSONExtent(url) {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch GeoJSON: ${response.statusText}`)
    }

    const geojson = await response.json()

    if (!geojson || !geojson.features || geojson.features.length === 0) {
      console.warn('GeoJSON has no features')
      return null
    }

    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity

    // Process all features to find bounds
    for (const feature of geojson.features) {
      if (!feature.geometry) continue

      const coords = extractCoordinates(feature.geometry)
      for (const [lon, lat] of coords) {
        // Transform from EPSG:4326 to EPSG:3857
        const [x, y] = transform([lon, lat], 'EPSG:4326', 'EPSG:3857')

        minX = Math.min(minX, x)
        minY = Math.min(minY, y)
        maxX = Math.max(maxX, x)
        maxY = Math.max(maxY, y)
      }
    }

    if (!isFinite(minX) || !isFinite(minY) || !isFinite(maxX) || !isFinite(maxY)) {
      console.warn('Could not calculate valid extent from GeoJSON')
      return null
    }

    return [minX, minY, maxX, maxY]
  } catch (error) {
    console.error('Error calculating GeoJSON extent:', error)
    return null
  }
}

/**
 * Extract all coordinates from any geometry type
 */
function extractCoordinates(geometry) {
  const coords = []

  switch (geometry.type) {
    case 'Point':
      coords.push(geometry.coordinates)
      break

    case 'LineString':
    case 'MultiPoint':
      coords.push(...geometry.coordinates)
      break

    case 'Polygon':
    case 'MultiLineString':
      for (const ring of geometry.coordinates) {
        coords.push(...ring)
      }
      break

    case 'MultiPolygon':
      for (const polygon of geometry.coordinates) {
        for (const ring of polygon) {
          coords.push(...ring)
        }
      }
      break

    case 'GeometryCollection':
      for (const geom of geometry.geometries) {
        coords.push(...extractCoordinates(geom))
      }
      break
  }

  return coords
}