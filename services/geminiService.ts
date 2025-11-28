import { GoogleGenAI } from "@google/genai";
import { GenerationSize } from "../types";

// Helper to check for API key selection
const ensureApiKey = async (forcePrompt: boolean = false): Promise<void> => {
  const aistudio = (window as any).aistudio;
  if (aistudio) {
    const hasKey = await aistudio.hasSelectedApiKey();
    if (!hasKey || forcePrompt) {
      await aistudio.openSelectKey();
    }
  }
};

const getClient = async () => {
  await ensureApiKey();
  // We re-instantiate to ensure we pick up the env var injected by the platform after selection
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// Wrapper to handle retries and permission errors
const withErrorHandling = async <T>(operation: (ai: GoogleGenAI) => Promise<T>): Promise<T> => {
  const maxRetries = 2;
  let lastError: any;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      // Create a fresh client for each attempt to ensure we have the latest API key
      const ai = await getClient();
      return await operation(ai);
    } catch (err: any) {
      lastError = err;
      
      // Handle 403/Permission Denied - likely invalid API key or Project
      // Also handle "Requested entity was not found" which can happen if project is invalid/unpaid for Veo/Imagen
      if (err.status === 403 || err.message?.includes('403') || err.message?.includes('permission') || err.message?.includes('Requested entity was not found')) {
        console.warn("Permission denied or entity not found. Prompting for API key...");
        const aistudio = (window as any).aistudio;
        if (aistudio) {
          await aistudio.openSelectKey();
          continue; // Retry with new key
        }
      }

      // Handle 500/503 - Internal Server Error
      if (err.status === 500 || err.status === 503 || err.message?.includes('500') || err.message?.includes('503')) {
         if (i < maxRetries) {
           console.warn(`Attempt ${i + 1} failed with 500/503. Retrying...`);
           await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i))); // Exponential backoff
           continue;
         }
      }

      // If we are here, it's an error we shouldn't retry or we ran out of retries
      throw err;
    }
  }
  throw lastError;
};

export const generatePoster = async (
  imageBase64: string,
  prompt: string,
  size: GenerationSize
): Promise<string> => {
  const data = imageBase64.split(',')[1] || imageBase64;
  const mimeType = imageBase64.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)?.[1] || 'image/jpeg';

  return withErrorHandling(async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          { inlineData: { data, mimeType } },
          { text: prompt },
        ],
      },
      config: {
        imageConfig: {
          imageSize: size,
          aspectRatio: "3:4",
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image generated.");
  });
};

export const editImage = async (
  imageBase64: string,
  prompt: string
): Promise<string> => {
  const data = imageBase64.split(',')[1] || imageBase64;
  const mimeType = imageBase64.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)?.[1] || 'image/jpeg';

  return withErrorHandling(async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data, mimeType } },
          { text: prompt },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No edited image generated.");
  });
};

export const analyzeImage = async (
  imageBase64: string
): Promise<string> => {
  const data = imageBase64.split(',')[1] || imageBase64;
  const mimeType = imageBase64.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)?.[1] || 'image/jpeg';

  return withErrorHandling(async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { data, mimeType } },
          { text: "Analyze this image in the style of a Stranger Things investigator (like Nancy Wheeler or Hopper). Describe what you see in detail, looking for clues, supernatural elements, or emotional context." },
        ],
      },
    });

    return response.text || "No analysis available.";
  });
};