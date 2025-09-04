
'use server';

/**
 * @fileOverview An AI-powered system that analyzes user profiles and categorizations to suggest potential 'dream team' members in real time.
 *
 * - aiWorkmateRadar - A function that handles the dream team suggestion process.
 * - AIWorkmateRadarInput - The input type for the aiWorkmateRadar function.
 * - AIWorkmateRadarOutput - The return type for the aiWorkmateRadar function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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

export async function aiWorkmateRadar(input: AIWorkmateRadarInput): Promise<AIWorkmateRadarOutput> {
  return aiWorkmateRadarFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiWorkmateRadarPrompt',
  input: {schema: AIWorkmateRadarInputSchema},
  output: {schema: AIWorkmateRadarOutputSchema},
  prompt: `You are an AI Talent Scout for Sentry, a professional networking platform. Your task is to find the perfect collaborators for a user.

Analyze the user's profile or project description below. Based on this, suggest a dream team for the specified category.

**User Information / Project Description:**
"""
{{{userProfile}}}
"""

**Categorization Needed:** {{{categorization}}}
**Team Size to Suggest:** {{{teamSize}}}

**Your Task:**
1.  Identify the core strengths and needs from the user's information.
2.  Suggest team members who complement the user's skills and would be a great fit for the project.
3.  For each suggested member, provide a realistic name, a match score between 70 and 95, a list of 3-5 relevant skills, and a compelling, one-sentence bio that highlights their expertise.
4.  Ensure the output is a valid JSON array of suggested team members.
`, 
});

const aiWorkmateRadarFlow = ai.defineFlow(
  {
    name: 'aiWorkmateRadarFlow',
    inputSchema: AIWorkmateRadarInputSchema,
    outputSchema: AIWorkmateRadarOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
