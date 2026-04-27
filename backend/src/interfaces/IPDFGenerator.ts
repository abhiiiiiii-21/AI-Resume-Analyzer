export interface IPDFGenerator {
  generate(data: any, fileName: string): Promise<string>;
}
 