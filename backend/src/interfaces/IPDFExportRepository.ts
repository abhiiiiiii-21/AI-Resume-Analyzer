/**
 * SOLID — I (Interface Segregation): Focused solely on PDF export tracking.
 * Does NOT mix ATS or resume builder concerns.
 */

export interface SavePDFExportData {
  userId: string;
  type: 'builder' | 'optimized';
  pdfUrl: string;
  title?: string;
}

export interface IPDFExportRepository {
  save(data: SavePDFExportData): Promise<{ id: string }>;
  findByUserId(userId: string): Promise<any[]>;
  countByUserId(userId: string): Promise<number>;
}
