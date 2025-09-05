
'use server';

/**
 * @fileOverview An AI-powered matching system for clients and freelancers.
 *
 * - skillSyncNet - A function that handles the matching process.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
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
Carefully analyze all provided information, especially any "Advanced Requirements" in the description, to inform your choice.

Generate a JSON object containing the matched freelancer's profile.
- The 'matchReasoning' must be a sharp, insightful paragraph explaining *why* this person is the perfect fit, referencing specific details from the project brief and any advanced requirements.
- The 'matchConfidence' score must be high (80-100), reflecting your expert vetting.
- Do NOT populate the 'project' field in the output.
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
      
      // Return a hardcoded project to save on API calls and avoid rate limiting.
      const featuredProject: SkillSyncNetOutput = {
        match: {
          project: {
            title: "Featured Project: Interactive Data Dashboard",
            clientName: "Data Insights Inc.",
            description: "Develop a cutting-edge, interactive web dashboard for visualizing real-time analytics. This is a high-visibility project for a fast-growing tech startup.",
            requiredSkills: ["React", "D3.js", "TypeScript", "Data Visualization", "UI/UX"],
            budget: 15000,
            timeline: "1-2 months",
            matchReasoning: "This featured project requires strong front-end skills and an eye for data visualization, making it an excellent opportunity for top-tier developers. The modern tech stack aligns with your expertise in React and TypeScript.",
            matchConfidence: 98,
          }
        }
      };
      return featuredProject;
    }
    throw new Error("Invalid context provided.");
  }
);
