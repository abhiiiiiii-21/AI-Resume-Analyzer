import { TextProcessor } from './TextProcessor';
import { ATSResult } from './ATSResult';

// SRP: ATSEngine is ONLY responsible for scoring logic
// DIP: Depends on the TextProcessor abstraction injected via constructor
export class ATSEngine {
  constructor(private textProcessor: TextProcessor) {}

  calculateMatch(resumeText: string, jobSkillsInput: string): ATSResult {
    const resumeTokens = this.textProcessor.tokenizeUnique(resumeText);
    const resumeNormalized = this.textProcessor.normalize(resumeText);

    const jobSkills = jobSkillsInput
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    for (const skill of jobSkills) {
      const skillTokens = this.textProcessor.tokenize(skill);
      const isMatch =
        skillTokens.every((t) => resumeTokens.has(t)) ||
        resumeNormalized.includes(skill);
      if (isMatch) matchedSkills.push(skill);
      else missingSkills.push(skill);
    }

    const score =
      jobSkills.length === 0
        ? 0
        : Math.round((matchedSkills.length / jobSkills.length) * 100);

    // Keyword density: counts how many times each job skill appears in resume
    const keywordDensity: Record<string, number> = {};
    for (const skill of jobSkills) {
      const regex = new RegExp(skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      keywordDensity[skill] = (resumeNormalized.match(regex) || []).length;
    }

    // Section scoring heuristics based on keyword presence
    const sectionScores = this.computeSectionScores(resumeNormalized, score);
    const suggestions = this.buildSuggestions(missingSkills, score);
    const aiSummary = this.buildAiSummary(score, matchedSkills, missingSkills);
    const atsCompatible = score >= 60;

    return {
      score,
      matchedSkills,
      missingSkills,
      suggestions,
      keywordDensity,
      sectionScores,
      aiSummary,
      atsCompatible,
    };
  }

  private computeSectionScores(
    resumeText: string,
    baseScore: number
  ): ATSResult['sectionScores'] {
    const has = (word: string) => resumeText.includes(word);
    return {
      skills: Math.min(100, baseScore + (has('skill') ? 10 : 0)),
      experience: Math.min(
        100,
        (has('experience') || has('worked') || has('developed') ? 60 : 30) +
          Math.floor(baseScore * 0.4)
      ),
      education: Math.min(
        100,
        has('bachelor') || has('master') || has('degree') || has('university')
          ? 85
          : 50
      ),
      projects: Math.min(
        100,
        (has('project') || has('built') || has('created') ? 70 : 35) +
          Math.floor(baseScore * 0.2)
      ),
    };
  }

  private buildSuggestions(missingSkills: string[], score: number): string[] {
    const suggestions: string[] = [];
    if (missingSkills.length > 0) {
      suggestions.push(
        `Add the following missing keywords to your resume: ${missingSkills.slice(0, 5).join(', ')}`
      );
      missingSkills.slice(0, 3).forEach((s) => {
        suggestions.push(`Include hands-on experience or a project using "${s}"`);
      });
    }
    if (score < 50) {
      suggestions.push('Tailor your resume more closely to the job description.');
      suggestions.push('Use measurable achievements (e.g., "Improved performance by 40%").');
    }
    if (score >= 50 && score < 80) {
      suggestions.push('Consider adding certifications related to the job requirements.');
    }
    if (score >= 80) {
      suggestions.push('Great match! Highlight your top 3 projects at the top of the resume.');
    }
    return suggestions;
  }

  private buildAiSummary(
    score: number,
    matchedSkills: string[],
    missingSkills: string[]
  ): string {
    if (score >= 80) {
      return `Excellent match! Your resume aligns strongly with the job requirements and includes ${matchedSkills.length} of the required skills.`;
    }
    if (score >= 50) {
      return `Your resume is a moderate match. You cover ${matchedSkills.length} skills but are missing critical keywords: ${missingSkills.slice(0, 3).join(', ')}.`;
    }
    return `Your resume needs significant tailoring. Only ${matchedSkills.length} of ${matchedSkills.length + missingSkills.length} required skills were detected. Focus on adding: ${missingSkills.slice(0, 4).join(', ')}.`;
  }
}
