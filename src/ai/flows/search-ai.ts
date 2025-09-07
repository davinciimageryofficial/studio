
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

export type { SearchAIInput, SearchAIOutput };

export async function searchAI(input: SearchAIInput): Promise<SearchAIOutput> {
  return searchAIFlow(input);
}

const prompt = ai.definePrompt({
  name: 'searchAIPrompt',
  input: { schema: SearchAIInputSchema },
  output: { schema: SearchAIOutputSchema },
  tools: [searchTheWeb, navigateTo],
  system: `You are Sentry, a helpful AI assistant integrated into a professional networking platform.

Your role is to answer user questions and execute commands. Be helpful, concise, and friendly.

- If the user asks a question, provide a direct answer.
- If you don't know the answer or the question requires access to real-time information, you MUST use the 'searchTheWeb' tool to find a current, verified answer. Do not state that you cannot access real-time data; instead, proactively offer to search for it.
- If the user gives a command to navigate to a part of the app (e.g., "go to my profile", "open courses", "show me the feed"), use the 'navigateTo' tool.
- If the user asks to perform an action you cannot do, politely inform them of the limitation.`,
  prompt: `User query: {{{query}}}`,
});

const searchAIFlow = ai.defineFlow(
  {
    name: 'searchAIFlow',
    inputSchema: SearchAIInputSchema,
    outputSchema: SearchAIOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
