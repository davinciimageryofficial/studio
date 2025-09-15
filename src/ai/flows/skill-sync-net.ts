
'use server';

/**
 * @fileOverview An AI-powered matching system for clients and freelancers.
 *
 * - skillSyncNet - A function that handles the matching process.
 */
import { openai } from '@/ai/inference';
import { 
    SkillSyncNetInputSchema,
    SkillSyncNetOutputSchema,
    type SkillSyncNetInput, 
    type SkillSyncNetOutput
} from '@/ai/schemas/skill-sync-net';

export type { SkillSyncNetInput, SkillSyncNetOutput };

const clientSystemPrompt = `You are Skill Sync Net, an AI-powered talent scout. Your task is to find the perfect freelancer for a client's project.

Analyze the client's project brief below and generate a profile for one ideal freelance candidate.

**Your Task:**
1.  Invent a realistic and professional-sounding freelancer.
2.  Create a compelling headline that aligns with the project's needs.
3.  List 3-5 key skills that are highly relevant to the project brief.
4.  Write a concise "Match Reasoning" explaining why this freelancer is a perfect fit, directly referencing the brief.
5.  Provide a match confidence score between 85 and 98.
6.  Ensure your entire output is in the specified JSON format under the "match.freelancer" key.

The JSON schema for the output is:
{
  "match": {
    "freelancer": {
      "name": string,
      "headline": string,
      "skills": string[],
      "matchReasoning": string,
      "matchConfidence": number
    }
  }
}
`;

const freelancerSystemPrompt = `You are Skill Sync Net, an AI-powered project finder. Your task is to find the perfect project for a freelancer.

Analyze the freelancer's profile below and generate one ideal project listing.

**Your Task:**
1.  Invent a realistic and appealing project.
2.  Create a compelling project title and a realistic client name.
3.  Write a concise project description.
4.  List 3-5 required skills that align with the freelancer's profile.
5.  Set a realistic budget and timeline for the project.
6.  Write a "Match Reasoning" explaining why this project is an excellent opportunity for the freelancer.
7.  Provide a match confidence score between 85 and 98.
8.  Ensure your entire output is in the specified JSON format under the "match.project" key.

The JSON schema for the output is:
{
    "match": {
        "project": {
            "title": string,
            "clientName": string,
            "description": string,
            "requiredSkills": string[],
            "budget": number,
            "timeline": string,
            "matchReasoning": string,
            "matchConfidence": number
        }
    }
}
`;


export async function skillSyncNet(input: SkillSyncNetInput): Promise<SkillSyncNetOutput> {
    let systemPrompt: string;
    let userPrompt: string;

    if (input.context === 'client_seeking_freelancer') {
        if (!input.clientBrief) throw new Error("Client brief is required.");
        systemPrompt = clientSystemPrompt;
        userPrompt = `
**Client's Project Brief:**
- **Title:** ${input.clientBrief.projectTitle}
- **Description:** ${input.clientBrief.projectDescription}
- **Required Skills:** ${input.clientBrief.requiredSkills}
- **Budget:** $${input.clientBrief.budget}
- **Timeline:** ${input.clientBrief.timeline}
        `;
    } else if (input.context === 'freelancer_seeking_project') {
        if (!input.freelancerProfile) throw new Error("Freelancer profile is required.");
        systemPrompt = freelancerSystemPrompt;
        userPrompt = `
**Freelancer's Profile:**
- **Headline:** ${input.freelancerProfile.headline}
- **Bio:** ${input.freelancerProfile.bio}
- **Skills:** ${input.freelancerProfile.skills.join(', ')}
        `;
    } else {
        throw new Error("Invalid context provided.");
    }
    
    const response = await openai.chat.completions.create({
        model: "google/gemma-3-27b-instruct/bf-16",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
        throw new Error("AI failed to generate a response.");
    }
    
    try {
        return JSON.parse(content) as SkillSyncNetOutput;
    } catch (e) {
        console.error("Failed to parse AI response as JSON:", content);
        throw new Error("AI returned invalid data format.");
    }
}
