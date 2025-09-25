
'use server';

/**
 * @fileOverview An AI flow to generate social media posts for different personas.
 *
 * - generatePost - A function that creates a post with content, an image, and engagement stats.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getUsers } from '@/lib/database';
import { PostGeneratorInputSchema, PostGeneratorOutputSchema } from '../schemas/post-generator';

export type { PostGeneratorInput, PostGeneratorOutput } from '../schemas/post-generator';


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


const generatePostFlow = ai.defineFlow(
    {
        name: 'generatePostFlow',
        inputSchema: PostGeneratorInputSchema,
        outputSchema: PostGeneratorOutputSchema,
    },
    async (input) => {
        const author = await getAuthorForPersona(input.persona);

        const llmResponse = await ai.generate({
            prompt: `You are an AI assistant for a professional networking platform called Sentry.

Your task is to generate a realistic, text-only social media post for a professional user with the persona of a '${input.persona}'.
The post should be engaging and relevant to their industry. Do not include images.

Generate the following as a valid JSON object:
- **timestamp**: A short, relative timestamp (e.g., "5m", "3h", "1d").
- **content**: The main text of the post. It should be insightful, ask a question, or share an update. Include 1-2 relevant hashtags.
- **image**: This must always be null.
- **likes**: A random number of likes between 20 and 500.
- **comments**: A random number of comments between 5 and 50.
- **retweets**: A random number of retweets/reposts between 10 and 100.
- **views**: A string representing a random number of views between 1.0k and 50.0k (e.g., "15.7k").
`,
            model: 'googleai/gemini-1.5-flash',
            config: {
                output: {
                    format: 'json',
                    schema: PostGeneratorOutputSchema,
                },
            },
        });
        
        const output = llmResponse.output();

        if (output) {
            return {
                ...output,
                image: null,
                id: Date.now(),
                authorId: author.id,
            };
        }

        throw new Error("AI failed to generate a response.");
    }
);


export async function generatePost(input: PostGeneratorInput): Promise<PostGeneratorOutput> {
    return generatePostFlow(input);
}
