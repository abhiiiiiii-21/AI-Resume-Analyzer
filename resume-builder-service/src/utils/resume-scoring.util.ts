import { ResumeData } from '../types/resume.types';

/**
 * Resume Scoring Utility
 * 
 * Calculates a completion score (0-100) for a resume based on
 * which sections are filled in and how complete they are.
 * 
 * This is a DETERMINISTIC, rule-based system — it does NOT depend on the LLM.
 * The LLM also provides its own score, but this gives us a reliable baseline.
 * 
 * Scoring breakdown (100 points total):
 * - Basics (name, email, etc.)    : 15 points
 * - Summary / Headline            : 10 points
 * - Skills                        : 10 points
 * - Experience                    : 25 points
 * - Projects                      : 15 points
 * - Education                     : 15 points
 * - Extras (certs, links, etc.)   : 10 points
 */

/**
 * Calculate a completion score for the given resume data.
 * Returns a number between 0 and 100.
 */
export function calculateCompletionScore(resume: ResumeData): number {
    let score = 0;

    // --- Basics (15 points) ---
    const basics = resume.basics;
    if (basics.fullName) score += 3;
    if (basics.email) score += 3;
    if (basics.phone) score += 2;
    if (basics.location) score += 2;
    if (basics.targetRole) score += 3;
    if (basics.linkedin || basics.github) score += 2;

    // --- Summary / Headline (10 points) ---
    if (basics.headline) score += 4;
    if (basics.summary && basics.summary.length > 30) score += 6;

    // --- Skills (10 points) ---
    const skills = resume.skills;
    const totalSkills = [
        ...skills.languages,
        ...skills.frameworks,
        ...skills.tools,
        ...skills.databases,
        ...skills.cloud,
        ...skills.other,
    ].length;
    if (totalSkills >= 1) score += 3;
    if (totalSkills >= 5) score += 3;
    if (totalSkills >= 10) score += 4;

    // --- Experience (25 points) ---
    const exp = resume.experience;
    if (exp.length >= 1) score += 5;
    if (exp.length >= 2) score += 5;
    // Check quality of experience entries
    for (const entry of exp.slice(0, 3)) {
        if (entry.achievements && entry.achievements.length >= 2) score += 3;
        if (entry.startDate) score += 1;
        if (entry.technologies && entry.technologies.length > 0) score += 1;
    }
    // Cap experience score contribution
    score = Math.min(score, 70); // Ensure we don't exceed due to multiple entries

    // --- Projects (15 points) ---
    const projects = resume.projects;
    if (projects.length >= 1) score += 4;
    if (projects.length >= 2) score += 3;
    for (const proj of projects.slice(0, 3)) {
        if (proj.description) score += 1;
        if (proj.technologies && proj.technologies.length > 0) score += 1;
        if (proj.impact && proj.impact.length > 0) score += 2;
    }

    // --- Education (15 points) ---
    const edu = resume.education;
    if (edu.length >= 1) {
        score += 5;
        const firstEdu = edu[0];
        if (firstEdu.degree) score += 3;
        if (firstEdu.fieldOfStudy) score += 2;
        if (firstEdu.startDate || firstEdu.endDate) score += 3;
        if (firstEdu.grade) score += 2;
    }

    // --- Extras (10 points) ---
    if (resume.certifications.length > 0) score += 4;
    if (resume.achievements.length > 0) score += 3;
    if (resume.extras?.languagesSpoken && resume.extras.languagesSpoken.length > 0) score += 1;
    if (resume.extras?.volunteer && resume.extras.volunteer.length > 0) score += 2;

    // Cap at 100
    return Math.min(100, score);
}
