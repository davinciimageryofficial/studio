'use server';

/**
 * @fileOverview An AI-powered system that analyzes user profiles and categorizations to suggest potential 'dream team' members in real time.
 *
 * - aiWorkmateRadar - A function that handles the dream team suggestion process.
 * - AIWorkmateRadarInput - The input type for the aiWorkmateRadar function.
 * - AIWorkmateRadarOutput - The return type for the aiWorkmateRadar function.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const AIWorkmateRadarInputSchema = z.object({
  userProfile: z.string().describe('The user profile data including skills, experience, and preferences, or a project description.'),
  categorization: z.enum(['design', 'writing', 'development']).describe('The specific area of expertise for the dream team.'),
  teamSize: z.number().int().min(1).describe('The desired number of team members.'),
});
export type AIWorkmateRadarInput = z.infer<typeof AIWorkmateRadarInputSchema>;

const AIWorkmateRadarOutputSchema = z.object({
  suggestedMembers: z.array(
    z.object({
      profileId: z.string().describe('The unique identifier of the suggested team member.'),
      name: z.string().describe('The name of the suggested team member.'),
      matchScore: z.number().describe('A score indicating how well the member matches the criteria.'),
      skills: z.array(z.string()).describe('List of skills'),
      shortBio: z.string().describe('A short biography'),
    })
  ).describe('A list of suggested team members based on the user profile and categorization.'),
});
export type AIWorkmateRadarOutput = z.infer<typeof AIWorkmateRadarOutputSchema>;


const workmateRadarFlow = ai.defineFlow(
    {
        name: 'workmateRadarFlow',
        inputSchema: AIWorkmateRadarInputSchema,
        outputSchema: AIWorkmateRadarOutputSchema,
    },
    async (input) => {
        const llmResponse = await ai.generate({
            prompt: `You are an AI Talent Scout. Analyze the user's profile or project description and suggest a dream team for the specified category.

**Your Task:**
1.  Identify the core strengths and needs from the user's information.
2.  Suggest ${input.teamSize} team member(s) who complement the user's skills and would be a great fit.
3.  For each suggested member, provide a realistic name, a match score between 70 and 95, a list of 3-5 relevant skills, and a compelling, one-sentence bio that highlights their expertise.
4.  Generate a unique 'profileId' for each member.
5.  Ensure the output is a valid JSON object.

**User Information / Project Description:**
"""
${input.userProfile}
"""

**Categorization Needed:** ${input.categorization}
`,
            model: 'googleai/gemini-1.5-flash',
            config: {
                output: {
                    format: 'json',
                    schema: AIWorkmateRadarOutputSchema,
                },
            },
        });

        const output = llmResponse.output();
        if (output && output.suggestedMembers) {
            output.suggestedMembers.forEach(member => {
                member.profileId = `user-${Date.now()}-${Math.random()}`;
            });
        }

        return output || { suggestedMembers: [] };
    }
);


export async function aiWorkmateRadar(input: AIWorkmateRadarInput): Promise<AIWorkmateRadarOutput> {
    return workmateRadarFlow(input);
}
