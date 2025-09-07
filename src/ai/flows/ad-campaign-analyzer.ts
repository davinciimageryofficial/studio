
'use server';

/**
 * @fileOverview An AI flow to analyze an ad campaign in real-time and provide feedback.
 *
 * - analyzeAdCampaign - A function that takes campaign details and returns live suggestions.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const AdCampaignAnalyzerInputSchema = z.object({
  campaignName: z.string().optional().describe("The name of the ad campaign."),
  adContent: z.string().optional().describe("The copy or text content of the ad."),
  targetingKeywords: z.string().optional().describe("A comma-separated list of keywords for targeting."),
  adType: z.enum(['banner', 'profile-spotlight', 'product-listing', 'sponsored-content', 'job-gig']).describe("The type of ad being created."),
});
export type AdCampaignAnalyzerInput = z.infer<typeof AdCampaignAnalyzerInputSchema>;


export const AdCampaignAnalyzerOutputSchema = z.object({
  campaignNameStrength: z.object({
    score: z.number().int().min(0).max(100).describe('A score from 0 to 100 for the campaign name\'s effectiveness.'),
    feedback: z.string().describe('Actionable feedback on how to improve the campaign name.'),
  }).optional(),
  adContentSuggestions: z.array(z.string()).optional().describe('A list of suggestions to improve the ad content.'),
  keywordSuggestions: z.array(z.string()).optional().describe('A list of suggested keywords to add.'),
});
export type AdCampaignAnalyzerOutput = z.infer<typeof AdCampaignAnalyzerOutputSchema>;


export async function analyzeAdCampaign(input: AdCampaignAnalyzerInput): Promise<AdCampaignAnalyzerOutput> {
  return adCampaignAnalyzerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adCampaignAnalyzerPrompt',
  input: { schema: AdCampaignAnalyzerInputSchema },
  output: { schema: AdCampaignAnalyzerOutputSchema },
  prompt: `You are an AI Ad Campaign Analyst integrated into the Sentry platform. Your task is to provide live, concise, and helpful feedback to a user creating an ad campaign. The user's ad type is '{{{adType}}}'.

Analyze the provided campaign details. If a field is empty, do not analyze it.

**Campaign Name Analysis:**
{{#if campaignName}}
Analyze the campaign name: "{{{campaignName}}}"
- **Score:** Rate its effectiveness on a scale of 0-100 based on clarity, catchiness, and relevance.
- **Feedback:** Provide one single, actionable sentence to improve it.
{{/if}}

**Ad Content Analysis:**
{{#if adContent}}
Analyze the ad content: """{{{adContent}}}"""
- **Suggestions:** Provide a bulleted list of 2-3 short, actionable tips to improve the ad copy. Consider conciseness, call-to-action, and tone. Advise on optimal word counts (e.g., "Aim for 20-30 words for a spotlight ad.").
{{/if}}

**Keyword Analysis:**
{{#if targetingKeywords}}
Analyze the keywords: "{{{targetingKeywords}}}"
- **Suggestions:** Suggest a bulleted list of 2-3 additional keywords that would be relevant.
{{/if}}

Your entire output must be in the specified JSON format. Only include analysis for fields that are not empty.
`,
});

const adCampaignAnalyzerFlow = ai.defineFlow(
  {
    name: 'adCampaignAnalyzerFlow',
    inputSchema: AdCampaignAnalyzerInputSchema,
    outputSchema: AdCampaignAnalyzerOutputSchema,
  },
  async (input) => {
    // Only call the prompt if at least one field has content
    if (!input.campaignName && !input.adContent && !input.targetingKeywords) {
      return {};
    }
    const { output } = await prompt(input);
    return output!;
  }
);
