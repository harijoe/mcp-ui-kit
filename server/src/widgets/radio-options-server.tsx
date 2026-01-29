// Radio Options widget configuration
export const radioOptionsWidget = {
  name: "radio-options" as const,
  metadata: {
    description: "Radio Options Selector",
  },
  toolConfig: {
    description: "Display radio options to choose from.",
    inputSchema: {},
  },
  handler: async () => {
    try {
      return {
        structuredContent: {},
        content: [],
        isError: false,
      };
    } catch (error) {
      return {
        content: [{ type: "text" as const, text: `Error: ${error}` }],
        isError: true,
      };
    }
  },
};
