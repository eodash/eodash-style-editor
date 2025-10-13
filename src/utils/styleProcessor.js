/**
 * Process and update variables in vector layer styles
 * Replaces ["var", "key"] expressions with actual values from styles.variables
 * @param {Record<string,any>} styles
 * @returns {Record<string,any>} Processed style with variables burned in
 */
export function updateVectorLayerStyle(styles) {
  // Return flat style if no variables to process
  let returnStyle = styles;

  // Check if variables are defined and need to be "burned in" first
  if ("variables" in styles) {
    // Stringify all the styles to be able to search quickly
    let rawStyle = JSON.stringify(styles);
    // Extract updated variables
    const { variables } = styles;

    // Loop through the variables keys
    for (const key in variables) {
      // OpenLayers styles expects numbers to be assigned as typeof number
      if (typeof variables[key] === "number") {
        // Replace ["var","key"] with actual number value
        rawStyle = rawStyle.replaceAll(`["var","${key}"]`, variables[key]);
      } else {
        // Replace all style variables set of the specific key with the variables value
        rawStyle = rawStyle.replaceAll(
          `["var","${key}"]`,
          `"${variables[key]}"`
        );
      }
    }

    returnStyle = JSON.parse(rawStyle);
  }

  return returnStyle;
}