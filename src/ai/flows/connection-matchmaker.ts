
'use server';

/**
 * @fileOverview An AI-powered flow that recommends content.
 *
 * - recommendContent - A function that handles the content recommendation process.
 * - ContentRecommenderInput - The input type for the recommendContent function.
 * - ContentRecommenderOutput - The return type for the recommendContent function.
 */

import { ai } from '@/ai/genkit';
import { ContentRecommenderInputSchema, ContentRecommenderOutputSchema, type ContentRecommenderInput, type ContentRecommenderOutput } from '@/ai/schemas/content-recommender';

export type { ContentRecommenderInput, ContentRecommenderOutput };


export async function recommendContent(input: ContentRecommenderInput): Promise<ContentRecommenderOutput> {
  return contentRecommenderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contentRecommenderPrompt',
  input: { schema: ContentRecommenderInputSchema },
  output: { schema: ContentRecommenderOutputSchema },
  prompt: `You are an AI assistant for a professional networking platform called Sentry. Your task is to act as a content recommender.

You will analyze the user's profile to determine if they would be interested in a specific course or podcast.

Analyze the user profile and the content information below and decide if it is a good recommendation.

**User Profile:**
- Headline: {{{currentUser.headline}}}
- Bio: {{{currentUser.bio}}}
- Skills: {{#each currentUser.skills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

**Content:**
- Title: {{{content.title}}}
- Description: {{{content.description}}}
- Category: {{{content.category}}}

---

Based on your analysis, set the "recommended" field to true or false and provide a brief "reason" for your decision.
`,
});

const contentRecommenderFlow = ai.defineFlow(
  {
    name: 'contentRecommenderFlow',
    inputSchema: ContentRecommenderInputSchema,
    outputSchema: ContentRecommenderOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
