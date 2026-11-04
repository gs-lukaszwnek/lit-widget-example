import { LitElement, css, html } from "lit";

export class HelloCard extends LitElement {
  static properties = {
    heading: { type: String },
    count: { type: Number, state: true },
  };

  static styles = css`
    :host {
      display: block;
    }
    h3 {
      color: var(--config-test-color, rgb(255, 0, 0));
    }
  `;

  declare heading: string;
  declare count: number;

  constructor() {
    super();
    this.heading = "";
    this.count = 0;
  }

  render() {
    return html`
      <h3>${this.heading}</h3>
      <button @click=${() => this.count++}>clicked ${this.count}</button>
    `;
  }
}

if (!customElements.get("hello-card")) customElements.define("hello-card", HelloCard);
