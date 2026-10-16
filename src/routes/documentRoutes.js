import { Router } from "express";
import multer from "multer";
import path from "node:path";
import { randomUUID } from "node:crypto";

import { extractPdfPages } from "../rag/documentParser.js";
import { ingestDocument } from "../rag/ingestionService.js";

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

router.post("/upload", upload.single("document"), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                error: "Please upload a PDF using the document field"
            });
        }

        // Reject files without the expected PDF signature.
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
            const result = await ingestDocument(
                page.text,
                `${documentId}-page-${page.pageNumber}`
            );

            totalChunks += result.totalChunks;
        }

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