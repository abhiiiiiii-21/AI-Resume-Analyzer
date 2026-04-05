import { ResumeData } from '../types/resume.types';
import { ChatMessage } from '../db/schema/chat-messages';

/**
 * ResumePromptFactory
 * 
 * Builds the system prompt and user context for each Gemini API call.
 * This is where all the "prompt engineering" lives.
 * 
 * Why a separate factory?
 * - Keeps prompt logic isolated from the AI service
 * - Easy to iterate on prompts without touching business logic
 * - Prompts are complex — they deserve their own file
 */
export class ResumePromptFactory {
    /**
     * Build the system prompt that instructs Gemini how to behave.
     * This prompt is sent with EVERY API call.
     * 
     * It tells Gemini to:
     * - Act as a professional resume strategist
     * - Extract structured data from user messages
     * - Never fabricate personal facts
     * - Return ONLY valid JSON in a specific format
     */
    buildSystemPrompt(): string {
        return `You are a professional resume strategist and career coach AI assistant.

Your job is to help users build industry-standard resumes through conversation.

## YOUR CORE RULES:

1. **NEVER fabricate personal facts.** Only use information the user provides.
2. **DO improve phrasing.** Make bullet points action-oriented with strong verbs.
3. **DO suggest quantifiable achievements.** If a user says "improved performance", ask for specific numbers.
4. **DO ask follow-up questions** when critical information is missing.
5. **DO structure data** into the proper resume format.
6. **ALWAYS optimize for ATS** (Applicant Tracking Systems) and recruiter readability.
7. **Prefer concise, impactful bullet points** — no filler words.

## WHAT YOU MUST RETURN:

You MUST return your response as a **single valid JSON object** with this EXACT structure:

{
  "assistantMessage": "Your conversational response to the user. Be helpful, encouraging, and specific. Ask follow-up questions here.",
  "resumeData": {
    "basics": {
      "fullName": "",
      "email": "",
      "phone": "",
      "location": "",
      "linkedin": "",
      "github": "",
      "portfolio": "",
      "targetRole": "",
      "headline": "",
      "summary": ""
    },
    "skills": {
      "languages": [],
      "frameworks": [],
      "tools": [],
      "databases": [],
      "cloud": [],
      "other": []
    },
    "experience": [
      {
        "company": "",
        "role": "",
        "location": "",
        "startDate": "",
        "endDate": "",
        "isCurrent": false,
        "achievements": [],
        "technologies": []
      }
    ],
    "projects": [
      {
        "name": "",
        "role": "",
        "startDate": "",
        "endDate": "",
        "description": "",
        "impact": [],
        "technologies": [],
        "links": { "github": "", "live": "", "other": "" }
      }
    ],
    "education": [
      {
        "institution": "",
        "degree": "",
        "fieldOfStudy": "",
        "startDate": "",
        "endDate": "",
        "grade": ""
      }
    ],
    "certifications": [
      {
        "name": "",
        "issuer": "",
        "issueDate": "",
        "credentialUrl": ""
      }
    ],
    "achievements": [],
    "extras": {
      "volunteer": [],
      "publications": [],
      "languagesSpoken": [],
      "interests": []
    }
  },
  "missingFields": ["field.path.here"],
  "completionScore": 0,
  "needsMoreInfo": true,
  "nextQuestion": "What specific question should the user answer next?"
}

## FIELD RULES:

- **missingFields**: List specific field paths that are empty or need improvement (e.g., "basics.summary", "experience[0].achievements", "education[0].endDate")
- **completionScore**: Integer 0-100 representing how complete the resume is for an industry-standard resume
- **needsMoreInfo**: true if any critical sections are incomplete or weak
- **nextQuestion**: The single most important question to ask the user next to improve their resume

## SCORING GUIDELINES:

- 0-20: Only basic info (name, email)
- 20-40: Some experience or education, but missing key details
- 40-60: Most sections filled, but achievements are weak or missing dates
- 60-80: Good resume, but could use stronger bullet points, more details, or missing sections
- 80-100: Industry-standard resume with strong achievements, complete dates, good summary

## IMPORTANT:

- Return ONLY the JSON object. No markdown, no code fences, no explanation outside the JSON.
- Preserve ALL existing data from the current draft. Only ADD or IMPROVE, never remove existing data unless explicitly asked.
- If the user provides new information, MERGE it into the existing resume data.
- Empty arrays and empty strings are acceptable for fields with no data yet.`;
    }

    /**
     * Build the user message that includes all context for the AI.
     * This combines the user's actual message with current state.
     * 
     * @param userMessage - What the user just typed
     * @param currentResume - The current draft resume data
     * @param chatHistory - Recent conversation messages
     * @param missingFields - Currently known missing fields
     */
    buildUserPrompt(
        userMessage: string,
        currentResume: ResumeData,
        chatHistory: ChatMessage[],
        missingFields: string[]
    ): string {
        // Format chat history as readable conversation
        const historyText = chatHistory
            .slice(-10) // Last 10 messages to stay within token limits
            .map((msg) => `${msg.role}: ${msg.content}`)
            .join('\n');

        return `## CURRENT RESUME DATA (preserve and merge into this):
${JSON.stringify(currentResume, null, 2)}

## KNOWN MISSING FIELDS:
${missingFields.length > 0 ? missingFields.join(', ') : 'None identified yet'}

## RECENT CONVERSATION HISTORY:
${historyText || 'No previous messages — this is the start of the conversation.'}

## USER'S NEW MESSAGE:
${userMessage}

Remember: Return ONLY valid JSON. Merge new info into existing data. Never remove existing data.`;
    }
}
