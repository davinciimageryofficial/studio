
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
  userProfile: z.string().describe('The user profile data including skills, experience, and preferences.'),
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
  prompt: `You are an AI assistant designed to suggest potential dream team members based on a user's profile and their desired categorization.

Analyze the following user profile and suggest team members that would be a good fit for the specified categorization. Provide a match score indicating the strength of the match.

User Profile: {{{userProfile}}}
Categorization: {{{categorization}}}
Team Size: {{{teamSize}}}

Ensure that the suggested members align with the specified categorization and complement the user's skills and experience. Consider factors such as expertise, availability, and compatibility. For each suggested member, provide a realistic name, a match score between 70 and 95, a list of 3-5 relevant skills, and a compelling, one-sentence bio that highlights their expertise.

Output a JSON array of suggested team members, including their profile ID, name, match score, skills, and a short bio.
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
