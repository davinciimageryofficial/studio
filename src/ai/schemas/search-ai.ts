/**
 * @fileOverview Zod schemas and TypeScript types for the AI search functionality.
 *
 * - SearchAIInputSchema - Zod schema for the searchAI function's input.
 * - SearchAIInput - TypeScript type for the searchAI function's input.
 * - SearchAIOutputSchema - Zod schema for the searchAI function's output.
 * - SearchAIOutput - TypeScript type for the searchAI function's output.
 */

import { z } from 'zod';

export const SearchAIInputSchema = z.object({
  query: z.string().describe('The user\'s search query or question.'),
});
export type SearchAIInput = z.infer<typeof SearchAIInputSchema>;

export const SearchAIOutputSchema = z.object({
  answer: z.string().describe('The AI-generated answer to the user\'s query.'),
  destination: z.string().optional().describe('The page to navigate to, if requested by the user. Should be one of "dashboard", "feed", "messages", "discover", "workspaces", "workmate-radar", "news", "courses", "billing", "profile", "settings".'),
});
export type SearchAIOutput = z.infer<typeof SearchAIOutputSchema>;
