/**
 * `EodashStyle` represents a style configuration for geospatial data within `eodash`.
 *
 * This class aims to provide a fluent interface for building style documents that extend
 * the OpenLayers style format with additional `eodash`-specific features.
 *
 * @class
 * @property {Object} [tooltip]  - Tooltip configuration
 * @property {Object} [legend]   - Legend config for EOxLayerControl
 * @property {Object} [jsonform] - JSON form config for EOxLayerControl
 * @property {Object} [entries]     - Any additional entries present in the style object.
 * @example
 * const style = new EodashStyle()
 *   .withLayer({ id: 'points', type: 'circle', paint: { 'circle-color': 'blue' } })
 *   .withTooltip({ template: '{name}: {value}' })
 */
class EodashStyle {
  /**
   * Creates a new EodashStyle instance based on the default configuration
   * @constructor
   */
  constructor() {
    /**
     * Tooltip configuration (from `eodash` style superset)
     * @type {Object}
     * @public
     */
    this.tooltip = {}

    /**
     * Legend config for EOxLayerControl (from `eodash` style superset)
     * @type {Object}
     * @public
     */
    this.legend = {}

    /**
     * JSON form config for EOxLayerControl (from `eodash` style superset)
     * @type {Object}
     * @public
     */
    this.jsonform = {}

    /**
     * Any other keys in the style object that are not
     * part of the tooltip, legend or JSON form.
     * @type {Object}
     * @public
     */
    this.entries = {}
  }

  /**
   * Retrieve the `EodashStyle` as a single OpenLayers style object
   */
  toJSON() {
    return {
      tooltip:  this.tooltip,
      legend:   this.legend,
      jsonform: this.jsonform,
      ...this.keys,
    }
  }

  /**
   * Convert a Styled Layer Descriptor (SLD) string into an `EodashStyle` object.
   */
  fromSLD() {
    return {
      tooltip:  this.tooltip,
      legend:   this.legend,
      jsonform: this.jsonform,
      ...this.keys,
    }
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