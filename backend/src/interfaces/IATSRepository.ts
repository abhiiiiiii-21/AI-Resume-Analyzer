/**
 * SOLID — I (Interface Segregation): Focused solely on ATS score persistence.
 * Does NOT mix resume builder or PDF export concerns.
 */

export interface SaveATSRecordData {
  userId: string;
  score: number;
  jobRole?: string;
  fileName?: string;
}

export interface IATSRepository {
  save(data: SaveATSRecordData): Promise<{ id: string }>;
  findByUserId(userId: string): Promise<any[]>;
  countByUserId(userId: string): Promise<number>;
  averageScoreByUserId(userId: string): Promise<number>;
}
