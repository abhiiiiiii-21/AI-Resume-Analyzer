/**
 * Resume Types — Core Data Contract
 * 
 * This file defines the main ResumeData interface that is the heart of the
 * entire application. This exact shape is:
 * - Returned to the frontend after every chat message
 * - Stored as JSONB in the resume_drafts and resumes database tables
 * - Used by the AI to structure extracted resume information
 * - Used by the PDF template to render the resume
 * 
 * If you change this interface, everything downstream must be updated.
 */

/** Basic personal and contact information */
export interface ResumeBasics {
    fullName: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
    targetRole?: string;
    headline?: string;
    summary?: string;
}

/** Technical skills grouped by category */
export interface ResumeSkills {
    languages: string[];
    frameworks: string[];
    tools: string[];
    databases: string[];
    cloud: string[];
    other: string[];
}

/** A single work experience entry */
export interface ResumeExperience {
    company: string;
    role: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    isCurrent?: boolean;
    /** Short overview of the role */
    description?: string;
    /** Action-oriented bullet points with measurable achievements */
    achievements: string[];
    /** Technologies used in this role */
    technologies?: string[];
}

/** A single project entry */
export interface ResumeProject {
    name: string;
    role?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
    /** Quantifiable impact statements */
    impact?: string[];
    technologies: string[];
    links?: {
        github?: string;
        live?: string;
        other?: string;
    };
}

/** A single education entry */
export interface ResumeEducation {
    institution: string;
    degree: string;
    fieldOfStudy?: string;
    startDate?: string;
    endDate?: string;
    grade?: string;
}

/** A single certification entry */
export interface ResumeCertification {
    name: string;
    issuer?: string;
    issueDate?: string;
    credentialUrl?: string;
}

/** Optional extra sections */
export interface ResumeExtras {
    volunteer?: string[];
    publications?: string[];
    languagesSpoken?: string[];
    interests?: string[];
}

/**
 * ResumeData — The master resume structure.
 * 
 * This is THE core contract of the entire application.
 * Frontend renders live preview from this, backend stores this as JSONB,
 * and the AI populates this from user chat messages.
 */
export interface ResumeData {
    basics: ResumeBasics;
    skills: ResumeSkills;
    experience: ResumeExperience[];
    projects: ResumeProject[];
    education: ResumeEducation[];
    certifications: ResumeCertification[];
    achievements: string[];
    extras?: ResumeExtras;
}

/**
 * Empty resume data — used as default when starting a new session.
 * Every field has a sensible empty value.
 */
export const EMPTY_RESUME_DATA: ResumeData = {
    basics: {
        fullName: '',
        email: '',
    },
    skills: {
        languages: [],
        frameworks: [],
        tools: [],
        databases: [],
        cloud: [],
        other: [],
    },
    experience: [],
    projects: [],
    education: [],
    certifications: [],
    achievements: [],
};
