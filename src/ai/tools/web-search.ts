
'use server';

/**
 * @fileOverview A tool for the AI to perform web searches.
 */
import { openai } from '@/ai/inference';

export const searchTheWebSchema = {
    type: 'function',
    function: {
        name: 'searchTheWeb',
        description: 'Searches the web for information on a given topic. Use this when you need external information to answer a user\'s question.',
        parameters: {
            type: 'object',
            properties: {
                query: {
                    type: 'string',
                    description: 'The search query.',
                }
            },
            required: ['query'],
        }
    }
};

export async function searchTheWeb(args: { query: string }) {
    console.log(`[Web Search Tool] Searching for: ${args.query}`);

    // In a real application, this would call a search engine API (e.g., Google Search API).
    // For this example, we'll return hardcoded results for specific queries to simulate the tool's behavior.
    
    if (args.query.toLowerCase().includes('top designers in london')) {
        return JSON.stringify([
            { name: 'Es Devlin', specialty: 'Stage Design, Large-Scale Installations', note: 'Known for her spectacular stage sets for artists like Beyoncé and U2.' },
            { name: 'Tom Dixon', specialty: 'Product & Interior Design', note: 'An industrial designer famous for his lighting and furniture.' },
            { name: 'Kelly Hoppen', specialty: 'Interior Design', note: 'A world-renowned interior designer with a clean, precise style.' },
            { name: 'Thomas Heatherwick', specialty: 'Architecture, Design', note: 'Creator of the 2012 Olympic Cauldron and the new London bus.' },
        ]);
    }

    if (args.query.toLowerCase().includes('future of ai')) {
        return 'The future of AI points towards more personalized experiences, advancements in autonomous systems, and significant breakthroughs in creative fields and scientific research. Ethical considerations and responsible development are key themes in the ongoing conversation.';
    }

    return 'No specific results found for this query. Try a different search term.';
  }

