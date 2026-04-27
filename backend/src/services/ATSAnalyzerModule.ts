import fs from 'fs/promises';
const pdf = require('pdf-parse');

import Groq from 'groq-sdk';

/**
 * --- INTERFACES ---
 */

/**
 * Result of basic rule-based checks
 */
export interface BasicCheckResult {
  email: boolean;
  phone: boolean;
  linkedin: boolean;
  sections: {
    experience: boolean;
    education: boolean;
    skills: boolean;
    summary: boolean;
  };
  wordCount: number;
  readingLength: "short" | "medium" | "long";
  basicScore: number;
}

/**
 * Result of AI-driven analysis using Groq
 */
export interface AIAnalysisResult {
  aiScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  sectionFeedback: {
    experience: string;
    education: string;
    skills: string;
    summary: string;
  };
  suggestions: string[];
}

/**
 * Final consolidated ATS analysis result
 */
export interface ATSResult {
  finalScore: number;
  basicChecks: BasicCheckResult;
  aiAnalysis: AIAnalysisResult | null;
  resumeText: string;
}

/**
 * --- CUSTOM ERRORS ---
 */

/**
 * Error thrown during PDF text extraction
 */
export class PDFExtractionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PDFExtractionError";
  }
}

/**
 * Error thrown during Groq API interaction
 */
export class GroqAPIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GroqAPIError";
  }
}

/**
 * --- CLASSES ---
 */

/**
 * Handles extraction of raw text from PDF files
 */
export class PDFExtractor {
  /**
   * Extracts clean text from a PDF file
   * @param filePath Path to the PDF file
   * @throws PDFExtractionError if file is missing, corrupt, or text is empty
   */
  async extractText(filePath: string): Promise<string> {
    try {
      const dataBuffer = await fs.readFile(filePath);
      const { PDFParse } = pdf;
      const parser = new PDFParse({ data: dataBuffer });
      const result = await parser.getText();
      
      const cleanText = result.text.trim();
      if (!cleanText) {
        throw new PDFExtractionError("Empty extracted text from PDF");
      }
      
      // Optional: Clean up resources if necessary (destroy() might not exist in all versions but search suggests it)
      if (typeof parser.destroy === 'function') {
        await parser.destroy();
      }
      
      return cleanText;
    } catch (error) {
      if (error instanceof PDFExtractionError) throw error;
      throw new PDFExtractionError(`Failed to extract PDF text: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

/**
 * Performs synchronous, rule-based checks on resume text
 */
export class BasicChecker {
  /**
   * Runs basic checks for contact info and standard sections
   * @param resumeText Raw text content of the resume
   */
  runChecks(resumeText: string): BasicCheckResult {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const phoneRegex = /(\+?\d[\d\s\-().]{7,}\d)/;
    const linkedinRegex = /linkedin\.com\/in\//i;

    const hasEmail = emailRegex.test(resumeText);
    const hasPhone = phoneRegex.test(resumeText);
    const hasLinkedin = linkedinRegex.test(resumeText);

    const sections = {
      experience: /experience/i.test(resumeText),
      education: /education/i.test(resumeText),
      skills: /skills/i.test(resumeText),
      summary: /summary/i.test(resumeText)
    };

    const wordCount = resumeText.split(/\s+/).filter(Boolean).length;
    let readingLength: "short" | "medium" | "long" = "long";
    if (wordCount < 300) readingLength = "short";
    else if (wordCount < 700) readingLength = "medium";

    // Scoring: email (+8), phone (+8), linkedin (+4), sections (+5 each, max +20)
    let basicScore = 0;
    if (hasEmail) basicScore += 8;
    if (hasPhone) basicScore += 8;
    if (hasLinkedin) basicScore += 4;
    
    if (sections.experience) basicScore += 5;
    if (sections.education) basicScore += 5;
    if (sections.skills) basicScore += 5;
    if (sections.summary) basicScore += 5;

    return {
      email: hasEmail,
      phone: hasPhone,
      linkedin: hasLinkedin,
      sections,
      wordCount,
      readingLength,
      basicScore
    };
  }
}

/**
 * Uses Groq AI to score resume against a job description
 */
export class GroqScorer {
  private client: Groq;

  constructor(apiKey: string) {
    this.client = new Groq({ apiKey });
  }

  /**
   * Scores resume content against a job description using LLM
   * @param resumeText Raw resume text
   * @param jobDescription Target job description
   * @throws GroqAPIError if API call or parsing fails
   */
  async score(resumeText: string, jobDescription: string): Promise<AIAnalysisResult> {
    try {
      const response = await this.client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        temperature: 0,
        max_tokens: 1000,
        messages: [
          {
            role: "system",
            content: "You are an ATS scoring engine. Always respond with valid JSON only. No explanation, no markdown, no code blocks."
          },
          {
            role: "user",
            content: `Score this resume against the job description.
                     Resume: ${resumeText}
                     Job Description: ${jobDescription}
                     
                     Return ONLY this JSON:
                     {
                       "aiScore": <int 0-60>,
                       "matchedKeywords": [...],
                       "missingKeywords": [...],
                       "sectionFeedback": {
                         "experience": "<feedback>",
                         "education": "<feedback>",
                         "skills": "<feedback>",
                         "summary": "<feedback>"
                       },
                       "suggestions": [<max 5 short actionable points>]
                     }`
          }
        ]
      });

      const content = response.choices[0]?.message?.content || "";
      const cleanedJson = content.replace(/```json|```/g, "").trim();
      
      try {
        return JSON.parse(cleanedJson) as AIAnalysisResult;
      } catch (parseError) {
        throw new GroqAPIError("Failed to parse AI response as JSON");
      }
    } catch (error) {
      if (error instanceof GroqAPIError) throw error;
      throw new GroqAPIError(`Groq API call failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

/**
 * Main orchestrator for ATS analysis
 */
export class ATSAnalyzer {
  private pdfExtractor = new PDFExtractor();
  private basicChecker = new BasicChecker();
  private groqScorer: GroqScorer;

  constructor(apiKey: string) {
    this.groqScorer = new GroqScorer(apiKey);
  }

  /**
   * Analyzes a resume PDF against an optional job description
   * @param filePath Path to the resume PDF
   * @param jobDescription Optional job description for AI scoring
   */
  async analyze(filePath: string, jobDescription?: string): Promise<ATSResult> {
    // Step 1: Extract text (let PDFExtractionError bubble up)
    const resumeText = await this.pdfExtractor.extractText(filePath);

    // Step 2: Run basic checks (always runs)
    const basicChecks = this.basicChecker.runChecks(resumeText);

    let aiAnalysis: AIAnalysisResult | null = null;

    // Step 3: Run AI analysis if job description provided
    if (jobDescription) {
      try {
        aiAnalysis = await this.groqScorer.score(resumeText, jobDescription);
      } catch (error) {
        // Log error but continue with null aiAnalysis as per requirements
        console.error("Groq scoring failed:", error);
        aiAnalysis = null;
      }
    }

    // Step 4: Calculate final score
    const finalScore = basicChecks.basicScore + (aiAnalysis?.aiScore ?? 0);

    // Step 5: Return result
    return {
      finalScore,
      basicChecks,
      aiAnalysis,
      resumeText
    };
  }

  /**
   * Analyzes raw resume text against an optional job description
   * @param resumeText Raw resume text
   * @param jobDescription Optional job description for AI scoring
   */
  async analyzeText(resumeText: string, jobDescription?: string): Promise<ATSResult> {
    const basicChecks = this.basicChecker.runChecks(resumeText);
    let aiAnalysis: AIAnalysisResult | null = null;

    if (jobDescription) {
      try {
        aiAnalysis = await this.groqScorer.score(resumeText, jobDescription);
      } catch (error) {
        console.error("Groq scoring failed:", error);
        aiAnalysis = null;
      }
    }

    const finalScore = basicChecks.basicScore + (aiAnalysis?.aiScore ?? 0);

    return {
      finalScore,
      basicChecks,
      aiAnalysis,
      resumeText
    };
  }
}
