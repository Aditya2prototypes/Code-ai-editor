'use server';

/**
 * @fileOverview Implements a Genkit flow that improves code snippets based on user prompts.
 *
 * - improveCode - A function that takes a code snippet and a prompt, and returns improved code.
 * - ImproveCodeInput - The input type for the improveCode function.
 * - ImproveCodeOutput - The return type for the improveCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveCodeInputSchema = z.object({
  code: z.string().describe('The code snippet to improve.'),
  prompt: z.string().describe('The prompt for improving the code (e.g., improve efficiency, reduce cyclomatic complexity, or improve readability).'),
  language: z.string().describe('The programming language of the code snippet.'),
});
export type ImproveCodeInput = z.infer<typeof ImproveCodeInputSchema>;

const ImproveCodeOutputSchema = z.object({
  improvedCode: z.string().describe('The improved code snippet.'),
});
export type ImproveCodeOutput = z.infer<typeof ImproveCodeOutputSchema>;

export async function improveCode(input: ImproveCodeInput): Promise<ImproveCodeOutput> {
  return improveCodeFlow(input);
}

const improveCodePrompt = ai.definePrompt({
  name: 'improveCodePrompt',
  input: {schema: ImproveCodeInputSchema},
  output: {schema: ImproveCodeOutputSchema},
  prompt: `You are an AI code assistant. You will receive a code snippet, a programming language, and a prompt describing how to improve the code. You will return the improved code snippet.

Language: {{{language}}}
Code:
\`\`\`{{{language}}}
{{{code}}}
\`\`\`

Improvement Prompt: {{{prompt}}}

Improved Code:
`,
});

const improveCodeFlow = ai.defineFlow(
  {
    name: 'improveCodeFlow',
    inputSchema: ImproveCodeInputSchema,
    outputSchema: ImproveCodeOutputSchema,
  },
  async input => {
    const {output} = await improveCodePrompt(input);
    return output!;
  }
);
