/**
 * SOLID — I (Interface Segregation): Focused solely on ResumeBuilderDraft CRUD.
 * Does NOT mix ATS or PDF export concerns.
 */

export interface SaveDraftData {
  userId: string;
  title: string;
  data: Record<string, unknown>; // The full Resume JSON object
  theme: string;
}

export interface UpdateDraftData {
  title?: string;
  data?: Record<string, unknown>;
  theme?: string;
}

export interface IResumeBuilderRepository {
  create(data: SaveDraftData): Promise<{ id: string }>;
  update(id: string, userId: string, data: UpdateDraftData): Promise<{ id: string }>;
  findByUserId(userId: string): Promise<any[]>;
  findById(id: string, userId: string): Promise<any | null>;
  delete(id: string, userId: string): Promise<void>;
  countByUserId(userId: string): Promise<number>;
}
