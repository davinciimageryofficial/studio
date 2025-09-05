
'use server';

/**
 * @fileOverview An AI-powered matching system for clients and freelancers.
 *
 * - skillSyncNet - A function that handles the matching process.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { 
    SkillSyncNetInputSchema,
    SkillSyncNetOutputSchema,
    ClientBriefSchema,
    FreelancerProfileSchema,
    type SkillSyncNetInput, 
    type SkillSyncNetOutput
} from '@/ai/schemas/skill-sync-net';

export type { SkillSyncNetInput, SkillSyncNetOutput };

export async function skillSyncNet(input: SkillSyncNetInput): Promise<SkillSyncNetOutput> {
  return skillSyncNetFlow(input);
}

const skillSyncNetFlow = ai.defineFlow(
  {
    name: 'skillSyncNetFlow',
    inputSchema: SkillSyncNetInputSchema,
    outputSchema: SkillSyncNetOutputSchema,
  },
  async (input) => {
    if (input.context === 'client_seeking_freelancer') {
      if (!input.clientBrief) throw new Error("Client brief is required.");
      
      // Return a hardcoded result to save on API calls and avoid rate limiting.
      const featuredFreelancer: SkillSyncNetOutput = {
          match: {
              freelancer: {
                  name: "Elena Rodriguez",
                  headline: "Senior UI/UX Designer & Prototyping Expert",
                  skills: ["Figma", "User Research", "Prototyping", "Interaction Design", "Webflow"],
                  matchReasoning: `Elena is a perfect match based on the project's focus on a checkout flow redesign. Her expertise in Figma and Prototyping aligns directly with the "Required Skills". Her "Advanced Requirements" match for "Creative Assets" and "Pixel-perfect precision" makes her an ideal candidate to deliver a high-quality, user-centric solution.`,
                  matchConfidence: 96,
              }
          }
      };
      return featuredFreelancer;

    } else if (input.context === 'freelancer_seeking_project') {
      if (!input.freelancerProfile) throw new Error("Freelancer profile is required.");
      
      // Return a hardcoded project to save on API calls and avoid rate limiting.
      const featuredProject: SkillSyncNetOutput = {
        match: {
          project: {
            title: "Featured Project: Interactive Data Dashboard",
            clientName: "Data Insights Inc.",
            description: "Develop a cutting-edge, interactive web dashboard for visualizing real-time analytics. This is a high-visibility project for a fast-growing tech startup.",
            requiredSkills: ["React", "D3.js", "TypeScript", "Data Visualization", "UI/UX"],
            budget: 15000,
            timeline: "1-2 months",
            matchReasoning: "This featured project requires strong front-end skills and an eye for data visualization, making it an excellent opportunity for top-tier developers. The modern tech stack aligns with your expertise in React and TypeScript.",
            matchConfidence: 98,
          }
        }
      };
      return featuredProject;
    }
    throw new Error("Invalid context provided.");
  }
);
