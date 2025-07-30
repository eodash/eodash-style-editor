import { LitElement, html, css } from "lit"
import { property, state } from "lit/decorators.js"
import eoxUiStyle from "@eox/ui/style.css?inline"

import StyleParser from "../lib/style/style-parser.js"

import componentStyle from "../styles/app.css?inline"

class StyleImportDialog extends LitElement {

  static properties = {
    isVisible: {
      type: Boolean,
      attribute: true,
    },
    _isLoading: { type: Boolean, state: true },
    _loadingHint: { type: String, state: true },
    _urlValue: { type: String, state: true },
    _selectedFormat: { type: String, state: true },
    _validationErrors: { type: Object, state: true },
    _loadingIndicators: { type: Object, state: true },
  }

  constructor() {
    super()

    this._isLoading = false
    this._loadingHint = "Loading data"
    this._urlValue = ""
    this._selectedFormat = "eodash"
    this._validationErrors = []
    this._loadingIndicators = { "url-input": false }
  }

  _cancel() {
    // Reset any errors and loading indicators
    this._isLoading = false
    this._validationErrors = []

    const event = new CustomEvent('cancel', {
        bubbles: true,
        composed: true,
      })
      this.dispatchEvent(event)
  }

  async _loadStyleFromUrl(e) {
    // Reset all errors first.
    this._validationErrors = this._validationErrors.filter(error => error.region != "url-input")

    //
    // 1. Preflight checks
    //

    // 1.1 The URL input could be empty
    if (this._urlValue.length === 0) {
      this._reportError("url-input", "URL field cannot be empty")
      return
    }

    // 1.2 The URL could be malformed
    try {
      // Try to parse the string from the input into a `URL` object.
      // The following line will throw an error if the text is not a URL.
      const _testUrl = new URL(this._urlValue);
    } catch (_) {
      this._reportError("url-input", "The provided input is not a valid web address")
      return
    }

    /*
    this._loadingIndicators = {
      "url-input": true,
    }*/
    this._isLoading = true
    this._loadingHint = "Downloading data from URL"

    var styleParser = new StyleParser()

    const response = await fetch(this._urlValue);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const styleString = await response.text();
    console.log(this._selectedFormat)
    switch (this._selectedFormat) {
      case "qml":
        console.log(`Trying to parse QML style: ${styleString}`)
        console.log(await styleParser.parseQML(styleString))
        break
      case "sld":
        break
    }
/*
    const { output: geostylerStyle } = await sldParser.readStyle(someSld);
    const { output: olStyle } = await olParser.writeStyle(geostylerStyle);
*/
  }

  _urlInputHandler(e) {
    this._urlValue = e.target.value

    // Trigger auto-loading of the URL when one is entered into the input.
    try {
      // Try to parse the string from the input into a `URL` object.
      // The following line will throw an error if the text is not a URL.
      const _testUrl = new URL(this._urlValue);

      // This will only execute if the URL is parsed successfully.
      this._loadStyleFromUrl()
    } catch (_) {
      this._reportError("url-input", "The provided input is not a valid web address")
      return
    }
  }

  _dropHandler(e) {
  }

  _dropoverHandler(e) {
  }

  _reportError(region, description) {
    const error = {
      region,
      description,
    }
    // Make sure the property is reactive in the UI by re-setting the entire variable.
    // Also, ensure to not add another error if it is already there.
    if (this._validationErrors.find(e => 
          e.region === error.region 
          && e.description === error.description) == undefined) {
      console.log(`Reporting error in ${region}, ${description}`)

      this._validationErrors = [
        ...this._validationErrors,
        error,
      ]
    } else {
      console.log(`Error already reported`)
    }

    console.log(this._validationErrors)
  }

  get _hasUrlInputError() {
    return this._validationErrors.find(e => e.region === "url-input") !== undefined
  }

  get _isUrlInputLoading() {
    return this._loadingIndicators["url-input"]
  }

  get _urlInputErrors() {
    return this._validationErrors.filter(e => e.region === "url-input")
  }

  render() {
    const dialogFieldsetHeight = 250
    const fileUrlRowHeight = 50

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
              <nav class="center-align middle-align gradient rounded small" style="height: ${dialogFieldsetHeight}px; background: #00417022">
                <progress class="circle"></progress>
                <h6 class="small" style="margin-left: 6px;">${this._loadingHint}</h6>
              </nav>
            `
            : html`
              <eox-layout
                gap="16"
                style="height: ${dialogFieldsetHeight}px; width: 100%;"
              >
                <eox-layout-item h="12" w="4" x="0" y="0">
                  <fieldset style="height: ${dialogFieldsetHeight}px;">
                    <legend>Format</legend>
                    <nav class="vertical">
                      <label class="radio" @click="${() => this._selectedFormat = 'eodash'}">
                        <input type="radio" name="format" />
                        <span>Eodash Style</span>
                      </label>

                      <label class="radio" @click="${() => this._selectedFormat = 'openlayers'}">
                        <input type="radio" name="format" />
                        <span>OpenLayers Flat Style</span>
                      </label>

                      <label class="radio" @click="${() => this._selectedFormat = 'sld'}">
                        <input type="radio" name="format" />
                        <span>Styled Layer Descriptor (.sld)</span>
                      </label>
                    </nav>
                  </fieldset>
                </eox-layout-item>
                <eox-layout-item
                  h="3" w="8" x="4" y="0"
                  style="padding-top: 10px;"
                >
                  <nav class="small">
                    <button>
                      <i>attach_file</i>
                      <span>Upload file</span>
                      <input type="file">
                    </button>
                    <div
                      class="field border prefix
                        round small ${this._hasUrlInputError ? 'invalid' : ''}"
                      style="width: calc(100% - 200px);"

                    >
                      <i>link</i>
                      <input
                        type="text"
                        placeholder="Paste a web address here to load from a website"
                        .value="${this._urlValue || ''}"
                        @input="${this._urlInputHandler}"
                        style="width: 100%;"
                      />
                      ${this._urlInputErrors
                        .map(error =>
                          html`<span
                            class="error"
                            style="display: ${this._hasUrlInputError ? 'flex' : 'none'}"
                          >
                            ${error.description}
                          </span>`
                        )
                      }
                    </div>

                    <!--<button
                      class="right-round"
                      @click="${this._loadStyleFromUrl}"
                    >
                      ${
                        this._isUrlInputLoading
                          ? html`<progress class="circle small"></progress>`
                          : html`Import from URL`
                      }
                    </button>-->
                  </nav>
                </eox-layout-item>
                <eox-layout-item h="9" w="8" x="4" y="3">
                  <nav
                    style="
                      width: 100%;
                      height: 100%;
                      flex: 1 0 auto;
                      border: 2px #999 dashed;
                      border-radius: 12px;
                      margin: 0 0 0 0;
                      justify-content: center;
                      align-items: center;
                      user-select: none;
                      cursor: grab;
                    "
                  >
                    <i class="large">upload</i>
                    <h6>Drop a file into this zone to upload</h6>
                  </nav>
                </eox-layout-item>
              </eox-layout>
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