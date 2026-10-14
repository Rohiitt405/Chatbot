export function splitIntoChunks(text, chunkSize = 1000, overlap = 200) {
    if (typeof text !== "string" || !text.trim()) {
        throw new Error("Text must be a non-empty string");
    }

    if (chunkSize <= 0 || overlap < 0 || overlap >= chunkSize) {
        throw new Error("Invalid chunk size or overlap");
    }

    const normalizedText = text.replace(/\s+/g, " ").trim();
    const chunks = [];

    let start = 0;

    while (start < normalizedText.length) {
        const end = Math.min(start + chunkSize, normalizedText.length);

        chunks.push(normalizedText.slice(start, end));

        if (end === normalizedText.length) {
            break;
        }

        start = end - overlap;
    }

    return chunks;
}