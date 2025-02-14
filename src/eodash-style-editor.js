import { LitElement, css, html } from "lit"
import { fromUrl } from "geotiff"
import stringify from "json-stringify-pretty-compact"

import { geojson } from "flatgeobuf";

import "@eox/layout"
import "@eox/map"
import "@eox/layercontrol"
import "@eox/map/dist/eox-map-advanced-layers-and-sources.js"
import "@eox/jsonform"

import "./components/toolbar/toolbar"

import "./fonts/IBMPlexMono-Regular.ttf"

import componentStyle from "./eodash-style-editor.css?inline"

//import exampleStyleDef from "./example-style.json?inline"

const maxEditorHeight = 360

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
              "maxPixelHeight": maxEditorHeight,
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

    this._isInitialized = false
    this._mapLayers = []
    this._mapCenter = [16.346, 48.182]
    this._mapZoom = 12.5
    this._mapZoomExtent = undefined
    
    this.editorValue = JSON.parse("{\"stroke-color\": \"#004170\",\"stroke-width\": 3}")
    this.lastEditorValue = ""
    this.editor = null
    this._geometryUrl = "https://eox-gtif-public.s3.eu-central-1.amazonaws.com/admin_borders/STATISTIK_AUSTRIA_GEM_20220101.fgb"
  }

  static properties = {
    // Reactive internal state
    _mapLayers: {state: true},
    _mapCenter: {state: true},
    _mapZoom: {state: true},
    _mapZoomExtent: {state: true},
    _geometryUrl: {state: true},
    _isInitialized: {state: true},
  };

  _getFileFormat(url) {
    if (url.includes(".tif")) { return "tif" }
    if (url.includes(".fgb")) { return "fgb" }

    return "unknown"
  }

  async _buildMapLayers()  {
    console.log("buildMapLayers")

    console.log("Generating map layers")
    const inputFormat = this._getFileFormat(this._geometryUrl)

    console.log(`Loading ${this._geometryUrl}`)

    switch (inputFormat) {
      case "fgb":
        //console.log(getFgbInfo(this._geometryUrl))
        this._mapLayers = createFgbConfig(
          this._geometryUrl,
          this.editorValue
        )
        break
      case "tif":
        console.log("Loading GeoTIFF/COG")
        const tiffInfo = await getGeoTiffCenterAndZoom(this._geometryUrl)
        console.log(tiffInfo)
        this._mapZoomExtent = tiffInfo.extent;
        this._mapLayers = createGeoTiffConfig(
          this._geometryUrl,
          this.editorValue
        )
      default:
        console.warn("File format not supported. Please use FGB, GeoTiff or COG files.")
    }

    // Apply our OpenLayers style, for now it is simply added to each generated vector layer.
    //
    // NOTE: Generation for non-vector layers is disabled here because it leads to an
    //       app-breaking exception in the `eox-map` instance when the map is handling
    //       the style object.
    this._mapLayers.forEach((layer) => {
      if (layer.type == "Vector") {
        layer.style = this.editorValue
      }
    })

    const map = this.renderRoot.querySelector('eox-map');

    this._mapZoom = map.zoom
    this._mapCenter = map.center

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
    var parseResult = tryParseJson(e);

    // Only rebuild map layers if the JSON parse result is valid
    if (parseResult !== false) {
      this.editorValue = parseResult
      await this._buildMapLayers()
    }
  }


  render() {
    if (!this._isInitialized) {
      this._buildMapLayers()
    }

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
          .addEventListener("input", (e) => this.onEditorInput(e.target.value)
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
          .zoom='${this._mapZoom}'
          .zoomExtent='${this._mapZoomExtent}'
          style="width: 100%; height: 100%;">
        </eox-map>

        <style-editor-toolbar
          url="https://eox-gtif-public.s3.eu-central-1.amazonaws.com/admin_borders/STATISTIK_AUSTRIA_GEM_20220101.fgb"
          @submit="${(event) => {
            this._geometryUrl = event.detail
            this._isInitialized = true
            this._buildMapLayers()
          }}"
        ></style-editor-toolbar>

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

            <div class="card">
              <div class="editor-toolbar">
                <span class="start">
                  <div class="icon-container editor">
                    <div class="icon layer-control"></div>
                  </div>
                  <h3 class="layers-title">Layers</h3>
                </span>
              </div>
              <div id="layercontrol" style="width: 300px; height: 300px;">
                ${this.isInitialized
                    ? `<eox-layercontrol
                        for="eox-map"
                        style="width: 300px; height: 300px;"
                      ></eox-layercontrol>`
                    : ''
                }
              </div>
            </div>
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
    const origin = image.getOrigin();
    const resolution = image.getResolution();
    const extent = image.getBoundingBox();

    return {
      origin,
      resolution,
      extent,
    }
  } catch (error) {
    console.error('Error processing GeoTIFF:', error);
    throw error;
  }
}

window.customElements.define('eodash-style-editor', EodashStyleEditor)
