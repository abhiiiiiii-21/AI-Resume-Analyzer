export interface IDocumentParser {
  canHandle(mimetype: string): boolean;
  extractText(buffer: Buffer): Promise<string>;
}
