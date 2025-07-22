import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import eoxUiStyle from "@eox/ui/style.css?inline"

import componentStyle from "../styles/app.css?inline"

class StyleImportDialog extends LitElement {

  static properties = {
    isVisible: {
      type: Boolean,
      attribute: true,
    },
    _styleFormat: { type: String, state: true },
    _isLoading: { type: Boolean, state: true },
    _loadingHint: { type: String, state: true },
    _urlValue: { type: String, state: true },
    _selectedFormat: { type: String, state: true },
  }

  constructor() {
    super()

    this._isLoading = false
    this._loadingHint = "Loading data"
    this._selectedFormat = "openlayers"
  }

  _cancel() {
    this._isLoading = false

    const event = new CustomEvent('cancel', {
        bubbles: true,
        composed: true,
      })
      this.dispatchEvent(event)
  }

  async _loadStyleFromUrl(e) {
    this._isLoading = true
    this._loadingHint = "Downloading data"

    const { output: geostylerStyle } = await sldParser.readStyle(someSld);
    const { output: olStyle } = await olParser.writeStyle(geostylerStyle);
  }

  _urlInputHandler(e) {
    this._urlValue = e.target.value
    console.log(this._urlValue)
  }

  _dropHandler(e) {
  }

  _dropoverHandler(e) {
  }

  render() {
    return html`
      <style>
        ${eoxUiStyle}
        ${componentStyle}

        .gradient {
          animation-duration: 1.8s;
          animation-fill-mode: forwards;
          animation-iteration-count: infinite;
          animation-name: placeHolderShimmer;
          animation-timing-function: linear;
          background: #f6f7f8;
          background: linear-gradient(to right, #fafafa 8%, #f4f4f4 38%, #fafafa 54%);
          background-size: 1000px 640px;
          position: relative;
        }

        @keyframes placeHolderShimmer {
          0%{
              background-position: -468px 0
          }
          100%{
              background-position: 468px 0
          }
        }
      </style>
      <dialog class="top ${this.isVisible ? 'active' : ''}" style="z-index: 4000; background: #FFF;">
        <h5>Import style</h5>
        <div>Upload a local file from your computer via the file selector or drag-and-drop interface, or use the URL field to download a style file from the Internet.</div>
        ${
          this._isLoading
            ? html`
              <nav class="center-align middle-align gradient rounded small" style="height: 170px; background: #00417022">
                <progress class="circle"></progress>
                <h6 class="small" style="margin-left: 6px;">${this._loadingHint}</h6>
              </nav>
            `
            : html`
              <nav style="align-items: flex-start; height: 250px;">
                <fieldset style="height: 250px;">
                  <legend>Format</legend>
                  <nav class="vertical">
                    <label class="radio" @click="${this._selectedFormat = 'openlayers'}">
                      <input type="radio" name="format" checked />
                      <span>OpenLayers Flat Style</span>
                    </label>
                    <label class="radio" @click="${this._selectedFormat = 'mapbox'}">
                      <input type="radio" name="format" />
                      <span>Mapbox Style</span>
                    </label>
                    <label class="radio" @click="${this._selectedFormat = 'qml'}">
                      <input type="radio" name="format" />
                      <span>QGIS / QML</span>
                    </label>
                    <label class="radio" @click="${this._selectedFormat = 'sld'}">
                      <input type="radio" name="format" />
                      <span>Styled Layer Descriptor (.sld)</span>
                    </label>
                    <label class="radio" @click="${this._selectedFormat = 'arcgis'}">
                      <input type="radio" name="format" />
                      <span>ArcGIS</span>
                    </label>
                  </nav>
                </fieldset>

                <fieldset style="height: 250px;">
                  <legend>Upload file</legend>
                  <nav class="vertical">
                    <button>
                      <i>attach_file</i>
                      <span>Upload file</span>
                      <input type="file">
                    </button>
                    <nav class="no-space small">
                      <div class="field border prefix left-round small">
                        <i>link</i>
                        <input
                          type="text"
                          placeholder="Enter URL"
                          .value="${this._urlValue || ''}"
                          @input="${this._urlInputHandler}"
                        />
                      </div>

                      <button
                        class="right-round"
                        @click="${this._loadStyleFromUrl}"
                      >
                        Import from URL
                      </button>
                    </nav>
                  </nav>
                </fieldset>
                <nav
                  style="
                    flex: 1 0 auto;
                    border: 2px #999 dashed;
                    border-radius: 12px;
                    margin: 10px 0 0 0;
                    justify-content: center;
                    align-items: center;
                    user-select: none;
                  "
                >
                  <i class="large">upload</i>
                  <h6>Drop a file into this zone to upload</h6>
                </nav>
              </nav>
            `
        }
        <nav class="right-align">
          <button class="border" @click="${this._cancel}">Cancel</button>
        </nav>
      </dialog>
    `
  }
}

customElements.define('style-import-dialog', StyleImportDialog)