import { ResumeDraftRepository } from '../repositories/resume-draft.repository';
import { ResumeRepository } from '../repositories/resume.repository';
import { BuilderSessionRepository } from '../repositories/builder-session.repository';
import { ResumeEvaluationService } from './resume-evaluation.service';
import { ResumeData } from '../types/resume.types';
import { Resume } from '../db/schema/resumes';
import { AppError } from '../utils/app-error';

/**
 * ResumeFinalizationService
 * 
 * Handles the process of converting a draft into a finalized resume.
 * 
 * Finalization flow:
 * 1. Load the draft
 * 2. Evaluate quality (deterministic check)
 * 3. If not ready → return blocking reasons
 * 4. If ready → create finalized resume record, mark draft as finalized,
 *    mark session as completed
 */
export class ResumeFinalizationService {
    private draftRepo: ResumeDraftRepository;
    private resumeRepo: ResumeRepository;
    private sessionRepo: BuilderSessionRepository;
    private evaluationService: ResumeEvaluationService;

    constructor() {
        this.draftRepo = new ResumeDraftRepository();
        this.resumeRepo = new ResumeRepository();
        this.sessionRepo = new BuilderSessionRepository();
        this.evaluationService = new ResumeEvaluationService();
    }

    /**
     * Finalize a resume draft.
     * 
     * @param draftId - The draft to finalize
     * @param userId - The user who owns it
     * @param title - Title for the finalized resume
     * @param templateKey - Which PDF template to use
     * @returns The finalized resume, or throws with reasons if not ready
     */
    async finalize(
        draftId: string,
        userId: string,
        title: string,
        templateKey: string
    ): Promise<Resume> {
        // 1. Load the draft (with ownership check)
        const draft = await this.draftRepo.findByIdAndUser(draftId, userId);
        if (!draft) {
            throw new AppError('Draft not found', 404);
        }

        // 2. Check if already finalized
        if (draft.status === 'FINALIZED') {
            throw new AppError('This draft has already been finalized', 400);
        }

        // 3. Evaluate quality
        const resumeData = draft.resumeJson as ResumeData;
        const evaluation = this.evaluationService.evaluate(resumeData);

        if (!evaluation.isReadyToFinalize) {
            throw new AppError(
                `Resume is not ready to finalize. Issues: ${evaluation.blockingReasons.join('; ')}`,
                400
            );
        }

        // 4. Create the finalized resume record
        const resume = await this.resumeRepo.create({
            draftId: draft.id,
            userId,
            title,
            templateKey,
            resumeJson: resumeData,
            version: 1,
        });

        // 5. Mark the draft as finalized
        await this.draftRepo.update(draftId, { status: 'FINALIZED' });

        // 6. Mark the session as completed
        await this.sessionRepo.update(draft.sessionId, { status: 'COMPLETED' });

        return resume;
    }
}
