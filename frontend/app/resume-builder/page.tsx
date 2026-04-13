"use client";

import React, { useState, useEffect } from "react";
import ResumeForm from "@/components/ResumeForm";
import ResumePreview from "@/components/ResumePreview";
import { Resume } from "@/types/resume";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2, FileText, Layout, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";

const initialData: Resume = {
  id: "1",
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    portfolio: "",
    linkedin: "",
    github: "",
    twitter: "",
    leetcode: "",
    codeforces: "",
  },
  careerDetails: {
    objective: "",
  },
  experience: [],
  education: [],
  projects: [],
  certifications: [],
};

export default function ResumeBuilderPage() {
  const [resumeData, setResumeData] = useState<Resume>(initialData);
  const [themeTemplate, setThemeTemplate] = useState("default");
  const [isSaving, setIsSaving] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch logic for the theme toggle
  useEffect(() => setMounted(true), []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/resume/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resumeData),
      });
      const result = await response.json();
      if (result.success) {
        alert("Resume saved successfully!");
      } else {
        alert("Failed to save resume: " + result.message);
      }
    } catch (error) {
      alert("Error saving resume");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-neutral-900 dark:text-white font-inter relative overflow-hidden transition-colors duration-300">

      {/* Headers */}

      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800/60 bg-white/60 dark:bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#1C4ED6] flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white font-manrope">
              Resumind
            </h1>
          </div>

          {/* Center Navigation (Tabs) */}
          <div className="hidden md:flex items-center justify-center flex-1 mx-8 font-manrope">
            <Tabs value={themeTemplate} onValueChange={setThemeTemplate} className="w-auto">
              <TabsList className="bg-neutral-100 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-full h-10 p-1">
                <TabsTrigger value="default" className="rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:text-neutral-900 dark:data-[state=active]:text-white text-neutral-500 dark:text-neutral-400 font-medium shadow-sm data-[state=inactive]:shadow-none">Default</TabsTrigger>
                <TabsTrigger value="modern" className="rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:text-neutral-900 dark:data-[state=active]:text-white text-neutral-500 dark:text-neutral-400 font-medium shadow-sm data-[state=inactive]:shadow-none">Modern</TabsTrigger>
                <TabsTrigger value="professional" className="rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:text-neutral-900 dark:data-[state=active]:text-white text-neutral-500 dark:text-neutral-400 font-medium shadow-sm data-[state=inactive]:shadow-none">Professional</TabsTrigger>
                <TabsTrigger value="compact" className="rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:text-neutral-900 dark:data-[state=active]:text-white text-neutral-500 dark:text-neutral-400 font-medium shadow-sm data-[state=inactive]:shadow-none">Compact</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 font-manrope">

            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="hidden md:flex bg-[#1C4ED6] hover:bg-blue-700 text-white shadow-[0_4px_14px_0_rgba(28,78,214,0.39)] hover:shadow-[0_6px_20px_rgba(28,78,214,0.23)] dark:shadow-[0_0_20px_-5px_rgba(37,99,235,0.4)] rounded-lg px-6 font-semibold"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Save
            </Button>
            <Link href="/">
              <Button className="border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-full px-5 h-9 bg-white dark:bg-transparent font-medium shadow-sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Ditch
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left Side - Form Container */}
          <div className="w-full lg:w-[45%] xl:w-[40%] rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#050505] relative overflow-hidden transition-colors duration-300">
            {/* Subtle inner top highlight */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neutral-200 dark:via-neutral-600/30 to-transparent" />

            <div className="p-4 border-b border-neutral-100 dark:border-neutral-800/60 bg-neutral-50 dark:bg-neutral-900/20">
              <h2 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 font-manrope flex items-center gap-2">
                <Layout className="w-4 h-4 text-[#1C4ED6] dark:text-blue-500" /> Resume Profile Data
              </h2>
            </div>
            <ScrollArea className="h-[calc(100vh-220px)] p-6">
              <ResumeForm data={resumeData} onChange={setResumeData} />
            </ScrollArea>
          </div>

          {/* Right Side - Live Preview */}
          <div className="w-full lg:w-[55%] xl:w-[60%] sticky top-[100px]">
            <ResumePreview data={resumeData} theme={themeTemplate} />
          </div>
        </div>
      </div>
    </div>
  );
}
