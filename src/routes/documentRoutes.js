import { Router } from "express";
import multer from "multer";
import path from "node:path";
import { randomUUID } from "node:crypto";

import { extractPdfPages } from "../rag/documentParser.js";
import { ingestDocument } from "../rag/ingestionService.js";
import {
    listDocuments,
    registerDocument,
    removeDocument
} from "../rag/documentRegistry.js";
import { index } from "../rag/vectorStore.js";

const router = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024,
        files: 1
    },
    fileFilter: (req, file, callback) => {
        if (path.extname(file.originalname).toLowerCase() !== ".pdf") {
            return callback(new Error("Only PDF files are allowed"));
        }

        callback(null, true);
    }
});

// GET /api/documents
router.get("/", async (req, res, next) => {
    try {
        const documents = await listDocuments();

        return res.status(200).json({
            total: documents.length,
            documents
        });
    } catch (error) {
        next(error);
    }
});

// DELETE /api/documents/:documentId
router.delete("/:documentId", async (req, res, next) => {
    try {
        const { documentId } = req.params;
        const documents = await listDocuments();

        const document = documents.find(
            item => item.documentId === documentId
        );

        if (!document) {
            return res.status(404).json({
                error: "Document not found"
            });
        }

        await index.deleteMany({
            filter: {
                documentId: { $eq: documentId }
            }
        });

        await removeDocument(documentId);

        return res.status(200).json({
            message: "Document deleted successfully",
            documentId
        });
    } catch (error) {
        next(error);
    }
});

// POST /api/documents/upload
router.post("/upload", upload.single("document"), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                error: "Please upload a PDF using the document field"
            });
        }

        if (req.file.buffer.subarray(0, 5).toString() !== "%PDF-") {
            return res.status(400).json({
                error: "The uploaded file is not a valid PDF"
            });
        }

        const pages = await extractPdfPages(req.file.buffer);
        const documentId = randomUUID();
        const filename = path.basename(req.file.originalname);

        let totalChunks = 0;

        for (const page of pages) {
            const result = await ingestDocument(page.text, {
                documentId,
                source: filename,
                pageNumber: page.pageNumber
            });

            totalChunks += result.totalChunks;
        }

        await registerDocument({
            documentId,
            filename,
            totalPages: pages.length,
            totalChunks
        });

        return res.status(201).json({
            message: "PDF ingested successfully",
            documentId,
            filename,
            totalPages: pages.length,
            totalChunks
        });
    } catch (error) {
        next(error);
    }
});

export default router;