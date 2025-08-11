import { LitElement, css, html } from "lit";
import stringify from "json-stringify-pretty-compact";
import _debounce from "lodash.debounce";
import mustache from "mustache";
import * as SLDReader from "@nieuwlandgeo/sldreader";

import Feature from "ol/Feature";

import "@eox/layout";
import "@eox/map";
import "@eox/layercontrol";
import "@eox/map/dist/eox-map-advanced-layers-and-sources.js";
import "@eox/jsonform";
import "color-legend-element";

import "./components/toolbar/toolbar";
import "./components/style-import-dialog";

import StyleParser from "./lib/style/style-parser.js";

import { getGeotiffExtent } from "./helpers/geotiff";
import { getFgbExtent, buildFgbConfig } from "./helpers/fgb";
import { getGeojsonExtent, buildGeojsonConfig } from "./helpers/geojson";
import { styleConvertExample } from "./helpers/import-style";

import "./fonts/IBMPlexMono-Regular.ttf";
import eoxUiStyle from "@eox/ui/style.css?inline";

import componentStyle from "./styles/app.css?inline";

import cerulean from "./cerulean_style.json?inline";

//import exampleStyleDef from "./example-style.json?inline"

const maxEditorHeight = window.innerHeight;

/**
 * @param {object} vector layer
 * @param {string} text the xml text
 * apply sld
 */
function applySLD(vectorLayer, map, text) {
  console.log(map);
  const sldObject = SLDReader.Reader(text);
  const sldLayer = SLDReader.getLayer(sldObject);
  const style = SLDReader.getStyle(sldLayer);
  const featureTypeStyle = style.featuretypestyles[0];

  const viewProjection = map.getView().getProjection();
  vectorLayer.setStyle(
    SLDReader.createOlStyleFunction(
      featureTypeStyle /*{
    // Use the convertResolution option to calculate a more accurate resolution.
    convertResolution: viewResolution => {
      const viewCenter = map.getView().getCenter();
      return ol.proj.getPointResolution(viewProjection, viewResolution, viewCenter);
    },
    // If you use point icons with an ExternalGraphic, you have to use imageLoadCallback
    // to update the vector layer when an image finishes loading.
    // If you do not do this, the image will only be visible after next layer pan/zoom.
    imageLoadedCallback: () => {
      vectorLayer.changed();
    },
  }*/,
    ),
  );
}

const jsonFormConfig = {
  type: "object",
  properties: {
    code: {
      type: "string",
      title: " ",
      description: "",
      format: "json",
      options: {
        ace: {
          tabSize: 2,
          fontSize: 14,
          fontFamily: "'IBM Plex Mono'",
          maxPixelHeight: window.innerHeight - 174,
          maxLines: 50,
        },
      },
    },
  },
};

function parseJsonDataUri(dataUri) {
  try {
    // Split the data URI to get the encoded part
    const encodedData = dataUri.split(",")[1];
    // Decode the URI component to convert %xx characters
    const decodedData = decodeURIComponent(encodedData);
    // Parse the JSON string into an object
    return JSON.parse(decodedData);
  } catch (error) {
    console.error("Error parsing GeoJSON data URI:", error);
    throw error; // Re-throw or handle as needed
  }
}

/* Create a map config for Flat Geo Buf sources */
function createGeoTiffConfig(url) {
  return [
    {
      type: "WebGLTile",
      properties: {
        id: "geotiffLayer",
      },
      source: {
        type: "GeoTIFF",
        sources: [
          {
            url: url,
          },
        ],
      },
    },
    {
      type: "Tile",
      properties: {
        id: "customId",
      },
      source: {
        type: "OSM",
      },
    },
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
  } catch (e) {}

  return false;
}

/**
 * updating the variables assigned in the layer style
 * from the `styles.variables` property
 * @param {Record<string,any>} styles
 * @returns
 */
function updateVectorLayerStyle(styles) {
  // pass back flat style if contained in config
  let returnStyle = styles;
  // Check if variables are defined and need to be "burned in" first
  if ("variables" in styles) {
    // stringify all the styles to be able to search quickly
    let rawStyle = JSON.stringify(styles);
    // extract updated variables
    const { variables } = styles;
    // loop through the variables keys
    for (const key in variables) {
      // ol styles expects numbers to be assigned as typeof number
      if (typeof variables[key] === "number") {
        //@ts-expect-error assigning number to string
        rawStyle = rawStyle.replaceAll(`["var","${key}"]`, variables[key]);
      } else {
        // replace all styles variables set of the specific key with the variables value
        rawStyle = rawStyle.replaceAll(
          `["var","${key}"]`,
          `"${variables[key]}"`,
        );
      }
    }
    returnStyle = JSON.parse(rawStyle);
  }
  return returnStyle;
}

/**
 * An instance of the `eodash` style editor for geospatial features on a map.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
export class EodashStyleEditor extends LitElement {
  // Disable shadow DOM so that we can use Tailwind
  createRenderRoot() {
    return this;
  }

  constructor() {
    super();

    this._isInitialized = false;
    this._mapLayers = [];
    this._mapZoomExtent = null;
    this._isLayerControlVisible = false;
    this._isStyleImporterVisible = false;

    this._style = {
      "stroke-color": "red",
      radius: 5,
      fill: "red",
      /*"color": [
        "case",
        [">", ["band", 1], 0],
        [
          "array",
          ["*", ["band", 1], 0.4],
          ["*", ["band", 2], 1],
          ["*", ["band", 3], 1],
          1
        ],
        ["color", 0, 0, 0, 0]
      ]*/
    };

    this._style = cerulean;

    this._isMapLoading = false;
    // this._url = "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/36/Q/WD/2020/7/S2A_36QWD_20200701_0_L2A/TCI.tif"
    //this._url =  "https://gist.githubusercontent.com/spectrachrome/911295cd5d54a30495520ed3dde0f3bc/raw/387cbba42f99684c1306891e472b3c706cc9b4d2/testFeatures.json";
    this._url =
      "https://workspace-ui-public.cif.gtif.eox.at/api/public/share/public-4WaZei3Y-02/examples/202501200900_SouthEast_RIC-processed.fgb";
    this._layerControlFormValue = {};
    this._errorQueue = [];
    this._snackbarDuration = 2000;
    this._currentError = "";
  }

  #debouncedEditorFn = null;

  static properties = {
    // Reactive internal state
    _mapLayers: { state: true },
    _mapZoomExtent: { state: true },
    _geometryUrl: { state: true },
    _isInitialized: { state: true },
    _style: { state: true },
    _isMapLoading: { state: true },
    _isLayerControlVisible: { state: true },
    _isStyleImporterVisible: { state: true },
    _layerControlFormValue: { state: true },
    _shouldUpdate: { state: true },
    _errorQueue: { state: true },
    _currentError: { state: true },
    // Duration in milliseconds until a spawned snackbar notification fades away.
    _snackbarDuration: { state: true },
  };

  // Error handling remains the same
  _handleError(event) {
    event.stopPropagation();
    this._errorQueue = [...this._errorQueue, event.detail];

    if (!this._currentError) {
      this._processNextError();
    }
  }

  _processNextError() {
    if (this._errorQueue.length === 0) return;
    this._currentError = this._errorQueue[0];
    this._errorQueue = this._errorQueue.slice(1);

    setTimeout(() => {
      this._currentError = null;

      // Hide snackbar for 500ms
      this._currentError = "";
      // Process next error after current is dismissed
      setTimeout(this._processNextError, 500);
    }, this._snackbarDuration);
  }

  _tooltipPropertyTransform = (param) => {
    const templateContext = {
      ...this._layerControlFormValue,
      ...param.properties,
    };

    try {
      const tooltipConfig = JSON.parse(
        mustache.render(JSON.stringify(this._style.tooltip), templateContext),
      );

      const tooltipProp = tooltipConfig.find((p) => p.id === param.key);
      if (!tooltipProp) return null;

      let value = param.value;
      if (typeof value === "object") {
        value = JSON.stringify(value);
      } else if (typeof value === "number") {
        value = value.toFixed(4);
      }

      return {
        key: mustache.render(tooltipProp.title, templateContext),
        value:
          `${value} ${mustache.render(tooltipProp.appendix || "", templateContext)}`.trim(),
      };
    } catch (e) {
      console.error("Tooltip transformation error:", e);
      return null;
    }
  };

  _getFileFormat(url) {
    if (url.includes(".tif")) {
      return "tif";
    }
    if (url.includes(".fgb")) {
      return "fgb";
    }
    if (
      url.includes("data:,") ||
      url.includes(".geojson") ||
      url.includes(".json")
    ) {
      return "geojson";
    }

    return "unknown";
  }

  async _buildMapLayers(options) {
    this._isMapLoading = true;
    this._isLayerControlVisible = false;

    var layers = [];

    const inputFormat = this._getFileFormat(this._url);

    switch (inputFormat) {
      case "fgb":
        this._mapZoomExtent = await getFgbExtent(this._url);
        layers = buildFgbConfig(this._url, this._style);
        break;
      case "geojson":
        // "Fetch" data URI
        const fetchRes = await fetch(this._url);
        const featureCollection = await fetchRes.json();
        this._mapZoomExtent = await getGeojsonExtent(featureCollection);
        layers = buildGeojsonConfig(this._url, this._style);
        break;
      case "tif":
        this._mapZoomExtent = await getGeotiffExtent(this._url);
        layers = createGeoTiffConfig(this._url, this._style);
        break;
      default:
        console.warn(
          "File format not supported. Please use FGB, GeoTiff or COG files.",
        );
    }

    // Apply our OpenLayers style, for now it is simply added to each generated vector layer.
    //
    // NOTE: Generation for non-vector layers is disabled here because it leads to an
    //       app-breaking exception in the `eox-map` instance when the map is handling
    //       the style object.
    layers.forEach((layer) => {
      if (layer.type == "WebGLTile") {
        layer.style = this._style;
      } else if (layer.type == "Vector") {
        console.log(this._style);
        if (!this._style) {
          this._style = {};
        }
        layer.properties.layerConfig = {
          schema: this._style.jsonform,
          style: this._style,
          legend: this._style.legend,
        };
      }

      layer.opacity = 1.0;
    });

    this._mapLayers = layers;

    window.setTimeout(() => {
      this.renderRoot
        .querySelector("eox-jsonform")
        .editor.editors[
          "root.code"
        ]["ace_editor_instance"].textInput.getElement()
        .focus();
    }, 40);

    this._isMapLoading = false;

    // Give the map some time to load, so that EOxLayerControl can establish the link.
    window.setTimeout(() => {
      this._isLayerControlVisible = true;
    }, 40);
  }

  _updateLayerStyles() {
    console.log("updating styles");
    if (!this._mapLayers) return;

    const eoxMap = this.renderRoot.querySelector("eox-map");
    //const layerConfig = this.renderRoot.querySelector('eox-layercontrol')

    console.log(eoxMap.map.getLayers().getArray());

    // Create a new array with updated styles but same layer references
    const newLayers = this._mapLayers.map((layer) => {
      const updatedStyle = updateVectorLayerStyle(this._style);
      if (layer.type === "Vector") {
        const olLayer = eoxMap.map
          .getLayers()
          .getArray()
          .find((l) => l.get("id") === layer.properties.id);
        if (olLayer) {
          console.log("Updating style for layer");
          olLayer.setStyle(updatedStyle);
        }
      }
      if (layer.type === "Vector" || layer.type === "WebGLTile") {
        return {
          ...layer,
          style: updatedStyle,
        };
      }
      return layer;
    });
    this._mapLayers = [...newLayers]; // Trigger Lit update with new array reference
  }

  async onEditorInput(e) {
    // When pressing Enter to create new line, the logic responds weirdly and immediately
    // resets back to the previous state, effectively undoing the user's change.
    //
    // Here, we simply return early to prevent this from happening, basically skipping a bit.
    if (e.key === "Enter") return;

    // 1. Quit early if the map is currently already loading.
    if (this._isMapLoading) return;

    // 2. Retrieve the code the user has edited from the Ace Editor in `eox-jsonform`.
    const currentJSON = this.renderRoot
      .querySelector("eox-jsonform")
      .editor.getValue().code;

    // 3. Validate JSON string and return deserialized object if parsing was successful.
    var parseResult = tryParseJson(currentJSON);

    // 4. Rebuild map layers and set editor string if parsing succeeded.
    //
    // It is important to to only set the editor value only if the parsing was successful,
    // otherwise desynchronization sneaks in and messes with our formatting.

    if (parseResult !== false) {
      this._style = parseResult;
      await this._buildMapLayers({ shouldBoundsUpdate: true });
    }
  }

  firstUpdated() {
    if (!this._isInitialized) {
      this.#debouncedEditorFn = _debounce((e) => {
        this.onEditorInput(e);
      }, 650);

      // Build the map config
      this._buildMapLayers({ shouldBoundsUpdate: true });
      this._isInitialized = true;

      styleConvertExample();
    }

    window.setTimeout(() => {
      var aceEditor =
        this.renderRoot.querySelector("eox-jsonform").editor.editors[
          "root.code"
        ]["ace_editor_instance"];

      this.renderRoot
        .querySelector("eox-jsonform")
        .editor.editors[
          "root.code"
        ]["ace_editor_instance"].textInput.getElement()
        .addEventListener("keyup", this.#debouncedEditorFn);
    }, 100);
  }

  // Temporary function until I move the layer control box to a separate element.
  get layerControl() {
    return html`
      <div id="layercontrol" class="card scroll" style="max-width: 300px">
        <div style="width: 300px; height: 400px;">
          <eox-layercontrol
            idProperty="id"
            titleProperty="title"
            .tools="${["config", "legend"]}"
            .for="${this.renderRoot.querySelector("eox-map")}"
            @layerConfig:change="${() => {}}"
          >
          </eox-layercontrol>
        </div>
      </div>
    `;
  }

  render() {
    return html`
      <style>
        ${eoxUiStyle}
        ${componentStyle}
      </style>

      <style-import-dialog
        .isVisible="${this._isStyleImporterVisible}"
        @cancel="${(_e) => (this._isStyleImporterVisible = false)}"
        @loadstyle="${(e) => {
          this._style = e.detail;
          this._buildMapLayers();
        }}"
        @loadsld="${(e) => {
          const map = this.renderRoot.querySelector("eox-map");
          console.log(map.map.getLayers().getArray());
          map.map
            .getLayers()
            .getArray()
            .forEach((layer) => {
              if (layer.get("type") == "Vector") {
                console.log("Applying SLD");
                // Generate and apply the style function generated by `SLDReader`
                applySLD(layer, map.map, e.detail);

                const styleFunction = layer.getStyle();

                console.info(layer.getSource().getFeatures());

                // Create a dummy feature and resolution for the call
                const dummyFeature = layer.getSource().getFeatures()[0];

                for (const feature of layer.getSource().getFeatures()) {
                  console.log(
                    styleFunction(feature, map.map.getView().getResolution()),
                  );
                }
                const dummyResolution = 1;

                // Call the style function
                const style = styleFunction(dummyFeature, dummyResolution);

                console.log(style);

                // OL style functions may return a single style or an array
                let flatStyle;
                if (Array.isArray(style)) {
                  flatStyle = style[0]; // Use the first style if there's more than one
                } else {
                  flatStyle = style;
                }

                // Now, flatStyle is your “snapshot” flat style object.
                // You can inspect its properties, serialize, or present for editing.
                console.log(flatStyle);
              }
            });
        }}"
        @error="${this._handleError}"
      ></style-import-dialog>

      <div class="eodash-style-editor">
        <div class="snackbar error">${this._currentError}</div>
        <div
          class="snackbar error small-round ${this._currentError !== ""
            ? "active"
            : ""}"
        >
          <i>error</i> <b>Error:</b> ${this._currentError}
        </div>

        ${this._isMapLoading
          ? html`<div id="style-editor-loader">
              <div
                style="display: flex; width: 100%; height: 100%; justify-content: center; align-items: center"
              >
                <progress class="circle large"></progress>
              </div>
            </div>`
          : html`<eox-map
              id="map"
              .layers="${this._mapLayers}"
              .zoomExtent="${this._mapZoomExtent}"
              style="width: 100%; height: 100%;"
            >
              <eox-map-tooltip
                .propertyTransform="${this._tooltipPropertyTransform}"
              />
            </eox-map>`}

        <style-editor-toolbar
          style="z-index: 3000"
          url="${this._url}"
          @importstyle="${() => (this._isStyleImporterVisible = true)}"
          @submit="${(event) => {
            this._url = event.detail.uri;
            this._style = event.detail.style || {};
            this._buildMapLayers({ shouldBoundsUpdate: true });
          }}"
        ></style-editor-toolbar>

        <!--<div id="map-buttons">
          <button class="small-round small" style="
            background: #FFF;
            box-shadow: 0px 3px 7px 0px rgba(0,0,0,0.14);
            width: var(--map-button-size) !important;
          ">
            <i>
              <svg xmlns="http://www.w3.org/2000/svg" style="transform: translateY(1px);" viewBox="0 0 24 24"><title>layers</title><path fill="#004170" d="M12,16L19.36,10.27L21,9L12,2L3,9L4.63,10.27M12,18.54L4.62,12.81L3,14.07L12,21.07L21,14.07L19.37,12.8L12,18.54Z" /></svg>
            </i>
          </button>
        <div>-->

        ${this._isLayerControlVisible ? html`${this.layerControl}` : html``}

        <div class="sidebar">
          <div class="sidebar-items">
            <div class="card editor">
              <div class="editor-toolbar">
                <span class="start">
                  <div class="icon-container editor">
                    <div class="icon code-editor"></div>
                  </div>
                  <h3 class="editor-title">Untitled Style</h3>
                </span>
              </div>
              <eox-jsonform
                style="height: 100%; max-height: none;"
                .schema="${jsonFormConfig}"
                .value="${{ code: stringify(this._style, {}, 2) }}"
              ></eox-jsonform>
            </div>
          </div>
        </div>
      </div>
    `;
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
    `;
  }
}

window.customElements.define("eodash-style-editor", EodashStyleEditor);
