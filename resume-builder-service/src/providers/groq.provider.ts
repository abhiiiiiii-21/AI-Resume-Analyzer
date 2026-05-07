import { groqClient, GROQ_MODEL } from '../config/groq';
import { AppError } from '../utils/app-error';

/**
 * Available free Groq models for resume building.
 * Each has separate rate limits on Groq's free tier.
 */
export const AVAILABLE_MODELS = [
    { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B', description: 'Best quality (recommended)', isDefault: true },
    { id: 'deepseek-r1-distill-llama-70b', label: 'DeepSeek R1 70B', description: 'Advanced reasoning' },
    { id: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B', description: 'Fast, high availability' },
    { id: 'deepseek-r1-distill-qwen-32b', label: 'DeepSeek R1 32B', description: 'Advanced reasoning, lightweight' },
    { id: 'llama-3.2-11b-vision-preview', label: 'Llama 3.2 11B', description: 'Fast multimodal model' },
    { id: 'llama-3.2-3b-preview', label: 'Llama 3.2 3B', description: 'Ultra-fast lightweight model' },
    { id: 'llama-3.2-1b-preview', label: 'Llama 3.2 1B', description: 'Ultra-fast, lowest latency' },
    { id: 'gemma2-9b-it', label: 'Gemma 2 9B', description: 'Google model, good for structured data' },
    { id: 'gemma-7b-it', label: 'Gemma 7B', description: 'Google model, lightweight' },
    { id: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B', description: 'Mistral model, large context' },
];

/**
 * GroqProvider
 * 
 * The ONLY class that directly calls the Groq SDK.
 * Supports model override and automatic fallback on rate limits.
 */
export class GroqProvider {
    /**
     * Send a system prompt + user message to Groq and get a text response.
     * 
     * @param systemPrompt - Instructions for how the model should behave
     * @param userMessage - The user input + context
     * @param modelOverride - Optional model to use instead of default
     * @returns Object with response text and which model was used
     */
    async generateContent(
        systemPrompt: string,
        userMessage: string,
        modelOverride?: string
    ): Promise<{ text: string, usedModel: string }> {
        const initialModel = modelOverride || GROQ_MODEL;
        let currentModel = initialModel;
        let attempts = 0;
        const maxAttempts = AVAILABLE_MODELS.length;

        while (attempts < maxAttempts) {
            try {
                const text = await this.callModel(currentModel, systemPrompt, userMessage);
                return { text, usedModel: currentModel };
            } catch (error: any) {
                // If rate limited or model decommissioned, try next model
                const isRateLimited = error.status === 429 || error.message?.includes('rate_limit') || error.message?.includes('Rate limit');
                const isDecommissioned = error.status === 400 && error.message?.includes('decommissioned');
                
                if (isRateLimited || isDecommissioned) {
                    attempts++;
                    const currentIndex = AVAILABLE_MODELS.findIndex(m => m.id === currentModel);
                    
                    if (currentIndex !== -1 && currentIndex + 1 < AVAILABLE_MODELS.length && attempts < maxAttempts) {
                        currentModel = AVAILABLE_MODELS[currentIndex + 1].id;
                        console.warn(`[GroqProvider] Rate limit hit. Falling back to ${currentModel}`);
                        continue;
                    }

                    const retryMatch = error.message?.match(/try again in (\d+m[\d.]+s|\d+s)/);
                    const retryIn = retryMatch ? retryMatch[1] : 'a few minutes';
                    throw new AppError(`Rate limit reached across models. Try again in ${retryIn}.`, 429);
                }

                if (error.message?.includes('API key') || error.status === 401) {
                    throw new AppError('Groq API key is invalid or missing. Check your GROQ_API_KEY in .env.', 401);
                }

                throw new AppError(`AI error: ${error.message || 'Unknown error'}`, 500);
            }
        }
        throw new AppError('Failed to generate content after multiple attempts.', 500);
    }

    private async callModel(model: string, systemPrompt: string, userMessage: string): Promise<string> {
        const completion = await groqClient.chat.completions.create({
            model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage },
            ],
            temperature: 0.3,
            max_tokens: 8192,
            top_p: 0.9,
        });

        const text = completion.choices[0]?.message?.content;
        if (!text || text.trim() === '') {
            throw new Error('Groq returned an empty response');
        }
        return text;
    }
}
