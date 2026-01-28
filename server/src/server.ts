import { McpServer } from "skybridge/server";
import { basicAnswerWidget } from "./widgets/basic-answer-server";
import { ecomCarouselWidget } from "./widgets/ecommerce-products-server";
import { radioOptionsWidget } from "./widgets/radio-options-server";

const server = new McpServer(
  {
    name: "mcp-ui-kit",
    version: "0.0.1",
  },
  { capabilities: {} }
)
  .registerWidget(
    basicAnswerWidget.name,
    basicAnswerWidget.metadata,
    basicAnswerWidget.toolConfig,
    basicAnswerWidget.handler
  )
  .registerWidget(
    ecomCarouselWidget.name,
    ecomCarouselWidget.metadata,
    ecomCarouselWidget.toolConfig,
    ecomCarouselWidget.handler
  )
  .registerWidget(
    radioOptionsWidget.name,
    radioOptionsWidget.metadata,
    radioOptionsWidget.toolConfig,
    radioOptionsWidget.handler
  );

export default server;
export type AppType = typeof server;
