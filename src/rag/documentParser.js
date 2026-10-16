
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

export async function extractPdfPages(buffer) {
    if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
        throw new Error("A valid PDF buffer is required");
    }

    const loadingTask = getDocument({
        data: new Uint8Array(buffer)
    });

    const pdf = await loadingTask.promise;
    const pages = [];

    try {
        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
            const page = await pdf.getPage(pageNumber);
            const content = await page.getTextContent();

            const text = content.items
                .filter(item => "str" in item)
                .map(item => item.str)
                .join(" ")
                .replace(/\s+/g, " ")
                .trim();

            if (text) {
                pages.push({
                    pageNumber,
                    text
                });
            }

            page.cleanup();
        }
    } finally {
        await loadingTask.destroy();
    }

    if (pages.length === 0) {
        throw new Error(
            "No extractable text found. The PDF may be scanned or image-based."
        );
    }

    return pages;
}