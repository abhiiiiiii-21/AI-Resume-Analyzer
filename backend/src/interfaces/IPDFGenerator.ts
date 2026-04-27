export interface IPDFGenerator {
  generate(text: string, fileName: string): Promise<string>;
}
 