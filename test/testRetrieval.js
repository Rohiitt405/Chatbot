
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
    path: path.resolve(__dirname, "../.env")
});

const { retrieveRelevantChunks } = await import("../src/rag/retrievalService.js");

async function main() {
    const question = "What is Retrieval-Augmented Generation?";

    const chunks = await retrieveRelevantChunks(question, {
        topK: 5,
        minScore: 0.5
    });

    if (chunks.length === 0) {
        console.log("No matching document chunks found.");
        return;
    }

    for (const [i, chunk] of chunks.entries()) {
        console.log(`\nResult ${i + 1}`);
        console.log("Page:", chunk.pageNumber);
        console.log("Document ID:", chunk.documentId);
        console.log("Score:", chunk.score);
        console.log("Source:", chunk.source);
        console.log("Chunk:", chunk.chunkIndex);
        console.log("Text:", chunk.text);
    }
}

main().catch(error => {
    console.error("Retrieval failed:", error);
    process.exitCode = 1;
});