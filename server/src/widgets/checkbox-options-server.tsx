import { z } from "zod";

// Checkbox Options widget configuration
export const checkboxOptionsWidget = {
  name: "checkbox-options" as const,
  metadata: {
    description: "Checkbox Options Selector",
  },
  toolConfig: {
    description: "Display a question with checkbox options to choose from.",
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
