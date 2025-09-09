
'use server';

/**
 * @fileOverview An AI flow to generate professional courses.
 *
 * - generateCourse - A function that creates a course with a title, description, and other details.
 */

import { ai } from '@/ai/genkit';
import { CourseGeneratorInputSchema, CourseGeneratorOutputSchema, type CourseGeneratorInput, type CourseGeneratorOutput } from '@/ai/schemas/course-generator';

export type { CourseGeneratorInput, CourseGeneratorOutput };

export async function generateCourse(input: CourseGeneratorInput): Promise<CourseGeneratorOutput> {
  return courseGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'courseGeneratorPrompt',
  input: { schema: CourseGeneratorInputSchema },
  output: { schema: CourseGeneratorOutputSchema.omit({ id: true }) },
  prompt: `You are an AI assistant for a professional networking platform called Sentry.

Your task is to generate a realistic, professional course listing.
The course must be relevant to the specified category: {{{category}}}.

Generate the following:
- **title**: A compelling and descriptive course title.
- **author**: A realistic-sounding expert name.
- **price**: A realistic price between 49.99 and 299.99.
- **category**: The category provided in the input.
- **description**: A short, engaging summary of the course (2-3 sentences).
- **imageUrl**: A placeholder image URL from picsum.photos in the format https://picsum.photos/seed/<random_string>/600/400.
- **level**: The skill level for the course (Beginner, Intermediate, or Advanced).

Your entire output must be in the specified JSON format.
`,
});

const courseGeneratorFlow = ai.defineFlow(
  {
    name: 'courseGeneratorFlow',
    inputSchema: CourseGeneratorInputSchema,
    outputSchema: CourseGeneratorOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    
    return {
        ...output!,
        id: `course-${Date.now()}-${Math.random()}`, // Generate a unique ID
    };
  }
);
