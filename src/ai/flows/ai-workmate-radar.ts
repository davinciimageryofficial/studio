
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
import { AIWorkmateRadarInputSchema, AIWorkmateRadarOutputSchema } from '../schemas/ai-workmate-radar';

export type { AIWorkmateRadarInput, AIWorkmateRadarOutput } from '../schemas/ai-workmate-radar';


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
