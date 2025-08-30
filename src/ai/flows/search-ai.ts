
'use server';

/**
 * @fileOverview An AI flow to handle general user queries.
 *
 * - searchAI - A function that takes a user query and returns an answer.
 */

import { ai } from '@/ai/genkit';
import { SearchAIInputSchema, SearchAIOutputSchema, SearchAIInput, SearchAIOutput } from '@/ai/schemas/search-ai';

export async function searchAI(input: SearchAIInput): Promise<SearchAIOutput> {
  return searchAIFlow(input);
}

const prompt = ai.definePrompt({
  name: 'searchAIPrompt',
  input: { schema: SearchAIInputSchema },
  output: { schema: SearchAIOutputSchema },
  prompt: `You are a helpful AI assistant integrated into a professional networking platform called Sentry.

Your role is to answer user questions. Be helpful, concise, and friendly.

User query: {{{query}}}
`,
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
