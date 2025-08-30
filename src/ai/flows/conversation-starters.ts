
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

Your task is to generate a list of 5 fresh, engaging, and thought-provoking conversation starters. These topics should be relevant to professionals in the tech and creative industries.

Focus on current trends, future-looking questions, and topics that encourage meaningful discussion. Avoid generic or boring questions.

Generate a JSON object with a "topics" array containing 5 string-based conversation starters.
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
