
'use server';

/**
 * @fileOverview An AI agent that monitors user interactions to ensure community safety and reliability.
 *
 * - analyzeUserBehavior - A function that assesses a user's activity to generate a reliability score.
 * - CommunityPolicingInput - The input type for the analyzeUserBehavior function.
 * - CommunityPolicingOutput - The return type for the analyzeUserBehavior function.
 */
import { ai } from '@/ai/genkit';
import { CommunityPolicingInputSchema, CommunityPolicingOutputSchema, type CommunityPolicingInput, type CommunityPolicingOutput } from '../schemas/community-policing-agent';

export type { CommunityPolicingInput, CommunityPolicingOutput } from '../schemas/community-policing-agent';


const communityPolicingFlow = ai.defineFlow(
    {
        name: 'communityPolicingFlow',
        inputSchema: CommunityPolicingInputSchema,
        outputSchema: CommunityPolicingOutputSchema,
    },
    async (input) => {
        const llmResponse = await ai.generate({
            prompt: `You are the Sentry Community Policing AI. Your role is to analyze a user's activity to promote a safe and reliable professional environment.

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

**User to Analyze:** ${input.userId}

**Recent Activity Log:**
${input.userActivity.map(activity => `- ${activity}`).join('\n')}

**Transaction & Dispute History:**
${input.transactionHistory.map(tx => `- Type: ${tx.type}, Details: ${tx.details}`).join('\n')}
`,
            model: 'googleai/gemini-1.5-flash',
            config: {
                output: {
                    format: 'json',
                    schema: CommunityPolicingOutputSchema,
                },
            },
        });
        
        return llmResponse.output() || { reliabilityScore: 0, summary: "Error analyzing user.", flags: [] };
    }
);


export async function analyzeUserBehavior(input: CommunityPolicingInput): Promise<CommunityPolicingOutput> {
    return communityPolicingFlow(input);
}
