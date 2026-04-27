import { Request, Response } from 'express';
import { ATSAnalyzer } from '../services/ATSAnalyzerModule';
import { ParserFactory } from '../parsers/ParserFactory';

export class ATSController {
  constructor(
    private analyzer: ATSAnalyzer,
    private parserFactory: ParserFactory
  ) {}

  calculateFromText = async (req: Request, res: Response): Promise<void> => {
    try {
      const { resumeText, jobSkills, jobRole, experience, filters } = req.body;
      
      if (!resumeText || (!jobSkills && !jobRole)) {
        res.status(400).json({ error: 'resumeText and either jobSkills or jobRole are required' });
        return;
      }

      // Construct a job description for the AI
      const jobDescription = this.constructJD(jobRole, experience, jobSkills, filters);
      
      const result = await this.analyzer.analyzeText(resumeText, jobDescription);
      res.status(200).json(this.mapResult(result));
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
  };

  calculateFromFile = async (req: Request, res: Response): Promise<void> => {
    try {
      const file = (req as any).file;
      const { jobSkills, jobRole, experience, filters } = req.body;

      if (!file || (!jobSkills && !jobRole)) {
        res.status(400).json({ error: 'resumeFile and either jobSkills or jobRole are required' });
        return;
      }

      const parser = this.parserFactory.getParser(file.mimetype);
      const resumeText = await parser.extractText(file.buffer);

      if (!resumeText.trim()) {
        res.status(400).json({ error: 'Could not extract text from the provided file.' });
        return;
      }

      // Construct a job description for the AI
      const jobDescription = this.constructJD(jobRole, experience, jobSkills, filters);

      const result = await this.analyzer.analyzeText(resumeText, jobDescription);
      res.status(200).json(this.mapResult(result));
    } catch (err: any) {
      res.status(err.message?.includes('Unsupported') ? 415 : 500).json({
        error: err.message || 'Internal Server Error',
      });
    }
  };

  private constructJD(role: string, exp: string, skills: string, filters: string): string {
    let jd = "";
    if (role) jd += `Role: ${role}\n`;
    if (exp) jd += `Experience: ${exp}\n`;
    if (skills) jd += `Required Skills: ${skills}\n`;
    if (filters) {
      try {
        const f = JSON.parse(filters);
        const activeFilters = Object.entries(f).filter(([_, v]) => v).map(([k]) => k);
        if (activeFilters.length > 0) jd += `Work Preferences: ${activeFilters.join(', ')}\n`;
      } catch (e) {}
    }
    return jd.trim() || "Analyze this resume based on industry standards.";
  }

  private mapResult(result: any) {
    const { finalScore, basicChecks, aiAnalysis } = result;
    
    // Calculate simple keyword density for the frontend UI
    const keywordDensity: Record<string, number> = {};
    if (aiAnalysis?.matchedKeywords) {
      aiAnalysis.matchedKeywords.forEach((k: string) => {
        keywordDensity[k] = (result.resumeText.match(new RegExp(k, 'gi')) || []).length;
      });
    }

    return {
      score: finalScore,
      matchedSkills: aiAnalysis?.matchedKeywords || [],
      missingSkills: aiAnalysis?.missingKeywords || [],
      suggestions: aiAnalysis?.suggestions || [],
      keywordDensity,
      sectionScores: {
        skills: basicChecks.sections.skills ? 100 : 40,
        experience: basicChecks.sections.experience ? 100 : 40,
        education: basicChecks.sections.education ? 100 : 40,
        projects: 70 // Default placeholder as our basic checker doesn't check projects yet
      },
      aiSummary: aiAnalysis 
        ? `Analysis complete. AI Score: ${aiAnalysis.aiScore}/60, Basic Score: ${basicChecks.basicScore}/40.` 
        : "AI analysis unavailable. Showing basic rule-based score.",
      atsCompatible: finalScore >= 60,
    };
  }
}
