
/**
 * @fileOverview Zod schemas and TypeScript types for the AI Workmate Radar functionality.
 */

import { z } from 'zod';

export const AIWorkmateRadarInputSchema = z.object({
  userProfile: z.string().describe('The user profile data including skills, experience, and preferences, or a project description.'),
  categorization: z.enum(['design', 'writing', 'development']).describe('The specific area of expertise for the dream team.'),
  teamSize: z.number().int().min(1).describe('The desired number of team members.'),
});
export type AIWorkmateRadarInput = z.infer<typeof AIWorkmateRadarInputSchema>;

export const AIWorkmateRadarOutputSchema = z.object({
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
