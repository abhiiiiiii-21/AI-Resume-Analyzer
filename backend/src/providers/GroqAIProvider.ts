import Groq from "groq-sdk";
import dotenv from "dotenv";
import { IAIProvider } from "../interfaces/IAIProvider";
dotenv.config();

const client = new Groq({ apiKey: process.env.GROQ_API_KEY! });

/**
 * SOLID — S (Single Responsibility): Only job is calling Groq AI and returning text.
 * SOLID — D (Dependency Inversion): Implements IAIProvider interface.
 *
 * OOP — Encapsulation: All Groq-specific details (model name, prompt structure,
 *                      temperature) are hidden inside this class.
 *                      The rest of the app has no idea we are using Groq.
 *
 * To switch to OpenAI: create OpenAIProvider that implements IAIProvider.
 * Nothing else changes.
 */


export class AIProvider implements IAIProvider {
    async enhance(resumeText: string, jobDescription: string): Promise<any> {
        const response = await client.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                {
                    role: "system",
                    content: `You are an expert resume parser and enhancer.
                    Your goal is to extract information from a raw resume text and enhance it to match a specific job description.
                    
                    STRICT RULES:
                    1. Return ONLY valid JSON.
                    2. Do not change the structure of the JSON.
                    3. Do not add explanations or markdown.
                    4. Enhance the wording of summaries, bullet points, and details to be more impactful and keyword-rich for the target role.
                    5. Keep all original facts (dates, companies, degrees) exactly as they are.
                    
                    SCHEMA:
                    {
                        "name": "string",
                        "email": "string",
                        "phone": "string",
                        "links": ["string"],
                        "summary": "string (enhanced professional summary)",
                        "education": [{ "institution": "string", "degree": "string", "dates": "string", "location": "string", "details": ["string"] }],
                        "experience": [{ "company": "string", "role": "string", "dates": "string", "location": "string", "bullets": ["enhanced bullet 1", "enhanced bullet 2"] }],
                        "projects": [{ "title": "string", "dates": "string", "bullets": ["enhanced bullet 1"] }],
                        "skills": [{ "category": "string", "items": ["string"] }],
                        "extraCurricular": ["string"]
                    }`,
                },
                {
                    role: "user",
                    content: `JOB DESCRIPTION:\n${jobDescription}\n\nRAW RESUME TEXT:\n${resumeText}`,
                },
            ],
            temperature: 0.2, // Lower temperature for more stable JSON
            response_format: { type: "json_object" }
        });

        const result = response.choices[0]?.message?.content;
        if (!result) throw new Error("AI returned empty response");

        try {
            return JSON.parse(result);
        } catch (e) {
            console.error("Failed to parse AI JSON response:", result);
            throw new Error("AI response was not valid JSON");
        }
    }
}