
/**
 * @fileOverview Zod schemas and TypeScript types for the post analyzer AI functionality.
 */
import { z } from 'zod';

export const AnalyzePostInputSchema = z.object({
  postContent: z.string().describe("The draft content of the user's post."),
  userProfile: z.object({
    headline: z.string().describe("The user's professional headline."),
    bio: z.string().describe("The user's biography or about section."),
    skills: z.array(z.string()).describe("A list of the user's skills."),
  }).describe("The profile of the user authoring the post."),
  targetAudience: z.string().describe("The intended audience for the post."),
});
export type AnalyzePostInput = z.infer<typeof AnalyzePostInputSchema>;


export const AnalyzePostOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('A list of actionable tips to improve the post.'),
  perceptionAnalysis: z.array(
    z.object({
      metric: z.string().describe('The name of the metric being scored (e.g., Clarity, Engagement, Professionalism).'),
      score: z.number().int().min(0).max(100).describe('The score from 0 to 100.'),
      explanation: z.string().describe('A brief explanation of the score and what it means.'),
    })
  ).describe("An analysis of how the post might be perceived by the target audience."),
});
export type AnalyzePostOutput = z.infer<typeof AnalyzePostOutputSchema>;
