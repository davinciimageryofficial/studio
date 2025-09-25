
/**
 * @fileOverview Zod schemas and TypeScript types for the post generator AI functionality.
 */
import { z } from 'zod';

export const PostGeneratorInputSchema = z.object({
  persona: z.enum(['designer', 'developer', 'writer']).describe("The professional persona for whom to generate the post."),
});
export type PostGeneratorInput = z.infer<typeof PostGeneratorInputSchema>;

export const PostGeneratorOutputSchema = z.object({
  id: z.number().describe("A unique ID for the post."),
  authorId: z.string().describe("The ID of the author."),
  timestamp: z.string().describe("A relative timestamp (e.g., '2h')."),
  content: z.string().describe("The text content of the post."),
  image: z.string().nullable().describe("Should always be null."),
  likes: z.number().describe("A realistic number of likes."),
  comments: z.number().describe("A realistic number of comments."),
  retweets: z.number().describe("A realistic number of retweets/reposts."),
  views: z.string().describe("A realistic number of views (e.g., '10.2k')."),
});
export type PostGeneratorOutput = z.infer<typeof PostGeneratorOutputSchema>;
