
'use server';

/**
 * @fileOverview A tool for the AI to navigate the application.
 */
import { SearchAIOutputSchema } from "@/ai/schemas/search-ai";
import { z } from "zod";

const NavigationInputSchema = z.object({
  destination: z.string().describe('The page to navigate to, e.g., "dashboard", "profile".'),
});

export async function navigateTo(args: z.infer<typeof NavigationInputSchema>): Promise<z.infer<typeof SearchAIOutputSchema>> {
  // This function's primary job is to structure the output for the flow.
  // The actual navigation will be handled by the client-side code that calls the flow.
  return {
    answer: `Navigating you to the ${args.destination} page.`,
    destination: args.destination,
  };
}
