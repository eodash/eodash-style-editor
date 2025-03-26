import { LitElement, html, css, unsafeCSS } from "lit"

import staticStyle from "./toolbar.css?inline"
import examples from "./examples.json?inline"

import eoxUiStyle from "@eox/ui/style.css?inline"

export class StyleEditorToolbar extends LitElement {
  constructor() {
    super()
    this._isInitialized = false
    this._isFormatDropdownVisible = false
  }

  firstUpdated() {
    if (!this._isInitialized) {
      this._inputValue = this.url
      this._isInitialized = true
    }
/*
    this.renderRoot
      .querySelector("#toolbar-format-dropdown")
      .addEventListener("blur", (_e) => {
        this._isFormatDropdownVisible = false
        this.requestUpdate()
      })

    this.renderRoot
      .querySelector("#toolbar-format-dropdown")
      .focus()
*/
  }

  static properties = {
    /**
     * The default URL value given to the input within the toolbar.
     */
    url: {
      type: String,
      attribute: true,
    },
    /**
     * The current value of the internal input field.
     */
    _inputValue: {
      state: true
    },
    _isInitialized: {
      state: true,
    },
    _isFormatDropdownVisible: {
      state: true,
    },
    _selectedFormat: {
      state: true,
    },
  };

  static get styles() {
    return [unsafeCSS(staticStyle )];
  }

  _onSelectExample(evt) {
    const foundExample = examples
      .find((example) => example.name === evt.target.value)

    if (foundExample) {
      this._inputValue = foundExample.uri
      const event = new CustomEvent('submit', {
        detail: {
          uri: this._inputValue,
          style: foundExample.style,
        },
        bubbles: true,
        composed: true,
      });
      this.dispatchEvent(event);
    }
  }

  _triggerFileLoad(_e) {
    console.log("triggerFileLoad")
    console.log(this._inputValue)
    const event = new CustomEvent('submit', {
      detail: {
        uri: this._inputValue,
      },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  _onInput(e) {
    console.log("Toolbar onInput")
    this._inputValue = e.target.value
  }

  render() {
    return html`
      <style>
        ${eoxUiStyle}

        .examples-container {
          position: absolute;
          width: 100vw;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .examples-container > * {
          max-width: 1000px;
        }
      </style>
      <div class="style-editor-toolbar">
        <div class="flex">
          <div id="logo">
            <img src="/eodash-style-editor/EOX_Eye.svg" width="32" />
          </div>
          <input
            style="font-size: 0.9rem;"
            type="text"
            value="${this._inputValue}"
            @input="${this._onInput}"
            placeholder="Paste a link here to load geometry"
          />

          <button
            @click="${this._triggerFileLoad}"
            style="
              background: #004170 !important;
              color: #FFF !important;
              font-weight: 700 !important;
              margin: 0;
              min-width: 54px;
            "
            class="primary right-round fill"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>import</title><path d="M14,12L10,8V11H2V13H10V16M20,18V6C20,4.89 19.1,4 18,4H6A2,2 0 0,0 4,6V9H6V6H18V18H6V15H4V18A2,2 0 0,0 6,20H18A2,2 0 0,0 20,18Z" /></svg>
            <span>Load</span>
          </button>

          <div class="field suffix border round small" style="width: 270px; margin-top: 0; margin-left: 9px; background: #FFF;">
            <select @change="${(e) => this._onSelectExample(e)}" style="font-size: .875rem; cursor: pointer;">
              <option>Polar Ice FGB</option>
              <option>Crop Circles COG</option>
              <option>Inline GeoJSON</option>
            </select>
            <i>arrow_drop_down</i>
          </div>
        </div>
      </div>
    `;
  }
}

window.customElements.define("style-editor-toolbar", StyleEditorToolbar)