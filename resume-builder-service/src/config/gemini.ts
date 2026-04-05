import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from './env';

/**
 * Gemini Client Configuration
 * 
 * Initializes the Google Generative AI SDK with our API key.
 * This is the single source of truth for the Gemini client instance.
 * 
 * Only the GeminiProvider should import this directly.
 * All other code should go through the provider layer.
 */

// Create the Google Generative AI client
export const genAI = new GoogleGenerativeAI(env.geminiApiKey);

// The model name to use (configurable via .env)
export const GEMINI_MODEL = env.geminiModel;
