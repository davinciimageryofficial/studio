
'use server';

/**
 * @fileOverview An AI flow to generate conversation starters for a professional networking platform.
 *
 * - getConversationStarters - A function that returns a list of conversation topics.
 */

import { ai } from '@/ai/genkit';
import { ConversationStartersOutputSchema, type ConversationStartersOutput } from '@/ai/schemas/conversation-starters';

export { type ConversationStartersOutput } from '@/ai/schemas/conversation-starters';


export async function getConversationStarters(): Promise<ConversationStartersOutput> {
  return conversationStartersFlow();
}

const prompt = ai.definePrompt({
  name: 'conversationStartersPrompt',
  output: { schema: ConversationStartersOutputSchema },
  prompt: `You are an AI assistant for a professional networking platform called Sentry.

Your task is to generate a list of 5 short, direct, and thought-provoking subject headlines.
These headlines should be relevant to professionals in the tech and creative industries and inspire them to write a post.

Focus on current trends and future-looking ideas.

Generate a JSON object with a "topics" array containing 5 string-based subject headlines.
`,
});

const conversationStartersFlow = ai.defineFlow(
  {
    name: 'conversationStartersFlow',
    outputSchema: ConversationStartersOutputSchema,
  },
  async () => {
    const { output } = await prompt();
    return output!;
  }
);
