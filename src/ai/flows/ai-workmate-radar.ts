
'use server';

/**
 * @fileOverview An AI-powered system that analyzes user profiles and categorizations to suggest potential 'dream team' members in real time.
 *
 * - aiWorkmateRadar - A function that handles the dream team suggestion process.
 * - AIWorkmateRadarInput - The input type for the aiWorkmateRadar function.
 * - AIWorkmateRadarOutput - The return type for the aiWorkmateRadar function.
 */
import { openai } from '@/ai/inference';
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

const systemPrompt = `You are an AI Talent Scout for Sentry, a professional networking platform. Your task is to find the perfect collaborators for a user.

Analyze the user's profile or project description below. Based on this, suggest a dream team for the specified category.

**Your Task:**
1.  Identify the core strengths and needs from the user's information.
2.  Suggest team members who complement the user's skills and would be a great fit for the project.
3.  For each suggested member, provide a realistic name, a match score between 70 and 95, a list of 3-5 relevant skills, and a compelling, one-sentence bio that highlights their expertise.
4.  Ensure the output is a valid JSON object.
The JSON schema for the output is:
{
  "suggestedMembers": [
    {
      "profileId": string,
      "name": string,
      "matchScore": number (70-95),
      "skills": string[],
      "shortBio": string
    }
  ]
}
`;

function buildUserPrompt(input: AIWorkmateRadarInput): string {
    return `
User Information / Project Description:
"""
${input.userProfile}
"""

Categorization Needed: ${input.categorization}
Team Size to Suggest: ${input.teamSize}
`;
}


export async function aiWorkmateRadar(input: AIWorkmateRadarInput): Promise<AIWorkmateRadarOutput> {
    const response = await openai.chat.completions.create({
        model: "google/gemma-3-27b-instruct/bf-16",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: buildUserPrompt(input) }
        ],
        response_format: { type: "json_object" },
    });
    
    const content = response.choices[0]?.message?.content;
    if (!content) {
        throw new Error("AI failed to generate a response.");
    }

    try {
        const parsed = JSON.parse(content);
        // Add a simple unique ID for profileId
        if (parsed.suggestedMembers) {
            parsed.suggestedMembers.forEach((member: any) => {
                member.profileId = `user-${Date.now()}-${Math.random()}`;
            });
        }
        return parsed as AIWorkmateRadarOutput;
    } catch (e) {
        console.error("Failed to parse AI response as JSON:", content);
        throw new Error("AI returned invalid data format.");
    }
}
