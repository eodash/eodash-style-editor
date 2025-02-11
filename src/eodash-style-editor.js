import { LitElement, css, html } from "lit"

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
function createFgbConfig(url, styleObject) {
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
    this.geometryUrl = "https://eox-gtif-public.s3.eu-central-1.amazonaws.com/admin_borders/STATISTIK_AUSTRIA_GEM_20220101.fgb"
  }

  static properties = {
    // Make the map layers reactive
    _mapLayers: {state: true},
    _mapCenter: {state: true},
  };

  _buildMapLayers()  {
    this._mapLayers = createFgbConfig(
      this.geometryUrl,
      this.editorValue
    );

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

  onEditorInput(e) {
    console.log(e);
    var parseResult = tryParseJson(e);

    if (parseResult !== false) {
      console.log("updating editor value");
      this.editorValue = parseResult
      this._buildMapLayers()
    }
  }


  render() {
    this._buildMapLayers();

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
              value="${this.geometryUrl}"
              placeholder="Paste a link here to load geometry"
            />

            <a
              class="load-button flex justify-center items-center text-white font-bold"
              @click="${this._build_mapLayers}"
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
                .value='${{"code": JSON.stringify(this.editorValue, null, 2)}}'
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

window.customElements.define('eodash-style-editor', EodashStyleEditor)
