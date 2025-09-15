
'use server';

/**
 * @fileOverview An AI flow to analyze an ad campaign in real-time and provide feedback.
 *
 * - analyzeAdCampaign - A function that takes campaign details and returns live suggestions.
 */
import { openai } from '@/ai/inference';
import { type AdCampaignAnalyzerInput, type AdCampaignAnalyzerOutput } from '@/ai/schemas/ad-campaign-analyzer';

export type { AdCampaignAnalyzerInput, AdCampaignAnalyzerOutput } from '@/ai/schemas/ad-campaign-analyzer';

const systemPrompt = `You are an AI Ad Campaign Analyst integrated into the Sentry platform. Your task is to provide live, concise, and helpful feedback to a user creating an ad campaign.

You will receive the user's input as a JSON object. Analyze the provided campaign details. If a field is empty, do not analyze it.

The user's ad type is '{{adType}}'.

**Campaign Name Analysis:**
{{#if campaignName}}
Analyze the campaign name: "{{campaignName}}"
- **Score:** Rate its effectiveness on a scale of 0-100 based on clarity, catchiness, and relevance.
- **Feedback:** Provide one single, actionable sentence to improve it.
{{/if}}

**Ad Content Analysis:**
{{#if adContent}}
Analyze the ad content: """{{adContent}}"""
- **Suggestions:** Provide a bulleted list of 2-3 short, actionable tips to improve the ad copy. Consider conciseness, call-to-action, and tone. Advise on optimal word counts (e.g., "Aim for 20-30 words for a spotlight ad.").
{{/if}}

**Keyword Analysis:**
{{#if targetingKeywords}}
Analyze the keywords: "{{targetingKeywords}}"
- **Suggestions:** Suggest a bulleted list of 2-3 additional keywords that would be relevant.
{{/if}}

Your entire output must be in a valid JSON format. Only include analysis for fields that are not empty.
The JSON schema for the output is:
{
  "campaignNameStrength": {
    "score": number (0-100),
    "feedback": string
  },
  "adContentSuggestions": string[],
  "keywordSuggestions": string[]
}
`;

function buildUserPrompt(input: AdCampaignAnalyzerInput): string {
    let prompt = `Analyze the following ad campaign details:\n`;
    if (input.campaignName) prompt += `Campaign Name: ${input.campaignName}\n`;
    if (input.adContent) prompt += `Ad Content: ${input.adContent}\n`;
    if (input.targetingKeywords) prompt += `Targeting Keywords: ${input.targetingKeywords}\n`;
    prompt += `Ad Type: ${input.adType}`;
    return prompt;
}

export async function analyzeAdCampaign(input: AdCampaignAnalyzerInput): Promise<AdCampaignAnalyzerOutput> {
   if (!input.campaignName && !input.adContent && !input.targetingKeywords) {
      return {};
    }

    const response = await openai.chat.completions.create({
        model: "google/gemma-3-27b-instruct/bf-16",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: buildUserPrompt(input) }
        ],
        response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
        throw new Error("AI failed to generate a response.");
    }

    try {
        return JSON.parse(content) as AdCampaignAnalyzerOutput;
    } catch (e) {
        console.error("Failed to parse AI response as JSON:", content);
        throw new Error("AI returned invalid data format.");
    }
}
