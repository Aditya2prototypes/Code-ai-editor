'use server';

import {
  generateCode,
  GenerateCodeInput,
} from '@/ai/flows/generate-code-from-prompt';
import { improveCode, ImproveCodeInput } from '@/ai/flows/improve-code';
import { explainCode, ExplainCodeInput } from '@/ai/flows/explain-code';

interface GenerateCodeActionResult {
  code?: string;
  error?: string;
}

export async function generateCodeAction(
  prevState: GenerateCodeActionResult,
  formData: FormData
): Promise<GenerateCodeActionResult> {
  const prompt = formData.get('prompt') as string;
  const language = formData.get('language') as string;

  const languageFormatted =
    language.charAt(0).toUpperCase() + language.slice(1);

  if (!prompt || !language) {
    return { error: 'Prompt and language are required.' };
  }

  try {
    const result = await generateCode({
      prompt,
      language: languageFormatted as GenerateCodeInput['language'],
    });
    return { code: result.code };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to generate code. Please try again.' };
  }
}

interface ImproveCodeActionResult {
  improvedCode?: string;
  error?: string;
}

export async function improveCodeAction(
  prevState: ImproveCodeActionResult,
  formData: FormData
): Promise<ImproveCodeActionResult> {
  const code = formData.get('code') as string;
  const prompt = formData.get('prompt') as string;
  const language = formData.get('language') as string;

  const languageFormatted =
    language.charAt(0).toUpperCase() + language.slice(1);

  if (!code || !prompt || !language) {
    return { error: 'Code, prompt, and language are required.' };
  }

  try {
    const result = await improveCode({
      code,
      prompt,
      language: languageFormatted as ImproveCodeInput['language'],
    });
    return { improvedCode: result.improvedCode };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to improve code. Please try again.' };
  }
}

interface ExplainCodeActionResult {
  explanation?: string;
  error?: string;
}

export async function explainCodeAction(
  prevState: ExplainCodeActionResult,
  formData: FormData
): Promise<ExplainCodeActionResult> {
  const code = formData.get('code') as string;
  const prompt = formData.get('prompt') as string;
  const language = formData.get('language') as string;

  const languageFormatted =
    language.charAt(0).toUpperCase() + language.slice(1);

  if (!code || !language) {
    return { error: 'Code and language are required.' };
  }

  try {
    const result = await explainCode({
      code,
      prompt: prompt || 'Explain this code snippet.',
      language: languageFormatted as ExplainCodeInput['language'],
    });
    return { explanation: result.explanation };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to explain code. Please try again.' };
  }
}
