import { IResumeBuilderRepository, SaveDraftData, UpdateDraftData } from "../interfaces/IResumeBuilderRepository";

/**
 * SOLID — S (Single Responsibility): Handles only resume-builder draft business logic.
 * SOLID — D (Dependency Inversion): Receives IResumeBuilderRepository interface, not concrete class.
 *
 * OOP — Encapsulation: Validation & business rules are here, not in controllers.
 */
export class ResumeBuilderService {
  constructor(private repository: IResumeBuilderRepository) {}

  async saveDraft(userId: string, title: string, data: Record<string, unknown>, theme: string): Promise<{ id: string }> {
    if (!userId) throw new Error("User ID is required.");
    if (!data) throw new Error("Resume data is required.");

    return this.repository.create({
      userId,
      title: title || "Untitled Resume",
      data,
      theme: theme || "default",
    });
  }

  async updateDraft(id: string, userId: string, updates: UpdateDraftData): Promise<{ id: string }> {
    if (!id) throw new Error("Draft ID is required.");
    const existing = await this.repository.findById(id, userId);
    if (!existing) throw new Error("Draft not found or access denied.");
    return this.repository.update(id, userId, updates);
  }

  async getDraft(id: string, userId: string): Promise<any> {
    const draft = await this.repository.findById(id, userId);
    if (!draft) throw new Error("Draft not found.");
    return draft;
  }

  async listDrafts(userId: string): Promise<any[]> {
    return this.repository.findByUserId(userId);
  }

  async deleteDraft(id: string, userId: string): Promise<void> {
    const existing = await this.repository.findById(id, userId);
    if (!existing) throw new Error("Draft not found or access denied.");
    await this.repository.delete(id, userId);
  }
}
