import { LitElement, css, html } from 'lit'
import { createRef, ref } from "lit/directives/ref.js"
import litLogo from './assets/lit.svg'
import viteLogo from '/vite.svg'

import '@eox/layout';
import '@eox/map';

import * as monaco from 'monaco-editor';
import editorStyle from "monaco-editor/min/vs/editor/editor.main.css?inline"
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === "json") {
      return new jsonWorker()
    }
    return new jsonWorker()
  },
};

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
export class MyElement extends LitElement {
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
    this.docsHint = 'Click on the Vite and Lit logos to learn more'
    this.count = 0

    this.editorValue = "{}"
    this.editor = null
  }

  firstUpdated() {
    // Initialize Monaco editor after the first render
    this._initializeEditor()
  }

  disconnectedCallback() {
    // Clean up the editor when the component is removed
    if (this.editor) {
      //this.editor.dispose()
    }
    super.disconnectedCallback()
  }

  async _initializeEditor() {
    const editorElement = this.shadowRoot.querySelector('#code-editor');
    
    if (editorElement && !this.editor) {
      console.log('Creating editor instance ...');
      this.editor = monaco.editor.create(editorElement, {
        value: this.editorValue,
        language: 'json',
        fontSize: 15,
        theme: 'vs', // Optional: use dark theme,
      });

      // Force a layout recalculation after creation
      requestAnimationFrame(() => {
        this.editor.layout();
        // Sometimes needs a second layout call
        requestAnimationFrame(() => {
          this.editor.layout();
        });
      });

      // Add layout handler for container resizes
      const resizeObserver = new ResizeObserver(() => {
        // Get explicit dimensions
        const bounds = editorElement.getBoundingClientRect();
        this.editor.layout({
          width: bounds.width,
          height: bounds.height
        });
      });
      resizeObserver.observe(editorElement);

      // Optional: Handle editor content changes
      this.editor.onDidChangeModelContent(() => {
        this.editorValue = this.editor.getValue();
        this.dispatchEvent(new CustomEvent('editor-change', {
          detail: { value: this.editorValue },
          bubbles: true,
          composed: true
        }));
      });
    }
  }

  render() {
    return html`
      <style>
        ${editorStyle}

        #navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 36px;
        }
      </style>

      <eox-layout style="width: 100vw; height: 100vh;">
        <eox-layout-item id="navbar" x="0" y="0" w="12" h="1" style="background: #FFF; border-bottom: 2px solid #CCCCC9;">
          <img src="/EOX_logo.svg" style="height: 32px;" />
          <h1>eodash style editor</h1>
        </eox-layout-item>

        <eox-layout-item x="0" y="1" w="4" h="11">
          <div id="code-editor" style="height: 100%; width: 100%;"></div>
        </eox-layout-item>

        <eox-layout-item x="4" y="1" w="8" h="11" style="background: white">
          <eox-map
            .center='${[15,48]}'
            .layers='${[{"type":"Tile","source":{"type":"OSM"}}]}'
            .zoom='${7}'
            style="width: 100%; height: 100%;">
          </eox-map>
        </eox-layout-item>
      </eox-layout>
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

window.customElements.define('my-element', MyElement)
