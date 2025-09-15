
'use server';

/**
 * @fileOverview An AI flow to generate conversation starters for a professional networking platform.
 *
 * - getConversationStarters - A function that returns a list of conversation topics.
 */
import { openai } from '@/ai/inference';
import { ConversationStartersInputSchema, ConversationStartersOutputSchema, type ConversationStartersInput, type ConversationStartersOutput } from '@/ai/schemas/conversation-starters';

export { type ConversationStartersInput, type ConversationStartersOutput } from '@/ai/schemas/conversation-starters';

const systemPrompt = `You are an AI assistant for a professional networking platform called Sentry.

Your task is to generate a list of 5 short, direct, and thought-provoking subject headlines.
These headlines should be relevant to professionals in the tech and creative industries and inspire them to write a post.

The user has requested headlines with a specific tone. Please adjust the style of your suggestions accordingly.

Focus on current trends and future-looking ideas.

Generate a JSON object with a "topics" array containing 5 string-based subject headlines.
The JSON schema for the output is:
{
  "topics": string[]
}
`;


export async function getConversationStarters(input: ConversationStartersInput): Promise<ConversationStartersOutput> {
    const response = await openai.chat.completions.create({
        model: "google/gemma-3-27b-instruct/bf-16",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Generate headlines with a '${input.mood}' tone.` }
        ],
        response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
        throw new Error("AI failed to generate a response.");
    }

    try {
        return JSON.parse(content) as ConversationStartersOutput;
    } catch (e) {
        console.error("Failed to parse AI response as JSON:", content);
        throw new Error("AI returned invalid data format.");
    }
}
