import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const EMBEDDING_MODEL = "gemini-embedding-2";
const EMBEDDING_DIMENSIONS = 768;

export async function generateEmbedding(text) {
    if (!text?.trim()) {
        throw new Error("Text cannot be empty");
    }

    const response = await ai.models.embedContent({
        model: EMBEDDING_MODEL,
        contents: text,
        config: {
            outputDimensionality: EMBEDDING_DIMENSIONS
        }
    });

    const values = response.embeddings?.[0].values;

    if (!values || values.length !== EMBEDDING_DIMENSIONS) {
        throw new Error("Invalid embedding returned by Gemini");
    }

    return values;
}