
'use server';

/**
 * @fileOverview A tool for the AI to navigate the application.
 */
import { openai } from '@/ai/inference';

export const navigateToSchema = {
    type: 'function',
    function: {
        name: 'navigateTo',
        description: 'Navigates the user to a specific page within the Sentry application. Use this when the user asks to go to a page, open a feature, or view a specific section.',
        parameters: {
            type: 'object',
            properties: {
                destination: {
                    type: 'string',
                    enum: [
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
                    ],
                    description: 'The destination page key.',
                }
            },
            required: ['destination'],
        }
    }
}


export async function navigateTo(args: { destination: string }) {
    // This function's primary job is to structure the output for the flow.
    // The actual navigation will be handled by the client-side code that calls the flow.
    return JSON.stringify({
      answer: `Navigating you to the ${args.destination} page.`,
      destination: args.destination,
    });
  }

