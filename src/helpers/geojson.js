import proj4 from "proj4"

async function getGeojsonExtent(featureCollection) {
  console.log(featureCollection);
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  // Process each coordinate recursively
  function processCoordinate(coord) {
    let [lon, lat] = coord;
    let [x, y] = proj4('EPSG:4326', 'EPSG:3857', [lon, lat]);
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }

  // Function to traverse coordinates in any geometry type
  function traverseCoordinates(coords) {
    if (Array.isArray(coords[0])) {
      coords.forEach(traverseCoordinates);
    } else {
      processCoordinate(coords);
    }
  }

  // Iterate over all features
  for (const feature of featureCollection.features) {
    const geometry = feature.geometry;
    if (!geometry || !geometry.coordinates) continue;
    traverseCoordinates(geometry.coordinates);
  }

  if (minX === Infinity) return undefined;
  console.log([minX, minY, maxX, maxY]);
  return [minX, minY, maxX, maxY];
}

function buildGeojsonConfig(url, style) {
  return [
    {
      "type":"Vector",
      "background":"#1366dd",
      "properties":{
        "id":"regions"
      },
      "source":{
        "type":"Vector",
        "url": url,
        "format":"GeoJSON",
        "attributions":"Regions: @ openlayers.org"
      },
      "style":{
        "stroke-color":"#232323",
        "stroke-width":1,
        "fill-color":[
          "string",
          [
            "get",
            "COLOR"
          ],
          "#eee"
        ]
      },
      "interactions": style.tooltip !== undefined
        ? [{
          "type":"select",
          "options":{
              "id":"selectInteraction",
              "condition":"pointermove",
              "style":{
                "stroke-color":"white",
                "stroke-width":3
              }
          }
        }]
        : []
    },
    {
      "type": "Tile",
      "properties": {
        "id": "customId"
      },
      "source": {
        "type": "OSM"
      }
    }
  ];
}

export {
  getGeojsonExtent,
  buildGeojsonConfig,
}