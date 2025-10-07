"use server";

import { suggestPrompt } from "@/ai/flows/suggest-prompt";
import { generateImage } from "@/ai/flows/generate-image";
import type { GenerateImageInput } from "@/ai/flows/generate-image";

export async function getSuggestedPrompt(basicDescription: string) {
  if (!basicDescription) {
    return { error: "Please provide a description." };
  }

  try {
    const result = await suggestPrompt({ basicDescription });
    return { suggestedPrompt: result.suggestedPrompt };
  } catch (e) {
    console.error(e);
    return { error: "Failed to generate suggestion. Please try again." };
  }
}

export async function generateImageAction(input: GenerateImageInput) {
  if (!input.prompt) {
    return { error: "Please provide a prompt." };
  }

  try {
    const result = await generateImage(input);
    return { imageUrl: result.imageUrl };
  } catch (e) {
    console.error(e);
    return { error: "Failed to generate image. Please try again." };
  }
}
