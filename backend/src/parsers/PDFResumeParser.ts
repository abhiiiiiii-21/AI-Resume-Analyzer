const pdfParse = require("pdf-parse");
import { IResumeParser } from "../interfaces/IResumeParser";

export class PDFResumeParser implements IResumeParser {
  async parse(fileBuffer: Buffer): Promise<string> {
    const data = await pdfParse(fileBuffer);

    if (!data.text || data.text.trim().length === 0) {
      throw new Error("Could not extract text from PDF. Make sure it is not a scanned image.");
    }

    return data.text.trim();
  }
}