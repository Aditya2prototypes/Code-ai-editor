'use server';
/**
 * @fileOverview An AI agent that generates React components with Tailwind CSS.
 *
 * - generateTailwindComponent - A function that generates a component from a prompt.
 * - GenerateTailwindComponentInput - The input type for the function.
 * - GenerateTailwindComponentOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTailwindComponentInputSchema = z.object({
  prompt: z.string().describe('A description of the UI component to generate.'),
});
export type GenerateTailwindComponentInput = z.infer<
  typeof GenerateTailwindComponentInputSchema
>;

const GenerateTailwindComponentOutputSchema = z.object({
  code: z.string().describe('The generated React component code with Tailwind CSS.'),
});
export type GenerateTailwindComponentOutput = z.infer<
  typeof GenerateTailwindComponentOutputSchema
>;

export async function generateTailwindComponent(
  input: GenerateTailwindComponentInput
): Promise<GenerateTailwindComponentOutput> {
  return generateTailwindComponentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTailwindComponentPrompt',
  input: {schema: GenerateTailwindComponentInputSchema},
  output: {schema: GenerateTailwindComponentOutputSchema},
  prompt: `You are an expert web developer specializing in Next.js, React, Tailwind CSS, and shadcn/ui.
Your task is to generate the code for a single React component based on the user's request.
- Use functional components.
- Use Tailwind CSS for styling.
- Use shadcn/ui components (e.g., <Button>, <Input>, <Card>) where appropriate to create a modern and clean UI.
- Use lucide-react for icons.
- Do not include \`import React from 'react'\`.
- Do not include any explanations, just the raw code for the component.
- The component should be self-contained in one file.

User Request: {{{prompt}}}
`,
});

const generateTailwindComponentFlow = ai.defineFlow(
  {
    name: 'generateTailwindComponentFlow',
    inputSchema: GenerateTailwindComponentInputSchema,
    outputSchema: GenerateTailwindComponentOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
