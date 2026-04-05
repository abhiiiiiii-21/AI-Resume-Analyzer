import { ResumeData } from '../types/resume.types';

/**
 * Resume DTOs — Data Transfer Objects for resume-related endpoints.
 * 
 * These define the data shapes for resume finalization,
 * manual section updates, and PDF generation.
 */

/** Input for finalizing a resume draft */
export interface FinalizeResumeDto {
    draftId: string;
    userId: string;
    title: string;
    templateKey: string;
}

/** Input for manually updating a resume section */
export interface UpdateSectionDto {
    draftId: string;
    userId: string;
    sectionName: string;
    data: any;
}

/** Input for exporting a resume as PDF */
export interface ExportPdfDto {
    resumeId: string;
    userId: string;
}

/** Full resume details returned by GET /resumes/:resumeId */
export interface ResumeDetailDto {
    id: string;
    title: string;
    templateKey: string;
    resumeJson: ResumeData;
    pdfUrl: string | null;
    version: number;
    createdAt: Date;
    updatedAt: Date;
}
