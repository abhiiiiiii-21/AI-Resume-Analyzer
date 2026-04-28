import { Request, Response } from "express";
import { DashboardService } from "../services/DashboardService";
import { ResumeBuilderRepository } from "../repositories/ResumeBuilderRepository";
import { ATSRepository } from "../repositories/ATSRepository";
import { PDFExportRepository } from "../repositories/PDFExportRepository";

/**
 * SOLID — S (Single Responsibility): Only responsible for handling HTTP for dashboard routes.
 */
export class DashboardController {
  private dashboardService: DashboardService;

  constructor() {
    this.dashboardService = new DashboardService(
      new ResumeBuilderRepository(),
      new ATSRepository(),
      new PDFExportRepository()
    );
  }

  getStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).userId;
      const stats = await this.dashboardService.getStats(userId);
      res.status(200).json({ success: true, data: stats });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  };

  getDrafts = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).userId;
      const drafts = await this.dashboardService.getRecentDrafts(userId);
      res.status(200).json({ success: true, data: drafts });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  };

  getATSRecords = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).userId;
      const history = await this.dashboardService.getATSHistory(userId);
      res.status(200).json({ success: true, data: history });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  };

  saveATSRecord = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).userId;
      const { score, jobRole, fileName } = req.body;
      
      const atsRepo = new ATSRepository();
      const record = await atsRepo.save({
        userId,
        score,
        jobRole,
        fileName
      });

      res.status(201).json({ success: true, data: record });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  };
}
