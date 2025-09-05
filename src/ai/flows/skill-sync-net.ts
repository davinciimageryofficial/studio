
'use server';

/**
 * @fileOverview An AI-powered matching system for clients and freelancers.
 *
 * - skillSyncNet - A function that handles the matching process.
 * - SkillSyncNetInput - The input type for the skillSyncNet function.
 * - SkillSyncNetOutput - The return type for the skillSyncNet function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ClientBriefSchema = z.object({
    projectTitle: z.string().describe("The title of the client's project."),
    projectDescription: z.string().describe("A detailed description of the project, its goals, and deliverables."),
    requiredSkills: z.string().describe("A comma-separated list of skills required for the project."),
    budget: z.number().describe("The budget for the project in USD."),
    timeline: z.string().describe("The expected timeline for project completion."),
});

const FreelancerProfileSchema = z.object({
    headline: z.string().describe("The freelancer's professional headline."),
    bio: z.string().describe("A summary of the freelancer's experience and expertise."),
    skills: z.array(z.string()).describe("A list of the freelancer's top skills."),
});

export const SkillSyncNetInputSchema = z.object({
  context: z.enum(["client_seeking_freelancer", "freelancer_seeking_project"])
    .describe("The context of the request, determining which party is actively searching."),
  clientBrief: ClientBriefSchema.optional().describe("The project details provided by the client. Required when context is 'client_seeking_freelancer'."),
  freelancerProfile: FreelancerProfileSchema.optional().describe("The profile of the freelancer seeking a project. Required when context is 'freelancer_seeking_project'."),
});
export type SkillSyncNetInput = z.infer<typeof SkillSyncNetInputSchema>;

export const SkillSyncNetOutputSchema = z.object({
  match: z.object({
    freelancer: z.object({
        name: z.string().describe("A realistic name for the matched freelancer."),
        headline: z.string().describe("A compelling professional headline for the freelancer."),
        skills: z.array(z.string()).describe("A list of the freelancer's 3-5 most relevant skills for the project."),
        matchReasoning: z.string().describe("A brief, insightful explanation of why this freelancer is an excellent match for the project."),
        matchConfidence: z.number().int().min(80).max(100).describe("A confidence score from 80-100 indicating the quality of the match."),
    }).optional().describe("The profile of the matched freelancer. Provided when a client is seeking a freelancer."),
    project: z.object({
        title: z.string().describe("The title of the matched project."),
        clientName: z.string().describe("A realistic name for the client or company posting the project."),
        description: z.string().describe("A concise summary of the project's goals."),
        requiredSkills: z.array(z.string()).describe("A list of the 3-5 most important skills for the project."),
        budget: z.number().describe("The project budget."),
        timeline: z.string().describe("The project timeline."),
        matchReasoning: z.string().describe("A brief, insightful explanation of why this project is an excellent match for the freelancer."),
        matchConfidence: z.number().int().min(80).max(100).describe("A confidence score from 80-100 indicating the quality of the match."),
    }).optional().describe("The details of the matched project. Provided when a freelancer is seeking a project."),
  }).describe("The AI-vetted match."),
});
export type SkillSyncNetOutput = z.infer<typeof SkillSyncNetOutputSchema>;


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
