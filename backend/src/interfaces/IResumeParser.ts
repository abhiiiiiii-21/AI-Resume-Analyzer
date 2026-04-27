export interface IResumeParser {
  parse(fileBuffer: Buffer): Promise<string>;
}