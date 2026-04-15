export interface ATSResult {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  suggestions: string[];
  keywordDensity: Record<string, number>;
  sectionScores: {
    skills: number;
    experience: number;
    education: number;
    projects: number;
  };
  aiSummary: string;
  atsCompatible: boolean;
}
