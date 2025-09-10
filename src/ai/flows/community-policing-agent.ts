
'use server';

/**
 * @fileOverview An AI agent that monitors user interactions to ensure community safety and reliability.
 *
 * - analyzeUserBehavior - A function that assesses a user's activity to generate a reliability score.
 * - CommunityPolicingInput - The input type for the analyzeUserBehavior function.
 * - CommunityPolicingOutput - The return type for the analyzeUserBehavior function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const CommunityPolicingInputSchema = z.object({
  userId: z.string().describe("The unique ID of the user to analyze."),
  userActivity: z.array(z.string()).describe("A list of recent activities, such as posts, comments, and job listings."),
  transactionHistory: z.array(z.object({
    type: z.enum(['payment_received', 'payment_sent', 'dispute_opened', 'dispute_resolved']),
    details: z.string(),
  })).describe("A history of the user's transactions and disputes."),
});
export type CommunityPolicingInput = z.infer<typeof CommunityPolicingInputSchema>;

const CommunityPolicingOutputSchema = z.object({
  reliabilityScore: z.number().int().min(0).max(100).describe("A score from 0-100 representing the user's reliability."),
  summary: z.string().describe("A brief, neutral summary of the user's community standing."),
  flags: z.array(z.object({
    reason: z.string().describe("The reason for the flag (e.g., 'Unresponsive to applicants', 'Payment dispute')."),
    severity: z.enum(['low', 'medium', 'high']),
  })).describe("A list of any flags raised against the user."),
});
export type CommunityPolicingOutput = z.infer<typeof CommunityPolicingOutputSchema>;


export async function analyzeUserBehavior(input: CommunityPolicingInput): Promise<CommunityPolicingOutput> {
  return communityPolicingFlow(input);
}


const prompt = ai.definePrompt({
  name: 'communityPolicingPrompt',
  input: { schema: CommunityPolicingInputSchema },
  output: { schema: CommunityPolicingOutputSchema },
  prompt: `You are the Sentry Community Policing AI. Your role is to analyze a user's activity to promote a safe and reliable professional environment.

**User to Analyze:** {{{userId}}}

**Recent Activity Log:**
{{#each userActivity}}
- {{{this}}}
{{/each}}

**Transaction & Dispute History:**
{{#each transactionHistory}}
- Type: {{{type}}}, Details: {{{details}}}
{{/each}}

**Your Tasks:**
1.  **Assess Reliability Score (0-100):**
    - Start with a baseline score of 80.
    - **Increase score for:** Positive actions like successfully completed projects, resolved disputes amicably, consistent and professional communication.
    - **Decrease score for:** Negative actions like unresolved payment disputes, ignoring applicants on job posts, posting vague or suspicious projects, receiving multiple complaints. A history of disappearing after work is delivered should result in a significant score decrease.
    - Calculate a final score based on the evidence.

2.  **Generate a Summary:**
    - Write a one-sentence, neutral summary of the user's standing. Examples: "Established member with a positive transaction history." or "Newer member, proceed with standard caution." or "This member has several unresolved payment disputes."

3.  **Identify Flags:**
    - Review the activity and history for patterns of unreliability.
    - If a user posts a job and receives many applications but never communicates with applicants, raise a 'low' severity flag for being 'Unresponsive to applicants'.
    - If a user has an unresolved payment dispute, raise a 'medium' severity flag.
    - If there's evidence of a scam (e.g., received work, then disappeared), raise a 'high' severity flag for 'Fraudulent activity'.
    - If no negative patterns are found, return an empty array for flags.

Your entire output must be in the specified JSON format.
`,
});


const communityPolicingFlow = ai.defineFlow(
  {
    name: 'communityPolicingFlow',
    inputSchema: CommunityPolicingInputSchema,
    outputSchema: CommunityPolicingOutputSchema,
  },
  async (input) => {
    // In a real application, you'd fetch this data from a database.
    // For now, we'll use the data passed in the input.
    const { output } = await prompt(input);
    return output!;
  }
);
