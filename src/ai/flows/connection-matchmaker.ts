
'use server';

/**
 * @fileOverview An AI-powered flow that decides if two users should be a connection match.
 *
 * - makeConnectionDecision - A function that handles the connection decision process.
 * - ConnectionMatchmakerInput - The input type for the makeConnectionDecision function.
 * - ConnectionMatchmakerOutput - The return type for the makeConnectionDecision function.
 */

import { ai } from '@/ai/genkit';
import { ConnectionMatchmakerInputSchema, ConnectionMatchmakerOutputSchema, type ConnectionMatchmakerInput, type ConnectionMatchmakerOutput } from '@/ai/schemas/connection-matchmaker';

export type { ConnectionMatchmakerInput, ConnectionMatchmakerOutput };


export async function makeConnectionDecision(input: ConnectionMatchmakerInput): Promise<ConnectionMatchmakerOutput> {
  return connectionMatchmakerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'connectionMatchmakerPrompt',
  input: { schema: ConnectionMatchmakerInputSchema },
  output: { schema: ConnectionMatchmakerOutputSchema },
  prompt: `You are an AI assistant for a professional networking platform called Sentry. Your task is to act as a matchmaker.

You will analyze the profiles of two users to determine if they would be a strong professional connection. A "match" should be based on complementary skills, shared industries, or potential for collaboration.

Do not match users who have very similar roles and skillsets (e.g., two frontend developers). The goal is to build diverse and complementary networks.

Analyze the two profiles below and decide if they are a match.

**User 1 (The Swiper):**
- Headline: {{{currentUser.headline}}}
- Bio: {{{currentUser.bio}}}
- Skills: {{#each currentUser.skills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

**User 2 (The Profile):**
- Headline: {{{otherUser.headline}}}
- Bio: {{{otherUser.bio}}}
- Skills: {{#each otherUser.skills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

---

Based on your analysis, set the "match" field to true or false and provide a brief "reason" for your decision.
`,
});

const connectionMatchmakerFlow = ai.defineFlow(
  {
    name: 'connectionMatchmakerFlow',
    inputSchema: ConnectionMatchmakerInputSchema,
    outputSchema: ConnectionMatchmakerOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
