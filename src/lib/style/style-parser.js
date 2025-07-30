

/**
 * `StyleParser` is a helper class with methods to validate and convert imported styles.
 *
 * @class
 * @example
 * const mapboxStyle = StyleParser.parseQML("...")
 */
class StyleParser {

  /**
   * Creates a new EodashStyle instance based on the default configuration
   * @constructor
   */
  constructor() {

  }

  /**
   * Convert a QGIS style into a Mapbox style
   */
  async parseQML(string) {
    
  }

  /**
   * Convert a Styled Layer Descriptor into a Mapbox style
   */
  async parseSLD(string) {
    
  }

  /**
   * Add a tooltip config to the `eodash` style
   *
   * @param {Object} tooltipConfig - Tooltip configuration
   * @returns {EodashStyle} This instance for method chaining
   *
   * @example
   * const style = new EodashStyle()
   *   ..withTooltip({
   *     id: '{{combined_prop}}',
   *     title: 'Total concentration ({{ship_class}} ice: {{type_of_ice}}',
   *   })
   */
  withTooltip(tooltipConfig) {
    // Implementation here
    return this
  }
}

export default StyleParser