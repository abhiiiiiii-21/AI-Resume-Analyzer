"use client";

import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ChatInterface } from '@/components/ai-builder/chat-interface';
import { ResumePreview } from '@/components/ai-builder/resume-preview';
import {
  startBuilderSession, sendBuilderMessage, finalizeResume,
  exportResumePdf, listSessions, getSession,
  renameSession as renameSessionApi, deleteSession as deleteSessionApi,
  listModels
} from '@/lib/builder-api';
import {
  Sparkles, Layers, CheckCircle2, User, Mail,
  Briefcase, Wrench, GraduationCap, Circle, ArrowLeft,
  Plus, Clock, MessageSquare, ChevronRight, Phone, Link2,
  AlignLeft, Target, Trash2, Pencil, X, Check
} from 'lucide-react';
import { toast } from 'sonner';

function cls(...args: (string | boolean | undefined | null)[]) {
  return args.filter(Boolean).join(' ');
}

/* ── Requirements ── */
interface Req { key: string; label: string; done: boolean; required: boolean }

function getRequirements(data: any): Req[] {
  const b = data?.basics;
  const skills = data?.skills;
  const exp = data?.experience;
  const proj = data?.projects;
  const edu = data?.education;
  const certs = data?.certifications;
  const totalSkills = skills
    ? [...(skills.languages || []), ...(skills.frameworks || []), ...(skills.tools || [])].length : 0;

  const hasGoodEducation = !!(edu && edu.length > 0 && edu.some((e: any) => e.institution && e.grade && e.startDate));
  const hasGoodProjects = !!(proj && proj.length > 0 && proj.some((p: any) => p.impact?.length > 0 && (p.links?.github || p.links?.live)));
  const hasGoodCerts = !!(certs && certs.length > 0 && certs.some((c: any) => c.credentialUrl));
  const hasExperience = !!(exp && exp.length > 0);

  return [
    { key: 'name',     label: 'Full Name',           done: !!b?.fullName,                          required: true },
    { key: 'email',    label: 'Email',               done: !!b?.email,                             required: true },
    { key: 'phone',    label: 'Phone',               done: !!b?.phone,                             required: true },
    { key: 'linkedin', label: 'LinkedIn Profile',    done: !!b?.linkedin,                          required: true },
    { key: 'summary',  label: 'Detailed Summary',    done: !!(b?.summary && b.summary.length >= 50), required: true },
    { key: 'skills',   label: 'Skills',              done: totalSkills > 0,                        required: true },
    { key: 'edu',      label: 'Education (w/ CGPA)', done: hasGoodEducation,                       required: true },
    { key: 'proj',     label: 'Projects (w/ Links)', done: hasGoodProjects || hasExperience,       required: true },
    { key: 'github',   label: 'GitHub Profile',      done: !!b?.github,                            required: false },
    { key: 'certs',    label: 'Certifications (w/ Links)', done: hasGoodCerts,                     required: false },
  ];
}

/* ── Session type ── */
interface Session { id: string; title: string; status: string; createdAt: string; updatedAt: string }

function AIBuilderPageInner() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const urlSessionId = searchParams?.get('session');

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    { role: 'assistant', content: "Hi! I'm your AI Resume Builder. Tell me about your experience and I'll build your resume." }
  ]);
  const [resumeData, setResumeData] = useState<any>(null);
  const [pastSessions, setPastSessions] = useState<Session[]>([]);
  const [showSessions, setShowSessions] = useState(false);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [newRoleInput, setNewRoleInput] = useState('');
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const [isInitializing, setIsInitializing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [isFinalized, setIsFinalized] = useState(false);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  
  // Model state
  const [models, setModels] = useState<Array<{ id: string; label: string; description?: string; isDefault?: boolean }>>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  // exhaustedModels: { [modelId]: expiresAt (timestamp) }
  const [exhaustedModels, setExhaustedModels] = useState<Record<string, number>>({});
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [now, setNow] = useState(Date.now());

  const requirements = useMemo(() => getRequirements(resumeData), [resumeData]);
  const requiredItems = requirements.filter(r => r.required);
  const optionalItems = requirements.filter(r => !r.required);
  const allRequiredMet = requiredItems.every(r => r.done);
  const requiredDone = requiredItems.filter(r => r.done).length;
  const optionalDone = optionalItems.filter(r => r.done).length;

  useEffect(() => {
    if (isLoaded && !userId) router.push('/');
  }, [isLoaded, userId, router]);

  // Load exhausted models from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('builder_exhausted_models');
      if (stored) setExhaustedModels(JSON.parse(stored));
    } catch {}
  }, []);

  // Persist exhausted models to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('builder_exhausted_models', JSON.stringify(exhaustedModels));
    } catch {}
  }, [exhaustedModels]);

  // Tick every 30s to update countdowns & auto-revive expired models
  useEffect(() => {
    const t = setInterval(() => {
      const n = Date.now();
      setNow(n);
      setExhaustedModels(prev => {
        const updated = { ...prev };
        let changed = false;
        for (const id in updated) {
          if (updated[id] <= n) { delete updated[id]; changed = true; }
        }
        return changed ? updated : prev;
      });
    }, 30_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    async function loadModels() {
      try {
        const res = await listModels();
        const loaded = res.data?.models || [];
        setModels(loaded);
        // Restore persisted model or pick default
        const savedModel = localStorage.getItem('builder_selected_model');
        const available = loaded.filter((m: any) => !exhaustedModels[m.id] || exhaustedModels[m.id] <= Date.now());
        if (savedModel && loaded.find((m: any) => m.id === savedModel)) {
          setSelectedModel(savedModel);
        } else {
          const def = available.find((m: any) => m.isDefault) || available[0];
          if (def) setSelectedModel(def.id);
        }
      } catch (err) {
        console.warn('Failed to load models:', err);
      }
    }
    loadModels();
  }, []);

  // Persist selected model to localStorage
  useEffect(() => {
    if (selectedModel) localStorage.setItem('builder_selected_model', selectedModel);
  }, [selectedModel]);

  // Sync session ID from URL on mount
  useEffect(() => {
    if (userId && urlSessionId && urlSessionId !== sessionId && !isInitializing) {
      loadSession(urlSessionId);
    }
  }, [userId, urlSessionId]);

  // Sync session ID to URL when it changes
  useEffect(() => {
    if (sessionId && sessionId !== urlSessionId) {
      router.replace(`${pathname}?session=${sessionId}`);
    } else if (!sessionId && urlSessionId) {
      router.replace(pathname);
    }
  }, [sessionId, pathname, router]);

  // Removed auto-initialization to prevent saving empty/untitled sessions to the database.
  // Session is now lazy-created when the user sends their first message.

  /* ── Session helpers ── */
  async function initNewSession(title?: string) {
    if (!userId) return;
    setIsInitializing(true);
    try {
      const res = await startBuilderSession(userId, title);
      setSessionId(res.data.sessionId);
      setDraftId(res.data.draftId);
      setMessages([{ role: 'assistant', content: res.data.assistantMessage }]);
      setResumeData(null);
      setIsFinalized(false);
      loadPastSessions();
    } catch (error) {
      console.error('Failed to start session:', error);
      toast.error('Failed to connect to AI Builder service.');
    } finally {
      setIsInitializing(false);
    }
  }

  async function loadPastSessions() {
    if (!userId) return;
    setIsLoadingSessions(true);
    try {
      const res = await listSessions(userId);
      setPastSessions(res.data.sessions || []);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setIsLoadingSessions(false);
    }
  }

  async function loadSession(sid: string) {
    if (!userId) return;
    setIsInitializing(true);
    try {
      const res = await getSession(sid, userId);
      const { session, draft, recentMessages } = res.data;
      setSessionId(session.id);
      setDraftId(draft?.id || null);
      setResumeData(draft?.resumeJson || null);
      setMessages((recentMessages || []).map((m: any) => ({ role: m.role, content: m.content })));
      setIsFinalized(session.status === 'COMPLETED');
      setShowSessions(false);
    } catch (error) {
      console.error('Failed to load session:', error);
      toast.error('Failed to load session.');
    } finally {
      setIsInitializing(false);
    }
  }

  function handleCreateNew() {
    const role = newRoleInput.trim();
    if (!role) {
      toast.error('Please enter a job role for the session.');
      return;
    }
    // Check if session with this role already exists
    const existing = pastSessions.find(s => s.title.toLowerCase() === role.toLowerCase());
    if (existing) {
      const proceed = window.confirm(
        `A session for "${existing.title}" already exists. Create another one anyway?`
      );
      if (!proceed) return;
    }
    setShowNewDialog(false);
    setNewRoleInput('');
    setSessionId(null); // triggers re-init
    initNewSession(role);
  }

  async function handleDeleteSession(sid: string) {
    if (!userId) return;
    const ok = window.confirm('Delete this session? This cannot be undone.');
    if (!ok) return;
    try {
      await deleteSessionApi(sid, userId);
      toast.success('Session deleted.');
      setPastSessions(prev => prev.filter(s => s.id !== sid));
      if (sessionId === sid) {
        setSessionId(null);
        setDraftId(null);
        setMessages([
          { role: 'assistant', content: "Hi! I'm your AI Resume Builder. Tell me about your experience and I'll build your resume." }
        ]);
        setResumeData(null);
        setIsFinalized(false);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete session.');
    }
  }

  async function handleRenameSession(sid: string) {
    if (!userId || !renameValue.trim()) return;
    try {
      await renameSessionApi(sid, renameValue.trim(), userId);
      setPastSessions(prev => prev.map(s => s.id === sid ? { ...s, title: renameValue.trim() } : s));
      setRenamingId(null);
      setRenameValue('');
      toast.success('Session renamed.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to rename session.');
    }
  }

  const handleSendMessage = useCallback(async (message: string) => {
    if (!userId) return;
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    setIsSending(true);
    try {
      let activeSessionId = sessionId;

      // Lazy create session if we haven't yet
      if (!activeSessionId) {
        const initRes = await startBuilderSession(userId);
        activeSessionId = initRes.data.sessionId;
        setSessionId(activeSessionId);
        setDraftId(initRes.data.draftId);
        loadPastSessions(); // update sidebar
      }

      if (!activeSessionId) throw new Error('Failed to initialize session');
      const res = await sendBuilderMessage(activeSessionId, message, userId, selectedModel);
      
      // Auto-update the selected model if the backend had to fall back to another one
      if (res.data.usedModel && res.data.usedModel !== selectedModel) {
        // Mark the originally requested model as exhausted for 1 hour
        const expiresAt = Date.now() + 60 * 60 * 1000;
        setExhaustedModels(prev => ({ ...prev, [selectedModel]: expiresAt }));
        setSelectedModel(res.data.usedModel);
        const fallbackModelName = models.find(m => m.id === res.data.usedModel)?.label || res.data.usedModel;
        toast.info(`⚡ Switched to ${fallbackModelName} — previous model quota hit.`, { duration: 5000 });
      }

      if (res.data.assistantMessage) {
        setMessages(prev => [...prev, { role: 'assistant', content: res.data.assistantMessage }]);
      }
      if (res.data.resumeData) {
        setResumeData(res.data.resumeData);
      }
    } catch (error: any) {
      console.warn('AI Builder Warning:', error.message);
      const isRateLimit = error.message && (error.message.includes('Rate limit') || error.message.includes('quota'));
      if (isRateLimit) {
        // Mark ALL models as exhausted for 10 minutes
        const expiresAt = Date.now() + 10 * 60 * 1000;
        setExhaustedModels(prev => {
          const updated = { ...prev };
          models.forEach(m => { updated[m.id] = expiresAt; });
          return updated;
        });
        toast.error('⏳ All AI models are currently busy. They will auto-revive in ~10 minutes.', { duration: 8000 });
      } else {
        toast.error('Failed to send message to AI.');
      }
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsSending(false);
    }
  }, [userId, sessionId, selectedModel, models]);

  const handleFinalize = async () => {
    if (!userId || !draftId || !allRequiredMet) return;
    try {
      setIsFinalizing(true);
      const title = resumeData?.basics?.fullName
        ? `${resumeData.basics.fullName}'s Resume`
        : 'My Resume';
      const finalizeRes = await finalizeResume(draftId, userId, title);
      const newResumeId = finalizeRes.data.resumeId;
      setIsFinalized(true);
      toast.success('Resume finalized!');

      try {
        const filename = `${(resumeData?.basics?.fullName || 'resume').replace(/\s+/g, '_')}_Resume.pdf`;
        await exportResumePdf(newResumeId, userId, filename);
        toast.success('PDF downloaded to your Downloads folder!');
      } catch (pdfError: any) {
        console.warn('PDF export issue:', pdfError.message);
        toast.info('Resume finalized! PDF download may take a moment.');
      }
    } catch (error: any) {
      console.error('Failed to finalize:', error);
      toast.error(error.message || 'Failed to finalize resume.');
    } finally {
      setIsFinalizing(false);
    }
  };

  if (!isLoaded || !userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="flex items-center gap-3 text-neutral-500 font-manrope font-bold">
          <div className="w-5 h-5 border-[3px] border-neutral-200 border-t-[#1C4ED6] rounded-full animate-spin" />
          Loading...
        </div>
      </div>
    );
  }

  const canFinalize = !isFinalizing && !isFinalized && draftId && allRequiredMet;
  const currentTitle = pastSessions.find(s => s.id === sessionId)?.title || 'New Session';

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#FAFAFA] text-neutral-900 font-inter relative overflow-hidden">

      {/* ── BACKGROUND ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#FAFAFA]" />
        <div className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)",
            backgroundSize: "24px 24px",
            maskImage: "linear-gradient(to bottom, black 10%, transparent 60%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 10%, transparent 60%)",
          }}
        />
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-[#1C4ED6]/5 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-blue-400/5 blur-[100px]" />
      </div>

      {/* ── LEFT SIDEBAR ── */}
      <aside className="w-full lg:w-[480px] shrink-0 flex flex-col h-screen sticky top-0 bg-white/80 backdrop-blur-xl border-r border-neutral-200 z-20 shadow-xl">
        <div className="flex flex-col flex-1 p-5 md:p-6 overflow-hidden">

          {/* Top bar */}
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => router.push('/')}
              className="flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-neutral-900 transition-colors font-manrope">
              <ArrowLeft size={14} /> Home
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-[8px] bg-[#1C4ED6] flex items-center justify-center">
                <Layers size={12} className="text-white" />
              </div>
              <span className="font-bold text-neutral-900 text-base tracking-tight font-manrope hidden sm:inline-block">Resumind</span>
            </div>
            <div className="flex items-center gap-3 relative">
              {models.length > 0 && (() => {
                const activeModel = models.find(m => m.id === selectedModel);
                const isExhausted = selectedModel && exhaustedModels[selectedModel] && exhaustedModels[selectedModel] > now;
                const exhaustedCount = models.filter(m => exhaustedModels[m.id] && exhaustedModels[m.id] > now).length;
                return (
                  <div className="relative">
                    <button
                      onClick={() => setShowModelMenu(v => !v)}
                      className={`flex items-center gap-1.5 text-[10px] font-bold border rounded-md px-2 py-1 transition-colors font-manrope cursor-pointer ${
                        isExhausted
                          ? 'text-red-500 border-red-200 bg-red-50'
                          : 'text-neutral-600 border-neutral-200 bg-white hover:border-[#1C4ED6]'
                      }`}
                      title="Select AI Model"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isExhausted ? 'bg-red-400' : 'bg-emerald-400'}`} />
                      <span className="max-w-[80px] truncate">{activeModel?.label || 'Model'}</span>
                      {exhaustedCount > 0 && <span className="text-[8px] bg-red-100 text-red-500 px-1 rounded">{exhaustedCount} busy</span>}
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round"/></svg>
                    </button>

                    {showModelMenu && (
                      <>
                        <div className="fixed inset-0 z-30" onClick={() => setShowModelMenu(false)} />
                        <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-neutral-200 rounded-xl shadow-xl z-40 overflow-hidden">
                          <div className="px-3 py-2 border-b border-neutral-100">
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-manrope">AI Model</p>
                          </div>
                          <div className="max-h-72 overflow-y-auto p-1">
                            {models.map(m => {
                              const isActive = m.id === selectedModel;
                              const expiry = exhaustedModels[m.id];
                              const isBusy = !!(expiry && expiry > now);
                              const minsLeft = isBusy ? Math.ceil((expiry - now) / 60000) : 0;
                              return (
                                <button
                                  key={m.id}
                                  disabled={isBusy}
                                  onClick={() => { if (!isBusy) { setSelectedModel(m.id); setShowModelMenu(false); } }}
                                  className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-2.5 transition-all ${
                                    isActive && !isBusy
                                      ? 'bg-[#1C4ED6]/8 border border-[#1C4ED6]/20'
                                      : isBusy
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'hover:bg-neutral-50 cursor-pointer'
                                  }`}
                                >
                                  <span className={`w-2 h-2 rounded-full shrink-0 ${
                                    isActive && !isBusy ? 'bg-emerald-400' : isBusy ? 'bg-red-400' : 'bg-neutral-300'
                                  }`} />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[11px] font-bold text-neutral-800 font-manrope truncate">{m.label}</span>
                                      {isActive && !isBusy && <span className="text-[8px] bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded-full font-bold">ACTIVE</span>}
                                      {isBusy && <span className="text-[8px] bg-red-100 text-red-500 px-1.5 py-0.5 rounded-full font-bold">BUSY</span>}
                                    </div>
                                    <p className="text-[9px] text-neutral-400 font-manrope truncate">
                                      {isBusy ? `Revives in ~${minsLeft} min` : (m.description || '')}
                                    </p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })()}
              <button onClick={() => { setShowSessions(!showSessions); if (!showSessions) loadPastSessions(); }}
                className="flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-[#1C4ED6] transition-colors font-manrope">
                <Clock size={14} /> Sessions
              </button>
            </div>
          </div>

          {/* ── Sessions Panel ── */}
          {showSessions && (
            <div className="mb-3 bg-white rounded-[14px] border border-neutral-200 shadow-lg max-h-64 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
                <p className="text-[11px] font-bold text-neutral-700 uppercase tracking-[0.1em] font-manrope">Your Sessions</p>
                <button onClick={() => { setShowNewDialog(true); setNewRoleInput(''); }}
                  className="flex items-center gap-1 text-[11px] font-bold text-[#1C4ED6] hover:underline font-manrope">
                  <Plus size={12} /> New Session
                </button>
              </div>

              {/* New session dialog */}
              {showNewDialog && (
                <div className="px-4 py-3 border-b border-neutral-100 bg-[#1C4ED6]/5">
                  <p className="text-[10px] font-bold text-neutral-600 mb-2 font-manrope">What role is this resume for?</p>
                  <div className="flex gap-2">
                    <input value={newRoleInput} onChange={e => setNewRoleInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleCreateNew()}
                      placeholder="e.g. Frontend Developer"
                      className="flex-1 text-xs bg-white border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#1C4ED6]/50 font-medium" autoFocus />
                    <button onClick={handleCreateNew}
                      className="text-xs font-bold text-white bg-[#1C4ED6] px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors font-manrope">Create</button>
                    <button onClick={() => setShowNewDialog(false)}
                      className="text-xs text-neutral-400 hover:text-neutral-600 p-2"><X size={14} /></button>
                  </div>
                </div>
              )}

              {/* Session list */}
              <div className="overflow-y-auto flex-1 p-2">
                {isLoadingSessions ? (
                  <div className="py-6 text-center text-xs text-neutral-400">Loading...</div>
                ) : pastSessions.length === 0 ? (
                  <div className="py-6 text-center text-xs text-neutral-400">No sessions yet</div>
                ) : (
                  <div className="flex flex-col gap-1">
                    {pastSessions.map(s => (
                      <div key={s.id}
                        className={cls(
                          'group flex items-center gap-2 w-full px-3 py-2 rounded-[10px] transition-all text-xs',
                          s.id === sessionId
                            ? 'bg-[#1C4ED6]/5 border border-[#1C4ED6]/20'
                            : 'hover:bg-neutral-50 border border-transparent'
                        )}>
                        <button onClick={() => loadSession(s.id)} className="flex items-center gap-2 flex-1 min-w-0 text-left">
                          <MessageSquare size={13} className="shrink-0 text-neutral-400" />
                          {renamingId === s.id ? (
                            <div className="flex items-center gap-1 flex-1" onClick={e => e.stopPropagation()}>
                              <input value={renameValue} onChange={e => setRenameValue(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleRenameSession(s.id)}
                                className="flex-1 text-xs bg-white border border-neutral-200 rounded px-2 py-1 focus:outline-none" autoFocus />
                              <button onClick={() => handleRenameSession(s.id)} className="text-green-500 hover:text-green-600"><Check size={13} /></button>
                              <button onClick={() => setRenamingId(null)} className="text-neutral-400 hover:text-neutral-600"><X size={13} /></button>
                            </div>
                          ) : (
                            <div className="flex-1 min-w-0">
                              <p className="truncate font-bold font-manrope text-neutral-800">{s.title}</p>
                              <p className="text-[10px] text-neutral-400 mt-0.5">
                                {s.status === 'COMPLETED' ? '✅ Done' : '🔄 Active'} · {new Date(s.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                        </button>
                        {/* Actions — only show when not renaming */}
                        {renamingId !== s.id && (
                          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={(e) => { e.stopPropagation(); setRenamingId(s.id); setRenameValue(s.title); }}
                              className="p-1 text-neutral-400 hover:text-[#1C4ED6] rounded transition-colors" title="Rename">
                              <Pencil size={12} />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); handleDeleteSession(s.id); }}
                              className="p-1 text-neutral-400 hover:text-red-500 rounded transition-colors" title="Delete">
                              <Trash2 size={12} />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Current session label — click to rename */}
          <div className="mb-3 flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#1C4ED6] bg-[#1C4ED6]/5 px-2.5 py-1 rounded-full border border-[#1C4ED6]/10 font-manrope shrink-0">
              <Sparkles size={10} /> AI Builder
            </div>
            {editingTitle ? (
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <input value={titleInput} onChange={e => setTitleInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && sessionId && titleInput.trim()) {
                      renameSessionApi(sessionId, titleInput.trim(), userId!).then(() => {
                        setPastSessions(prev => prev.map(s => s.id === sessionId ? { ...s, title: titleInput.trim() } : s));
                        setEditingTitle(false);
                        toast.success('Session renamed.');
                      }).catch(() => toast.error('Failed to rename.'));
                    }
                    if (e.key === 'Escape') setEditingTitle(false);
                  }}
                  className="flex-1 min-w-0 text-sm font-bold bg-white border border-[#1C4ED6]/30 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-[#1C4ED6]/20 font-manrope"
                  autoFocus />
                <button onClick={() => {
                  if (sessionId && titleInput.trim()) {
                    renameSessionApi(sessionId, titleInput.trim(), userId!).then(() => {
                      setPastSessions(prev => prev.map(s => s.id === sessionId ? { ...s, title: titleInput.trim() } : s));
                      setEditingTitle(false);
                      toast.success('Session renamed.');
                    }).catch(() => toast.error('Failed to rename.'));
                  }
                }} className="p-1 text-green-500 hover:text-green-600"><Check size={14} /></button>
                <button onClick={() => setEditingTitle(false)} className="p-1 text-neutral-400 hover:text-neutral-600"><X size={14} /></button>
              </div>
            ) : (
              <button onClick={() => { setEditingTitle(true); setTitleInput(currentTitle); }}
                className="text-base font-bold text-neutral-900 tracking-tight font-manrope truncate flex-1 text-left hover:text-[#1C4ED6] transition-colors group flex items-center gap-1.5" title="Click to rename">
                {currentTitle}
                <Pencil size={11} className="text-neutral-300 group-hover:text-[#1C4ED6] shrink-0 transition-colors" />
              </button>
            )}
          </div>

          {/* ── Requirements ── */}
          <div className="mb-3 bg-neutral-50 rounded-[12px] border border-neutral-200 p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-[0.15em] font-manrope">Progress</p>
              <span className={cls(
                'text-[9px] font-bold px-2 py-0.5 rounded-full border font-manrope',
                allRequiredMet ? 'text-green-600 bg-green-50 border-green-200' : 'text-neutral-500 bg-white border-neutral-200'
              )}>
                {requiredDone}/{requiredItems.length} required
              </span>
            </div>
            <div className="w-full h-1 bg-neutral-200 rounded-full overflow-hidden mb-2">
              <div className={cls('h-full rounded-full transition-all duration-500', allRequiredMet ? 'bg-green-500' : 'bg-[#1C4ED6]')}
                style={{ width: `${(requiredDone / requiredItems.length) * 100}%` }} />
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mb-2">
              {requiredItems.map(r => (
                <div key={r.key} className="flex items-center gap-1">
                  {r.done ? <CheckCircle2 size={11} className="text-green-500" /> : <Circle size={11} className="text-neutral-300" />}
                  <span className={cls('text-[10px] font-semibold font-manrope', r.done ? 'text-green-600 line-through' : 'text-neutral-500')}>{r.label}</span>
                </div>
              ))}
            </div>
            <p className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest mb-1 font-manrope">Optional ({optionalDone}/{optionalItems.length})</p>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5">
              {optionalItems.map(r => (
                <div key={r.key} className="flex items-center gap-1">
                  {r.done ? <CheckCircle2 size={10} className="text-blue-400" /> : <Circle size={10} className="text-neutral-200" />}
                  <span className={cls('text-[9px] font-medium', r.done ? 'text-blue-500' : 'text-neutral-400')}>{r.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chat */}
          <div className="flex-1 min-h-0">
            <ChatInterface messages={messages} isSending={isSending} onSendMessage={handleSendMessage} isInitializing={isInitializing} />
          </div>

          {/* Actions */}
          <div className="pt-3 mt-auto flex gap-2">
            <button onClick={() => { setShowNewDialog(true); setShowSessions(true); setNewRoleInput(''); loadPastSessions(); }}
              className="flex items-center justify-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200 px-3.5 py-2.5 rounded-full transition-all shadow-sm hover:shadow-md font-manrope">
              <Plus size={13} /> New
            </button>
            <button onClick={handleFinalize} disabled={!canFinalize}
              className={cls(
                'flex-1 py-2.5 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 font-manrope',
                isFinalized ? 'bg-green-500 text-white cursor-default'
                  : canFinalize ? 'bg-[#1C4ED6] text-white hover:scale-[1.02] shadow-[0_8px_20px_rgba(28,78,214,0.3)] active:scale-100'
                    : 'bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200'
              )}>
              {isFinalizing ? (
                <><div className="w-4 h-4 border-[2px] border-white/20 border-t-white rounded-full animate-spin" /> Processing...</>
              ) : isFinalized ? (
                <><CheckCircle2 size={15} /> Finalized ✓</>
              ) : (
                <><CheckCircle2 size={15} /> Finalize & Download</>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* ── RIGHT PANEL ── */}
      <main className="flex-1 relative z-10 overflow-y-auto h-screen p-6 md:p-10">
        <ResumePreview data={resumeData} />
      </main>
    </div>
  );
}

export default function AIBuilderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="flex items-center gap-3 text-neutral-500 font-bold">
          <div className="w-5 h-5 border-[3px] border-neutral-200 border-t-[#1C4ED6] rounded-full animate-spin" />
          Loading...
        </div>
      </div>
    }>
      <AIBuilderPageInner />
    </Suspense>
  );
}
