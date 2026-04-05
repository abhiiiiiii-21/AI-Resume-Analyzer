import { ChatMessageRepository } from '../repositories/chat-message.repository';
import { ChatMessage } from '../db/schema/chat-messages';

/**
 * ChatService
 * 
 * Handles saving and retrieving chat messages for builder sessions.
 * 
 * Why a separate service instead of using the repository directly?
 * - Services can add business logic (e.g., message formatting, limits)
 * - Controllers stay thin — they call services, not repos
 * - Keeps the layered architecture consistent
 */
export class ChatService {
    private chatRepo: ChatMessageRepository;

    constructor() {
        this.chatRepo = new ChatMessageRepository();
    }

    /**
     * Save a user's message to the chat history.
     */
    async saveUserMessage(sessionId: string, content: string): Promise<ChatMessage> {
        return this.chatRepo.create({
            sessionId,
            role: 'USER',
            content,
        });
    }

    /**
     * Save the AI assistant's response to the chat history.
     * Optionally includes metadata (completion score, missing fields, etc.)
     */
    async saveAssistantMessage(
        sessionId: string,
        content: string,
        metadata?: Record<string, any>
    ): Promise<ChatMessage> {
        return this.chatRepo.create({
            sessionId,
            role: 'ASSISTANT',
            content,
            metadata: metadata || null,
        });
    }

    /**
     * Get recent chat history for a session.
     * Used to build context for the LLM prompt.
     * 
     * @param sessionId - The session to get messages for
     * @param limit - Max messages to return (default 20)
     */
    async getRecentMessages(sessionId: string, limit: number = 20): Promise<ChatMessage[]> {
        return this.chatRepo.findRecentBySessionId(sessionId, limit);
    }

    /**
     * Get all messages for a session (for full history display).
     */
    async getAllMessages(sessionId: string): Promise<ChatMessage[]> {
        return this.chatRepo.findBySessionId(sessionId);
    }
}
