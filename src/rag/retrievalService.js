
import { generateEmbedding } from "./embeddingService.js";
import { index } from "./vectorStore.js";

export async function retrieveRelevantChunks(
    question, {
        topK = 5,
        minScore = 0.5,
        filter
    } = {}
) {
    if (typeof question !== "string" || !question.trim()) {
        throw new Error("Question cannot be empty");
    }

    const queryEmbedding = await generateEmbedding(question);

    const result = await index.query({
        vector: queryEmbedding,
        topK,
        includeMetadata: true,
        ...(filter ? { filter } : {})
    });

    return (result.matches ?? [])
        .filter(match =>
            typeof match.score === "number" &&
            match.score >= minScore &&
            typeof match.metadata?.text === "string"
        )
        .map(match => ({
            id: match.id,
            score: match.score,
            text: match.metadata?.text ?? "",
            source: match.metadata?.source ?? "unknown",
            chunkIndex: match.metadata?.chunkIndex ?? null
        }));
}