import { IResumeBuilderRepository } from "../interfaces/IResumeBuilderRepository";
import { IATSRepository } from "../interfaces/IATSRepository";
import { IPDFExportRepository } from "../interfaces/IPDFExportRepository";

export interface DashboardStats {
  totalDrafts: number;
  totalATSScans: number;
  totalPDFs: number;
  avgATSScore: number;
}

/**
 * SOLID — S (Single Responsibility): Aggregates cross-domain stats for the dashboard only.
 * SOLID — O (Open/Closed): New stat sources can be added without modifying existing logic.
 * SOLID — D (Dependency Inversion): Receives interfaces, not concrete repositories.
 *
 * OOP — Encapsulation: All dashboard aggregation logic is here, controllers stay thin.
 */
export class DashboardService {
  constructor(
    private draftsRepo: IResumeBuilderRepository,
    private atsRepo: IATSRepository,
    private pdfRepo: IPDFExportRepository
  ) {}

  async getStats(userId: string): Promise<DashboardStats> {
    const [totalDrafts, totalATSScans, totalPDFs, avgATSScore] = await Promise.all([
      this.draftsRepo.countByUserId(userId),
      this.atsRepo.countByUserId(userId),
      this.pdfRepo.countByUserId(userId),
      this.atsRepo.averageScoreByUserId(userId),
    ]);

    return { totalDrafts, totalATSScans, totalPDFs, avgATSScore };
  }

  async getRecentDrafts(userId: string): Promise<any[]> {
    return this.draftsRepo.findByUserId(userId);
  }

  async getATSHistory(userId: string): Promise<any[]> {
    return this.atsRepo.findByUserId(userId);
  }

  async getRecentPDFs(userId: string): Promise<any[]> {
    return this.pdfRepo.findByUserId(userId);
  }
}
