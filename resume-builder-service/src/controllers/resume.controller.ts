import { Request, Response } from 'express';
import { UserContextService } from '../services/user-context.service';
import { ResumeDraftService } from '../services/resume-draft.service';
import { ResumeFinalizationService } from '../services/resume-finalization.service';
import { ResumePdfService } from '../services/resume-pdf.service';
import { ResumeRepository } from '../repositories/resume.repository';
import { ApiResponse } from '../utils/api-response';
import { asyncHandler } from '../utils/async-handler';
import { ResumeData } from '../types/resume.types';

/**
 * ResumeController
 * 
 * Handles all resume CRUD endpoints:
 * - Update draft section manually
 * - Finalize a draft
 * - List all user resumes
 * - Get a single resume
 * - Delete a resume
 * - Export PDF
 * 
 * Controllers are THIN — business logic lives in services.
 */
export class ResumeController {
    private userContextService: UserContextService;
    private draftService: ResumeDraftService;
    private finalizationService: ResumeFinalizationService;
    private pdfService: ResumePdfService;
    private resumeRepo: ResumeRepository;

    constructor() {
        this.userContextService = new UserContextService();
        this.draftService = new ResumeDraftService();
        this.finalizationService = new ResumeFinalizationService();
        this.pdfService = new ResumePdfService();
        this.resumeRepo = new ResumeRepository();
    }

    /**
     * PATCH /api/v1/builder/drafts/:draftId/section/:sectionName
     * 
     * Manually update a specific section of a resume draft.
     * Used when the frontend allows direct editing of sections.
     */
    updateSection = asyncHandler(async (req: Request, res: Response) => {
        const user = await this.userContextService.resolveUser(req.externalUserId!);

        const updatedDraft = await this.draftService.updateSection(
            req.params.draftId as string,
            user.id,
            req.params.sectionName as string,
            req.body.data
        );

        ApiResponse.success(res, {
            draftId: updatedDraft.id,
            resumeJson: updatedDraft.resumeJson,
            message: `Section "${req.params.sectionName}" updated successfully.`,
        });
    });

    /**
     * POST /api/v1/builder/drafts/:draftId/finalize
     * 
     * Finalize a resume draft — creates a permanent resume record.
     * Will fail if resume doesn't meet minimum quality standards.
     */
    finalize = asyncHandler(async (req: Request, res: Response) => {
        const user = await this.userContextService.resolveUser(req.externalUserId!);

        const resume = await this.finalizationService.finalize(
            req.params.draftId as string,
            user.id,
            req.body.title,
            req.body.templateKey || 'modern-ats'
        );

        ApiResponse.created(res, {
            resumeId: resume.id,
            title: resume.title,
            status: 'FINALIZED',
        });
    });

    /**
     * GET /api/v1/resumes
     * 
     * Get all finalized resumes for the current user.
     */
    getAllResumes = asyncHandler(async (req: Request, res: Response) => {
        const user = await this.userContextService.resolveUser(req.externalUserId!);
        const resumes = await this.resumeRepo.findAllByUser(user.id);

        ApiResponse.success(res, {
            resumes: resumes.map((r) => ({
                id: r.id,
                title: r.title,
                templateKey: r.templateKey,
                pdfUrl: r.pdfUrl,
                version: r.version,
                createdAt: r.createdAt,
                updatedAt: r.updatedAt,
            })),
        });
    });

    /**
     * GET /api/v1/resumes/:resumeId
     * 
     * Get a single resume by ID with full JSON data.
     */
    getResumeById = asyncHandler(async (req: Request, res: Response) => {
        const user = await this.userContextService.resolveUser(req.externalUserId!);

        const resume = await this.resumeRepo.findByIdAndUser(
            req.params.resumeId as string,
            user.id
        );

        if (!resume) {
            return ApiResponse.error(res, 'Resume not found', 404);
        }

        ApiResponse.success(res, {
            id: resume.id,
            title: resume.title,
            templateKey: resume.templateKey,
            resumeJson: resume.resumeJson as ResumeData,
            pdfUrl: resume.pdfUrl,
            version: resume.version,
            createdAt: resume.createdAt,
            updatedAt: resume.updatedAt,
        });
    });

    /**
     * DELETE /api/v1/resumes/:resumeId
     * 
     * Delete a finalized resume.
     */
    deleteResume = asyncHandler(async (req: Request, res: Response) => {
        const user = await this.userContextService.resolveUser(req.externalUserId!);

        const resume = await this.resumeRepo.findByIdAndUser(
            req.params.resumeId as string,
            user.id
        );

        if (!resume) {
            return ApiResponse.error(res, 'Resume not found', 404);
        }

        await this.resumeRepo.delete(resume.id);

        ApiResponse.success(res, {
            message: 'Resume deleted successfully',
            resumeId: resume.id,
        });
    });

    /**
     * POST /api/v1/resumes/:resumeId/export-pdf
     * 
     * Generate a PDF for a finalized resume.
     * Uses Puppeteer to render HTML template to PDF.
     */
    exportPdf = asyncHandler(async (req: Request, res: Response) => {
        const user = await this.userContextService.resolveUser(req.externalUserId!);

        const pdfUrl = await this.pdfService.generatePdf(
            req.params.resumeId as string,
            user.id
        );

        ApiResponse.success(res, {
            resumeId: req.params.resumeId,
            pdfUrl,
            message: 'PDF generated successfully',
        });
    });
}
