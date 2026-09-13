import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function summarizeTicket(ticket) {
  const prompt = `Summarize this support ticket in 2 lines:\n\n${ticket}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  if (!response.text) {
    throw new Error("Gemini returned an empty summary");
  }

  return response.text.trim();
}