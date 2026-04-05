import { ResumeDraftRepository } from '../repositories/resume-draft.repository';
import { ResumeDraft } from '../db/schema/resume-drafts';
import { ResumeData } from '../types/resume.types';
import { AppError } from '../utils/app-error';

/**
 * ResumeDraftService
 * 
 * Manages resume draft data during the building process.
 * 
 * The draft is updated after every AI response — it stores the
 * latest version of the structured resume data, completion score,
 * and list of missing fields.
 */
export class ResumeDraftService {
    private draftRepo: ResumeDraftRepository;

    constructor() {
        this.draftRepo = new ResumeDraftRepository();
    }

    /**
     * Get a draft by its ID with ownership check.
     */
    async getDraft(draftId: string, userId: string): Promise<ResumeDraft> {
        const draft = await this.draftRepo.findByIdAndUser(draftId, userId);

        if (!draft) {
            throw new AppError('Resume draft not found', 404);
        }

        return draft;
    }

    /**
     * Get the draft for a specific session.
     */
    async getDraftBySession(sessionId: string): Promise<ResumeDraft | null> {
        return this.draftRepo.findBySessionId(sessionId);
    }

    /**
     * Update the draft with new resume data from the AI response.
     * This is called after every successful AI interaction.
     * 
     * @param draftId - The draft to update
     * @param resumeData - The merged resume data
     * @param completionScore - Updated completion score (0-100)
     * @param missingFields - Updated list of missing fields
     */
    async updateDraftFromAI(
        draftId: string,
        resumeData: ResumeData,
        completionScore: number,
        missingFields: string[]
    ): Promise<ResumeDraft> {
        return this.draftRepo.update(draftId, {
            resumeJson: resumeData,
            completionScore,
            missingFields,
            targetRole: resumeData.basics?.targetRole || undefined,
        });
    }

    /**
     * Manually update a specific section of the draft.
     * Used when the frontend allows users to edit sections directly.
     * 
     * @param draftId - The draft to update
     * @param sectionName - Which section to update (e.g., 'basics', 'skills')
     * @param data - The new section data
     */
    async updateSection(
        draftId: string,
        userId: string,
        sectionName: string,
        data: any
    ): Promise<ResumeDraft> {
        const draft = await this.getDraft(draftId, userId);
        const currentResume = draft.resumeJson as ResumeData;

        // Validate that the section name is a valid key of ResumeData
        const validSections = [
            'basics', 'skills', 'experience', 'projects',
            'education', 'certifications', 'achievements', 'extras',
        ];

        if (!validSections.includes(sectionName)) {
            throw new AppError(
                `Invalid section name: ${sectionName}. Valid sections: ${validSections.join(', ')}`,
                400
            );
        }

        // Merge the new section data into the existing resume
        const updatedResume = {
            ...currentResume,
            [sectionName]: data,
        };

        return this.draftRepo.update(draftId, {
            resumeJson: updatedResume,
        });
    }

    /**
     * Mark a draft as finalized.
     */
    async finalizeDraft(draftId: string): Promise<ResumeDraft> {
        return this.draftRepo.update(draftId, { status: 'FINALIZED' });
    }
}
