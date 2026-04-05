/**
 * JSON Extract Utility
 * 
 * Robustly extracts JSON from LLM responses.
 * 
 * Why this is needed:
 * - LLMs sometimes wrap JSON in markdown code fences (```json ... ```)
 * - LLMs sometimes add text before or after the JSON
 * - LLMs sometimes produce slightly malformed JSON
 * - We need to handle all these cases gracefully without crashing
 */

/**
 * Attempt to extract and parse a JSON object from a raw text string.
 * Handles common LLM output quirks like markdown fences and extra text.
 * 
 * @param rawText - The raw text response from the LLM
 * @returns The parsed JSON object, or null if extraction fails
 */
export function extractJsonFromText(rawText: string): any | null {
    if (!rawText || rawText.trim() === '') {
        return null;
    }

    let cleaned = rawText.trim();

    // Strategy 1: Try parsing directly (best case — LLM returned clean JSON)
    try {
        return JSON.parse(cleaned);
    } catch {
        // Not clean JSON, try other strategies
    }

    // Strategy 2: Remove markdown code fences (```json ... ``` or ``` ... ```)
    const codeFenceRegex = /```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/;
    const fenceMatch = cleaned.match(codeFenceRegex);
    if (fenceMatch) {
        try {
            return JSON.parse(fenceMatch[1].trim());
        } catch {
            // Fenced content wasn't valid JSON either
        }
    }

    // Strategy 3: Find the first { and last } — extract the JSON object
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');

    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        const jsonCandidate = cleaned.substring(firstBrace, lastBrace + 1);
        try {
            return JSON.parse(jsonCandidate);
        } catch {
            // Still not valid JSON
        }
    }

    // Strategy 4: Try to fix common JSON issues
    // Remove trailing commas before } or ]
    const fixedJson = cleaned
        .replace(/,\s*([}\]])/g, '$1')
        // Remove single-line comments
        .replace(/\/\/.*$/gm, '');

    const firstBrace2 = fixedJson.indexOf('{');
    const lastBrace2 = fixedJson.lastIndexOf('}');

    if (firstBrace2 !== -1 && lastBrace2 !== -1 && lastBrace2 > firstBrace2) {
        try {
            return JSON.parse(fixedJson.substring(firstBrace2, lastBrace2 + 1));
        } catch {
            // Give up
        }
    }

    // All strategies failed
    console.error('[JsonExtract] Failed to extract JSON from text:', rawText.substring(0, 200));
    return null;
}
