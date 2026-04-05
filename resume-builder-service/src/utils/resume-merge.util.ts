import { ResumeData, EMPTY_RESUME_DATA } from '../types/resume.types';

/**
 * Resume Merge Utility
 * 
 * Safely merges new resume data from the AI into the existing draft.
 * 
 * Why this is critical:
 * - We NEVER want to lose data the user already provided
 * - The AI might return partial data (only the fields it extracted)
 * - We need to merge new data IN, not replace everything
 * - Arrays should be replaced (not appended) because the AI returns the full updated array
 * - Empty strings and empty arrays from AI should NOT overwrite existing data
 */

/**
 * Merge new resume data from AI response into existing draft data.
 * 
 * Rules:
 * - Non-empty new values overwrite old values
 * - Empty strings ("") do NOT overwrite existing non-empty values
 * - Empty arrays ([]) do NOT overwrite existing non-empty arrays
 * - Non-empty arrays REPLACE (not append to) old arrays
 * - Nested objects are merged recursively
 * 
 * @param existing - The current resume draft data
 * @param incoming - New data from the AI response
 * @returns Merged resume data
 */
export function mergeResumeData(
    existing: ResumeData,
    incoming: Partial<ResumeData>
): ResumeData {
    // Start with a copy of existing data
    const merged: ResumeData = JSON.parse(JSON.stringify(existing));

    if (!incoming) return merged;

    // Merge basics (simple key-value object)
    if (incoming.basics) {
        merged.basics = mergeSimpleObject(merged.basics, incoming.basics);
    }

    // Merge skills (object with array values)
    if (incoming.skills) {
        merged.skills = mergeSkills(merged.skills, incoming.skills);
    }

    // Merge arrays — replace if incoming is non-empty
    if (incoming.experience && incoming.experience.length > 0) {
        merged.experience = incoming.experience;
    }

    if (incoming.projects && incoming.projects.length > 0) {
        merged.projects = incoming.projects;
    }

    if (incoming.education && incoming.education.length > 0) {
        merged.education = incoming.education;
    }

    if (incoming.certifications && incoming.certifications.length > 0) {
        merged.certifications = incoming.certifications;
    }

    if (incoming.achievements && incoming.achievements.length > 0) {
        merged.achievements = incoming.achievements;
    }

    // Merge extras
    if (incoming.extras) {
        merged.extras = mergeSimpleObject(merged.extras || {}, incoming.extras);
    }

    return merged;
}

/**
 * Merge two simple objects — new non-empty values overwrite old values.
 * Empty strings are skipped (preserving existing data).
 */
function mergeSimpleObject<T extends Record<string, any>>(
    existing: T,
    incoming: Partial<T>
): T {
    const result = { ...existing };

    for (const key of Object.keys(incoming)) {
        const newValue = (incoming as any)[key];

        // Skip null, undefined, and empty strings
        if (newValue === null || newValue === undefined || newValue === '') {
            continue;
        }

        (result as any)[key] = newValue;
    }

    return result;
}

/**
 * Merge skills — each skill category is an array.
 * Non-empty arrays from incoming replace existing arrays.
 */
function mergeSkills(
    existing: ResumeData['skills'],
    incoming: Partial<ResumeData['skills']>
): ResumeData['skills'] {
    const result = { ...existing };

    for (const key of Object.keys(incoming) as Array<keyof ResumeData['skills']>) {
        const newArr = incoming[key];
        if (newArr && Array.isArray(newArr) && newArr.length > 0) {
            result[key] = newArr;
        }
    }

    return result;
}

/**
 * Create a safe starting point for resume data.
 * Returns a deep copy of the empty template.
 */
export function createEmptyResume(): ResumeData {
    return JSON.parse(JSON.stringify(EMPTY_RESUME_DATA));
}
