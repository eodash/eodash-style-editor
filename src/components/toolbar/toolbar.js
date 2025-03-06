import { LitElement, html, css, unsafeCSS } from "lit";
import staticStyle from "./toolbar.css?inline"

export class StyleEditorToolbar extends LitElement {
  constructor() {
    super()
    this._isInitialized = false
  }

  firstUpdated() {
    if (!this._isInitialized) {
      this._inputValue = this.url
      this._isInitialized = true
    }
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
  };

  static get styles() {
    return [unsafeCSS(staticStyle )];
  }

  _triggerFileLoad(_e) {
    console.log("triggerFileLoad")
    console.log(this._inputValue)
    const event = new CustomEvent('submit', {
      detail: this._inputValue,
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
      <div class="style-editor-toolbar">
        <div class="flex">
          <div id="logo">
            <img src="/eodash-style-editor/EOX_Eye.svg" width="32" />
          </div>
          <input
            id="geometry-url-input"
            type="text"
            value="${this._inputValue}"
            @input="${this._onInput}"
            placeholder="Paste a link here to load geometry"
          />

          <a
            class="load-button flex justify-center items-center text-white font-bold"
            @click="${this._triggerFileLoad}"
          >
            Load
          </a>
        </div>
      </div>
    `;
  }
}

window.customElements.define("style-editor-toolbar", StyleEditorToolbar)