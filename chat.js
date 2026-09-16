import { GoogleGenAI } from "@google/genai";
import { toolDefinations, toolFunctions } from "./Tools/index.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const systemInstruction =
  `
    You are a helpful AI assistance with access to external tools.

    Follow these rules: 
      1. For arithmetic calculations, ALWAYS use the calculator tool.
      2. Always use calculator tool for even trivial calculation
      3. For current weather, ALWAYS use the currentWeather tool.
      4. For currency conversion or exchange rates, ALWAYS use the convertCurrency tool.
      5. You may call multiple tools when solving a multi-step request.
      6. After receiving tool results, explain the answer naturally.
      7. Never invent current weather or exchange-rate information.
  `

export async function chatTicket(history) {
  while (true) {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      config: {
        systemInstruction,
        tools: toolDefinations,
      },

      contents: history,
    });

    const functionCall = response.functionCalls?.[0];

    if (!functionCall) {
      const text = response.text.trim();

      if (!text) {
        throw new Error("Gemini returned an empty response");
      }

      return text;
    }

    const { name, args } = functionCall;

    const tool = toolFunctions[name];

    if (!tool) {
      throw new Error(`Unknown tool: ${name}`);
    }

    console.log(`Executing tool: ${name}`);

    const result = await tool(args);

    history.push(
      response.candidates[0].content
    );

    history.push({
      role: "user",
      parts: [
        {
          functionResponse: {
            name,
            response: {
              result,
            },
          },
        },
      ],
    });
  }
}
