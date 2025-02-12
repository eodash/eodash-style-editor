import { LitElement, css, html } from "lit"
import { fromUrl } from "geotiff"
import stringify from "json-stringify-pretty-compact"

import "@eox/layout"
import "@eox/map"
import "@eox/layercontrol"
import "@eox/map/dist/eox-map-advanced-layers-and-sources.js"
import "@eox/jsonform"

import "./fonts/IBMPlexMono-Regular.ttf"

import componentStyle from "./eodash-style-editor.css?inline"

import exampleStyleDef from "./example-style.json?inline"

const maxEditorHeight = 276

const jsonFormConfig = {
  "type":"object",
  "properties":{
     "code":{
        "type":"string",
        "title":" ",
        "description":"",
        "format":"json",
        "options":{
           "ace":{
              "tabSize":2,
              "fontSize":14,
              "fontFamily":"'IBM Plex Mono'",
              "maxPixelHeight":"maxEditorHeight"
           }
        }
     }
  }
}

/* Create a map config for Flat Geo Buf sources */
function createFgbConfig(url) {
  return [
    {
      "type": "Vector",
      "properties": {
        "id": "FlatGeoBufLayer",
        "minZoom": 12
      },
      "source": {
        "type": "FlatGeoBuf",
        "url": "https://eox-gtif-public.s3.eu-central-1.amazonaws.com/admin_borders/STATISTIK_AUSTRIA_GEM_20220101.fgb"
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

/* Create a map config for Flat Geo Buf sources */
function createGeoTiffConfig(url) {
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

/**
 * If you don't care about primitives and only objects then this function
 * is for you, otherwise look elsewhere.
 * This function will return `false` for any valid json primitive.
 * EG, 'true' -> false
 *     '123' -> false
 *     'null' -> false
 *     '"I'm a string"' -> false
 */
function tryParseJson(jsonString) {
  try {
      var o = JSON.parse(jsonString);

      // Handle non-exception-throwing cases:
      // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
      // but... JSON.parse(null) returns null, and typeof null === "object", 
      // so we must check for that, too. Thankfully, null is falsey, so this suffices:
      if (o && typeof o === "object") {
          return o;
      }
  }
  catch (e) { }

  return false;
};

/**
 * An instance of the `eodash` style editor for geospatial features on a map.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
export class EodashStyleEditor extends LitElement {
  constructor() {
    super()
    this._mapLayers = []
    this._mapCenter = [16.346, 48.182];
    
    this.editorValue = JSON.parse("{\"stroke-color\": \"magenta\",\"stroke-width\": 3}") //exampleStyleDef
    this.editor = null
    this._geometryUrl = "https://eox-gtif-public.s3.eu-central-1.amazonaws.com/admin_borders/STATISTIK_AUSTRIA_GEM_20220101.fgb"
  }

  static properties = {
    // Make the map layers reactive
    _mapLayers: {state: true},
    _mapCenter: {state: true},
    _geometryUrl: {state: true},
  };

  _getFileFormat(url) {
    if (url.includes(".tif")) { return "tif" }
    if (url.includes(".fgb")) { return "fgb" }

    return "unknown"
  }

  async _buildMapLayers()  {
    const inputFormat = this._getFileFormat(this._geometryUrl)

    switch (inputFormat) {
      case "fgb":
        this._mapLayers = createFgbConfig(
          this._geometryUrl,
          this.editorValue
        )
        break
      case "tif":
        console.log(await getGeoTiffCenterAndZoom(this._geometryUrl))
        this._mapLayers = createGeoTiffConfig(
          this._geometryUrl,
          this.editorValue
        )
      default:
        console.warn("File format not supported. Please use FGB, GeoTiff or COG files.")
    }

    console.log(inputFormat)

    this._mapLayers.forEach((layer) => {
      if (layer.type == "Vector") {
        layer.style = this.editorValue
      }
    })

    console.log(this._mapLayers)

    window.setTimeout(() => {
      this.renderRoot
        .querySelector('eox-jsonform')
        .editor
        .editors["root.code"]["ace_editor_instance"]
        .textInput
        .getElement()
        .focus()
    }, 40)
  }

  async onEditorInput(e) {
    console.log(e);
    var parseResult = tryParseJson(e);

    if (parseResult !== false) {
      console.log("updating editor value");
      this.editorValue = parseResult
      await this._buildMapLayers()
    }
  }


  render() {
    window.setTimeout(() => {
      var aceEditor = this.renderRoot
        .querySelector('eox-jsonform')
        .editor
        .editors["root.code"]["ace_editor_instance"]

        this.renderRoot
          .querySelector('eox-jsonform')
          .editor
          .editors["root.code"]["ace_editor_instance"]
          .textInput
          .getElement()
          .addEventListener("input", (e) => this.onEditorInput(aceEditor.getValue())
    )
    }, 100)

    return html`
      <style>
        ${componentStyle}
      </style>

      <div class="eodash-style-editor">
        <eox-map
          id="map"
          .center='${this._mapCenter}'
          .layers='${this._mapLayers}'
          .zoom='${12.5}'
          style="width: 100%; height: 100%;">
        </eox-map>

        <div class="style-editor-input-container">
          <div class="flex">
            <input
              id="geometry-url-input"
              type="text"
              value="${this._geometryUrl}"
              @input="${(e) => this._geometryUrl = e.target.value}"
              placeholder="Paste a link here to load geometry"
            />

            <a
              class="load-button flex justify-center items-center text-white font-bold"
              @click="${this._buildMapLayers}"
            >
              Import
            </a>
          </div>
        </div>

        <div class="sidebar">
          <div class="sidebar-items">
            <div class="card">
              <div class="editor-toolbar">
                <span class="start">
                  <div class="icon-container editor">
                    <div class="icon code-editor"></div>
                  </div>
                  <h3 class="editor-title">Untitled Style</h3>
                </span>
              </div>
              <eox-jsonform
                .schema='${jsonFormConfig}'
                .value='${{"code": stringify(this.editorValue, {}, 2)}}'
              ></eox-jsonform>
            </div>

            <!--<div class="card">
              <div class="editor-toolbar">
                <span class="start">
                  <div class="icon-container editor">
                    <div class="icon layer-control"></div>
                  </div>
                  <h3 class="layers-title">Layers</h3>
                </span>
              </div>
              <div style="width: 300px; height: 300px;">
                <eox-layercontrol
                  for="eox-map"
                  style="width: 300px; height: 300px;"
                ></eox-layercontrol>
              </div>
            </div>-->
          </div>
        </div>
      </div>
    `
  }

  static get styles() {
    return css`
      :host {
        contain: none;
      }

      @media (prefers-color-scheme: light) {
        a:hover {
          color: #747bff;
        }
        button {
          background-color: #f9f9f9;
        }
      }
    `
  }
}

async function getGeoTiffCenterAndZoom(url) {
  console.log("calculating Center and Zoom")
  try {
    // Load and parse the GeoTIFF file
    const tiff = await fromUrl(url);
    const image = await tiff.getImage();

    // Get the image's bounding box
    const bbox = image.getBoundingBox();

    // Calculate center coordinates
    const center = {
      lng: (bbox[0] + bbox[2]) / 2, // Average of min and max longitude
      lat: (bbox[1] + bbox[3]) / 2  // Average of min and max latitude
    };

    // Calculate appropriate zoom level based on bounding box size
    const latDiff = Math.abs(bbox[3] - bbox[1]);
    const lngDiff = Math.abs(bbox[2] - bbox[0]);
    const maxDiff = Math.max(latDiff, lngDiff);

    // Calculate zoom level based on the geographic extent
    // Using the equatorial circumference of the Earth (40,075 km)
    const EARTH_CIRCUMFERENCE = 40075;
    const TILE_SIZE = 256;
    const maxLatDistance = EARTH_CIRCUMFERENCE * Math.cos(((bbox[1] + bbox[3]) / 2) * Math.PI / 180);

    // Calculate zoom based on the larger of width or height
    const widthZoom = Math.log2(TILE_SIZE * maxLatDistance / (lngDiff * EARTH_CIRCUMFERENCE));
    const heightZoom = Math.log2(TILE_SIZE * EARTH_CIRCUMFERENCE / (latDiff * EARTH_CIRCUMFERENCE));
    let zoom = Math.floor(Math.min(widthZoom, heightZoom));

    // Ensure zoom is within reasonable bounds (0-20)
    zoom = Math.min(Math.max(zoom, 0), 20);

    console.log("Processed GeoTIFF")

    return {
      center,
      zoom,
      bounds: {
        north: bbox[3],
        south: bbox[1],
        east: bbox[2],
        west: bbox[0]
      }
    };
  } catch (error) {
    console.error('Error processing GeoTIFF:', error);
    throw error;
  }
}

window.customElements.define('eodash-style-editor', EodashStyleEditor)
