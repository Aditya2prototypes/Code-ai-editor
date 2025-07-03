'use server';
/**
 * @fileOverview A flow to simulate Python code execution.
 *
 * - runPythonCode - A function that takes Python code and returns the simulated output.
 * - RunPythonCodeInput - The input type for the runPythonCode function.
 * - RunPythonCodeOutput - The return type for the runPythonCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RunPythonCodeInputSchema = z.object({
  code: z.string().describe('The Python code to execute.'),
});
export type RunPythonCodeInput = z.infer<typeof RunPythonCodeInputSchema>;

const RunPythonCodeOutputSchema = z.object({
  output: z
    .string()
    .describe(
      'The simulated standard output of the Python code. If the code has a print statement, this will be the output. If there is an error, this will be the stderr.'
    ),
});
export type RunPythonCodeOutput = z.infer<typeof RunPythonCodeOutputSchema>;

export async function runPythonCode(
  input: RunPythonCodeInput
): Promise<RunPythonCodeOutput> {
  return runPythonCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'runPythonCodePrompt',
  input: {schema: RunPythonCodeInputSchema},
  output: {schema: RunPythonCodeOutputSchema},
  prompt: `You are a Python runtime environment. Execute the following Python code and return only the standard output. Do not provide any explanation, commentary, or formatting like \`\`\`python ... \`\`\`. If there is an error during execution, return the standard error message.

Code:
{{{code}}}
`,
});

const runPythonCodeFlow = ai.defineFlow(
  {
    name: 'runPythonCodeFlow',
    inputSchema: RunPythonCodeInputSchema,
    outputSchema: RunPythonCodeOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
