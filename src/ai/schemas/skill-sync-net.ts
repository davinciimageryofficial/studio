/**
 * @fileOverview Zod schemas and TypeScript types for the Skill Sync Net AI functionality.
 *
 * - SkillSyncNetInputSchema, SkillSyncNetInput - Input types for the skillSyncNet function.
 * - SkillSyncNetOutputSchema, SkillSyncNetOutput - Output types for the skillSyncNet function.
 * - ClientBriefSchema - Zod schema for a client's project brief.
 * - FreelancerProfileSchema - Zod schema for a freelancer's profile.
 */
import { z } from 'genkit/zod';

export const ClientBriefSchema = z.object({
    projectTitle: z.string().describe("The title of the client's project."),
    projectDescription: z.string().describe("A detailed description of the project, its goals, and deliverables."),
    requiredSkills: z.string().describe("A comma-separated list of skills required for the project."),
    budget: z.number().describe("The budget for the project in USD."),
    timeline: z.string().describe("The expected timeline for project completion."),
});

export const FreelancerProfileSchema = z.object({
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
