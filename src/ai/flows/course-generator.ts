
'use server';

/**
 * @fileOverview An AI flow to generate professional courses.
 *
 * - generateCourse - A function that creates a course with a title, description, and other details.
 */
import { openai } from '@/ai/inference';
import { CourseGeneratorInputSchema, CourseGeneratorOutputSchema, type CourseGeneratorInput, type CourseGeneratorOutput } from '@/ai/schemas/course-generator';

export type { CourseGeneratorInput, CourseGeneratorOutput };

const systemPrompt = `You are an AI assistant for a professional networking platform called Sentry.

Your task is to generate a realistic, professional course listing.
The course must be relevant to the specified category.

Generate the following fields and ensure your entire output is a valid JSON object:
- **title**: A compelling and descriptive course title.
- **author**: A realistic-sounding expert name.
- **price**: A realistic price between 49.99 and 299.99.
- **category**: The category provided in the user input.
- **description**: A short, engaging summary of the course (2-3 sentences).
- **imageUrl**: A placeholder image URL from picsum.photos in the format https://picsum.photos/seed/<random_string>/600/400.
- **level**: The skill level for the course (Beginner, Intermediate, or Advanced).

The JSON schema for the output is:
{
  "title": string,
  "author": string,
  "price": number,
  "category": string,
  "description": string,
  "imageUrl": string,
  "level": "Beginner" | "Intermediate" | "Advanced"
}
`;


export async function generateCourse(input: CourseGeneratorInput): Promise<CourseGeneratorOutput> {
    const response = await openai.chat.completions.create({
        model: "google/gemma-3-27b-instruct/bf-16",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Generate a course for the category: ${input.category}` }
        ],
        response_format: { type: "json_object" },
    });
    
    const content = response.choices[0]?.message?.content;
    if (!content) {
        throw new Error("AI failed to generate a response.");
    }
    
    try {
        const parsedOutput = JSON.parse(content);
        return {
            ...parsedOutput,
            id: `course-${Date.now()}-${Math.random()}`, // Generate a unique ID
        };
    } catch (e) {
        console.error("Failed to parse AI response as JSON:", content);
        throw new Error("AI returned invalid data format.");
    }
}

