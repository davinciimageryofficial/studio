
'use server';

/**
 * @fileOverview An AI-powered matching system for clients and freelancers.
 *
 * - skillSyncNet - A function that handles the matching process.
 */

import { ai } from '@/ai/genkit';
import { 
    SkillSyncNetInputSchema,
    SkillSyncNetOutputSchema,
    type SkillSyncNetInput, 
    type SkillSyncNetOutput
} from '@/ai/schemas/skill-sync-net';

export type { SkillSyncNetInput, SkillSyncNetOutput };

export async function skillSyncNet(input: SkillSyncNetInput): Promise<SkillSyncNetOutput> {
  return skillSyncNetFlow(input);
}

const clientPrompt = ai.definePrompt({
    name: 'skillSyncClientPrompt',
    input: { schema: SkillSyncNetInputSchema },
    output: { schema: SkillSyncNetOutputSchema },
    prompt: `You are Skill Sync Net, an AI-powered talent scout. Your task is to find the perfect freelancer for a client's project.

Analyze the client's project brief below and generate a profile for one ideal freelance candidate.

**Client's Project Brief:**
- **Title:** {{{clientBrief.projectTitle}}}
- **Description:** {{{clientBrief.projectDescription}}}
- **Required Skills:** {{{clientBrief.requiredSkills}}}
- **Budget:** \${{{clientBrief.budget}}}
- **Timeline:** {{{clientBrief.timeline}}}

**Your Task:**
1.  Invent a realistic and professional-sounding freelancer.
2.  Create a compelling headline that aligns with the project's needs.
3.  List 3-5 key skills that are highly relevant to the project brief.
4.  Write a concise "Match Reasoning" explaining why this freelancer is a perfect fit, directly referencing the brief.
5.  Provide a match confidence score between 85 and 98.
6.  Ensure your entire output is in the specified JSON format under the "match.freelancer" key.
`,
});

const freelancerPrompt = ai.definePrompt({
    name: 'skillSyncFreelancerPrompt',
    input: { schema: SkillSyncNetInputSchema },
    output: { schema: SkillSyncNetOutputSchema },
    prompt: `You are Skill Sync Net, an AI-powered project finder. Your task is to find the perfect project for a freelancer.

Analyze the freelancer's profile below and generate one ideal project listing.

**Freelancer's Profile:**
- **Headline:** {{{freelancerProfile.headline}}}
- **Bio:** {{{freelancerProfile.bio}}}
- **Skills:** {{#each freelancerProfile.skills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

**Your Task:**
1.  Invent a realistic and appealing project.
2.  Create a compelling project title and a realistic client name.
3.  Write a concise project description.
4.  List 3-5 required skills that align with the freelancer's profile.
5.  Set a realistic budget and timeline for the project.
6.  Write a "Match Reasoning" explaining why this project is an excellent opportunity for the freelancer.
7.  Provide a match confidence score between 85 and 98.
8.  Ensure your entire output is in the specified JSON format under the "match.project" key.
`,
});

const skillSyncNetFlow = ai.defineFlow(
  {
    name: 'skillSyncNetFlow',
    inputSchema: SkillSyncNetInputSchema,
    outputSchema: SkillSyncNetOutputSchema,
  },
  async (input) => {
    if (input.context === 'client_seeking_freelancer') {
      if (!input.clientBrief) throw new Error("Client brief is required.");
      const { output } = await clientPrompt(input);
      return output!;

    } else if (input.context === 'freelancer_seeking_project') {
      if (!input.freelancerProfile) throw new Error("Freelancer profile is required.");
      const { output } = await freelancerPrompt(input);
      return output!;
    }
    throw new Error("Invalid context provided.");
  }
);
