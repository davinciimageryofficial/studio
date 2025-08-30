
'use server';

/**
 * @fileOverview An AI flow to generate conversation starters for a professional networking platform.
 *
 * - getConversationStarters - A function that returns a list of conversation topics.
 */

import { ai } from '@/ai/genkit';
import { ConversationStartersInputSchema, ConversationStartersOutputSchema, type ConversationStartersInput, type ConversationStartersOutput } from '@/ai/schemas/conversation-starters';

export { type ConversationStartersInput, type ConversationStartersOutput } from '@/ai/schemas/conversation-starters';


export async function getConversationStarters(input: ConversationStartersInput): Promise<ConversationStartersOutput> {
  return conversationStartersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'conversationStartersPrompt',
  input: { schema: ConversationStartersInputSchema },
  output: { schema: ConversationStartersOutputSchema },
  prompt: `You are an AI assistant for a professional networking platform called Sentry.

Your task is to generate a list of 5 short, direct, and thought-provoking subject headlines.
These headlines should be relevant to professionals in the tech and creative industries and inspire them to write a post.

The user has requested headlines with a '{{{mood}}}' tone. Please adjust the style of your suggestions accordingly.

Focus on current trends and future-looking ideas.

Generate a JSON object with a "topics" array containing 5 string-based subject headlines.
`,
});

const conversationStartersFlow = ai.defineFlow(
  {
    name: 'conversationStartersFlow',
    inputSchema: ConversationStartersInputSchema,
    outputSchema: ConversationStartersOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
