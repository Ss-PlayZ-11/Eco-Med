
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { Diagnosis } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const diagnosisSchema = {
    type: Type.OBJECT,
    properties: {
        plantName: { type: Type.STRING, description: "The common name of the plant. If unsure, state 'Unknown Plant'." },
        isHealthy: { type: Type.BOOLEAN, description: "True if the plant appears healthy, false otherwise." },
        disease: { type: Type.STRING, description: "The common name of the disease or pest. Null if healthy." },
        confidence: { type: Type.NUMBER, description: "Confidence in the diagnosis, from 0.0 to 1.0." },
        description: { type: Type.STRING, description: "A brief, easy-to-understand summary of the diagnosis for a non-expert." },
        symptoms: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of key symptoms observed or typical for the diagnosed issue."
        },
        treatments: {
            type: Type.OBJECT,
            properties: {
                organic: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "A list of organic/natural treatment suggestions."
                },
                chemical: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "A list of chemical treatment suggestions."
                },
            },
        },
        prevention: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of tips to prevent this issue in the future."
        },
    },
    required: ["plantName", "isHealthy", "disease", "confidence", "description", "symptoms", "treatments", "prevention"],
};

const fileToGenerativePart = (base64: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64,
      mimeType
    },
  };
};

export const diagnosePlant = async (base64Image: string, mimeType: string): Promise<Diagnosis> => {
  try {
    const imagePart = fileToGenerativePart(base64Image, mimeType);
    
    const prompt = `You are an expert botanist and plant pathologist named EcoMed AI. Your task is to analyze the provided image of a plant.

Based on the image, provide a detailed diagnosis. Ensure the response includes:
1. Specific immediate actions (both organic and chemical) to fix the current issue.
2. Clear precautions and prevention strategies to ensure the plant stays healthy in the future and avoids the same disease.

Respond with only a valid JSON object that strictly adheres to the defined schema. Do not include any text, markdown formatting, or explanations outside of the JSON object.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ parts: [imagePart, { text: prompt }] }],
        config: {
            responseMimeType: "application/json",
            responseSchema: diagnosisSchema,
        },
    });

    const text = response.text;
    if (!text) {
        throw new Error("API returned an empty response.");
    }
    
    const parsedJson = JSON.parse(text);
    return parsedJson as Diagnosis;

  } catch (error) {
    console.error("Error diagnosing plant:", error);
    throw new Error("Failed to get a diagnosis from the AI. Please try again.");
  }
};

export const generateCuredVision = async (plantName: string, disease: string | null): Promise<string> => {
    try {
        const prompt = `Subject: A single, perfect specimen of a ${plantName} plant, previously afflicted with ${disease || 'an issue'}, now completely cured and healthy.
        Condition: The plant is depicted in a state of perfect health, vibrant, flourishing, and resilient. Show lush, green leaves with no signs of spots, discoloration, or pests.
        Style: Ultra-realistic, cinematic macro photography. Shot on a Hasselblad X2D 100C.
        Lighting: Bright, soft, diffused morning light, creating a hopeful and clean atmosphere.
        Composition: Asymmetrical, rule of thirds. The plant is the clear focal point, looking strong.
        Background: A clean, out-of-focus natural garden background, suggesting a healthy environment.
        Details: Hyper-detailed, capture the perfect texture of healthy leaves, perhaps with a few clean water droplets. 8k resolution, photorealistic.
        Color Palette: Rich, vibrant natural greens, bright highlights, and soft shadows.`;

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: [{
                parts: [{ text: prompt }]
            }],
            config: {
                imageConfig: {
                    aspectRatio: "1:1"
                }
            }
        });

        const imagePart = response.candidates?.[0]?.content?.parts.find(part => part.inlineData);
        if (imagePart?.inlineData) {
            return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
        }
        
        throw new Error("No image data found in response");
    } catch (error) {
        console.error("Error generating cured vision:", error);
        throw new Error("Failed to generate cured vision.");
    }
};
