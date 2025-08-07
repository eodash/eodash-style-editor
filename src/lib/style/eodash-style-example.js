/**
 * A loadable instance of a geodata file with an `eodash` style.
 *
 * @class
 * @example
 * const style = new EodashStyle()
 *   .withLayer({ id: 'points', type: 'circle', paint: { 'circle-color': 'blue' } })
 *   .withTooltip({ template: '{name}: {value}' })
 */
class EodashStyleExample {
  /**
   * Creates a new EodashStyle instance based on the default configuration
   * @constructor
   */
  constructor() {
    /**
     * OpenLayers-compatible style configuration
     * @type {Object}
     * @property {Object} [uri]   - URL that points to the data file for the example.
     * @property {Object} [style] - An instance of `EodashStyle`
     */

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