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
 * An instance of the `eodash` style editor for geospatial features on a map.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
export class EodashStyleEditor extends LitElement {
  static get properties() {
    return {
      /**
       * Copy for the read the docs hint.
       */
      docsHint: { type: String },

      /**
       * The number of times the button has been clicked.
       */
      count: { type: Number },
    }
  }

  constructor() {
    super()
    this.docsHint = "Click on the Vite and Lit logos to learn more"
    this.count = 0

    this.mapLayers = []
    this.editorValue = exampleStyleDef
    this.editor = null
  }

  _buildMapLayers()  {
    this.mapLayers = createFgbConfig(
      "https://eox-gtif-public.s3.eu-central-1.amazonaws.com/admin_borders/STATISTIK_AUSTRIA_GEM_20220101.fgb",
      this.editorValue
    );

    this.mapLayers.forEach((layer) => {
      layer.properties.layerConfig =  { style: this.editorValue };
    })

    console.log(this.mapLayers)
  }

  render() {
    this._buildMapLayers();

    return html`
      <style>
        ${componentStyle}
      </style>

      <div class="eodash-style-editor">
        <eox-map
          id="map"
          .center='${[16.346,48.182]}'
          .layers='${this.mapLayers}'
          .zoom='${12.5}'
          style="width: 100%; height: 100%;">
        </eox-map>

        <div class="style-editor-input-container">
          <div class="flex">
            <input
              id="geometry-url-input"
              type="text"
              placeholder="Paste a link here to load geometry"
            />

            <a class="load-button flex justify-center items-center text-white font-bold">
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
