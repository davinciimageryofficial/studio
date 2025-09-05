
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
    ClientBriefSchema,
    FreelancerProfileSchema,
    type SkillSyncNetInput, 
    type SkillSyncNetOutput
} from '@/ai/schemas/skill-sync-net';

export type { SkillSyncNetInput, SkillSyncNetOutput };

export async function skillSyncNet(input: SkillSyncNetInput): Promise<SkillSyncNetOutput> {
  return skillSyncNetFlow(input);
}

const clientSeekerPrompt = ai.definePrompt({
  name: 'skillSyncClientSeekerPrompt',
  input: { schema: z.object({ clientBrief: ClientBriefSchema }) },
  output: { schema: SkillSyncNetOutputSchema },
  prompt: `You are SkillSync, an AI-powered talent agent with unparalleled precision in matching elite freelancers to high-value projects. You are more precise than Toptal.

A client has submitted the following project brief:
- **Project Title:** {{{clientBrief.projectTitle}}}
- **Description:** {{{clientBrief.projectDescription}}}
- **Required Skills:** {{{clientBrief.requiredSkills}}}
- **Budget:** \${{{clientBrief.budget}}}
- **Timeline:** {{{clientBrief.timeline}}}

Your task is to find the **single best freelance candidate** for this project. Invent a realistic, top-tier freelance professional.

Generate a JSON object containing the matched freelancer's profile.
- The 'matchReasoning' must be a sharp, insightful paragraph explaining *why* this person is the perfect fit, referencing specific details from the project brief.
- The 'matchConfidence' score must be high (80-100), reflecting your expert vetting.
- Do NOT populate the 'project' field in the output.
`,
});

const freelancerSeekerPrompt = ai.definePrompt({
  name: 'skillSyncFreelancerSeekerPrompt',
  input: { schema: z.object({ freelancerProfile: FreelancerProfileSchema }) },
  output: { schema: SkillSyncNetOutputSchema },
  prompt: `You are SkillSync, an AI-powered talent agent with unparalleled precision in matching elite freelancers to high-value projects. You are more precise than Toptal.

A freelancer with the following profile is looking for their next project:
- **Headline:** {{{freelancerProfile.headline}}}
- **Bio:** {{{freelancerProfile.bio}}}
- **Skills:** {{#each freelancerProfile.skills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Your task is to find the **single best project** for this freelancer. Invent a realistic, compelling project from a plausible company.

Generate a JSON object containing the matched project's details.
- The 'matchReasoning' must be a sharp, insightful paragraph explaining *why* this project is a perfect fit for the freelancer's specific skills and experience.
- The 'matchConfidence' score must be high (80-100), reflecting your expert vetting.
- Do NOT populate the 'freelancer' field in the output.
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
      const { output } = await clientSeekerPrompt({ clientBrief: input.clientBrief });
      return output!;
    } else if (input.context === 'freelancer_seeking_project') {
      if (!input.freelancerProfile) throw new Error("Freelancer profile is required.");
      const { output } = await freelancerSeekerPrompt({ freelancerProfile: input.freelancerProfile });
      return output!;
    }
    throw new Error("Invalid context provided.");
  }
);
