"use client";

import React, { useState } from 'react';
import ScoreCard from '../../components/ats/ScoreCard';
import SkillsList from '../../components/ats/SkillsList';
import SuggestionsList from '../../components/ats/SuggestionsList';

export default function ATSDashboard() {
  const [resumeText, setResumeText] = useState("");
  const [jobSkills, setJobSkills] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("http://localhost:5000/api/ats/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobSkills })
      });

      if (!response.ok) {
        throw new Error("Failed to calculate ATS score from Backend API");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.warn("Backend API not reachable. Using fallback calculation for preview.", err);
      // Fallback calculation logic for demonstration when backend isn't actively running
      const skillsArray = jobSkills.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
      const resumeLower = resumeText.toLowerCase().replace(/[^a-z0-9+#\s]/g, " ");
      const matched = [];
      const missing = [];
      
      skillsArray.forEach(sk => {
        if (resumeLower.includes(sk)) matched.push(sk);
        else missing.push(sk);
      });
      
      setResult({
        score: skillsArray.length ? Math.round((matched.length / skillsArray.length) * 100) : 0,
        matchedSkills: matched,
        missingSkills: missing,
        suggestions: missing.length > 0 
          ? [`Consider adding the following skills to your resume: ${missing.join(', ')}`, "Try to tailor your resume more closely to the job description."]
          : ["Great match! Your resume highlights the key skills required for this job."]
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            ATS Score <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Dashboard</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Analyze your resume against job requirements to see your match score.
          </p>
        </div>

        <div className="bg-white px-8 py-10 rounded-2xl shadow-sm border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="resumeText" className="block text-sm font-semibold text-gray-700 mb-2">
                  Resume Content
                </label>
                <textarea
                  id="resumeText"
                  name="resumeText"
                  rows={6}
                  required
                  className="w-full rounded-xl border border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base p-4 transition-colors resize-none"
                  placeholder="Paste your resume text here (e.g. I know React, Node, JavaScript)..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="jobSkills" className="block text-sm font-semibold text-gray-700 mb-2">
                  Required Job Skills
                </label>
                <textarea
                  id="jobSkills"
                  name="jobSkills"
                  rows={6}
                  required
                  className="w-full rounded-xl border border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base p-4 transition-colors resize-none"
                  placeholder="Enter required skills, comma separated (e.g. react, node, aws)..."
                  value={jobSkills}
                  onChange={(e) => setJobSkills(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-75 disabled:cursor-not-allowed transition-all"
              >
                {loading ? 'Evaluating Match...' : 'Calculate ATS Score'}
              </button>
            </div>
            
            {error && (
              <p className="text-red-500 text-sm font-medium">{error}</p>
            )}
          </form>
        </div>

        {result && (
          <div className="animate-in slide-in-from-bottom-8 duration-700 ease-out">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              <div className="md:col-span-1">
                <ScoreCard score={result.score} />
              </div>
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <SkillsList title="Matched Skills" skills={result.matchedSkills} type="matched" />
                <SkillsList title="Missing Skills" skills={result.missingSkills} type="missing" />
              </div>
              <SuggestionsList suggestions={result.suggestions} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
