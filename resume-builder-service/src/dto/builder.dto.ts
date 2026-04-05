import { ResumeData } from '../types/resume.types';

/**
 * Builder DTOs — Data Transfer Objects for builder-related endpoints.
 * 
 * DTOs define the exact shape of data flowing between layers:
 * - Request DTOs: what the controller receives (after validation)
 * - Response DTOs: what the controller returns to the client
 * 
 * They act as a contract between controllers and services.
 */

/** Input for creating a new builder session */
export interface CreateSessionDto {
    externalUserId: string;
    title?: string;
}

/** Input for sending a chat message */
export interface SendMessageDto {
    sessionId: string;
    userId: string;
    message: string;
}

/**
 * Response after the AI processes a message.
 * This is the main data structure returned to the frontend
 * from the chat endpoint.
 */
export interface AiMessageResponseDto {
    assistantMessage: string;
    resumeData: ResumeData;
    missingFields: string[];
    completionScore: number;
    needsMoreInfo: boolean;
    nextQuestion: string;
}
