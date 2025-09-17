'use server';

/**
 * @fileOverview An AI flow to analyze an ad campaign in real-time and provide feedback.
 *
 * - analyzeAdCampaign - A function that takes campaign details and returns live suggestions.
 */
import { ai } from '@/ai/genkit';
import { AdCampaignAnalyzerInputSchema, AdCampaignAnalyzerOutputSchema, type AdCampaignAnalyzerInput, type AdCampaignAnalyzerOutput } from '@/ai/schemas/ad-campaign-analyzer';

export type { AdCampaignAnalyzerInput, AdCampaignAnalyzerOutput } from '@/ai/schemas/ad-campaign-analyzer';


const analyzeAdCampaignFlow = ai.defineFlow(
  {
    name: 'analyzeAdCampaignFlow',
    inputSchema: AdCampaignAnalyzerInputSchema,
    outputSchema: AdCampaignAnalyzerOutputSchema,
  },
  async (input) => {
    if (!input.campaignName && !input.adContent && !input.targetingKeywords) {
      return {};
    }

    const llmResponse = await ai.generate({
      prompt: `You are an AI Ad Campaign Analyst. Analyze the provided campaign details. If a field is empty, do not analyze it.

The user's ad type is '${input.adType}'.

**Campaign Name Analysis:**
${input.campaignName ? `
Analyze the campaign name: "${input.campaignName}"
- **Score:** Rate its effectiveness on a scale of 0-100 based on clarity, catchiness, and relevance.
- **Feedback:** Provide one single, actionable sentence to improve it.
` : ''}

**Ad Content Analysis:**
${input.adContent ? `
Analyze the ad content: """${input.adContent}"""
- **Suggestions:** Provide a bulleted list of 2-3 short, actionable tips to improve the ad copy. Consider conciseness, call-to-action, and tone. Advise on optimal word counts (e.g., "Aim for 20-30 words for a spotlight ad.").
` : ''}

**Keyword Analysis:**
${input.targetingKeywords ? `
Analyze the keywords: "${input.targetingKeywords}"
- **Suggestions:** Suggest a bulleted list of 2-3 additional keywords that would be relevant.
` : ''}

Your entire output must be in a valid JSON format. Only include analysis for fields that are not empty.
`,
      model: 'googleai/gemini-1.5-flash',
      config: {
        output: {
          format: 'json',
          schema: AdCampaignAnalyzerOutputSchema,
        },
      },
    });

    return llmResponse.output() || {};
  }
);


export async function analyzeAdCampaign(input: AdCampaignAnalyzerInput): Promise<AdCampaignAnalyzerOutput> {
   return analyzeAdCampaignFlow(input);
}
