
'use server';

/**
 * @fileOverview An AI flow to generate social media posts for different personas.
 *
 * - generatePost - A function that creates a post with content, an image, and engagement stats.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getUsers } from '@/lib/database';

const PostGeneratorInputSchema = z.object({
  persona: z.enum(['designer', 'developer', 'writer']).describe("The professional persona for whom to generate the post."),
});
export type PostGeneratorInput = z.infer<typeof PostGeneratorInputSchema>;

const PostGeneratorOutputSchema = z.object({
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

export async function generatePost(input: PostGeneratorInput): Promise<PostGeneratorOutput> {
  return postGeneratorFlow(input);
}


// Select a user based on the persona
const getAuthorForPersona = async (persona: PostGeneratorInput['persona']) => {
    const users = await getUsers();
    const filteredUsers = users.filter(u => u.category === persona);
    if (filteredUsers.length > 0) {
        return filteredUsers[Math.floor(Math.random() * filteredUsers.length)];
    }
    // Fallback to a random user if no match
    return users[Math.floor(Math.random() * users.length)];
}

const prompt = ai.definePrompt({
  name: 'postGeneratorPrompt',
  input: { schema: PostGeneratorInputSchema },
  output: { schema: PostGeneratorOutputSchema.omit({ id: true, authorId: true }) },
  prompt: `You are an AI assistant for a professional networking platform called Sentry.

Your task is to generate a realistic, text-only social media post for a professional user.
The post should be engaging and relevant to their industry. Do not include images.

The user's persona is: {{{persona}}}.

Generate the following:
- **timestamp**: A short, relative timestamp (e.g., "5m", "3h", "1d").
- **content**: The main text of the post. It should be insightful, ask a question, or share an update. Include 1-2 relevant hashtags.
- **image**: This must always be null.
- **likes**: A random number of likes between 20 and 500.
- **comments**: A random number of comments between 5 and 50.
- **retweets**: A random number of retweets/reposts between 10 and 100.
- **views**: A string representing a random number of views between 1.0k and 50.0k (e.g., "15.7k").

Your entire output must be in the specified JSON format.
`,
});

const postGeneratorFlow = ai.defineFlow(
  {
    name: 'postGeneratorFlow',
    inputSchema: PostGeneratorInputSchema,
    outputSchema: PostGeneratorOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    const author = await getAuthorForPersona(input.persona);
    
    return {
        ...output!,
        image: null, // Ensure image is always null
        id: Date.now(), // Generate a unique ID
        authorId: author.id,
    };
  }
);
