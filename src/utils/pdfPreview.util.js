// utils/pdfPreview.util.js
//
// Generates a real, physically-truncated preview PDF (first N pages only).
// This is the important security property: the preview FILE on disk never
// contains more than `maxPages` pages, so there is no client-side trick
// (view-source, dev tools, editing a query param, etc.) that can reveal
// the rest of the report — the bytes simply aren't there.
//
// npm install pdf-lib

const fs = require("fs");
const { PDFDocument } = require("pdf-lib");

/**
 * @param {string} sourcePath - absolute path to the full report PDF
 * @param {string} destPath   - absolute path to write the preview PDF to
 * @param {number} maxPages   - how many pages the free preview should contain
 * @returns {Promise<{ totalPages: number, previewPages: number }>}
 */
exports.generatePdfPreview = async (
  sourcePath,
  destPath,
  maxPages = 2
) => {
  const sourceBytes = fs.readFileSync(sourcePath);
  const sourceDoc = await PDFDocument.load(sourceBytes);

  const totalPages = sourceDoc.getPageCount();
  const previewPages = Math.min(maxPages, totalPages);

  const previewDoc = await PDFDocument.create();

  const indices = Array.from(
    { length: previewPages },
    (_, i) => i
  );

  const copiedPages = await previewDoc.copyPages(
    sourceDoc,
    indices
  );

  copiedPages.forEach((page) => previewDoc.addPage(page));

  const previewBytes = await previewDoc.save();

  fs.writeFileSync(destPath, previewBytes);

  return { totalPages, previewPages };
};