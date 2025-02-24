import { LitElement, css, html } from "lit"
import stringify from "json-stringify-pretty-compact"
import _debounce from "lodash.debounce"

import "@eox/layout"
import "@eox/map"
import "@eox/layercontrol"
import "@eox/map/dist/eox-map-advanced-layers-and-sources.js"
import "@eox/jsonform"

import "./components/toolbar/toolbar"
import { getGeotiffExtent } from "./helpers/geotiff"
import { getGeojsonExtent } from "./helpers/geojson"

import "./fonts/IBMPlexMono-Regular.ttf"

import componentStyle from "./eodash-style-editor.css?inline"

//import exampleStyleDef from "./example-style.json?inline"

const maxEditorHeight = 300

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
        "url": url,
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
    this._mapZoomExtent = null
    this._isLayerControlVisible = false;

    this._style = {
      "stroke-color": "red",
      "color": [
        "case",
        [">", ["band", 1], 0],
        [
          "array",
          ["*", ["band", 1], 1],
          ["*", ["band", 2], 1],
          ["*", ["band", 3], 1],
          1
        ],
        ["color", 0, 0, 0, 0]
      ]
    }

    this._isMapLoading = false;
    this._url = "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/36/Q/WD/2020/7/S2A_36QWD_20200701_0_L2A/TCI.tif"
  }

  #debouncedEditorFn = null

  static properties = {
    // Reactive internal state
    _mapLayers: {state: true},
    _mapZoomExtent: {state: true},
    _geometryUrl: {state: true},
    _isInitialized: {state: true},
    _style: {state: true},
    _isMapLoading: {state: true},
    _isLayerControlVisible: {state: true},
  };

  _getFileFormat(url) {
    if (url.includes(".tif")) { return "tif" }
    if (url.includes(".fgb")) { return "fgb" }

    return "unknown"
  }

  async _buildMapLayers(options)  {
    this._isMapLoading = true
    this._isLayerControlVisible = false

    var layers = []

    const inputFormat = this._getFileFormat(this._url)

    console.log(`shouldBoundsUpdate: ${options.shouldBoundsUpdate}`)

    switch (inputFormat) {
      case "fgb":
        this._mapZoomExtent = await getGeojsonExtent(this._url)
        layers = createFgbConfig(this._url, this._style)
        break
      case "tif":
        this._mapZoomExtent = await getGeotiffExtent(this._url)
        layers = createGeoTiffConfig(this._url, this._style)
        break
      default:
        console.warn("File format not supported. Please use FGB, GeoTiff or COG files.")
    }

    // Apply our OpenLayers style, for now it is simply added to each generated vector layer.
    //
    // NOTE: Generation for non-vector layers is disabled here because it leads to an
    //       app-breaking exception in the `eox-map` instance when the map is handling
    //       the style object.
    layers.forEach((layer) => {
      if (layer.type == "Vector" || layer.type == "WebGLTile") {
        layer.style = this._style
      }

      layer.opacity = 1.0
    })

    this._mapLayers = layers

    window.setTimeout(() => {
      this.renderRoot
        .querySelector('eox-jsonform')
        .editor
        .editors["root.code"]["ace_editor_instance"]
        .textInput
        .getElement()
        .focus()
    }, 40)

    this._isMapLoading = false

    // Give the map some time to load, so that EOxLayerControl can establish the link.
    window.setTimeout(() => { this._isLayerControlVisible = true }, 40)
  }

  async onEditorInput() {
    // 1. Quit early if the map is currently already loading.
    if (this._isMapLoading) return;

    // 2. Retrieve the code the user has edited from the Ace Editor in `eox-jsonform`.
    const currentJSON = this.renderRoot
        .querySelector('eox-jsonform')
        .editor
        .getValue()
        .code

    // 3. Validate JSON string and return deserialized object if parsing was successful.
    var parseResult = tryParseJson(currentJSON)

    // 4. Rebuild map layers and set editor string if parsing succeeded.
    if (parseResult !== false) {
      this._isLayerControlVisible = false
      // It is important to to only set the editor value only if the parsing was successful,
      // otherwise desynchronization sneaks in and messes with our formatting. Do not move.
      this._style = parseResult
      // Rebuild map layers
      await this._buildMapLayers({shouldBoundsUpdate: false})
    }
  }

  firstUpdated() {
    if (!this._isInitialized) {
      this.#debouncedEditorFn = _debounce(() => { this.onEditorInput() }, 500)

      this._buildMapLayers({shouldBoundsUpdate: true})
      this._isInitialized = true
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
          .addEventListener("input", this.#debouncedEditorFn)
    }, 100)
  }

  render() {
    return html`
      <style>
        ${componentStyle}
      </style>
      <div class="eodash-style-editor">
        ${this._isMapLoading
            ? html`<div id="map-loading">
                <div class="spinner">
                  <div class="double-bounce1"></div>
                  <div class="double-bounce2"></div>
                </div>
              </div>`
            : html`<eox-map
                id="map"
                .layers='${this._mapLayers}'
                .zoomExtent='${this._mapZoomExtent}'
                style="width: 100%; height: 100%;">
              </eox-map>`
          }

        <style-editor-toolbar
          url="${this._url}"
          @submit="${(event) => {
            this._url = event.detail
            this._buildMapLayers({shouldBoundsUpdate: true})
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
                .value='${{"code": stringify(this._style, {}, 2)}}'
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
              <div id="layercontrol" style="padding-top: 30px; width: 300px; height: 300px;">
                ${this._isLayerControlVisible
                  ? html`<eox-layercontrol
                    idProperty='id'
                    titleProperty='title'
                    .for="${this.renderRoot.querySelector("eox-map")}">
                  </eox-layercontrol>`
                  : html`<div>
                    <div class="spinner">
                      <div class="double-bounce1"></div>
                      <div class="double-bounce2"></div>
                    </div>
                  </div>`
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

window.customElements.define('eodash-style-editor', EodashStyleEditor)
