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
    async enhance(resumeText: string, jobDescription: string): Promise<string> {
        const response = await client.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                {
                    role: "system",
                    content: `You are an expert resume coach. 
                    Rewrite the resume to match the job description as closely as possible.
                    Focus on: matching keywords, highlighting relevant skills, and quantifying achievements.
                    Return ONLY the enhanced resume text. No explanations, no extra commentary.`,
                },
                {
                    role: "user",
                    content: `JOB DESCRIPTION:\n${jobDescription}\n\nRESUME:\n${resumeText}`,
                },
            ],
            temperature: 0.7,
            max_tokens: 2048,
        });

        const result = response.choices[0]?.message?.content;
        if (!result) throw new Error("AI returned empty response");
        return result;
    }
}