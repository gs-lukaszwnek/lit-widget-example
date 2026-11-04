import type { WidgetSDK } from "@gainsight-hub/sdk";
import "./hello-card";
import type { HelloCard } from "./hello-card";

export async function init(sdk: WidgetSDK) {
  await sdk.whenReady();
  const card = sdk.$<HelloCard>("hello-card")!;
  const render = (props: { title?: string }) => {
    card.heading = props.title ?? "";
  };

  render(sdk.getProps());
  sdk.on("propsChanged", render);
}
