
'use server';

/**
 * @fileOverview An AI flow to generate social media posts for different personas.
 *
 * - generatePost - A function that creates a post with content, an image, and engagement stats.
 */
import { openai } from '@/ai/inference';
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

const systemPrompt = `You are an AI assistant for a professional networking platform called Sentry.

Your task is to generate a realistic, text-only social media post for a professional user.
The post should be engaging and relevant to their industry. Do not include images.

Generate the following as a valid JSON object:
- **timestamp**: A short, relative timestamp (e.g., "5m", "3h", "1d").
- **content**: The main text of the post. It should be insightful, ask a question, or share an update. Include 1-2 relevant hashtags.
- **image**: This must always be null.
- **likes**: A random number of likes between 20 and 500.
- **comments**: A random number of comments between 5 and 50.
- **retweets**: A random number of retweets/reposts between 10 and 100.
- **views**: A string representing a random number of views between 1.0k and 50.0k (e.g., "15.7k").

The JSON schema for the output is:
{
  "timestamp": string,
  "content": string,
  "image": null,
  "likes": number,
  "comments": number,
  "retweets": number,
  "views": string
}
`;

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


export async function generatePost(input: PostGeneratorInput): Promise<PostGeneratorOutput> {
    const response = await openai.chat.completions.create({
        model: "google/gemma-3-27b-instruct/bf-16",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `The user's persona is: ${input.persona}.` }
        ],
        response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
        throw new Error("AI failed to generate a response.");
    }
    
    try {
        const output = JSON.parse(content);
        const author = await getAuthorForPersona(input.persona);
        
        return {
            ...output,
            image: null, // Ensure image is always null
            id: Date.now(), // Generate a unique ID
            authorId: author.id,
        };
    } catch (e) {
        console.error("Failed to parse AI response as JSON:", content);
        throw new Error("AI returned invalid data format.");
    }
}
