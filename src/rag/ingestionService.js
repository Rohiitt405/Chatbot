import { splitIntoChunks } from "./chunker.js";
import { generateEmbedding } from './embeddingService.js';
import { index } from './vectorStore.js';

export async function ingestDocument(text, source) {
    if (!text?.trim()) {
        throw new Error("Document text cannot be empty");
    }

    if (!source?.trim()) {
        throw new Error("Document source is required");
    }

    const chunks = splitIntoChunks(text);
    const records = [];

    for (let i = 0; i < chunks.length; i++) {
        const embedding = await generateEmbedding(chunks[i]);

        records.push({
            id: `${source}-chunk-${i}`,
            values: embedding,
            metadata: {
                text: chunks[i],
                source,
                chunkIndex: i
            }
        });
    }

    const batchSize = 100;

    for (let i = 0; i < records.length; i += batchSize) {
        const batch = records.slice(i, i+batchSize);
        await index.upsert({
            records: batch
        });
    }

    return {
        source,
        totalChunks: chunks.length
    };
}