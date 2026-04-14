class ATSEngine {
  extractText(text) {
    if (!text) return "";
    return text.toLowerCase().replace(/[^a-z0-9+#\s]/g, " ");
  }

  extractSkills(text) {
    if (!text) return [];
    // Basic word extraction for skills
    const words = this.extractText(text).split(/\s+/);
    return [...new Set(words)]; // returning unique words
  }

  calculateMatch(resumeSkillsText, jobSkillsInput) {
    const resumeSkillsAll = this.extractSkills(resumeSkillsText);
    const resumeTextLower = this.extractText(resumeSkillsText);
    
    // Process job skills input (comma separated string)
    const jobSkillsList = typeof jobSkillsInput === 'string'
        ? jobSkillsInput.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
        : Array.isArray(jobSkillsInput) ? jobSkillsInput.map(s => s.toLowerCase().trim()).filter(Boolean) : [];

    let matchedSkills = [];
    let missingSkills = [];

    jobSkillsList.forEach(requiredSkill => {
      // Check if resume contains the required skill as an exact word or a substring
      if (resumeSkillsAll.includes(requiredSkill) || resumeTextLower.includes(requiredSkill)) {
         matchedSkills.push(requiredSkill);
      } else {
         missingSkills.push(requiredSkill);
      }
    });

    const score = jobSkillsList.length === 0 ? 0 : Math.round((matchedSkills.length / jobSkillsList.length) * 100);

    let suggestions = [];
    if (missingSkills.length > 0) {
      suggestions.push(`Consider adding the following skills to your resume: ${missingSkills.join(', ')}`);
    } else {
      suggestions.push("Great match! Your resume highlights the key skills required for this job.");
    }
    
    if (score < 50) {
      suggestions.push("Try to tailor your resume more closely to the job description.");
    }

    return {
      score,
      matchedSkills,
      missingSkills,
      suggestions
    };
  }
}

module.exports = ATSEngine;
