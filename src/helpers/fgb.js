import { deserialize } from "flatgeobuf/lib/mjs/geojson.js"
import proj4 from "proj4"

async function getFgbExtent(url) {
  console.log(url);
  const response = await fetch(url)
  const buffer = await response.arrayBuffer()
  console.log(buffer)
  const featureCollection = deserialize(new Uint8Array(buffer))

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

function buildFgbConfig(url, style) {
  return [
    {
      "type": "Vector",
      "properties": {
        "id": "FlatGeoBufLayer",
        "title": "Vector Data",
      },
      "source": {
        "type": "FlatGeoBuf",
        "url": url,
      },
      "style":{
        "stroke-color": "#232323",
        "stroke-width": 7,
        "fill-color":[
          "string",
          [
            "get",
            "COLOR"
          ],
          "#eee"
        ]
      },
      "interactions":[
        {
          "type":"select",
          "options":{
              "id":"selectInteraction",
              "condition":"pointermove",
              "style":{
                "stroke-color":"white",
                "stroke-width":3
              }
          }
        }
    ]
    },
    {
      "type": "Tile",
      "properties": {
        "title": "OpenStreetMap",
      },
      "source": {
        "type": "OSM"
      }
    }
  ];
}

export {
  getFgbExtent,
  buildFgbConfig,
}