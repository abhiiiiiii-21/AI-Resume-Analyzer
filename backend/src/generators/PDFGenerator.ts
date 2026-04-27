const PDFDocument = require("pdfkit");
import fs from "fs";
import path from "path";
import { IPDFGenerator } from "../interfaces/IPDFGenerator";
 
/**
 * SOLID — S (Single Responsibility): Only job is creating a PDF file from text.
 * SOLID — D (Dependency Inversion): Implements IPDFGenerator interface.
 *
 * OOP — Encapsulation: PDFKit library details are hidden inside this class.
 *                      The rest of the app just calls .generate() and gets a file path back.
 */

export class PDFGenerator implements IPDFGenerator {
  async generate(text: string, fileName: string): Promise<string> {

    const uploadDir = path.resolve("uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
 
    const filePath = path.join(uploadDir, fileName);
 
    // PDFKit works with streams, so we wrap it in a Promise
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(filePath);
 
      doc.pipe(stream);
 
      doc
        .fontSize(11)
        .font("Helvetica")
        .text(text, { align: "left", lineGap: 4 });
 
      doc.end();
 
      stream.on("finish", () => resolve(filePath));
      stream.on("error", reject);
    });
  }
}
 