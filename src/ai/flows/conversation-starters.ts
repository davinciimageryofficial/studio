'use server';

/**
 * @fileOverview An AI flow to generate conversation starters for a professional networking platform.
 *
 * - getConversationStarters - A function that returns a list of conversation topics.
 */
import { ai } from '@/ai/genkit';
import { ConversationStartersInputSchema, ConversationStartersOutputSchema, type ConversationStartersInput, type ConversationStartersOutput } from '@/ai/schemas/conversation-starters';

export { type ConversationStartersInput, type ConversationStartersOutput } from '@/ai/schemas/conversation-starters';


const conversationStartersFlow = ai.defineFlow(
  {
    name: 'conversationStartersFlow',
    inputSchema: ConversationStartersInputSchema,
    outputSchema: ConversationStartersOutputSchema,
  },
  async (input) => {
    const llmResponse = await ai.generate({
      prompt: `You are an AI assistant for a professional networking platform called Sentry.

Your task is to generate a list of 5 short, direct, and thought-provoking subject headlines.
These headlines should be relevant to professionals in the tech and creative industries and inspire them to write a post.

The user has requested headlines with a specific tone: '${input.mood}'. Please adjust the style of your suggestions accordingly.

Focus on current trends and future-looking ideas.

Generate a JSON object with a "topics" array containing 5 string-based subject headlines.`,
      model: 'googleai/gemini-1.5-flash',
      config: {
        output: {
          format: 'json',
          schema: ConversationStartersOutputSchema,
        },
      },
    });

    return llmResponse.output() || { topics: [] };
  }
);


export async function getConversationStarters(input: ConversationStartersInput): Promise<ConversationStartersOutput> {
    return conversationStartersFlow(input);
}
