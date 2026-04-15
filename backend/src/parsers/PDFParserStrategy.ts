import { IDocumentParser } from './IDocumentParser';
import { PDFParse } from 'pdf-parse';

// SRP: This class only handles PDF extraction
export class PDFParserStrategy implements IDocumentParser {
  canHandle(mimetype: string): boolean {
    return mimetype === 'application/pdf';
  }

  async extractText(buffer: Buffer): Promise<string> {
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    if (parser.destroy) await parser.destroy();
    return result.text;
  }
}
