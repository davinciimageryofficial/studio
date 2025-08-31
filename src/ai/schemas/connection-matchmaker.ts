/**
 * @fileOverview Zod schemas and TypeScript types for the connection matchmaker AI functionality.
 *
 * - ConnectionMatchmakerInputSchema - Zod schema for the makeConnectionDecision function's input.
 * - ConnectionMatchmakerInput - TypeScript type for the makeConnectionDecision function's input.
 * - ConnectionMatchmakerOutputSchema - Zod schema for the makeConnectionDecision function's output.
 * - ConnectionMatchmakerOutput - TypeScript type for the makeConnectionDecision function's output.
 */

import { z } from 'zod';

const UserProfileSchema = z.object({
    id: z.string().describe("The user's unique identifier."),
    headline: z.string().describe("The user's professional headline."),
    skills: z.array(z.string()).describe("A list of the user's skills."),
    bio: z.string().describe("The user's biography or about section."),
});

export const ConnectionMatchmakerInputSchema = z.object({
  currentUser: UserProfileSchema.describe("The profile of the user initiating the swipe."),
  otherUser: UserProfileSchema.describe("The profile of the user being swiped on."),
});
export type ConnectionMatchmakerInput = z.infer<typeof ConnectionMatchmakerInputSchema>;

export const ConnectionMatchmakerOutputSchema = z.object({
  match: z.boolean().describe('Whether the two users are a good professional match.'),
  reason: z.string().describe('A brief explanation for the decision.'),
});
export type ConnectionMatchmakerOutput = z.infer<typeof ConnectionMatchmakerOutputSchema>;
