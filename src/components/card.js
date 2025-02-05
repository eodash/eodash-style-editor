import { LitElement, html, css } from "lit";
import cardCss from "./card.css?inline"

export class Card extends LitElement {
  constructor() {
    super()
  }

  render() {
    return html`
      <style>
        ${cardCss}
      </style>
      <div
        class="w-116 h-32 bg-white rounded-lg mb-6 shadow-md opacity-75 backdrop-blur-md"
      >
        <slot></slot>
      </div>
    `;
  }
}

window.customElements.define("eodash-style-editor-card", Card)