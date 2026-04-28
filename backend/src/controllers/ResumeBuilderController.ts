import { Request, Response } from "express";
import { ResumeBuilderService } from "../services/ResumeBuilderService";
import { ResumeBuilderRepository } from "../repositories/ResumeBuilderRepository";

/**
 * SOLID — S (Single Responsibility): Handles HTTP for resume-builder drafts.
 */
export class ResumeBuilderController {
  private builderService: ResumeBuilderService;

  constructor() {
    this.builderService = new ResumeBuilderService(new ResumeBuilderRepository());
  }

  saveDraft = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).userId;
      const { id: draftId, title, theme, ...data } = req.body;

      if (draftId && draftId !== "1") {
        const result = await this.builderService.updateDraft(draftId, userId, {
          title,
          theme,
          data: req.body,
        });
        res.status(200).json({ success: true, message: "Draft updated", id: result.id });
      } else {
        const result = await this.builderService.saveDraft(userId, title, req.body, theme);
        res.status(201).json({ success: true, message: "Draft saved", id: result.id });
      }
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  };

  getDrafts = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).userId;
      const drafts = await this.builderService.listDrafts(userId);
      res.status(200).json({ success: true, data: drafts });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  };

  getDraftById = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).userId;
      const { id } = req.params;
      const draft = await this.builderService.getDraft(id as string, userId);
      res.status(200).json({ success: true, data: draft });
    } catch (err: any) {
      res.status(404).json({ success: false, error: err.message });
    }
  };

  deleteDraft = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).userId;
      const { id } = req.params;
      await this.builderService.deleteDraft(id as string, userId);
      res.status(200).json({ success: true, message: "Draft deleted" });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  };
}
