import { GroqProvider } from '../providers/groq.provider';
import { ResumePromptFactory } from '../prompts/resume-prompt.factory';
import { extractJsonFromText } from '../utils/json-extract.util';
import { mergeResumeData } from '../utils/resume-merge.util';
import { ResumeData } from '../types/resume.types';
import { ChatMessage } from '../db/schema/chat-messages';
import { AppError } from '../utils/app-error';

/**
 * The shape of the structured response we expect from Groq.
 * This matches what the system prompt asks for.
 */
export interface AIResumeResponse {
    assistantMessage: string;
    resumeData: ResumeData;
    missingFields: string[];
    completionScore: number;
    needsMoreInfo: boolean;
    nextQuestion: string;
    usedModel?: string;
}

/**
 * ResumeAIService
 * 
 * Orchestrates the AI-powered resume building flow.
 * This is the "brain" of the application — it:
 * 
 * 1. Takes the user message + current context
 * 2. Builds the AI prompt
 * 3. Calls Groq (llama-3.3-70b-versatile)
 * 4. Parses the structured JSON response
 * 5. Merges new data into existing draft
 * 6. Returns the result for the controller to save and respond
 * 
 * It does NOT save to the database — that's the controller's job.
 * This keeps the service focused on AI logic only.
 */
export class ResumeAIService {
    private groqProvider: GroqProvider;
    private promptFactory: ResumePromptFactory;

    constructor() {
        this.groqProvider = new GroqProvider();
        this.promptFactory = new ResumePromptFactory();
    }

    /**
     * Process a user message and return structured resume data.
     * 
     * @param userMessage - What the user just typed
     * @param currentResume - The current draft resume data
     * @param chatHistory - Recent conversation messages for context
     * @param currentMissingFields - Currently known missing fields
     * @returns Structured AI response with merged resume data
     */
    async processMessage(
        userMessage: string,
        currentResume: ResumeData,
        chatHistory: ChatMessage[],
        currentMissingFields: string[],
        modelOverride?: string
    ): Promise<AIResumeResponse> {
        // 1. Build prompts
        const systemPrompt = this.promptFactory.buildSystemPrompt();
        const userPrompt = this.promptFactory.buildUserPrompt(
            userMessage,
            currentResume,
            chatHistory,
            currentMissingFields
        );

        // 2. Call Groq (with optional model override)
        const { text: rawResponse, usedModel } = await this.groqProvider.generateContent(systemPrompt, userPrompt, modelOverride);

        // 3. Parse the JSON response
        const parsed = extractJsonFromText(rawResponse);

        if (!parsed) {
            // Groq returned something we can't parse — return a graceful fallback
            console.error('[ResumeAIService] Failed to parse Groq response');
            return this.buildFallbackResponse(currentResume, currentMissingFields, rawResponse, usedModel);
        }

        // 4. Validate the parsed response has the expected fields
        const aiResponse = this.validateAndNormalize(parsed, currentResume);

        // 5. Merge the AI's resume data into the existing draft
        const mergedResume = mergeResumeData(currentResume, aiResponse.resumeData);

        // 6. Return the final result with merged data
        return {
            ...aiResponse,
            resumeData: mergedResume,
            usedModel,
        };
    }

    /**
     * Validate and normalize the parsed AI response.
     * Ensures all required fields exist with sensible defaults.
     */
    private validateAndNormalize(
        parsed: any,
        currentResume: ResumeData
    ): AIResumeResponse {
        return {
            assistantMessage:
                parsed.assistantMessage || 'I processed your message. How would you like to proceed?',
            resumeData: parsed.resumeData || currentResume,
            missingFields: Array.isArray(parsed.missingFields) ? parsed.missingFields : [],
            completionScore:
                typeof parsed.completionScore === 'number'
                    ? Math.min(100, Math.max(0, parsed.completionScore))
                    : 0,
            needsMoreInfo: parsed.needsMoreInfo !== false, // Default to true
            nextQuestion:
                parsed.nextQuestion || 'What other details would you like to add to your resume?',
        };
    }

    /**
     * Build a fallback response when JSON parsing fails.
     * This ensures the user still gets a useful response even if
     * the AI output was malformed.
     */
    private buildFallbackResponse(
        currentResume: ResumeData,
        currentMissingFields: string[],
        rawResponse: string,
        usedModel?: string
    ): AIResumeResponse {
        return {
            assistantMessage:
                'I had some trouble processing that. Could you rephrase or provide more details? ' +
                'Here\'s what I understood: ' +
                rawResponse.substring(0, 200),
            resumeData: currentResume,
            missingFields: currentMissingFields,
            completionScore: 0,
            needsMoreInfo: true,
            nextQuestion: 'Could you try rephrasing your last message?',
            usedModel,
        };
    }
}
