import { McpServer } from "skybridge/server";
import { basicAnswerWidget } from "./widgets/basic-answer-server";
import { ecomCarouselWidget } from "./widgets/ecommerce-products";

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
  );

export default server;
export type AppType = typeof server;
