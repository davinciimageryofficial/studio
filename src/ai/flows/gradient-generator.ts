
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
  model: 'googleai/gemini-pro',
  prompt: `You are a CSS gradient generator. Based on the user's description, create a visually appealing CSS linear-gradient string.

The gradient should be smooth and use 3 to 5 color stops. The output must be a single, valid CSS linear-gradient value.

**User Description:** {{{description}}}

**Example Output:**
"linear-gradient(135deg, #f6d365 0%, #fda085 100%)"
"linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)"

**Your Task:**
Generate a single CSS linear-gradient value for the user's description.
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
