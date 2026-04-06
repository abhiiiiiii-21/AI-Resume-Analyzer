import { groqClient, GROQ_MODEL } from '../config/groq';

/**
 * GroqProvider
 * 
 * The ONLY class that directly calls the Groq SDK.
 * All other code goes through this provider.
 * 
 * Why Groq over Gemini?
 * - 10x faster inference (Groq runs on custom LPU hardware)
 * - llama-3.3-70b-versatile: excellent JSON output and instruction following
 * - Generous free tier
 * - OpenAI-compatible Chat API — familiar structure
 * 
 * Why isolate it?
 * - Single point for error handling
 * - Easy to mock in tests
 * - Swappable with other providers (OpenAI, Claude, etc.)
 */
export class GroqProvider {
    /**
     * Send a system prompt + user message to Groq and get a text response.
     * 
     * @param systemPrompt - Instructions for how the model should behave
     * @param userMessage - The user input + context
     * @returns The raw text response from the model
     */
    async generateContent(systemPrompt: string, userMessage: string): Promise<string> {
        try {
            const completion = await groqClient.chat.completions.create({
                model: GROQ_MODEL,
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt,
                    },
                    {
                        role: 'user',
                        content: userMessage,
                    },
                ],
                // These settings encourage clean JSON output
                temperature: 0.3,    // Lower = more deterministic, better for structured data
                max_tokens: 8192,    // Generous limit for full resume JSON
                top_p: 0.9,
            });

            const text = completion.choices[0]?.message?.content;

            if (!text || text.trim() === '') {
                throw new Error('Groq returned an empty response');
            }

            return text;
        } catch (error: any) {
            console.error('[GroqProvider] Error calling Groq API:', error.message);

            if (error.message?.includes('API key') || error.status === 401) {
                throw new Error('Groq API key is invalid or missing. Check your GROQ_API_KEY in .env.');
            }

            if (error.status === 429 || error.message?.includes('rate')) {
                throw new Error('Groq API rate limit exceeded. Please try again in a moment.');
            }

            throw new Error(`Groq API error: ${error.message || 'Unknown error'}`);
        }
    }
}
