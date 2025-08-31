/**
 * @fileOverview Zod schemas and TypeScript types for the content recommender AI functionality.
 *
 * - ContentRecommenderInputSchema - Zod schema for the recommendContent function's input.
 * - ContentRecommenderInput - TypeScript type for the recommendContent function's input.
 * - ContentRecommenderOutputSchema - Zod schema for the recommendContent function's output.
 * - ContentRecommenderOutput - TypeScript type for the recommendContent function's output.
 */

import { z } from 'zod';

const UserProfileSchema = z.object({
    id: z.string().describe("The user's unique identifier."),
    headline: z.string().describe("The user's professional headline."),
    skills: z.array(z.string()).describe("A list of the user's skills."),
    bio: z.string().describe("The user's biography or about section."),
});

const ContentSchema = z.object({
    id: z.string().describe("The content's unique identifier."),
    title: z.string().describe("The title of the course or podcast."),
    description: z.string().describe("A brief description of the content."),
    category: z.string().describe("The category of the content (e.g., Development, Design)."),
});

export const ContentRecommenderInputSchema = z.object({
  currentUser: UserProfileSchema.describe("The profile of the user to receive the recommendation."),
  content: ContentSchema.describe("The course or podcast being considered for recommendation."),
});
export type ContentRecommenderInput = z.infer<typeof ContentRecommenderInputSchema>;

export const ContentRecommenderOutputSchema = z.object({
  recommended: z.boolean().describe('Whether the content is a good recommendation for the user.'),
  reason: z.string().describe('A brief explanation for the decision.'),
});
export type ContentRecommenderOutput = z.infer<typeof ContentRecommenderOutputSchema>;
