
/**
 * @fileOverview Zod schemas and TypeScript types for the community policing AI agent.
 */

import { z } from 'zod';

export const CommunityPolicingInputSchema = z.object({
  userId: z.string().describe("The unique ID of the user to analyze."),
  userActivity: z.array(z.string()).describe("A list of recent activities, such as posts, comments, and job listings."),
  transactionHistory: z.array(z.object({
    type: z.enum(['payment_received', 'payment_sent', 'dispute_opened', 'dispute_resolved']),
    details: z.string(),
  })).describe("A history of the user's transactions and disputes."),
});
export type CommunityPolicingInput = z.infer<typeof CommunityPolicingInputSchema>;

export const CommunityPolicingOutputSchema = z.object({
  reliabilityScore: z.number().int().min(0).max(100).describe("A score from 0-100 representing the user's reliability."),
  summary: z.string().describe("A brief, neutral summary of the user's community standing."),
  flags: z.array(z.object({
    reason: z.string().describe("The reason for the flag (e.g., 'Unresponsive to applicants', 'Payment dispute')."),
    severity: z.enum(['low', 'medium', 'high']),
  })).describe("A list of any flags raised against the user."),
});
export type CommunityPolicingOutput = z.infer<typeof CommunityPolicingOutputSchema>;
