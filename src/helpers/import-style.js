import QgisParser from "geostyler-qgis-parser"
import OpenLayersParser from "geostyler-openlayers-parser"

const qgisToOL = async (qml) => {
  /*const { output: qgisParser } = new QgisParser()
  const { output: olParser } = new OpenLayersParser()
  const geostylerStyle = await qgisParser.readStyle(qgisStyle)
  console.log(geostylerStyle)
  const { output: olStyle } = await olParser.writeStyle(geostylerStyle)
  return olStyle*/

  // 1. Read QGIS style
  const qgisParser = new QgisParser();
  const qgisStyle = await qgisParser.readStyle(qml);

  console.log(qgisStyle);

  // 2. Convert to GeoStyler style
  const geoStylerStyle = qgisStyle.output; // standardized style object

  // 3. Convert GeoStyler style to OpenLayers
  const olParser = new OpenLayersParser();
  const openLayersStyle = await olParser.writeStyle(geoStylerStyle);

  return openLayersStyle;
}

const styleConvertExample = async () => {
  //const url = "https://gist.githubusercontent.com/spectrachrome/e74d8ac87ac57f439be0d7d845b1ce6f/raw/48b0caf2ba46bf473f15c53cb7559fe3a4b350c2/qgis_style.xml"
  const url = "https://eox.slack.com/files/U030N0JUAP9/F095WCHNY9J/test1.qml"
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }

    const xml = await response.text()
    console.log(await qgisToOL(xml))
  } catch (error) {
    console.error(error.message)
  }
}

export { styleConvertExample }