import Groq from 'groq-sdk';
import { env } from './env';

/**
 * Groq Client Initialization
 * 
 * Creates a single Groq client instance for the entire application.
 * Only the GroqProvider should import this — all other code goes through
 * the provider, never directly through the client.
 * 
 * Why Groq over Gemini?
 * - Significantly faster inference (often 10x faster than Gemini)
 * - Generous free tier with high token limits
 * - llama-3.3-70b-versatile: excellent JSON instruction following
 * - OpenAI-compatible API — easy to maintain
 */
export const groqClient = new Groq({
    apiKey: env.groqApiKey,
});

/** The model to use for all AI calls */
export const GROQ_MODEL = env.groqModel;
