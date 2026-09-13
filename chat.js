import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function chatTicket(history) {
  const prompt = 
  ```
    Answer only questions directly related to the user s query. 
    Use clear, friendly, and natural language. 
    Keep responses concise and limit the response to one paragraph unless additional detail is necessary to answer the query properly. 
    Do not provide information, explanations, or suggestions unrelated to the user’s request.
  ```

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    config: { systemInstruction: prompt },
    contents: history,
  });

  if (!response.text) {
    throw new Error("Gemini returned an empty summary");
  }

  return response.text.trim();
}