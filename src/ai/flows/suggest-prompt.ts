'use server';
/**
 * @fileOverview A flow for suggesting an improved image generation prompt based on a basic description.
 *
 * - suggestPrompt - A function that takes a basic image description and returns a suggested prompt.
 * - SuggestPromptInput - The input type for the suggestPrompt function.
 * - SuggestPromptOutput - The return type for the suggestPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPromptInputSchema = z.object({
  basicDescription: z
    .string()
    .describe('A basic description of the image the user wants to generate.'),
});
export type SuggestPromptInput = z.infer<typeof SuggestPromptInputSchema>;

const SuggestPromptOutputSchema = z.object({
  suggestedPrompt: z
    .string()
    .describe('A detailed and effective prompt for generating a high-quality image.'),
});
export type SuggestPromptOutput = z.infer<typeof SuggestPromptOutputSchema>;

export async function suggestPrompt(input: SuggestPromptInput): Promise<SuggestPromptOutput> {
  return suggestPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPromptPrompt',
  input: {schema: SuggestPromptInputSchema},
  output: {schema: SuggestPromptOutputSchema},
  prompt: `You are an AI prompt engineer specializing in creating detailed and effective prompts for AI image generation. Based on the user's basic description, create a prompt that will produce a high-quality, visually stunning image.

Basic Description: {{{basicDescription}}}

Suggested Prompt:`,
});

const suggestPromptFlow = ai.defineFlow(
  {
    name: 'suggestPromptFlow',
    inputSchema: SuggestPromptInputSchema,
    outputSchema: SuggestPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
