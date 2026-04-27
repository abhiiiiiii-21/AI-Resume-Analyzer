export interface SaveResumeData {
  userId: string;
  originalText: string;
  enhancedText: string;
  jobDescription: string;
  pdfUrl: string;
}
 
export interface IResumeRepository {
  save(data: SaveResumeData): Promise<{ id: string }>;
  findByUserId(userId: string): Promise<any[]>;
  findById(id: string): Promise<any | null>;
}
 