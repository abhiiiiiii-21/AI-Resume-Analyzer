"use client";

import React, { useState, useEffect } from 'react'
import FileUpload from './_components/FileUpload'
import InputText from './_components/InputText'
import { SparklesIcon, Loader2Icon } from 'lucide-react'
import { useAuth } from '@clerk/nextjs'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"

const Page = () => {
  const { getToken } = useAuth();
  
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [role, setRole] = useState("");
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingRoles, setFetchingRoles] = useState(true);
  const [resultData, setResultData] = useState<{ pdfUrl: string; enhancedText: string } | null>(null);

  // Fetch available roles from backend
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resume/roles`);
        const result = await res.json();
        if (result.success) {
          setAvailableRoles(result.data);
        }
      } catch (err) {
        console.error("Failed to fetch roles:", err);
      } finally {
        setFetchingRoles(false);
      }
    };
    fetchRoles();
  }, []);

  const handleEnhance = async () => {
    if (!file || !jobDescription || !role) {
      alert("Please provide a resume, job description, and select a role.");
      return;
    }

    setLoading(true);
    setResultData(null); // Clear previous result
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobDescription", jobDescription);
      formData.append("role", role);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resume/enhance`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await res.json();

      if (result.success) {
        setResultData(result.data);
      } else {
        alert(result.error || "Enhancement failed.");
      }
    } catch (err) {
      console.error("Enhancement error:", err);
      alert("An error occurred while enhancing your resume.");
    } finally {
      setLoading(false);
    }
  };

  const getFullPdfUrl = (url: string) => {
    if (!url) return "#";
    // Map /uploads/xxx to http://localhost:5001/uploads/xxx
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5001";
    return `${baseUrl}${url}`;
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-widest text-muted-foreground mb-4">
            <span className="size-1.5 rounded-full inline-block" style={{ background: '#1C4ED6', opacity: 0.4 }} />
            AI Resume Enhancer
            <span className="size-1.5 rounded-full inline-block" style={{ background: '#1C4ED6', opacity: 0.4 }} />
          </div>
          <h1 className="text-[28px] font-medium tracking-tight text-foreground leading-snug mb-3">
            Tailor your resume for any{' '}
            <span style={{ color: '#1C4ED6' }}>role</span>
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Upload your resume and paste the job description. The AI will align your experience to the role and generate an optimized PDF.
          </p>
        </div>

        {/* Success View */}
        {resultData && (
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-card border border-[#1C4ED6]/30 rounded-xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 bg-[#1C4ED6]/5 border-b border-[#1C4ED6]/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className="size-6 rounded-full bg-[#1C4ED6] flex items-center justify-center">
                      <SparklesIcon className="size-3.5 text-white" />
                   </div>
                   <h2 className="text-sm font-medium">Resume Enhanced Successfully!</h2>
                </div>
                <a 
                  href={getFullPdfUrl(resultData.pdfUrl)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 h-9 rounded-md text-sm font-medium text-white transition-transform hover:scale-105"
                  style={{ background: '#1C4ED6' }}
                >
                   Download Optimized PDF
                </a>
              </div>
              <div className="p-6">
                <p className="text-[11px] font-medium uppercase tracking-widest mb-4 opacity-70">
                  AI-Generated Content Preview
                </p>
                <div className="bg-muted/30 rounded-lg p-5 border border-border/40 max-h-[400px] overflow-y-auto text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap font-serif italic">
                  {(() => {
                    try {
                      const parsed = JSON.parse(resultData.enhancedText);
                      return parsed.summary || resultData.enhancedText;
                    } catch (e) {
                      return resultData.enhancedText;
                    }
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className={`bg-card border border-border/60 rounded-xl overflow-hidden transition-opacity duration-300 ${loading ? 'opacity-70' : ''}`}>

          {/* Card Header */}
          <div className="px-6 py-4 border-b border-border/60 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {[
                { n: '1', label: 'Resume' },
                { n: '2', label: 'Job details' },
                { n: '3', label: 'Enhance' },
              ].map((step, i) => (
                <React.Fragment key={step.n}>
                  {i > 0 && <span className="text-border">→</span>}
                  <span className="flex items-center gap-1.5">
                    <span
                      className="size-5 rounded-full border flex items-center justify-center text-[11px] font-medium"
                      style={{ borderColor: '#1C4ED6', color: '#1C4ED6' }}
                    >
                      {step.n}
                    </span>
                    {step.label}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Role Selection */}
          <div className="px-6 pt-6 pb-2">
             <p className="text-[11px] font-medium uppercase tracking-widest mb-2" style={{ color: '#1C4ED6' }}>
                Select Target Role
              </p>
              <Select value={role} onValueChange={setRole} disabled={fetchingRoles || loading}>
                <SelectTrigger className="w-full border-border/60 text-sm">
                  <SelectValue placeholder={fetchingRoles ? "Loading roles..." : "Choose a role"} />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
          </div>

          {/* Two Column Body */}
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-6 md:border-r border-b md:border-b-0 border-border/60">
              <p className="text-[11px] font-medium uppercase tracking-widest mb-4" style={{ color: '#1C4ED6' }}>
                Your resume
              </p>
              <FileUpload onFileChange={setFile} />
            </div>
            <div className="p-6">
              <p className="text-[11px] font-medium uppercase tracking-widest mb-4" style={{ color: '#1C4ED6' }}>
                Job description
              </p>
              <InputText value={jobDescription} onChange={setJobDescription} />
            </div>
          </div>

          {/* Card Footer */}
          <div className="px-6 py-4 border-t border-border/60 flex items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="shrink-0">
                <circle cx="8" cy="8" r="6"/><path d="M8 7v4M8 5.5v.5"/>
              </svg>
              Files are processed securely and not stored.
            </p>

            <button
              onClick={handleEnhance}
              disabled={loading || !file || !jobDescription || !role}
              className="group inline-flex items-center gap-2 px-4 h-9 rounded-md text-[13px] font-medium text-white cursor-pointer border-none transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: '#1C4ED6' }}
            >
              {loading ? (
                <Loader2Icon className="size-3.5 animate-spin" />
              ) : (
                <SparklesIcon className="size-3.5" />
              )}
              <span className="leading-tight">
                {loading ? "Enhancing..." : "Enhance resume"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page