
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDirectory = path.resolve(__dirname, "../data");
const registryPath = path.join(dataDirectory, "documents.json");

let queue = Promise.resolve();

async function readDocuments() {
    await mkdir(dataDirectory, { recursive: true });

    try {
        return JSON.parse(await readFile(registryPath, "utf8"));
    } catch (error) {
        if (error.code !== "ENOENT") {
            throw error;
        }

        await writeFile(registryPath, "[]", "utf8");
        return [];
    }
}

function serialize(operation) {
    const result = queue.then(operation);
    queue = result.catch(() => {});
    return result;
}

export async function listDocuments() {
    return readDocuments();
}

export function registerDocument(document) {
    return serialize(async () => {
        const documents = await readDocuments();

        documents.push({
            documentId: document.documentId,
            filename: document.filename,
            totalPages: document.totalPages,
            totalChunks: document.totalChunks,
            uploadedAt: new Date().toISOString()
        });

        await writeFile(
            registryPath,
            JSON.stringify(documents, null, 2),
            "utf8"
        );
    });
}

export function removeDocument(documentId) {
    return serialize(async () => {
        const documents = await readDocuments();
        const updated = documents.filter(
            document => document.documentId !== documentId
        );

        if (updated.length === documents.length) {
            return false;
        }

        await writeFile(
            registryPath,
            JSON.stringify(updated, null, 2),
            "utf8"
        );

        return true;
    });
}
