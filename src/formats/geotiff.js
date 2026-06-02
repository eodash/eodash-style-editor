/**
 * GeoTIFF extent calculation utilities
 */

import { fromUrl } from 'geotiff'
import { transform } from 'ol/proj'
import { register } from 'ol/proj/proj4'
import proj4 from 'proj4'

// Register common UTM projections for Sentinel-2
proj4.defs('EPSG:32636', '+proj=utm +zone=36 +datum=WGS84 +units=m +no_defs')
register(proj4)

/**
 * Calculate extent from GeoTIFF metadata
 * @param {string} url - URL to the GeoTIFF file
 * @returns {Promise<Array>} - Extent in EPSG:3857 [minX, minY, maxX, maxY]
 */
export async function getGeoTIFFExtent(url) {
  try {
    console.log('Calculating GeoTIFF extent for:', url)
    const tiff = await fromUrl(url)
    const image = await tiff.getImage()

    // Get bbox from GeoTIFF metadata
    const bbox = image.getBoundingBox()
    console.log('GeoTIFF bbox:', bbox)

    if (!bbox || bbox.length !== 4) {
      console.warn('GeoTIFF has no valid bounding box')
      return null
    }

    // bbox is typically [minX, minY, maxX, maxY] in the image's CRS
    const [minX, minY, maxX, maxY] = bbox

    // Try to get the projection info
    const geoKeys = image.getGeoKeys()
    console.log('GeoTIFF geoKeys:', geoKeys)

    const epsgCode = geoKeys?.ProjectedCSTypeGeoKey || geoKeys?.GeographicTypeGeoKey
    console.log('Detected EPSG code:', epsgCode)

    // If we can identify the projection, transform to EPSG:3857
    if (epsgCode === 4326) {
      console.log('Transforming from EPSG:4326 to EPSG:3857')
      // Transform from EPSG:4326 to EPSG:3857
      const [minX3857, minY3857] = transform([minX, minY], 'EPSG:4326', 'EPSG:3857')
      const [maxX3857, maxY3857] = transform([maxX, maxY], 'EPSG:4326', 'EPSG:3857')
      console.log('Transformed extent:', [minX3857, minY3857, maxX3857, maxY3857])
      return [minX3857, minY3857, maxX3857, maxY3857]
    } else if (epsgCode === 3857) {
      console.log('Already in EPSG:3857')
      // Already in EPSG:3857
      return [minX, minY, maxX, maxY]
    } else {
      // Handle specific known projections
      if (epsgCode && epsgCode !== 4326 && epsgCode !== 3857) {
        console.log(`Transforming from EPSG:${epsgCode} to EPSG:3857`)
        try {
          // Transform from the detected projection to EPSG:3857
          const [minX3857, minY3857] = transform([minX, minY], `EPSG:${epsgCode}`, 'EPSG:3857')
          const [maxX3857, maxY3857] = transform([maxX, maxY], `EPSG:${epsgCode}`, 'EPSG:3857')
          console.log('Transformed extent:', [minX3857, minY3857, maxX3857, maxY3857])
          return [minX3857, minY3857, maxX3857, maxY3857]
        } catch (error) {
          console.error(`Failed to transform from EPSG:${epsgCode}:`, error)
          console.warn('Falling back to bbox as-is')
          return [minX, minY, maxX, maxY]
        }
      } else {
        // For unknown projections, try to detect if this looks like UTM coordinates
        if (Math.abs(minX) > 180 || Math.abs(maxX) > 180 || Math.abs(minY) > 90 || Math.abs(maxY) > 90) {
          console.log('Coordinates seem to be in projected CRS, trying to get extent from origin')

          // For COGs, sometimes we need to use the file origin and pixel size
          const fileDirectory = image.fileDirectory
          console.log('GeoTIFF file directory keys:', Object.keys(fileDirectory))

          // Try to get the extent another way if available
          const width = image.getWidth()
          const height = image.getHeight()
          console.log('Image dimensions:', width, 'x', height)

          // Return the bbox as-is but log that we're unsure
          console.warn('GeoTIFF projection unclear, coordinates look projected:', [minX, minY, maxX, maxY])
          return [minX, minY, maxX, maxY]
        } else {
          // Coordinates look geographic, assume EPSG:4326
          console.log('Coordinates look geographic, assuming EPSG:4326 and transforming')
          const [minX3857, minY3857] = transform([minX, minY], 'EPSG:4326', 'EPSG:3857')
          const [maxX3857, maxY3857] = transform([maxX, maxY], 'EPSG:4326', 'EPSG:3857')
          console.log('Transformed extent:', [minX3857, minY3857, maxX3857, maxY3857])
          return [minX3857, minY3857, maxX3857, maxY3857]
        }
      }
    }
  } catch (error) {
    console.error('Error calculating GeoTIFF extent:', error)
    return null
  }
}