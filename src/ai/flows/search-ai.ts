'use server';

/**
 * @fileOverview An AI flow to handle general user queries and commands.
 *
 * - searchAI - A function that takes a user query and returns an answer or executes a command.
 */
import { ai } from '@/ai/genkit';
import { SearchAIInputSchema, SearchAIOutputSchema, type SearchAIInput, type SearchAIOutput } from '@/ai/schemas/search-ai';
import { searchTheWeb } from '../tools/web-search';
import { navigateTo } from '../tools/navigation';
import { z } from 'zod';

export type { SearchAIInput, SearchAIOutput };

const getStockPrice = ai.defineTool(
    {
      name: 'getStockPrice',
      description: 'Returns the current market value of a stock.',
      inputSchema: z.object({
        ticker: z.string().describe('The ticker symbol of the stock.'),
      }),
      outputSchema: z.number(),
    },
    async (input) => {
      // This is a placeholder. In a real app, this would call a stock price API.
      return Math.random() * 1000;
    }
);

const searchAIQuery = ai.definePrompt({
    name: 'searchAIQuery',
    tools: [searchTheWeb, navigateTo, getStockPrice],
    system: `You are Sentry, a helpful AI assistant integrated into a professional networking platform.

Your role is to answer user questions and execute commands. Be helpful, concise, and friendly.

- If the user asks a question, provide a direct answer.
- If you don't know the answer or the question requires access to real-time information, you MUST use the 'searchTheWeb' tool to find a current, verified answer. Do not state that you cannot access real-time data; instead, proactively offer to search for it.
- If the user gives a command to navigate to a part of the app (e.g., "go to my profile", "open courses", "show me the feed"), use the 'navigateTo' tool.
- If the user asks about a public company, include its stock price in your answer, using the getStockPrice tool.
- If the user asks to perform an action you cannot do, politely inform them of the limitation.

Your final output must be a valid JSON object based on the user's request and the tool output. If you are just answering a question, set destination to null.`,
    output: {
        schema: SearchAIOutputSchema,
    }
});


const searchAIFlow = ai.defineFlow(
    {
        name: 'searchAIFlow',
        inputSchema: SearchAIInputSchema,
        outputSchema: SearchAIOutputSchema,
    },
    async (input) => {
        const llmResponse = await searchAIQuery({ query: input.query });
        return llmResponse.output() || { answer: "Sorry, I couldn't process that request.", destination: null };
    }
);


export async function searchAI(input: SearchAIInput): Promise<SearchAIOutput> {
    return searchAIFlow(input);
}
