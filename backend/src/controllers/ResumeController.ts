import { Request, Response } from "express";
import { ResumeService } from "../services/ResumeService";
import { PDFResumeParser } from "../parsers/PDFResumeParser";
import { AIProvider as GroqAIProvider } from "../providers/GroqAIProvider";
import { PDFGenerator } from "../generators/PDFGenerator";
import { ResumeRepository } from "../repositories/ResumeRepository";

/**
 * SOLID — S (Single Responsibility): Only responsible for handling HTTP for resume routes.
 */
export class ResumeController {
  private resumeService: ResumeService;

  constructor() {
    this.resumeService = new ResumeService(
      new PDFResumeParser(),
      new GroqAIProvider(),
      new PDFGenerator(),
      new ResumeRepository()
    );
  }

  enhance = async (req: Request, res: Response): Promise<void> => {
    try {
      const file = req.file;
      const { jobDescription, role } = req.body;
      const userId = (req as any).userId;

      if (!file) {
        res.status(400).json({ error: "Please upload a PDF resume." });
        return;
      }

      if (!jobDescription) {
        res.status(400).json({ error: "Job description is required." });
        return;
      }

      if (!role) {
        res.status(400).json({ error: "Role is required." });
        return;
      }

      const result = await this.resumeService.enhance(
        file.buffer,
        jobDescription,
        role,
        userId
      );

      res.status(200).json({ success: true, data: result });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };

  getMyResumes = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).userId;
      const resumes = await this.resumeService.getMyResumes(userId);
      res.status(200).json({ success: true, data: resumes });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };

  getResumeById = async (req: Request, res: Response): Promise<void> => {
    try {
      const resume = await this.resumeService.getResumeById(req.params.id as string);
      res.status(200).json({ success: true, data: resume });
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  };

  getRoles = (_req: Request, res: Response): void => {
    const roles = this.resumeService.getAvailableRoles();
    res.status(200).json({ success: true, data: roles });
  };
}