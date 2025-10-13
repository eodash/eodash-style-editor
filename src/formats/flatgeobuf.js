import { deserialize } from 'flatgeobuf/lib/mjs/geojson.js'
import proj4 from 'proj4'

// Cache for FGB buffers to prevent multiple fetches of the same URL
const bufferCache = new Map()
const extentCache = new Map()

async function getFgbBuffer(url) {
  // Check buffer cache first
  if (bufferCache.has(url)) {
    console.log(`FGB buffer cache hit for: ${url}`)
    return bufferCache.get(url)
  }

  console.log(`Fetching FGB buffer for: ${url}`)
  const response = await fetch(url)
  const buffer = await response.arrayBuffer()

  // Cache the buffer
  bufferCache.set(url, buffer)
  console.log(`Cached FGB buffer for: ${url}`)

  return buffer
}

async function getFgbExtent(url) {
  console.log('[flatgeobuf] getFgbExtent called with url:', url)

  // Check extent cache first
  if (extentCache.has(url)) {
    console.log(`[flatgeobuf] FGB extent cache hit for: ${url}`)
    return extentCache.get(url)
  }

  console.log(`[flatgeobuf] Calculating FGB extent for: ${url}`)
  const buffer = await getFgbBuffer(url)
  console.log('[flatgeobuf] Got buffer, size:', buffer.byteLength)

  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  // Process each coordinate recursively
  function processCoordinate(coord) {
    let [lon, lat] = coord
    let [x, y] = proj4('EPSG:4326', 'EPSG:3857', [lon, lat])
    if (x < minX) minX = x
    if (x > maxX) maxX = x
    if (y < minY) minY = y
    if (y > maxY) maxY = y
  }

  // Function to traverse coordinates in any geometry type
  function traverseCoordinates(coords) {
    if (Array.isArray(coords[0])) {
      coords.forEach(traverseCoordinates)
    } else {
      processCoordinate(coords)
    }
  }

  // FlatGeoBuf v4.x returns an AsyncGenerator - iterate through it
  const asyncIterable = deserialize(new Uint8Array(buffer))

  let featureCount = 0

  try {
    for await (const feature of asyncIterable) {
      featureCount++

      const geometry = feature.geometry
      if (!geometry || !geometry.coordinates) continue

      traverseCoordinates(geometry.coordinates)
    }

  } catch (error) {
    console.error('Error iterating through features:', error)
    extentCache.set(url, undefined)
    return undefined
  }

  if (featureCount === 0) {
    console.warn('No features found')
    extentCache.set(url, undefined)
    return undefined
  }

  if (minX === Infinity) {
    console.warn('No valid coordinates found')
    extentCache.set(url, undefined)
    return undefined
  }

  const extent = [minX, minY, maxX, maxY]

  // Cache the result
  extentCache.set(url, extent)
  console.log(`Cached FGB extent for: ${url}`)

  return extent
}

async function getFgbAsGeoJSON(url) {
  console.log(`Converting FGB to GeoJSON for: ${url}`)
  const buffer = await getFgbBuffer(url)

  try {
    const features = []
    for await (const feature of deserialize(new Uint8Array(buffer))) {
      features.push(feature)
    }

    return {
      type: 'FeatureCollection',
      features: features
    }
  } catch (error) {
    console.error('Error converting FGB to GeoJSON:', error)
    return null
  }
}

export { getFgbExtent, getFgbBuffer, getFgbAsGeoJSON }