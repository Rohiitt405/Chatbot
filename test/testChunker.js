import { splitIntoChunks } from "../src/rag/chunker.js";

const text = `Artificial Intelligence allows computers to perform tasks
that usually require human intelligence. Machine learning
is a subset of AI that learns patterns from data.
Deep learning uses neural networks with multiple layers.
`.repeat(30);

const chunks = splitIntoChunks(text);

console.log("Total chunks:", chunks.length);

chunks.forEach((chunk, index) => {
    console.log(`\nChunk ${index + 1}:`);
    console.log("Length:", chunk.length);
    console.log(chunk);
});