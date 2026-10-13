import "dotenv/config";
import { generateEmbedding } from "../src/rag/embeddingService.js";
import { index } from "../src/rag/vectorStore.js";

async function main() {
    const text = "RAG combines document retrieval with language generation.";

    const embedding = await generateEmbedding(text);

    await index.upsert({
        records: [
            {
                id: "test-rag-1",
                values: embedding,
                metadata: {
                    text,
                    source: "test"
                }
            }
        ]
    });

    console.log("Vector inserted successfully.");

    const result = await index.query({
        vector: embedding,
        topK: 1,
        includeMetadata: true
    });

    console.log(JSON.stringify(result, null, 2));
}

main().catch(console.error);