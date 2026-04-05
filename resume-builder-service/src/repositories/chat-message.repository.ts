import { eq, desc } from 'drizzle-orm';
import { db } from '../config/db';
import { chatMessages, ChatMessage, NewChatMessage } from '../db/schema/chat-messages';

/**
 * ChatMessageRepository
 * 
 * Handles all database operations for chat messages.
 * Messages are the conversation history for a builder session.
 */
export class ChatMessageRepository {
    /**
     * Save a new chat message to the database.
     * Used for both user messages and AI assistant responses.
     */
    async create(data: NewChatMessage): Promise<ChatMessage> {
        const result = await db.insert(chatMessages).values(data).returning();
        return result[0];
    }

    /**
     * Get all messages for a session, ordered oldest first.
     * Used to reconstruct conversation history for the LLM.
     */
    async findBySessionId(sessionId: string): Promise<ChatMessage[]> {
        return db
            .select()
            .from(chatMessages)
            .where(eq(chatMessages.sessionId, sessionId))
            .orderBy(chatMessages.createdAt);
    }

    /**
     * Get the most recent N messages for a session.
     * Used to limit context sent to the LLM (to stay within token limits).
     * 
     * @param sessionId - The session to fetch messages for
     * @param limit - Max number of recent messages to return (default 20)
     */
    async findRecentBySessionId(sessionId: string, limit: number = 20): Promise<ChatMessage[]> {
        const messages = await db
            .select()
            .from(chatMessages)
            .where(eq(chatMessages.sessionId, sessionId))
            .orderBy(desc(chatMessages.createdAt))
            .limit(limit);

        // Reverse so they're in chronological order (oldest first)
        return messages.reverse();
    }
}
