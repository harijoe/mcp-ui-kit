import { z } from "zod";
import { tableData } from "../data/table-data";

// Data Table widget configuration
export const dataTableWidget = {
  name: "basic-table" as const,
  metadata: {
    description: "Data Table Display",
  },
  toolConfig: {
    description: "Display a table of data based on a question.",
    inputSchema: {
      question: z.string().describe("The question or title for the table"),
    },
  },
  handler: async ({ question }: { question: string }) => {
    try {
      return {
        structuredContent: { question, tableData },
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
