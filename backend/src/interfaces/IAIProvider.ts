export interface IAIProvider {
  enhance(resumeText: string, jobDescription: string): Promise<any>;
}