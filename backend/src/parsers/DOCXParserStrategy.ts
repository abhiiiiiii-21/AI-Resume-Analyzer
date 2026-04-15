import { IDocumentParser } from './IDocumentParser';
import mammoth from 'mammoth';

// SRP: This class only handles DOCX extraction
export class DOCXParserStrategy implements IDocumentParser {
  canHandle(mimetype: string): boolean {
    return (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimetype === 'application/msword'
    );
  }

  async extractText(buffer: Buffer): Promise<string> {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }
}
