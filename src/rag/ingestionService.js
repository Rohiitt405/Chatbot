import { splitIntoChunks } from "./chunker.js";
import { generateEmbedding } from './embeddingService.js';
import { index } from './vectorStore.js';

export async function ingestDocument(
    text,
    { documentId, source, pageNumber }
) {
    if (!text?.trim()) {
        throw new Error("Document text cannot be empty");
    }

    if (!documentId || !source || !Number.isInteger(pageNumber)) {
        throw new Error("Valid document metadata is required");
    }

    const chunks = splitIntoChunks(text);
    const records = [];

    for (let i = 0; i < chunks.length; i++) {
        const embedding = await generateEmbedding(chunks[i]);

        records.push({
            id: `${documentId}page-${pageNumber}-chunk-${i}`,
            values: embedding,
            metadata: {
                documentId,
                source,
                pageNumber,
                chunkIndex: i,
                text: chunks[i],
            }
        });
    }

    const batchSize = 100;

    for (let i = 0; i < records.length; i += batchSize) {
        const batch = records.slice(i, i + batchSize);
        await index.upsert({
            records: batch
        });
    }

    return {
        documentId,
        source,
        pageNumber,
        totalChunks: chunks.length
    };
}