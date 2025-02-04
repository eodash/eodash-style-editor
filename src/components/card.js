import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('ese-card')
export class MyCard extends LitElement {
 static styles = css`
   :host {
     display: flex;
   }
   div {
     display: flex;
   }
 `;

 render() {
   return html`
     <div>
       <slot></slot>
     </div>
   `;
 }
}