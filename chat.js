import { GoogleGenAI } from "@google/genai";
import { toolDefinations, toolFunctions } from "./Tools/index.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const systemInstruction = `
  You are a helpful AI assistance with access to external tools.

  Follow these rules: 
    1. For arithmetic calculations, ALWAYS use the calculator tool.
    2. Always use calculator tool for even trivial calculation
    3. For current weather, ALWAYS use the currentWeather tool.
    4. For currency conversion or exchange rates, ALWAYS use the convertCurrency tool.
    5. You may call multiple tools when solving a multi-step request.
    6. After receiving tool results, explain the answer naturally.
    7. Never invent current weather or exchange-rate information.
    8. Answer normal questions and writing requests directly. Do not use tools unless required.
`;

const websiteBuilderInstruction = `
  You are an expert frontend website developer.
  When asked to create a website, MUST create the files using filesystem tools.

  WEBSITE MODE ONLY:
  Rules:
  1. Create a separate directory for each website.
  2. ALWAYS create exactly:
    - index.html
    - style.css
    - script.js
  3. Run createDirectory before creating files.
  4. Use separate writeFile calls for each file.
  5. index.html must contain only HTML structure and external references:
    <link rel="stylesheet" href="style.css">
    <script src="script.js"></script>
  6. Put ALL CSS in style.css and ALL client-side JS in script.js. Never use inline <style> or <script>.
  7. Use only HTML, CSS, and vanilla JavaScript.
  8. Build modern, responsive, visually polished websites.
  9. After creation, run listFiles to verify all files exist.
  10. Use readFile when needed to inspect files.
  11. Fix discovered issues with writeFile.
  12. Do NOT return the source code instead of creating the files.
  13. Finish only after the website is created and verified.
`;

export async function chatTicket(history, onChunk) {
  while (true) {
    const stream = await ai.models.generateContentStream({
      model: "gemini-3.5-flash-lite",
      config: {
        systemInstruction: `
          ${systemInstruction}
          ${websiteBuilderInstruction}
        `,
        tools: toolDefinations,
      },
      contents: history,
    });

    let fullText = "";
    let functionCallPart = null;

    for await (const chunk of stream) {
      const parts = chunk.candidates?.[0]?.content?.parts ?? [];

      for (const part of parts) {
        // Normal text
        if (part.text) {
          fullText += part.text;

          if (onChunk) {
            onChunk(part.text);
          }
        }

        if (part.functionCall) {
          functionCallPart = part;
        }
      }
    }

    if (!functionCallPart) {
      if (!fullText.trim()) {
        throw new Error("Gemini returned an empty response");
      }

      return fullText.trim();
    }

    const { name, args } = functionCallPart.functionCall;

    const tool = toolFunctions[name];

    if (!tool) {
      throw new Error(`Unknown tool: ${name}`);
    }

    console.log(`Executing tool: ${name}`);

    const result = await tool(args);

    history.push({
      role: "model",
      parts: [
        functionCallPart,
      ],
    });

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