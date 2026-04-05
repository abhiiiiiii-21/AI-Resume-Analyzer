import { ResumeData } from '../types/resume.types';

/**
 * Resume Validation Utility
 * 
 * Identifies missing or weak fields in a resume.
 * Returns a list of field paths that need attention.
 * 
 * This is used by:
 * - ResumeEvaluationService (to determine readiness)
 * - Finalization logic (to block finalization of incomplete resumes)
 */

/**
 * Find all missing or weak fields in the resume.
 * Returns an array of dot-notation field paths.
 * 
 * Example output: ["basics.summary", "experience[0].achievements", "education[0].endDate"]
 */
export function findMissingFields(resume: ResumeData): string[] {
    const missing: string[] = [];

    // --- Basics ---
    if (!resume.basics.fullName) missing.push('basics.fullName');
    if (!resume.basics.email) missing.push('basics.email');
    if (!resume.basics.targetRole) missing.push('basics.targetRole');
    if (!resume.basics.summary || resume.basics.summary.length < 20) {
        missing.push('basics.summary');
    }
    if (!resume.basics.headline) missing.push('basics.headline');
    if (!resume.basics.phone) missing.push('basics.phone');
    if (!resume.basics.linkedin) missing.push('basics.linkedin');

    // --- Skills ---
    const totalSkills = [
        ...resume.skills.languages,
        ...resume.skills.frameworks,
        ...resume.skills.tools,
        ...resume.skills.databases,
    ].length;
    if (totalSkills === 0) missing.push('skills');

    // --- Experience ---
    if (resume.experience.length === 0) {
        missing.push('experience');
    } else {
        resume.experience.forEach((exp, i) => {
            if (!exp.company) missing.push(`experience[${i}].company`);
            if (!exp.role) missing.push(`experience[${i}].role`);
            if (!exp.achievements || exp.achievements.length === 0) {
                missing.push(`experience[${i}].achievements`);
            }
            if (!exp.startDate) missing.push(`experience[${i}].startDate`);
        });
    }

    // --- Projects ---
    if (resume.projects.length === 0 && resume.experience.length === 0) {
        // At least one of experience or projects should exist
        missing.push('projects');
    } else {
        resume.projects.forEach((proj, i) => {
            if (!proj.technologies || proj.technologies.length === 0) {
                missing.push(`projects[${i}].technologies`);
            }
            if (!proj.description) missing.push(`projects[${i}].description`);
        });
    }

    // --- Education ---
    if (resume.education.length === 0) {
        missing.push('education');
    } else {
        resume.education.forEach((edu, i) => {
            if (!edu.degree) missing.push(`education[${i}].degree`);
            if (!edu.institution) missing.push(`education[${i}].institution`);
        });
    }

    return missing;
}

/**
 * Check if a resume meets the minimum quality bar for finalization.
 * 
 * Minimum requirements:
 * - Name and email must be present
 * - At least one of: experience or projects
 * - At least some skills
 * - Education present
 */
export function isReadyToFinalize(resume: ResumeData): {
    ready: boolean;
    reasons: string[];
} {
    const reasons: string[] = [];

    if (!resume.basics.fullName) reasons.push('Full name is required');
    if (!resume.basics.email) reasons.push('Email is required');

    const hasExperience = resume.experience.length > 0;
    const hasProjects = resume.projects.length > 0;
    if (!hasExperience && !hasProjects) {
        reasons.push('At least one experience entry or project is required');
    }

    const totalSkills = [
        ...resume.skills.languages,
        ...resume.skills.frameworks,
        ...resume.skills.tools,
    ].length;
    if (totalSkills === 0) reasons.push('At least some skills are required');

    if (resume.education.length === 0) {
        reasons.push('At least one education entry is required');
    }

    return {
        ready: reasons.length === 0,
        reasons,
    };
}
