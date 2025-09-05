
'use server';

/**
 * @fileOverview A tool for the AI to navigate the application.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const navigateTo = ai.defineTool(
  {
    name: 'navigateTo',
    description: 'Navigates the user to a specific page within the Sentry application. Use this when the user asks to go to a page, open a feature, or view a specific section.',
    inputSchema: z.object({
      destination: z.enum([
        "dashboard", 
        "feed", 
        "messages", 
        "discover", 
        "workspaces", 
        "workmate-radar", 
        "news", 
        "courses", 
        "billing", 
        "profile", 
        "settings"
      ]).describe('The destination page key.'),
    }),
    outputSchema: z.object({
        answer: z.string(),
        destination: z.string().optional(),
    }),
  },
  async (input) => {
    // This function's primary job is to structure the output for the flow.
    // The actual navigation will be handled by the client-side code that calls the flow.
    return {
      answer: `Navigating you to the ${input.destination} page.`,
      destination: input.destination,
    };
  }
);
