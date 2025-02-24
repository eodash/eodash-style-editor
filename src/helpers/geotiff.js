import { fromUrl } from "geotiff"
import proj4 from "proj4"

async function getGeotiffExtent(url) {
  try {
    // Load and parse the GeoTIFF file
    const tiff = await fromUrl(url);
    const image = await tiff.getImage();

    // Get the image's bounding box
    const origin = image.getOrigin();
    const resolution = image.getResolution();
    const extent = image.getBoundingBox();

    // Extract the geo key number that we can use as an EPSG number identifier with
    // proj4, so that we can dynamically detect the GeoTIFF projection and convert
    // into the usual EPSG:3857 that `eox-map` uses.
    //
    // The string is very simple, just compose `EPSG:${geoKey}`.
    let geoKey = image.geoKeys.ProjectedCSTypeGeoKey || image.geoKeys.GeographicTypeGeoKey || 3857;

    // The `proj4` API only works with coordinate pairs, so we need to temporarily turn our
    // bounding box array into two pairs of coordinates here for conversion.
    const transformedExtent = [
      proj4(`EPSG:${geoKey}`, 'EPSG:3857', [extent[0], extent[1]]),
      proj4(`EPSG:${geoKey}`, 'EPSG:3857', [extent[2], extent[3]]),
    ]

    // Move the values from our two converted coordinates back into the linear
    // arrangement we had before and return the finished bounding box.
    return [
      transformedExtent[0][0],
      transformedExtent[0][1],
      transformedExtent[1][0],
      transformedExtent[1][1],
    ]
  } catch (error) {
    console.error('Error processing GeoTIFF:', error);
    throw error;
  }
}

function buildGeotiffConfig(url) {
  return [
    {
      "type": "WebGLTile",
      "properties": {
        "id": "geotiffLayer"
      },
      "source": {
        "type": "GeoTIFF",
        "sources": [
          {
            "url": url
          }
        ]
      }
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
  getGeotiffExtent,
}