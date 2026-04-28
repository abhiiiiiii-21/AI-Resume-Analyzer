"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ResumeForm from "@/components/ResumeForm";
import ResumePreview from "@/components/ResumePreview";
import { Resume } from "@/types/resume";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/Buttons/button";
import { ArrowLeft, Save, Loader2, FileText, Layout, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useUser, useAuth } from "@clerk/nextjs";

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
  careerDetails: { objective: "" },
  experience: [],
  education: [],
  projects: [],
  certifications: [],
};

export default function ResumeBuilderPage() {
  const { isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const draftId = searchParams.get("draft");

  const [resumeData, setResumeData] = useState<Resume>(initialData);
  const [themeTemplate, setThemeTemplate] = useState("default");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingDraft, setIsLoadingDraft] = useState(false);
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(draftId);

  // Track last saved state to detect changes
  const lastSavedRef = useRef<string>("");

  // ── Load existing draft from URL param ────────────────────────────────────
  useEffect(() => {
    if (!draftId || !isLoaded || !isSignedIn) return;

    const loadDraft = async () => {
      setIsLoadingDraft(true);
      try {
        const token = await getToken();
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5005/api";
        const res = await fetch(`${baseUrl}/resume-builder/${draftId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json.success && json.data) {
          const saved = json.data;
          setResumeData(saved.data as Resume);
          setThemeTemplate(saved.theme || "default");
          setCurrentDraftId(saved.id);
          lastSavedRef.current = JSON.stringify(saved.data);
          toast.success(`Draft "${saved.title}" loaded`);
        } else {
          toast.error("Draft not found");
        }
      } catch {
        toast.error("Failed to load draft");
      } finally {
        setIsLoadingDraft(false);
      }
    };

    loadDraft();
  }, [draftId, isLoaded, isSignedIn]);

  // ── Save (Canva-style: update existing or create new) ─────────────────────
  const handleSave = useCallback(async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      const token = await getToken();
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5005/api";
      const payload = {
        ...resumeData,
        theme: themeTemplate,
        // Pass the current draft ID so the API can update instead of creating
        ...(currentDraftId && currentDraftId !== "1" ? { id: currentDraftId } : {}),
      };

      const res = await fetch(`${baseUrl}/resume-builder/save`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (result.success) {
        lastSavedRef.current = JSON.stringify(resumeData);

        // If this was a new draft, update the URL to include the new ID
        if (!currentDraftId || currentDraftId === "1") {
          setCurrentDraftId(result.id);
          router.replace(`/resume-builder?draft=${result.id}`, { scroll: false });
        }

        toast.success(currentDraftId && currentDraftId !== "1" ? "Draft updated ✓" : "Draft saved ✓");
      } else {
        toast.error(result.message || "Failed to save");
      }
    } catch {
      toast.error("Error saving draft — check your connection");
    } finally {
      setIsSaving(false);
    }
  }, [resumeData, themeTemplate, currentDraftId, isSaving, router]);

  // ── Keyboard shortcut: Ctrl/Cmd+S ─────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleSave]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-neutral-900 dark:text-white font-inter relative overflow-hidden transition-colors duration-300">

      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800/60 bg-white/60 dark:bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#1C4ED6] flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white font-manrope">
              Resumind
            </h1>
            {currentDraftId && currentDraftId !== "1" && (
              <span className="text-[10px] font-bold text-[#1C4ED6] bg-blue-50 px-2 py-0.5 rounded-full font-manrope ml-1">
                DRAFT SAVED
              </span>
            )}
          </div>

          {/* Theme Tabs */}
          <div className="hidden md:flex items-center justify-center flex-1 mx-8 font-manrope">
            <Tabs value={themeTemplate} onValueChange={setThemeTemplate} className="w-auto">
              <TabsList className="bg-neutral-100 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-full h-10 p-1">
                {["default", "modern", "professional", "compact"].map((t) => (
                  <TabsTrigger
                    key={t}
                    value={t}
                    className="rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:text-neutral-900 dark:data-[state=active]:text-white text-neutral-500 dark:text-neutral-400 font-medium shadow-sm data-[state=inactive]:shadow-none capitalize"
                  >
                    {t}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 font-manrope">
            <Button
              onClick={handleSave}
              disabled={isSaving || isLoadingDraft}
              className="hidden md:flex bg-[#1C4ED6] hover:bg-blue-700 text-white shadow-[0_4px_14px_0_rgba(28,78,214,0.39)] hover:shadow-[0_6px_20px_rgba(28,78,214,0.23)] rounded-lg px-6 font-semibold"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isSaving ? "Saving…" : currentDraftId && currentDraftId !== "1" ? "Update" : "Save"}
            </Button>

            <Link href="/dashboard">
              <Button className="border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-full px-5 h-9 bg-white dark:bg-transparent font-medium shadow-sm flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Button>
            </Link>

            <Link href="/">
              <Button className="border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-full px-5 h-9 bg-white dark:bg-transparent font-medium shadow-sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Exit
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Loading overlay when pulling in a draft */}
      {isLoadingDraft && (
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-3 text-neutral-500">
            <Loader2 className="w-5 h-5 animate-spin text-[#1C4ED6]" />
            <span className="text-sm font-medium font-manrope">Loading your draft…</span>
          </div>
        </div>
      )}

      {!isLoadingDraft && (
        <div className="max-w-[1600px] mx-auto px-4 py-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Form */}
            <div className="w-full lg:w-[45%] xl:w-[40%] rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#050505] relative overflow-hidden transition-colors duration-300">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neutral-200 dark:via-neutral-600/30 to-transparent" />
              <div className="p-4 border-b border-neutral-100 dark:border-neutral-800/60 bg-neutral-50 dark:bg-neutral-900/20">
                <h2 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 font-manrope flex items-center gap-2">
                  <Layout className="w-4 h-4 text-[#1C4ED6] dark:text-blue-500" />
                  Resume Profile Data
                  <span className="text-[10px] text-neutral-400 ml-1 font-normal">
                    {currentDraftId && currentDraftId !== "1" ? "· Auto-saves with ⌘S" : "· Press Save to create draft"}
                  </span>
                </h2>
              </div>
              <ScrollArea className="h-[calc(100vh-220px)] p-6">
                <ResumeForm data={resumeData} onChange={setResumeData} />
              </ScrollArea>
            </div>

            {/* Preview */}
            <div className="w-full lg:w-[55%] xl:w-[60%] sticky top-[100px]">
              <ResumePreview data={resumeData} theme={themeTemplate} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
