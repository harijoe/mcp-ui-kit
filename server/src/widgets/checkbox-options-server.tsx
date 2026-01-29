// Checkbox Options widget configuration
export const checkboxOptionsWidget = {
  name: "checkbox-options" as const,
  metadata: {
    description: "Checkbox Options Selector",
  },
  toolConfig: {
    description: "Display checkbox options to choose from.",
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
