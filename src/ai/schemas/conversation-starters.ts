/**
 * @fileOverview Zod schemas and TypeScript types for the conversation starters AI functionality.
 *
 * - ConversationStartersInputSchema - Zod schema for the getConversationStarters function's input.
 * - ConversationStartersInput - TypeScript type for the getConversationStarters function's input.
 * - ConversationStartersOutputSchema - Zod schema for the getConversationStarters function's output.
 * - ConversationStartersOutput - TypeScript type for the getConversationStarters function's output.
 */

import { z } from 'zod';

export const ConversationStartersInputSchema = z.object({
  mood: z.enum(['professional', 'casual', 'comedic', 'informative']).describe('The desired tone for the conversation starters.'),
});
export type ConversationStartersInput = z.infer<typeof ConversationStartersInputSchema>;


export const ConversationStartersOutputSchema = z.object({
  topics: z.array(z.string()).describe('A list of 5 engaging conversation starter topics.'),
});
export type ConversationStartersOutput = z.infer<typeof ConversationStartersOutputSchema>;
