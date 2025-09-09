
/**
 * @fileOverview Zod schemas and TypeScript types for the course generator AI functionality.
 *
 * - CourseGeneratorInputSchema - Zod schema for the generateCourse function's input.
 * - CourseGeneratorInput - TypeScript type for the generateCourse function's input.
 * - CourseGeneratorOutputSchema - Zod schema for the generateCourse function's output.
 * - CourseGeneratorOutput - TypeScript type for the generateCourse function's output.
 */

import { z } from 'zod';

export const CourseGeneratorInputSchema = z.object({
  category: z.enum(['Development', 'Design', 'Writing', 'AI & Machine Learning', 'Data Science', 'Freelance']),
});
export type CourseGeneratorInput = z.infer<typeof CourseGeneratorInputSchema>;

export const CourseGeneratorOutputSchema = z.object({
  id: z.string().describe("A unique ID for the course."),
  title: z.string().describe("The title of the course."),
  author: z.string().describe("The name of the course instructor."),
  price: z.number().describe("The price of the course in USD."),
  category: z.string().describe("The primary category of the course."),
  description: z.string().describe("A brief description of the course content."),
  imageUrl: z.string().url().describe("A URL for the course's thumbnail image."),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']).describe("The difficulty level of the course."),
});
export type CourseGeneratorOutput = z.infer<typeof CourseGeneratorOutputSchema>;
