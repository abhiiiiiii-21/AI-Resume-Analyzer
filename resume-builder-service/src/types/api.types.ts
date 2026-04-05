import { ResumeData } from './resume.types';

/**
 * API Types — Shapes for API responses.
 * 
 * These define the structure of data returned by each endpoint.
 * The frontend team can use these types directly.
 */

/** Standard success response wrapper */
export interface ApiSuccessResponse<T = any> {
    success: true;
    message: string;
    data: T;
}

/** Standard error response wrapper */
export interface ApiErrorResponse {
    success: false;
    message: string;
    errors: Array<{ field?: string; message: string }>;
}

/** Response from POST /builder/session/start */
export interface StartSessionResponse {
    sessionId: string;
    draftId: string;
    status: string;
    message: string;
}

/** Response from GET /builder/session/:sessionId */
export interface GetSessionResponse {
    session: {
        id: string;
        status: string;
        title: string | null;
        createdAt: Date;
        updatedAt: Date;
    };
    draft: {
        id: string;
        resumeJson: ResumeData;
        completionScore: number;
        missingFields: string[];
        status: string;
    } | null;
    recentMessages: Array<{
        id: string;
        role: string;
        content: string;
        createdAt: Date;
    }>;
}

/** Response from POST /builder/session/:sessionId/message */
export interface SendMessageResponse {
    assistantMessage: string;
    resumeData: ResumeData;
    missingFields: string[];
    completionScore: number;
    needsMoreInfo: boolean;
    nextQuestion: string;
}

/** Response from POST /builder/drafts/:draftId/finalize */
export interface FinalizeResumeResponse {
    resumeId: string;
    title: string;
    status: string;
}

/** Response from POST /resumes/:resumeId/export-pdf */
export interface ExportPdfResponse {
    resumeId: string;
    pdfUrl: string;
}

/** A resume summary for list views */
export interface ResumeSummary {
    id: string;
    title: string;
    templateKey: string;
    pdfUrl: string | null;
    version: number;
    createdAt: Date;
    updatedAt: Date;
}
