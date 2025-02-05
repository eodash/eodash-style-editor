import { LitElement, css, html } from "lit"

import "@eox/layout"
import "@eox/map"
import "@eox/layercontrol"
import "@eox/map/dist/eox-map-advanced-layers-and-sources.js"
import "@eox/jsonform"

import "./fonts/IBMPlexMono-Regular.ttf"

import componentStyle from "./eodash-style-editor.css?inline"

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

const defaultMapConfig = [
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

const secondMapConfig = [
  {
    "type": "Group",
    "properties": {
      "id": "group2",
      "title": "Data Layers",
      "layerControlExpand": true,
      "description": "# Hello world"
    },
    "layers": [
      {
        "type": "Tile",
        "properties": {
          "id": "WIND",
          "title": "WIND"
        },
        "source": {
          "type": "TileWMS",
          "url": "https://services.sentinel-hub.com/ogc/wms/0635c213-17a1-48ee-aef7-9d1731695a54",
          "params": {
            "LAYERS": "AWS_VIS_WIND_V_10M"
          }
        }
      },
      {
        "type": "Tile",
        "properties": {
          "id": "NO2",
          "title": "NO2"
        },
        "source": {
          "type": "TileWMS",
          "url": "https://services.sentinel-hub.com/ogc/wms/0635c213-17a1-48ee-aef7-9d1731695a54",
          "params": {
            "LAYERS": "AWS_NO2-VISUALISATION"
          }
        }
      },
      {
        "type": "Vector",
        "properties": {
          "title": "Regions",
          "id": "regions",
          "description": "Ecological regions of the earth."
        },
        "source": {
          "type": "Vector",
          "url": "https://openlayers.org/data/vector/ecoregions.json",
          "format": "GeoJSON",
          "attributions": "Regions: @ openlayers.org"
        }
      }
    ]
  },
  {
    "type": "Group",
    "properties": {
      "id": "group1",
      "title": "Background Layers"
    },
    "layers": [
      {
        "type": "WebGLTile",
        "properties": {
          "id": "s2",
          "layerControlExclusive": true,
          "title": "s2"
        },
        "style": {
          "variables": {
            "red": 1,
            "green": 2,
            "blue": 3,
            "redMax": 3000,
            "greenMax": 3000,
            "blueMax": 3000
          },
          "color": [
            "array",
            [
              "/",
              [
                "band",
                [
                  "var",
                  "red"
                ]
              ],
              [
                "var",
                "redMax"
              ]
            ],
            [
              "/",
              [
                "band",
                [
                  "var",
                  "green"
                ]
              ],
              [
                "var",
                "greenMax"
              ]
            ],
            [
              "/",
              [
                "band",
                [
                  "var",
                  "blue"
                ]
              ],
              [
                "var",
                "blueMax"
              ]
            ],
            1
          ],
          "gamma": 1.1
        },
        "source": {
          "type": "GeoTIFF",
          "normalize": false,
          "sources": [
            {
              "url": "https://s2downloads.eox.at/demo/EOxCloudless/2020/rgbnir/s2cloudless2020-16bits_sinlge-file_z0-4.tif"
            }
          ]
        }
      },
      {
        "type": "Tile",
        "properties": {
          "id": "osm",
          "title": "Open Street Map",
          "layerControlExclusive": true
        },
        "visible": false,
        "opacity": 0.5,
        "source": {
          "type": "OSM"
        }
      }
    ]
  }
];

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

    this.editorValue = "{}"
    this.editor = null
  }

  render() {
    return html`
      <style>
        ${componentStyle}
      </style>

      <div class="eodash-style-editor">
        <eox-map
          id="map"
          .center='${[16.346,48.182]}'
          .layers='${defaultMapConfig}'
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
                .value='${{"code":"{\n  \"hello\": \"world\"\n}"}}'
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
              <div style="width: 300px; height: 300px;">
                <eox-layercontrol
                  for="eox-map"
                  style="width: 300px; height: 300px;"
                ></eox-layercontrol>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  }

  _onClick() {
    this.count++
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
