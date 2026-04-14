"use client";

import React, { useState, useRef } from 'react';
import ScoreCard from '../../components/ats/ScoreCard';
import SkillsList from '../../components/ats/SkillsList';
import SuggestionsList from '../../components/ats/SuggestionsList';

export default function ATSDashboard() {
  const [inputType, setInputType] = useState('file');
  const [resumeText, setResumeText] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [jobSkills, setJobSkills] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file) => {
    const validTypes = [
      'application/pdf', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    if (validTypes.includes(file.type)) {
      setResumeFile(file);
      setError(null);
    } else {
      setError("Unsupported format. Please upload PDF or DOCX.");
      setResumeFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let response;
      if (inputType === 'file' && resumeFile) {
        const formData = new FormData();
        formData.append('resumeFile', resumeFile);
        formData.append('jobSkills', jobSkills);

        response = await fetch("http://localhost:5001/api/ats/calculate-file", {
          method: "POST",
          body: formData
        });
      } else {
        response = await fetch("http://localhost:5001/api/ats/calculate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeText, jobSkills })
        });
      }

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to calculate ATS score");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || "An error occurred while calculating the ATS score.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 selection:bg-blue-500/30 py-16 px-4 sm:px-6 lg:px-8 font-sans overflow-x-hidden relative">
      
      {/* Light dot pattern background to match theme */}
      <div className="absolute inset-0 z-0 opacity-[0.35] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#94A3B8 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        
        <div className="text-center space-y-5">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-2 transition-all hover:bg-blue-100 shadow-sm">
            <span className="text-xs font-bold text-white bg-blue-600 px-2 py-0.5 rounded-full mr-2">NEW</span>
            <span className="text-sm font-medium text-blue-600 cursor-default">Intelligent ATS Scanner &rsaquo;</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
            Build Smarter Resumes.<br/>
            Get Hired Faster <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">with AI</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg text-slate-500 font-normal leading-relaxed">
            Create, optimize, and analyze your resume with AI-powered tools from ATS scoring to role-based enhancements, all in one place.
          </p>
        </div>

        <div className="bg-white border border-slate-200 px-8 py-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
          
          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            
            <div className="flex justify-center mb-8">
              <div className="bg-slate-100/80 p-1.5 rounded-full inline-flex border border-slate-200 shadow-inner">
                <button 
                  type="button" 
                  onClick={() => setInputType('file')}
                  className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${inputType === 'file' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Upload File
                </button>
                <button 
                  type="button" 
                  onClick={() => setInputType('text')}
                  className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${inputType === 'text' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Paste Text
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              <div className="flex flex-col group">
                <label className="text-sm font-bold text-slate-800 mb-3 flex items-center">
                  <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-md flex items-center justify-center mr-2 text-xs">1</span> 
                  Submit Resume
                </label>
                
                {inputType === 'file' ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl transition-all duration-300 h-[280px] bg-slate-50 relative
                      ${isDragging ? 'border-blue-500 bg-blue-50 scale-[1.02]' : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50/50'}
                      ${resumeFile ? 'border-emerald-400 bg-emerald-50' : ''}`}
                  >
                    {!resumeFile ? (
                      <div className="text-center transform transition-transform group-hover:-translate-y-1">
                        <div className="w-16 h-16 bg-white border border-slate-200 shadow-sm rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 group-hover:text-blue-500 transition-colors">
                          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                        </div>
                        <p className="text-sm text-slate-800 font-semibold mb-1">Drag & drop your resume</p>
                        <p className="text-xs text-slate-500 mb-4">PDF or DOCX documents up to 5MB</p>
                        <label className="cursor-pointer bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 transition-all">
                          Browse Computer
                          <input type="file" className="sr-only" accept=".pdf,.doc,.docx" onChange={handleFileChange} ref={fileInputRef} />
                        </label>
                      </div>
                    ) : (
                      <div className="text-center w-full animate-in zoom-in-95 duration-300">
                        <div className="w-20 h-20 bg-emerald-100 border border-emerald-200 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600 relative shadow-sm">
                          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          <button type="button" onClick={() => setResumeFile(null)} className="absolute -top-2 -right-2 bg-white border border-slate-200 shadow-sm text-slate-400 hover:text-red-500 rounded-full p-1.5 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                        <p className="text-base font-bold text-slate-800 truncate px-4 max-w-full">{resumeFile.name}</p>
                        <p className="text-xs text-emerald-600 font-medium mt-2">Ready to scan</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <textarea
                    required={inputType === 'text'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 text-slate-700 shadow-inner focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all font-mono text-sm resize-none h-[280px] custom-scrollbar"
                    placeholder="const resume = {&#10;  skills: ['React', 'Node.js', 'TypeScript'],&#10;  experience: '5 years'&#10;};&#10;&#10;// Paste raw resume text here..."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                  />
                )}
              </div>

              <div className="flex flex-col group">
                <label className="text-sm font-bold text-slate-800 mb-3 flex items-center">
                  <span className="bg-indigo-100 text-indigo-700 w-6 h-6 rounded-md flex items-center justify-center mr-2 text-xs">2</span> 
                  Job Description Targets
                </label>
                <textarea
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 text-slate-700 shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all font-mono text-sm resize-none h-[280px] custom-scrollbar leading-relaxed"
                  placeholder="Enter required keywords (comma separated)&#10;&#10;E.g. react, typescript, tailwindcss, aws, python, sql, agile"
                  value={jobSkills}
                  onChange={(e) => setJobSkills(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-4 flex justify-center">
              <button
                type="submit"
                disabled={loading || (inputType === 'file' && !resumeFile)}
                className="w-48 flex justify-center items-center py-4 px-8 rounded-full text-base font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:grayscale transition-all duration-300 shadow-[0_8px_20px_rgba(37,99,235,0.3)] shadow-blue-500/30 group relative"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Scanning...
                  </span>
                ) : (
                  <>
                    <span className="mr-2">Get Started</span>
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 19L19 5M19 5v10M19 5H9" /></svg>
                  </>
                )}
              </button>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-start animate-in slide-in-from-top-2">
                <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="text-red-700 text-sm font-semibold">{error}</p>
              </div>
            )}
          </form>
        </div>

        {result && (
          <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000 ease-out pb-20">
            <h2 className="text-2xl font-black text-slate-800 mb-8 flex items-center">
              Scan Results
              <span className="ml-4 w-12 h-1 bg-blue-600 rounded-full inline-block"></span>
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4">
                <ScoreCard score={result.score} />
              </div>
              <div className="lg:col-span-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <SkillsList title="Verified Hits" skills={result.matchedSkills} type="matched" />
                  <SkillsList title="Missing Keywords" skills={result.missingSkills} type="missing" />
                </div>
                <SuggestionsList suggestions={result.suggestions} />
              </div>
            </div>
          </div>
        )}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94A3B8; }
      `}} />
    </div>
  );
}
