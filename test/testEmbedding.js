import "dotenv/config";
import { generateEmbedding } from '../src/rag/embeddingService.js';

async function main() {
    const vector = await generateEmbedding("Explain supervised learning");
    console.log(
        "Embedding dimesions: ",
        vector.length
    );
    
    console.log(
        "First five values: ", 
        vector.slice(0,5)
    );
}

main().catch(console.error);