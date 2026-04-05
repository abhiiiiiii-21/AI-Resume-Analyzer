import { genAI, GEMINI_MODEL } from '../config/gemini';

/**
 * GeminiProvider
 * 
 * The ONLY class that directly calls the Google Gemini SDK.
 * All other code goes through this provider — never call the SDK directly.
 * 
 * Why isolate the LLM call?
 * - Easy to swap to a different LLM provider (OpenAI, Claude, etc.)
 * - Centralized error handling for API failures
 * - Single place to add retries, logging, rate limiting
 * - Testable — can be mocked in tests
 */
export class GeminiProvider {
    /**
     * Send a prompt to Gemini and get a text response.
     * 
     * @param systemPrompt - Instructions for how Gemini should behave
     * @param userMessage - The actual user input + context
     * @returns The raw text response from Gemini
     */
    async generateContent(systemPrompt: string, userMessage: string): Promise<string> {
        try {
            const model = genAI.getGenerativeModel({
                model: GEMINI_MODEL,
                systemInstruction: systemPrompt,
            });

            const result = await model.generateContent(userMessage);
            const response = result.response;
            const text = response.text();

            if (!text || text.trim() === '') {
                throw new Error('Gemini returned an empty response');
            }

            return text;
        } catch (error: any) {
            // Log the error for debugging
            console.error('[GeminiProvider] Error calling Gemini API:', error.message);

            // Re-throw with a cleaner message
            if (error.message?.includes('API key')) {
                throw new Error('Gemini API key is invalid or missing. Check your GEMINI_API_KEY.');
            }

            if (error.message?.includes('quota') || error.message?.includes('rate')) {
                throw new Error('Gemini API rate limit exceeded. Please try again in a moment.');
            }

            throw new Error(`Gemini API error: ${error.message || 'Unknown error'}`);
        }
    }
}
