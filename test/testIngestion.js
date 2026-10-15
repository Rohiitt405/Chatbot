
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
    path: path.resolve(__dirname, "../.env")
});

const { ingestDocument } = await import("../src/rag/ingestionService.js");

async function main() {
    const text = `
        Artificial intelligence enables machines to perform tasks
        that typically require human intelligence.

        Machine learning is a subset of artificial intelligence.
        It allows systems to learn patterns from data.

        Retrieval-Augmented Generation combines information retrieval
        with a generative language model to answer questions using
        relevant external documents.
    `.repeat(20);

    const result = await ingestDocument(text, "fda-test-document");

    console.log("Ingestion completed:", result);
}

main().catch(error => {
    console.error("Ingestion failed:", error);
    process.exitCode = 1;
});