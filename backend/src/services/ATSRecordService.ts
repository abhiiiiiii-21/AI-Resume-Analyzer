import { IATSRepository, SaveATSRecordData } from "../interfaces/IATSRepository";

/**
 * SOLID — S (Single Responsibility): Handles only ATS score record business logic.
 * SOLID — D (Dependency Inversion): Receives IATSRepository interface, not concrete class.
 *
 * OOP — Encapsulation: Score validation and query logic lives here, not in controllers.
 */
export class ATSRecordService {
  constructor(private repository: IATSRepository) {}

  async recordScore(
    userId: string,
    score: number,
    jobRole?: string,
    fileName?: string
  ): Promise<{ id: string }> {
    if (!userId) throw new Error("User ID is required.");
    if (score < 0 || score > 100) throw new Error("Score must be between 0 and 100.");

    return this.repository.save({ userId, score, jobRole, fileName });
  }

  async getHistory(userId: string): Promise<any[]> {
    return this.repository.findByUserId(userId);
  }

  async getAverageScore(userId: string): Promise<number> {
    return this.repository.averageScoreByUserId(userId);
  }

  async getTotalScans(userId: string): Promise<number> {
    return this.repository.countByUserId(userId);
  }
}
