
import { generateEmbedding } from "./embeddingService.js";
import { index } from "./vectorStore.js";

export async function retrieveRelevantChunks(question, topK = 5) {
    if (typeof question !== "string" || !question.trim()) {
        throw new Error("Question cannot be empty");
    }

    if (!Number.isInteger(topK) || topK < 1 || topK > 100) {
        throw new Error("topK must be an integer between 1 and 100");
    }

    const queryEmbedding = await generateEmbedding(question);

    const result = await index.query({
        vector: queryEmbedding,
        topK,
        includeMetadata: true
    });

    return (result.matches ?? []).map(match => ({
        id: match.id,
        score: match.score,
        text: match.metadata?.text ?? "",
        source: match.metadata?.source ?? "unknown",
        chunkIndex: match.metadata?.chunkIndex ?? null
    }));
}