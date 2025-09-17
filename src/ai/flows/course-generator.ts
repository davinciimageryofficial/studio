'use server';

/**
 * @fileOverview An AI flow to generate professional courses.
 *
 * - generateCourse - A function that creates a course with a title, description, and other details.
 */
import { ai } from '@/ai/genkit';
import { CourseGeneratorInputSchema, CourseGeneratorOutputSchema, type CourseGeneratorInput, type CourseGeneratorOutput } from '@/ai/schemas/course-generator';

export type { CourseGeneratorInput, CourseGeneratorOutput };

const generateCourseFlow = ai.defineFlow(
    {
        name: 'generateCourseFlow',
        inputSchema: CourseGeneratorInputSchema,
        outputSchema: CourseGeneratorOutputSchema,
    },
    async (input) => {
        const llmResponse = await ai.generate({
            prompt: `You are an AI assistant for a professional networking platform called Sentry.

Your task is to generate a realistic, professional course listing.
The course must be relevant to the specified category: ${input.category}.

Generate the following fields and ensure your entire output is a valid JSON object:
- **title**: A compelling and descriptive course title.
- **author**: A realistic-sounding expert name.
- **price**: A realistic price between 49.99 and 299.99.
- **category**: The category provided in the user input.
- **description**: A short, engaging summary of the course (2-3 sentences).
- **imageUrl**: A placeholder image URL from picsum.photos in the format https://picsum.photos/seed/<random_string>/600/400.
- **level**: The skill level for the course (Beginner, Intermediate, or Advanced).
`,
            model: 'googleai/gemini-1.5-flash',
            config: {
                output: {
                    format: 'json',
                    schema: CourseGeneratorOutputSchema,
                },
            },
        });
        
        const output = llmResponse.output();
        if (output) {
            output.id = `course-${Date.now()}-${Math.random()}`; // Generate a unique ID
            return output;
        }

        // Fallback in case of error
        throw new Error("AI failed to generate a response.");
    }
);


export async function generateCourse(input: CourseGeneratorInput): Promise<CourseGeneratorOutput> {
    return generateCourseFlow(input);
}
