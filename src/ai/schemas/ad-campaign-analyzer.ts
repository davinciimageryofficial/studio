
/**
 * @fileOverview Zod schemas and TypeScript types for the ad campaign analyzer AI functionality.
 *
 * - AdCampaignAnalyzerInputSchema - Zod schema for the analyzeAdCampaign function's input.
 * - AdCampaignAnalyzerInput - TypeScript type for the analyzeAdCampaign function's input.
 * - AdCampaignAnalyzerOutputSchema - Zod schema for the analyzeAdCampaign function's output.
 * - AdCampaignAnalyzerOutput - TypeScript type for the analyzeAdCampaign function's output.
 */

import { z } from 'zod';

export const AdCampaignAnalyzerInputSchema = z.object({
  campaignName: z.string().optional().describe("The name of the ad campaign."),
  adContent: z.string().optional().describe("The copy or text content of the ad."),
  targetingKeywords: z.string().optional().describe("A comma-separated list of keywords for targeting."),
  adType: z.enum(['profile-spotlight', 'product-listing', 'sponsored-content', 'job-gig']).describe("The type of ad being created."),
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
