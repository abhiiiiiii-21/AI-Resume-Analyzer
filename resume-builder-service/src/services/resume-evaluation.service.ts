import { ResumeData } from '../types/resume.types';
import { calculateCompletionScore } from '../utils/resume-scoring.util';
import { findMissingFields, isReadyToFinalize } from '../utils/resume-validation.util';

/**
 * ResumeEvaluationService
 * 
 * Evaluates a resume's completeness and quality using deterministic rules.
 * 
 * This service complements the AI's assessment. While the LLM gives qualitative
 * feedback, this service provides consistent, rule-based evaluation.
 * 
 * Used by:
 * - The chat flow (to provide baseline scoring alongside AI scoring)
 * - The finalization endpoint (to decide if resume is ready)
 */
export class ResumeEvaluationService {
    /**
     * Evaluate a resume and return a full assessment.
     * 
     * @param resumeData - The resume data to evaluate
     * @returns Score, missing fields, warnings, and finalization readiness
     */
    evaluate(resumeData: ResumeData): ResumeEvaluation {
        const completionScore = calculateCompletionScore(resumeData);
        const missingFields = findMissingFields(resumeData);
        const { ready, reasons } = isReadyToFinalize(resumeData);

        // Generate helpful warnings
        const warnings: string[] = [];

        if (completionScore < 40) {
            warnings.push('Your resume is still quite incomplete. Keep adding details!');
        }

        if (resumeData.experience.length > 0) {
            const weakAchievements = resumeData.experience.some(
                (exp) => !exp.achievements || exp.achievements.length < 2
            );
            if (weakAchievements) {
                warnings.push('Some experience entries have few achievements. Add quantifiable results.');
            }
        }

        if (!resumeData.basics.summary) {
            warnings.push('A professional summary significantly improves your resume.');
        }

        if (!resumeData.basics.targetRole) {
            warnings.push('Setting a target role helps tailor the resume for ATS.');
        }

        return {
            completionScore,
            missingFields,
            warnings,
            isReadyToFinalize: ready,
            blockingReasons: reasons,
        };
    }
}

/** The result of a resume evaluation */
export interface ResumeEvaluation {
    /** 0-100 completion score */
    completionScore: number;
    /** List of missing field paths (dot notation) */
    missingFields: string[];
    /** Helpful improvement warnings */
    warnings: string[];
    /** Whether the resume meets minimum quality for finalization */
    isReadyToFinalize: boolean;
    /** If not ready, the specific reasons why */
    blockingReasons: string[];
}
