
'use server';

/**
 * @fileOverview A tool for the AI to perform web searches.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const searchTheWeb = ai.defineTool(
  {
    name: 'searchTheWeb',
    description: 'Searches the web for information on a given topic. Use this when you need external information to answer a user\'s question.',
    inputSchema: z.object({
      query: z.string().describe('The search query.'),
    }),
    outputSchema: z.string().describe('The search results in a summarized string format.'),
  },
  async (input) => {
    console.log(`[Web Search Tool] Searching for: ${input.query}`);

    // In a real application, this would call a search engine API (e.g., Google Search API).
    // For this example, we'll return hardcoded results for specific queries to simulate the tool's behavior.
    
    if (input.query.toLowerCase().includes('top designers in london')) {
        return JSON.stringify([
            { name: 'Es Devlin', specialty: 'Stage Design, Large-Scale Installations', note: 'Known for her spectacular stage sets for artists like Beyoncé and U2.' },
            { name: 'Tom Dixon', specialty: 'Product & Interior Design', note: 'An industrial designer famous for his lighting and furniture.' },
            { name: 'Kelly Hoppen', specialty: 'Interior Design', note: 'A world-renowned interior designer with a clean, precise style.' },
            { name: 'Thomas Heatherwick', specialty: 'Architecture, Design', note: 'Creator of the 2012 Olympic Cauldron and the new London bus.' },
        ]);
    }

    if (input.query.toLowerCase().includes('future of ai')) {
        return 'The future of AI points towards more personalized experiences, advancements in autonomous systems, and significant breakthroughs in creative fields and scientific research. Ethical considerations and responsible development are key themes in the ongoing conversation.';
    }

    return 'No specific results found for this query. Try a different search term.';
  }
);
