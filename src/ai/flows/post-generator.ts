
'use server';

/**
 * @fileOverview An AI flow to generate social media posts for different personas.
 *
 * - generatePost - A function that creates a post with content, an image, and engagement stats.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { placeholderUsers } from '@/lib/placeholder-data';

const PostGeneratorInputSchema = z.object({
  persona: z.enum(['designer', 'developer', 'writer']).describe("The professional persona for whom to generate the post."),
});
export type PostGeneratorInput = z.infer<typeof PostGeneratorInputSchema>;

const PostGeneratorOutputSchema = z.object({
  id: z.number().describe("A unique ID for the post."),
  authorId: z.string().describe("The ID of the author."),
  timestamp: z.string().describe("A relative timestamp (e.g., '2h')."),
  content: z.string().describe("The text content of the post."),
  image: z.string().nullable().describe("A URL for an image to accompany the post, or null."),
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
const getAuthorForPersona = (persona: PostGeneratorInput['persona']) => {
    switch (persona) {
        case 'designer':
            return placeholderUsers.find(u => u.category === 'design')!;
        case 'developer':
            return placeholderUsers.find(u => u.category === 'development')!;
        case 'writer':
            return placeholderUsers.find(u => u.category === 'writing')!;
        default:
            return placeholderUsers[0];
    }
}

const prompt = ai.definePrompt({
  name: 'postGeneratorPrompt',
  input: { schema: PostGeneratorInputSchema },
  output: { schema: Omit<PostGeneratorOutput, 'id' | 'authorId'> },
  prompt: `You are an AI assistant for a professional networking platform called Sentry.

Your task is to generate a realistic social media post for a professional user.
The post should be engaging and relevant to their industry.

The user's persona is: {{{persona}}}.

Generate the following:
- **timestamp**: A short, relative timestamp (e.g., "5m", "3h", "1d").
- **content**: The main text of the post. It should be insightful, ask a question, or share an update. Include 1-2 relevant hashtags.
- **image**: A URL for a relevant placeholder image from picsum.photos (e.g., https://picsum.photos/seed/some-random-string/600/400), or null if no image is needed.
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
    const author = getAuthorForPersona(input.persona);
    
    return {
        ...output!,
        id: Date.now(), // Generate a unique ID
        authorId: author.id,
    };
  }
);
