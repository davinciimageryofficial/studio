
'use server';

/**
 * @fileOverview An AI flow to analyze a user's post and provide feedback.
 *
 * - analyzePost - A function that takes post content and user context to return suggestions and a perception analysis.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { AnalyzePostInputSchema, AnalyzePostOutputSchema } from '../schemas/post-analyzer';

export type { AnalyzePostInput, AnalyzePostOutput } from '../schemas/post-analyzer';

const analyzePostFlow = ai.defineFlow(
    {
        name: 'analyzePostFlow',
        inputSchema: AnalyzePostInputSchema,
        outputSchema: AnalyzePostOutputSchema,
    },
    async (input) => {
        const llmResponse = await ai.generate({
            prompt: `You are an AI assistant for a professional networking platform. Your task is to act as a writing coach, helping users improve their posts before they publish them.

Analyze the user's draft post based on their profile and their stated target audience.

**Your Analysis:**

1.  **Suggestions:** Provide a list of 3-4 concrete, actionable suggestions to improve the post. Consider the user's profile and tone. Suggestions could relate to clarity, conciseness, engagement (e.g., adding a question), or formatting.

2.  **Perception Analysis:** Provide a score (0-100) and a brief explanation for each of the following metrics:
    *   **Professionalism:** How appropriate is the post for a professional audience?
    *   **Engagement:** How likely is this post to spark conversation and interaction?
    *   **Clarity:** How clear and easy to understand is the main message of the post?

Your entire output must be in the specified JSON format.

**User Profile:**
- Headline: ${input.userProfile.headline}
- Bio: ${input.userProfile.bio}
- Skills: ${input.userProfile.skills.join(', ')}

**Target Audience:** ${input.targetAudience}

**Post Draft:**
"""
${input.postContent}
"""
`,
            model: 'googleai/gemini-1.5-flash',
            config: {
                output: {
                    format: 'json',
                    schema: AnalyzePostOutputSchema,
                },
            },
        });

        return llmResponse.output() || { suggestions: [], perceptionAnalysis: [] };
    }
);


export async function analyzePost(input: AnalyzePostInput): Promise<AnalyzePostOutput> {
    return analyzePostFlow(input);
}
