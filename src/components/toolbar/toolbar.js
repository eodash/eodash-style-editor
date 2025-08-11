import { LitElement, html, css, unsafeCSS } from "lit";

import staticStyle from "./toolbar.css?inline";
import examples from "./examples.json?inline";

import eoxUiStyle from "@eox/ui/style.css?inline";

export class StyleEditorToolbar extends LitElement {
  constructor() {
    super();
    this._isInitialized = false;
    this._isFormatDropdownVisible = false;
  }

  firstUpdated() {
    if (!this._isInitialized) {
      this._inputValue = this.url;
      this._isInitialized = true;
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
    enableStyleImport: {
      type: String,
      attribute: true,
    },
    /**
     * The current value of the internal input field.
     */
    _inputValue: {
      state: true,
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
    return [unsafeCSS(staticStyle)];
  }

  _onSelectExample(evt) {
    const foundExample = examples.find(
      (example) => example.name === evt.target.value,
    );

    if (foundExample) {
      this._inputValue = foundExample.uri;
      const event = new CustomEvent("submit", {
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

  _openStyleImportModal() {
    const event = new CustomEvent("importstyle", {
      detail: "foo",
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  _triggerFileLoad(_e) {
    console.log("triggerFileLoad");
    console.log(this._inputValue);
    const event = new CustomEvent("submit", {
      detail: {
        uri: this._inputValue,
      },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  _onInput(e) {
    console.log("Toolbar onInput");
    this._inputValue = e.target.value;
  }

  render() {
    return html`
      <style>
        ${eoxUiStyle} .examples-container {
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
          <nav
            class="no-space small"
            style="height: 40px; width: 100%; margin-block-start: 0"
          >
            <div class="max field border left-round small">
              <input
                class="round small"
                value="${this._inputValue}"
                @input="${this._onInput}"
                style="font-size: 0.9rem;"
                type="text"
                placeholder="Paste a link here to load geometry"
              />
            </div>
            <button @click="${this._triggerFileLoad}" class="right-round">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>import</title>
                <path
                  d="M14,12L10,8V11H2V13H10V16M20,18V6C20,4.89 19.1,4 18,4H6A2,2 0 0,0 4,6V9H6V6H18V18H6V15H4V18A2,2 0 0,0 6,20H18A2,2 0 0,0 20,18Z"
                />
              </svg>
              <span>Open</span>
            </button>
            <button
              @click="${this._openStyleImportModal}"
              style="margin-left: 9px; display: ${this.enableStyleImport
                ? "flex"
                : "none"}"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>palette-swatch</title>
                <path
                  d="M2.53,19.65L3.87,20.21V11.18L1.44,17.04C1.03,18.06 1.5,19.23 2.53,19.65M22.03,15.95L17.07,4C16.76,3.23 16.03,2.77 15.26,2.75C15,2.75 14.73,2.79 14.47,2.9L7.1,5.95C6.35,6.26 5.89,7 5.87,7.75C5.86,8 5.91,8.29 6,8.55L11,20.5C11.29,21.28 12.03,21.74 12.81,21.75C13.07,21.75 13.33,21.7 13.58,21.6L20.94,18.55C21.96,18.13 22.45,16.96 22.03,15.95M7.88,8.75A1,1 0 0,1 6.88,7.75A1,1 0 0,1 7.88,6.75C8.43,6.75 8.88,7.2 8.88,7.75C8.88,8.3 8.43,8.75 7.88,8.75M5.88,19.75A2,2 0 0,0 7.88,21.75H9.33L5.88,13.41V19.75Z"
                />
              </svg>
              <span>Import style</span>
            </button>
          </nav>

          <div
            class="field suffix border round small"
            style="width: 270px; margin-top: 0; margin-left: 9px; background: #FFF;"
          >
            <select
              @change="${(e) => this._onSelectExample(e)}"
              style="font-size: .875rem; cursor: pointer;"
            >
              <option>Polar Ice FGB</option>
              <option>Crop Circles COG</option>
              <option>GeoJSON</option>
              <option>GeoJSON with Tooltip</option>
            </select>
            <i>arrow_drop_down</i>
          </div>
        </div>
      </div>
    `;
  }
}

window.customElements.define("style-editor-toolbar", StyleEditorToolbar);
