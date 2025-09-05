
'use server';

/**
 * @fileOverview An AI flow to generate CSS gradients from text descriptions.
 *
 * - generateGradient - A function that creates a CSS linear-gradient string.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GradientGeneratorInputSchema = z.object({
  description: z.string().describe("A text description of the desired gradient (e.g., 'a fiery sunset', 'a calm ocean morning')."),
});
export type GradientGeneratorInput = z.infer<typeof GradientGeneratorInputSchema>;

const GradientGeneratorOutputSchema = z.object({
  gradient: z.string().describe("A valid CSS linear-gradient string (e.g., 'linear-gradient(to right, #ff0000, #0000ff)')."),
});
export type GradientGeneratorOutput = z.infer<typeof GradientGeneratorOutputSchema>;

export async function generateGradient(input: GradientGeneratorInput): Promise<GradientGeneratorOutput> {
  return gradientGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'gradientGeneratorPrompt',
  input: { schema: GradientGeneratorInputSchema },
  output: { schema: GradientGeneratorOutputSchema },
  prompt: `You are a CSS gradient generator specializing in vibrant, animated backgrounds for a "Lit Mode" or "party mode" feature.

Based on the user's description, create a visually stunning CSS linear-gradient string.

**Requirements:**
- The gradient must be suitable for animation, so use at least 4-6 vibrant, contrasting, and interesting color stops.
- The gradient should be complex and exciting, fitting a "disco" or "pop culture" theme.
- The output must be a single, valid CSS linear-gradient value.

**User Description:** {{{description}}}

**Example Output:**
"linear-gradient(135deg, #ff00ff, #00ffff, #ffff00, #ff0000)"
"linear-gradient(-45deg, #fc5c7d, #6a82fb, #05dfd7, #f7b733)"

**Your Task:**
Generate a single, vibrant CSS linear-gradient value for the user's description.
`,
});

const gradientGeneratorFlow = ai.defineFlow(
  {
    name: 'gradientGeneratorFlow',
    inputSchema: GradientGeneratorInputSchema,
    outputSchema: GradientGeneratorOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
