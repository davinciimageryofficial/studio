/**
 * @fileOverview Zod schemas and TypeScript types for the conversation starters AI functionality.
 *
 * - ConversationStartersOutputSchema - Zod schema for the getConversationStarters function's output.
 * - ConversationStartersOutput - TypeScript type for the getConversationStarters function's output.
 */

import { z } from 'zod';

export const ConversationStartersOutputSchema = z.object({
  topics: z.array(z.string()).describe('A list of 5 engaging conversation starter topics.'),
});
export type ConversationStartersOutput = z.infer<typeof ConversationStartersOutputSchema>;
