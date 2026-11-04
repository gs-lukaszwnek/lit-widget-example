import "./hello-card";
import type { HelloCard } from "./hello-card";
import type { WidgetSDK, WidgetProps } from "./types";

export async function init(sdk: WidgetSDK) {
  await sdk.whenReady();
  const root = sdk.shadowRoot.querySelector("#root")!;
  const card = document.createElement("hello-card") as HelloCard;
  root.append(card);

  const render = (props: WidgetProps) => {
    card.heading = props.title ?? "";
  };

  render(sdk.getProps());
  sdk.on("propsChanged", render);
  sdk.on("destroy", () => card.remove());
}
