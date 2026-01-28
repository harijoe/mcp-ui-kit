import { z } from "zod";

// Radio Options widget configuration
export const radioOptionsWidget = {
  name: "radio-options" as const,
  metadata: {
    description: "Radio Options Selector",
  },
  toolConfig: {
    description: "Display a question with radio options to choose from.",
    inputSchema: {
      question: z.string().describe("The question to display"),
    },
  },
  handler: async ({ question }: { question: string }) => {
    try {
      return {
        structuredContent: { question },
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
