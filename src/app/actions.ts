'use server';

import { generateCode, GenerateCodeInput } from '@/ai/flows/generate-code-from-prompt';

interface ActionResult {
  code?: string;
  error?: string;
}

export async function generateCodeAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const prompt = formData.get('prompt') as string;
  const language = formData.get('language') as string;
  
  const languageFormatted = language.charAt(0).toUpperCase() + language.slice(1);

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
