/**
 * StyleFormatDetector - A class for detecting map style formats
 * Supports: OpenLayers, Mapbox, SLD, and EODash formats
 *
 * @author Your Name
 * @version 1.0.0
 * @license MIT
 */
class StyleFormatDetector {
    constructor() {
        // Define format constants
        this.FORMATS = {
            OPENLAYERS: 'openlayers',
            MAPBOX: 'mapbox',
            SLD: 'sld',
            EODASH: 'eodash'
        }

        // Superset keys which make the eodash style distinct from OL flat styles
        this.EODASH_KEYS = ["tooltips", "legend", "jsonform"]
    }

    /**
     * Main detection method
     * @param {string} input - The style string to analyze
     * @returns {string} - Returns "openlayers", "mapbox", "sld", or "eodash"
     * @throws {Error} - If input is invalid or format cannot be determined
     */
    detect(input) {
        if (!input || typeof input !== 'string') {
            throw new Error('Input must be a non-empty string')
        }

        const trimmed = input.trim()

        // Check for SLD (XML format) first
        if (this.isSLD(trimmed)) {
            return this.FORMATS.SLD
        }

        // Try to parse as JSON for other formats
        let parsed
        try {
            parsed = JSON.parse(trimmed)

            console.log(parsed)

            // Check for Mapbox style
            if (this.isMapboxStyle(parsed)) {
                return this.FORMATS.MAPBOX
            }

            console.log("past mapbox check")

            // Check for EODash style (must be checked before OpenLayers)
            if (this.isEodashStyle(parsed)) {
                return this.FORMATS.EODASH
            }

            console.log("past eodash check")

            // Check for OpenLayers style
            if (this.isOpenLayersStyle(parsed)) {
                return this.FORMATS.OPENLAYERS
            }

            console.log("past ol check")
        } catch (e) {
            throw new Error(`Input is not a valid style format: ${e}`)
        }

        throw new Error('Unable to determine style format')
    }

    /**
     * Static method for convenience
     * @param {string} input - The style string to analyze
     * @returns {string} - The detected format
     */
    static detect(input) {
        const detector = new StyleFormatDetector()
        return detector.detect(input)
    }

    /**
     * Get all supported format constants
     * @returns {object} - Object with format constants
     */
    getFormats() {
        return { ...this.FORMATS }
    }

    /**
     * Check if a format is supported
     * @param {string} format - The format to check
     * @returns {boolean} - True if format is supported
     */
    isFormatSupported(format) {
        return Object.values(this.FORMATS).includes(format)
    }

    /**
     * Check if the input is an SLD XML document
     * @private
     * @param {string} str - The string to check
     * @returns {boolean} - True if SLD format
     */
    isSLD(str) {
        // Check if it starts like XML
        if (!str.startsWith('<') || !str.includes('>')) {
            return false
        }

        const sldIndicators = [
            'StyledLayerDescriptor',
            'NamedLayer',
            'UserLayer',
            'FeatureTypeStyle',
            'Rule',
            'PointSymbolizer',
            'LineSymbolizer',
            'PolygonSymbolizer',
            'TextSymbolizer',
            'RasterSymbolizer'
        ]

        const lowerStr = str.toLowerCase()

        // Check for namespace declarations or SLD-specific content
        if (lowerStr.includes('sld:') ||
            lowerStr.includes('ogc:') ||
            lowerStr.includes('www.opengis.net/sld')) {
            return true
        }

        // Check for key SLD elements
        for (const indicator of sldIndicators) {
            if (lowerStr.includes('<' + indicator.toLowerCase()) ||
                lowerStr.includes('<sld:' + indicator.toLowerCase())) {
                return true
            }
        }

        return false
    }

    /**
     * Check if the parsed JSON is a Mapbox style
     * @private
     * @param {object} obj - The parsed object to check
     * @returns {boolean} - True if Mapbox format
     */
    isMapboxStyle(obj) {
        if (!obj || typeof obj !== 'object') {
            return false
        }

        // Mapbox styles require version and layers
        if (!('version' in obj) || !('layers' in obj)) {
            return false
        }

        // Version should be a number (typically 8)
        if (typeof obj.version !== 'number') {
            return false
        }

        // Layers should be an array
        if (!Array.isArray(obj.layers)) {
            return false
        }

        console.info("initial mapbox style check done")

        // Check for Mapbox-specific layer properties
        if (obj.layers.length > 0) {
            const layer = obj.layers[0]
            const mapboxLayerProps = ['id', 'type', 'source', 'source-layer', 'paint', 'layout', 'filter']
            const hasMapboxProps = mapboxLayerProps.some(prop => prop in layer)

            if (hasMapboxProps) {
                // Additional check for hyphenated paint properties
                if (layer.paint && typeof layer.paint === 'object') {
                    const paintKeys = Object.keys(layer.paint)
                    const hasHyphenatedProps = paintKeys.some(key => key.includes('-'))
                    if (hasHyphenatedProps) {
                        return true
                    }
                }
                return true
            }
        }

        // Check for sources object with Mapbox-specific types
        if (obj.sources && typeof obj.sources === 'object') {
            const sourceKeys = Object.keys(obj.sources)
            if (sourceKeys.length > 0) {
                const source = obj.sources[sourceKeys[0]]
                const mapboxSourceTypes = ['vector', 'raster', 'raster-dem', 'geojson', 'image', 'video']
                if (source.type && mapboxSourceTypes.includes(source.type)) {
                    return true
                }
            }
        }

        return false
    }

    /**
     * Check if the parsed JSON is an EODash style
     * EODash is a superset of OpenLayers with additional properties
     * @private
     * @param {object} obj - The parsed object to check
     * @returns {boolean} - True if EODash format
     */
    isEodashStyle(obj) {
        if ('legend' in obj || 'tooltip' in obj || 'jsonform' in obj) {
            return true
        }
    }

    /**
     * Check if the parsed JSON is an OpenLayers style
     * @private
     * @param {object} obj - The parsed object to check
     * @returns {boolean} - True if OpenLayers format
     */
    isOpenLayersStyle(obj) {
        if (!obj || typeof obj !== 'object') {
            return false
        }

        const olStyleProps = ['fill-color', 'stroke-color', 'image', 'text', 'zIndex', 'geometry']
        const hasOLProps = olStyleProps.some(prop => prop in obj)

        if (hasOLProps) {
            // Additional validation for OpenLayers structure
            if (obj.fill && typeof obj.fill === 'object' && 'color' in obj.fill) {
                return true
            }

            if (obj.stroke && typeof obj.stroke === 'object' &&
                ('color' in obj.stroke || 'width' in obj.stroke)) {
                return true
            }

            if (obj.image && typeof obj.image === 'object') {
                if (obj.image.radius || obj.image.src || obj.image.points) {
                    return true
                }
            }

            if (obj.text && typeof obj.text === 'object') {
                if ('text' in obj.text || 'font' in obj.text || 'offsetX' in obj.text) {
                    return true
                }
            }

            return true
        }

        // Check if it's an array of styles
        if (Array.isArray(obj)) {
            return obj.some(item => this.isOpenLayersStyle(item))
        }

        // Check for style function pattern
        if (obj.conditions && Array.isArray(obj.conditions)) {
            return true
        }

        return false
    }

    /**
     * Check if the string contains OpenLayers JavaScript code patterns
     * @private
     * @param {string} str - The string to check
     * @returns {boolean} - True if OpenLayers code
     */
    isOpenLayersCode(str) {
        const olPatterns = [
            /new\s+ol\.style\.Style/i,
            /new\s+ol\.style\.Fill/i,
            /new\s+ol\.style\.Stroke/i,
            /new\s+ol\.style\.Circle/i,
            /new\s+ol\.style\.Icon/i,
            /new\s+ol\.style\.Text/i,
            /ol\.style\./,
            /Style\s*\(\s*{/,
            /Fill\s*\(\s*{/,
            /Stroke\s*\(\s*{/
        ]

        return olPatterns.some(pattern => pattern.test(str))
    }

    /**
     * Validate and parse style string to object
     * @param {string} input - The style string
     * @returns {object} - Parsed style object with format property
     * @throws {Error} - If parsing fails
     */
    parse(input) {
        const format = this.detect(input)
        const trimmed = input.trim()

        let parsed = null

        if (format === this.FORMATS.SLD) {
            // For SLD, return the XML string as-is
            parsed = trimmed
        } else {
            // For JSON-based formats, parse the JSON
            try {
                parsed = JSON.parse(trimmed)
            } catch (e) {
                // For OpenLayers JavaScript code, return as-is
                if (format === this.FORMATS.OPENLAYERS && this.isOpenLayersCode(trimmed)) {
                    parsed = trimmed
                } else {
                    throw new Error('Failed to parse style: ' + e.message)
                }
            }
        }

        return {
            format: format,
            style: parsed
        }
    }
}

/* Example Usage:

// Create an instance
const detector = new StyleFormatDetector()

// Method 1: Using instance method
try {
    const format = detector.detect(styleString)
    console.log('Detected format:', format) // "openlayers", "mapbox", "sld", or "eodash"
} catch (error) {
    console.error('Detection failed:', error.message)
}

// Method 2: Using static method
try {
    const format = StyleFormatDetector.detect(styleString)
    console.log('Detected format:', format)
} catch (error) {
    console.error('Detection failed:', error.message)
}

// Method 3: Parse and get both format and parsed content
try {
    const result = detector.parse(styleString)
    console.log('Format:', result.format)
    console.log('Parsed style:', result.style)
} catch (error) {
    console.error('Parse failed:', error.message)
}

// Get supported formats
const formats = detector.getFormats()
console.log('Supported formats:', formats)
// Output: { OPENLAYERS: 'openlayers', MAPBOX: 'mapbox', SLD: 'sld', EODASH: 'eodash' }

// Check if a format is supported
const isSupported = detector.isFormatSupported('mapbox')
console.log('Is mapbox supported?', isSupported) // true

*/

export default StyleFormatDetector