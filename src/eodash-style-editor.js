import { LitElement, css, html } from "lit"

import "@eox/layout";
import "@eox/map";
import "@eox/jsonform";

import "./fonts/IBMPlexMono-Regular.ttf";

const maxEditorHeight = 276;

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
        :root, eodash-style-editor {
          width: 100vw;
          height: 100vh;
          max-width: 100vw;
          max-height: 100vh;
        }
        #navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 36px;
        }

        eox-map {
          width: 100vw;
          height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
        }

        .sidebar {
          position: fixed;
          left: 0;
          top: 0;
          width: 600px;
          height: 100vh;
          padding: 20px;
        }

        .sidebar-items {
          display: flex;
          flex-direction: column;
        }

        .editor-toolbar {
          position: absolute;
          left: 16px;
          top: 0;
          right: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 64px;
        }

        .editor-toolbar span {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 64px;
        }

        .editor-toolbar span.start {
          justify-content: flex-start;
        }

        .editor-toolbar span.end {
          justify-content: flex-end;
        }

        .icon-container {
          width: 36px;
          height: 36px;
          background: #0006;
          border-radius: 6px;
          margin-right: 16px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .icon-container.blue {
          background: #509CCF;
        }

        .icon {
          height: 24px;
          width: 24px;
          /* Position the icon properly */
          background-position: center;
          background-repeat: no-repeat;
        }

        .icon.layer-control {
          background-image: url("data:image/svg+xml,%3Csvg fill='%23FFF' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ctitle%3Elayers%3C/title%3E%3Cpath d='M12,16L19.36,10.27L21,9L12,2L3,9L4.63,10.27M12,18.54L4.62,12.81L3,14.07L12,21.07L21,14.07L19.37,12.8L12,18.54Z' /%3E%3C/svg%3E");
        }

        .icon.code-editor {
          background-image: url("data:image/svg+xml,%3Csvg fill='%23FFF' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ctitle%3Ecode-braces%3C/title%3E%3Cpath d='M8,3A2,2 0 0,0 6,5V9A2,2 0 0,1 4,11H3V13H4A2,2 0 0,1 6,15V19A2,2 0 0,0 8,21H10V19H8V14A2,2 0 0,0 6,12A2,2 0 0,0 8,10V5H10V3M16,3A2,2 0 0,1 18,5V9A2,2 0 0,0 20,11H21V13H20A2,2 0 0,0 18,15V19A2,2 0 0,1 16,21H14V19H16V14A2,2 0 0,1 18,12A2,2 0 0,1 16,10V5H14V3H16Z' /%3E%3C/svg%3E");
        }

        .editor-title {
          font-family: 'IBM Plex Mono';
          font-weight: 700;
          font-size: 16px;
          color: #051E2E;
        }

        .card {
          position: relative;
          display: flex;
          padding: 20px 20px;
          border-radius: 12px;
          width: 560px;
          min-height: 300px;
          background: #fffa;
          box-shadow: 0px 3px 5px 0px rgba(0,0,0,0.17);
          backdrop-filter: blur(10px);
          overflow: hidden;
        }

        eox-jsonform {
          position: absolute;
          left: 0;
          top: 40px;
          right: 0;
          height: 300px;
          max-height: 300px;
        }

        h1, h2, h3, h4, h5, h6 {
          margin: 0;
        }

        .row {
          margin-bottom: 16px;
        }

        #geometry-url-input {
          width: calc(100% - 120px);
          background: white;
          border: none;
          height: 48px;
          color: #333;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 500;
          padding-left: 16px;
        }
      </style>

      <div class="eodash-style-editor">
        <eox-map
          .center='${[15,48]}'
          .layers='${[{"type":"Tile","source":{"type":"OSM"}}]}'
          .zoom='${7}'
          style="width: 100%; height: 100%;">
        </eox-map>

        <div class="sidebar">
          <div class="sidebar-items">
            <div class="row">
              <input
                id="geometry-url-input"
                type="text"
                placeholder="Paste a link here to load geometry"
              />
            </div>
            <div class="card">
              <div class="editor-toolbar">
                <span class="start">
                  <div class="icon-container editor blue">
                    <div class="icon code-editor"></div>
                  </div>
                  <h3 class="editor-title">Untitled Style</h3>
                </span>
              </div>
              <eox-jsonform
                .schema='${{"type":"object","properties":{"code":{"type":"string","title":" ","description":"","format":"json","options":{"ace":{"tabSize":2, "fontSize": 14, "fontFamily": "'IBM Plex Mono'", "maxPixelHeight": maxEditorHeight}}}}}}'
                .value='${{"code":"{\n  \"hello\": \"world\"\n}"}}'
              ></eox-jsonform>
            </div>

            <!--<eox-layercontrol for"eox-map" />-->
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
