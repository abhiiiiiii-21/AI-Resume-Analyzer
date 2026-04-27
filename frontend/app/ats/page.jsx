"use client";
import React, { useState, useRef } from 'react';
import CircularScore from '../../components/ats/CircularScore';
import SectionScores from '../../components/ats/SectionScores';
import KeywordDensity from '../../components/ats/KeywordDensity';
import {
  Layers, UploadCloud, FileText, X, Sparkles,
  CheckCircle2, XCircle, AlertCircle, TrendingUp,
  BarChart3, Target, ArrowRight, RefreshCw, Download
} from 'lucide-react';

function cls(...args) { return args.filter(Boolean).join(' '); }

/* ── Card ── */
const Card = ({ children, className }) => (
  <div className={cls('bg-[#111827]/80 backdrop-blur-[12px] border border-white/5 rounded-[16px] shadow-lg hover:shadow-xl transition-all duration-300', className)}>
    {children}
  </div>
);

/* ── Step bar ── */
const STEPS = ['Upload', 'Keywords', 'Analyze', 'Results'];

function StepBar({ step }) {
  return (
    <div className="relative flex items-center justify-between mb-10 px-1">
      <div className="absolute top-3 left-0 right-0 h-px bg-white/5" />
      <div
        className="absolute top-3 left-0 h-px bg-gradient-to-r from-[#3B82F6] to-[#6366F1] transition-all duration-500"
        style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
      />
      {STEPS.map((label, i) => {
        const done   = step >  i + 1;
        const active = step === i + 1;
        return (
          <div key={label} className="flex flex-col items-center z-10">
            <div className={cls(
              'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all duration-300',
              done    ? 'bg-[#3B82F6] border-[#3B82F6] text-[#F9FAFB] shadow-[0_0_10px_rgba(59,130,246,0.3)]' :
              active  ? 'bg-[#0B0F19] border-[#6366F1] text-[#6366F1] shadow-[0_0_15px_rgba(99,102,241,0.2)]' :
                        'bg-[#0B0F19] border-white/5 text-[#9CA3AF]'
            )}>
              {done ? <CheckCircle2 size={12} /> : i + 1}
            </div>
            <span className={cls(
              'text-[9px] font-bold uppercase tracking-widest mt-2 transition-colors',
              active || done ? 'text-[#F9FAFB]' : 'text-[#9CA3AF]'
            )}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Drop zone ── */
function DropZone({ file, onFile, disabled }) {
  const [dragging, setDragging] = useState(false);
  const ref = useRef(null);

  const accept = (f) => {
    const ok = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ].includes(f?.type);
    if (ok) onFile(f);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); accept(e.dataTransfer.files[0]); }}
      onClick={() => !disabled && !file && ref.current?.click()}
      className={cls(
        'relative flex flex-col items-center justify-center rounded-[16px] border border-dashed transition-all duration-300 overflow-hidden',
        disabled ? 'opacity-40 pointer-events-none' : 'cursor-pointer',
        dragging  ? 'border-[#3B82F6] bg-[#3B82F6]/5 scale-[1.03]' :
        file      ? 'border-[#6366F1]/50 bg-[#6366F1]/5 h-24' :
                    'border-white/10 bg-[#111827]/40 hover:border-[#6366F1]/40 hover:bg-[#111827]/60 h-44'
      )}
    >
      {file ? (
        <div className="flex items-center gap-4 w-full px-5">
          <div className="w-10 h-10 rounded-xl bg-[#6366F1]/10 border border-[#6366F1]/20 flex items-center justify-center shrink-0">
            <FileText size={18} className="text-[#6366F1]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-[#F9FAFB] truncate">{file.name}</p>
            <p className="text-xs text-[#9CA3AF] mt-0.5">{(file.size / 1024).toFixed(0)} KB · Ready</p>
          </div>
          <button type="button" onClick={(e) => { e.stopPropagation(); onFile(null); }}
            className="p-1.5 text-[#9CA3AF] hover:text-[#EF4444] transition-colors rounded-lg hover:bg-white/5">
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="text-center px-6 group">
          <div className="w-12 h-12 rounded-[16px] bg-[#111827]/80 border border-white/5 mx-auto mb-3 flex items-center justify-center transition-all group-hover:bg-[#3B82F6]/10 group-hover:scale-[1.05] group-hover:border-[#3B82F6]/20 shadow-lg">
            <UploadCloud size={22} className="text-[#9CA3AF] group-hover:text-[#3B82F6] transition-colors" />
          </div>
          <p className="text-sm font-semibold text-[#9CA3AF]">Drop file or <span className="text-[#3B82F6] underline underline-offset-4 decoration-[#3B82F6]/30">browse</span></p>
          <p className="text-xs text-[#9CA3AF]/60 mt-1">PDF · DOCX · Max 5 MB</p>
        </div>
      )}
      <input ref={ref} type="file" className="hidden" accept=".pdf,.doc,.docx"
        onChange={(e) => accept(e.target.files[0])} />
    </div>
  );
}

/* ── Keyword chips ── */
const SUGGESTIONS = ['React.js', 'Node.js', 'TypeScript', 'AWS', 'Python', 'Docker', 'SQL'];

function ChipInput({ chips, setChips, disabled }) {
  const [val, setVal] = useState('');

  const add = (str) => {
    const v = str.trim();
    if (v && !chips.includes(v)) setChips([...chips, v]);
    setVal('');
  };

  const onKey = (e) => {
    if (e.key === 'Enter')     { e.preventDefault(); add(val); }
    if (e.key === 'Backspace' && !val && chips.length) setChips(chips.slice(0, -1));
  };

  return (
    <div className={cls(
      'bg-[#111827]/40 border rounded-[16px] p-4 transition-all focus-within:border-[#3B82F6]/50 focus-within:ring-1 focus-within:ring-[#3B82F6]/20 shadow-inner',
      disabled ? 'border-white/5 opacity-40 pointer-events-none' : 'border-white/5 hover:border-white/10'
    )}>
      <div className="flex flex-wrap gap-2 mb-3 min-h-[28px]">
        {chips.map((c) => (
          <span key={c} className="flex items-center gap-1.5 px-3 py-1 bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] rounded-lg text-xs font-semibold tracking-wide">
            {c}
            <button type="button" onClick={() => setChips(chips.filter((x) => x !== c))}>
              <X size={12} className="hover:text-[#F9FAFB] transition-colors" />
            </button>
          </span>
        ))}
        <input
          type="text" value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={onKey}
          placeholder={chips.length === 0 ? 'Type keyword → Enter...' : 'Add more...'}
          className="flex-1 min-w-[120px] bg-transparent text-sm text-[#F9FAFB] placeholder:text-[#9CA3AF]/50 focus:outline-none py-0.5"
        />
      </div>

      {chips.length === 0 && (
        <div className="pt-4 border-t border-white/5">
          <p className="text-[9px] font-bold text-[#9CA3AF]/60 uppercase tracking-widest mb-3">Suggestions</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button key={s} type="button" onClick={() => add(s)}
                className="text-[10px] px-2.5 py-1 bg-white/5 text-[#9CA3AF] border border-white/5 rounded-lg hover:bg-[#3B82F6]/10 hover:text-[#3B82F6] hover:border-[#3B82F6]/20 transition-all font-medium">
                + {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Scanning animation ── */
function ScanningView({ progress }) {
  return (
    <div className="h-full flex flex-col items-center justify-center px-10 py-20 relative z-10">
      <div className="relative w-full max-w-sm h-72 rounded-[16px] bg-[#111827]/80 backdrop-blur-[12px] border border-white/5 overflow-hidden flex items-center justify-center shadow-2xl mb-10">
        <FileText size={88} className="text-white/5" />
        <div className="absolute left-4 right-4 h-[2px] bg-gradient-to-r from-transparent via-[#6366F1] to-transparent shadow-[0_0_15px_#3B82F6] animate-[scan_1.8s_ease-in-out_infinite]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#3B82F6]/5 via-transparent to-transparent animate-pulse pointer-events-none" />
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes scan {
            0%   { top: 5%;  opacity: 0; }
            5%   { opacity: 1; }
            95%  { opacity: 1; }
            100% { top: 95%; opacity: 0; }
          }
        ` }} />
      </div>
      <p className="text-lg font-black text-[#F9FAFB] mb-2 animate-pulse">Running AI Analysis Engine</p>
      <p className="text-sm text-[#3B82F6] font-mono tracking-widest mb-6 font-bold">SCORING RESUME · {progress}%</p>
      <div className="w-64 h-1.5 bg-[#111827] border border-white/5 shadow-inner rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[#3B82F6] to-[#6366F1] rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

/* ── Empty state ── */
function EmptyDashboard() {
  return (
    <div className="h-full flex items-center justify-center p-10 relative z-10">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 rounded-[16px] bg-[#111827]/60 border border-white/5 flex items-center justify-center mx-auto mb-6 shadow-lg backdrop-blur-md">
          <BarChart3 size={32} className="text-[#9CA3AF]/60" />
        </div>
        <h3 className="text-xl font-bold text-[#F9FAFB] mb-3">Awaiting Analysis</h3>
        <p className="text-sm text-[#9CA3AF] leading-relaxed">
          Upload your resume on the left and enter a target job role or keywords to run a complete ATS compatibility scan.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-4 text-left">
          {['Upload PDF or DOCX', 'Add job keywords', 'Run AI analysis', 'Get instant score'].map((t, i) => (
            <div key={t} className="flex items-center gap-3 text-xs text-[#9CA3AF] font-medium">
              <span className="w-5 h-5 rounded-lg bg-[#111827] border border-white/5 text-[9px] flex items-center justify-center font-bold text-[#F9FAFB]/70 shadow-inner">{i + 1}</span>
              {t}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Result dashboard ── */
function ResultDashboard({ result, file, onReset }) {
  const { score, matchedSkills, missingSkills, suggestions, keywordDensity, sectionScores, aiSummary, atsCompatible } = result;

  return (
    <div className="p-6 md:p-10 space-y-6 max-w-5xl mx-auto relative z-10 min-h-screen">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#22C55E] bg-[rgba(34,197,94,0.1)] px-3 py-1 rounded-full border border-[#22C55E]/20 mb-4 shadow-sm">
            <CheckCircle2 size={11} /> Analysis Complete
          </div>
          <h1 className="text-3xl font-black text-[#F9FAFB] tracking-tight">ATS Score Report</h1>
          <p className="text-xs text-[#9CA3AF] mt-2 font-medium">
            Analyzed just now &nbsp;·&nbsp; <span className="text-[#F9FAFB]/70">{file?.name}</span> &nbsp;·&nbsp; {(file?.size / 1024).toFixed(0)} KB
          </p>
        </div>
        <button onClick={onReset}
          className="flex items-center gap-2 text-xs font-bold text-[#9CA3AF] hover:text-[#F9FAFB] bg-[#111827]/80 hover:bg-[#111827] border border-white/5 px-4 py-2.5 rounded-[12px] transition-all shadow-md backdrop-blur-md">
          <RefreshCw size={13} /> New Scan
        </button>
      </div>

      {/* Score + Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <Card className="md:col-span-4 p-8 flex flex-col items-center justify-center text-center relative hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/5 to-transparent pointer-events-none rounded-[16px]" />
          <CircularScore score={score} />
          <div className={cls(
            'mt-6 px-5 py-2 rounded-full border text-[10px] font-bold uppercase tracking-widest shadow-sm',
            atsCompatible
              ? 'bg-[rgba(34,197,94,0.1)] border-[#22C55E]/20 text-[#22C55E]'
              : 'bg-[rgba(239,68,68,0.1)] border-[#EF4444]/20 text-[#EF4444]'
          )}>
            {atsCompatible ? 'ATS Compatible ✓' : 'Needs Improvement'}
          </div>
        </Card>

        <div className="md:col-span-8 space-y-6">
          <Card className="p-6 flex items-start gap-5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#3B82F6]/10 to-[#6366F1]/10 pointer-events-none transition-opacity group-hover:opacity-80" />
            <div className="absolute -left-px top-0 bottom-0 w-1 bg-gradient-to-b from-[#3B82F6] to-[#6366F1] shadow-[0_0_10px_#6366F1]" />
            <div className="shrink-0 w-12 h-12 rounded-[14px] bg-[#0B0F19] border border-[#6366F1]/30 flex items-center justify-center shadow-inner relative z-10">
              <Sparkles size={20} className="text-[#6366F1]" />
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-[#6366F1] uppercase tracking-widest mb-2">AI Intelligence Summary</p>
              <p className="text-sm text-[#F9FAFB]/90 leading-relaxed font-medium">{aiSummary}</p>
            </div>
          </Card>

          <div className="grid grid-cols-3 gap-6">
            {[
              { label: 'Matched', value: matchedSkills.length, sub: 'found', color: 'text-[#22C55E]' },
              { label: 'Missing', value: missingSkills.length, sub: 'absent', color: 'text-[#EF4444]' },
              { label: 'Actions', value: suggestions.length, sub: 'tips', color: 'text-[#3B82F6]' },
            ].map(({ label, value, sub, color }) => (
              <Card key={label} className="p-5 text-center relative hover:-translate-y-1 hover:border-white/10">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none rounded-[16px]" />
                <div className={cls("text-4xl font-black drop-shadow-md mb-1", color)}>{value}</div>
                <div className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">{label}</div>
                <div className="text-[9px] text-[#9CA3AF]/50 mt-1">{sub}</div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Section breakdown + keyword density */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-7">
          <div className="flex items-center gap-3 mb-7">
            <div className="p-2 bg-[#0B0F19] rounded-lg border border-white/5">
              <Target size={16} className="text-[#6366F1]" />
            </div>
            <h3 className="text-sm font-bold text-[#F9FAFB]">Section Breakdown</h3>
          </div>
          <SectionScores scores={sectionScores} />
        </Card>
        <Card className="p-7">
          <div className="flex items-center gap-3 mb-7">
            <div className="p-2 bg-[#0B0F19] rounded-lg border border-white/5">
              <TrendingUp size={16} className="text-[#3B82F6]" />
            </div>
            <h3 className="text-sm font-bold text-[#F9FAFB]">Keyword Density</h3>
          </div>
          <KeywordDensity keywordDensity={keywordDensity} />
        </Card>
      </div>

      {/* Matched / Missing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-7">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#0B0F19] rounded-lg border border-[#22C55E]/20">
                <CheckCircle2 size={16} className="text-[#22C55E]" />
              </div>
              <h3 className="text-sm font-bold text-[#F9FAFB]">Found Keywords</h3>
            </div>
            <span className="text-[10px] font-bold bg-[#0B0F19] text-[#9CA3AF] px-2.5 py-1 rounded-lg border border-white/5">{matchedSkills.length}</span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {matchedSkills.length > 0
              ? matchedSkills.map((s) => (
                  <span key={s} className="px-3.5 py-1.5 bg-[rgba(34,197,94,0.1)] border border-[#22C55E]/20 text-[#22C55E] text-xs font-semibold rounded-[10px] capitalize shadow-sm tracking-wide">{s}</span>
                ))
              : <p className="text-[#9CA3AF] text-sm italic">No exact matches found.</p>
            }
          </div>
        </Card>

        <Card className="p-7">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#0B0F19] rounded-lg border border-[#EF4444]/20">
                <XCircle size={16} className="text-[#EF4444]" />
              </div>
              <h3 className="text-sm font-bold text-[#F9FAFB]">Missing Keywords</h3>
            </div>
            <span className="text-[10px] font-bold bg-[#0B0F19] text-[#9CA3AF] px-2.5 py-1 rounded-lg border border-white/5">{missingSkills.length}</span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {missingSkills.length > 0
              ? missingSkills.map((s) => (
                  <span key={s} className="px-3.5 py-1.5 bg-[rgba(239,68,68,0.1)] border border-[#EF4444]/20 text-[#EF4444] text-xs font-semibold rounded-[10px] capitalize shadow-sm tracking-wide">{s}</span>
                ))
              : <p className="text-[#22C55E] text-sm font-semibold bg-[rgba(34,197,94,0.1)] px-3 py-1.5 rounded-lg inline-block">All keywords detected ✓</p>
            }
          </div>
        </Card>
      </div>

      {/* Suggestions */}
      <Card className="p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#6366F1]/10 to-transparent blur-3xl pointer-events-none" />
        <div className="flex items-center gap-4 mb-8">
          <div className="w-10 h-10 rounded-[12px] bg-[#111827] border border-white/5 flex items-center justify-center shadow-inner relative z-10">
            <Sparkles size={18} className="text-[#3B82F6]" />
          </div>
          <h3 className="text-lg font-black text-[#F9FAFB] tracking-wide relative z-10">AI Recommendations</h3>
          <span className="text-[10px] font-bold bg-[#0B0F19] border border-white/5 text-[#3B82F6] px-3 py-1 rounded-lg ml-auto relative z-10 shadow-sm">{suggestions.length} actions</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
          {suggestions.map((s, i) => (
            <div key={i} className="flex items-start gap-4 bg-[#0B0F19]/50 border border-white/5 rounded-[14px] p-5 hover:bg-[#0B0F19] hover:border-white/10 hover:-translate-y-0.5 transition-all duration-300 shadow-sm">
              <div className="mt-0.5 shrink-0 bg-white/5 p-1 rounded-md text-[#3B82F6]">
                <ArrowRight size={14} />
              </div>
              <p className="text-sm text-[#F9FAFB]/80 leading-relaxed font-medium">{s}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <p className="text-xs text-[#9CA3AF] max-w-sm leading-relaxed">Apply these suggestions to significantly boost your resume's ATS compatibility and visibility to recruiters.</p>
          <div className="flex w-full sm:w-auto gap-4">
            <button onClick={() => window.print()}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-sm font-bold text-[#9CA3AF] hover:text-[#F9FAFB] bg-[#111827] hover:bg-[#111827]/80 border border-white/5 px-5 py-3 rounded-[12px] transition-all shadow-md">
              <Download size={15} /> Export
            </button>
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-sm font-bold text-white bg-gradient-to-r from-[#3B82F6] to-[#6366F1] hover:scale-[1.03] px-6 py-3 rounded-[12px] transition-all shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)]">
              Improve Resume <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </Card>

      <div className="pb-12" />
    </div>
  );
}

/* ── Main page ── */
export default function ATSAnalyzerTool() {
  const [step, setStep]               = useState(1);
  const [resumeFile, setResumeFile]   = useState(null);
  const [jobSkills, setJobSkills]     = useState([]);
  const [jobRole, setJobRole]         = useState('');
  const [experience, setExperience]   = useState('');
  const [filters, setFilters]         = useState({
    remote: false,
    urgent: false,
    hybrid: false,
    contract: false,
    relocation: false
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress]       = useState(0);
  const [error, setError]             = useState(null);
  const [result, setResult]           = useState(null);

  const handleFile = (f) => {
    setResumeFile(f);
    setError(null);
    if (f && step < 2) setStep(2);
    if (!f && step >= 2) setStep(1);
  };

  const handleAnalyze = async () => {
    if (!resumeFile) return setError('Please upload a resume first.');
    if (!jobRole.trim() && !jobSkills.length) {
      return setError('Please provide either a job role or at least one job keyword.');
    }
    setError(null);
    setStep(3);
    setIsAnalyzing(true);
    setProgress(0);

    const timer = setInterval(() =>
      setProgress((p) => (p < 88 ? p + Math.floor(Math.random() * 14) + 3 : p)), 350);

    try {
      const fd = new FormData();
      fd.append('resumeFile', resumeFile);
      fd.append('jobRole', jobRole);
      fd.append('experience', experience);
      fd.append('jobSkills', jobSkills.join(', '));
      fd.append('filters', JSON.stringify(filters));
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005/api';
      const res = await fetch(`${baseUrl}/ats/calculate-file`, { method: 'POST', body: fd });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Analysis failed'); }
      const data = await res.json();
      clearInterval(timer);
      setProgress(100);
      setTimeout(() => { setIsAnalyzing(false); setResult(data); setStep(4); }, 700);
    } catch (e) {
      clearInterval(timer);
      setIsAnalyzing(false);
      setError(e.message || 'Could not connect to server.');
      setStep(jobSkills.length > 0 ? 2 : 1);
    }
  };

  const handleReset = () => {
    setResult(null); setResumeFile(null); setJobSkills([]);
    setJobRole(''); setExperience('');
    setFilters({ remote: false, urgent: false, hybrid: false, contract: false, relocation: false });
    setStep(1); setProgress(0); setError(null);
  };

  const canAnalyze = !isAnalyzing && resumeFile && (jobRole.trim() !== '' || jobSkills.length > 0);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#020617] text-[#F9FAFB] font-sans relative overflow-hidden">

      {/* ── BACKGROUND ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div style={{ background: 'radial-gradient(circle at top, #111827 0%, #020617 100%)' }} className="absolute inset-0" />
        
        {/* Subtle Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.4)_100%)]" />
        
        {/* Noise Texture */}
        <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#3B82F6]/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#6366F1]/5 blur-[120px]" />
      </div>

      {/* ── LEFT SIDEBAR ── */}
      <aside className="w-full lg:w-[420px] shrink-0 flex flex-col h-screen sticky top-0 bg-[#020617]/90 backdrop-blur-xl border-r border-white/5 z-20 shadow-2xl overflow-y-auto">
        <div className="flex flex-col flex-1 p-8 md:p-10">

          {/* Logo */}
          <div className="flex items-center gap-4 mb-12">
            <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#3B82F6] to-[#6366F1] flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)]">
              <Layers size={18} className="text-white" />
            </div>
            <span className="font-black text-[#F9FAFB] text-xl tracking-tight">Resumind</span>
          </div>

          <StepBar step={step} />

          <div className="space-y-10 flex-1">

            {/* Upload */}
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="w-5 h-5 rounded-lg bg-[#111827] border border-white/5 text-[#F9FAFB]/70 flex items-center justify-center text-[9px] shadow-sm">1</span>
                Upload Resume
              </label>
              <DropZone file={resumeFile} onFile={handleFile} disabled={isAnalyzing} />
            </div>

            {/* Job Context */}
            <div className={cls('space-y-6 transition-all duration-500', step >= 2 ? 'opacity-100' : 'opacity-30 pointer-events-none')}>
              
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-[0.2em] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-lg bg-[#111827] border border-white/5 text-[#F9FAFB]/70 flex items-center justify-center text-[9px] shadow-sm">2</span>
                  Job Context
                </label>
              </div>

              {/* Job Role Input */}
              <div className="space-y-2">
                <p className="text-[9px] font-bold text-[#9CA3AF]/60 uppercase tracking-widest px-1">Job Role</p>
                <input
                  type="text"
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full bg-[#111827]/40 border border-white/5 rounded-[12px] p-3 text-sm text-[#F9FAFB] placeholder:text-[#9CA3AF]/30 focus:outline-none focus:border-[#3B82F6]/50 transition-all"
                />
              </div>

              {/* Experience & Keywords Row */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-[9px] font-bold text-[#9CA3AF]/60 uppercase tracking-widest px-1">Experience Level</p>
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full bg-[#111827]/40 border border-white/5 rounded-[12px] p-3 text-sm text-[#F9FAFB] focus:outline-none focus:border-[#3B82F6]/50 transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-[#020617]">Select Experience</option>
                    <option value="intern" className="bg-[#020617]">Internship / Student</option>
                    <option value="entry" className="bg-[#020617]">Entry Level (0-2 years)</option>
                    <option value="mid" className="bg-[#020617]">Mid Level (3-5 years)</option>
                    <option value="senior" className="bg-[#020617]">Senior (5-8 years)</option>
                    <option value="lead" className="bg-[#020617]">Lead / Architect (8+ years)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <p className="text-[9px] font-bold text-[#9CA3AF]/60 uppercase tracking-widest">Required Skills</p>
                    {jobSkills.length > 0 && <span className="text-[9px] font-bold text-[#3B82F6]">{jobSkills.length} selected</span>}
                  </div>
                  <ChipInput chips={jobSkills} setChips={setJobSkills} disabled={isAnalyzing} />
                </div>
              </div>

              {/* Filters */}
              <div className="space-y-3 pt-2">
                <p className="text-[9px] font-bold text-[#9CA3AF]/60 uppercase tracking-widest px-1">Work Preferences</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(filters).map(([key, active]) => (
                    <button
                      key={key}
                      onClick={() => setFilters(prev => ({ ...prev, [key]: !prev[key] }))}
                      className={cls(
                        'px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all duration-300',
                        active 
                          ? 'bg-[#3B82F6]/10 border-[#3B82F6]/40 text-[#3B82F6] shadow-[0_0_10px_rgba(59,130,246,0.1)]' 
                          : 'bg-[#111827]/40 border-white/5 text-[#9CA3AF] hover:border-white/10'
                      )}
                    >
                      {key}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-3 text-[#EF4444] bg-[rgba(239,68,68,0.1)] border border-[#EF4444]/20 p-4 rounded-[14px] text-sm font-semibold shadow-sm">
                <AlertCircle size={16} className="shrink-0" /> {error}
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="pt-10 mt-auto">
            <button
              onClick={handleAnalyze}
              disabled={!canAnalyze}
              className={cls(
                'w-full py-4 rounded-[14px] text-[15px] font-bold tracking-wide flex items-center justify-center gap-3 transition-all duration-300 relative overflow-hidden',
                canAnalyze
                  ? 'bg-gradient-to-r from-[#3B82F6] to-[#6366F1] text-white hover:scale-[1.02] shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)] active:scale-100'
                  : 'bg-[#111827] text-[#9CA3AF]/50 cursor-not-allowed border border-white/5'
              )}
            >
              {isAnalyzing
                ? <><div className="w-5 h-5 border-[3px] border-white/20 border-t-white rounded-full animate-spin" /> Analyzing Document...</>
                : <span className="flex items-center gap-2 drop-shadow-md">Analyze Resume <Sparkles size={16} className="ml-1" /></span>
              }
            </button>
          </div>

        </div>
      </aside>

      {/* ── RIGHT PANEL ── */}
      <main className="flex-1 relative z-10 overflow-y-auto h-screen bg-transparent">
        {isAnalyzing  && <ScanningView progress={progress} />}
        {!isAnalyzing && !result && <EmptyDashboard />}
        {!isAnalyzing && result  && <ResultDashboard result={result} file={resumeFile} onReset={handleReset} />}
      </main>

    </div>
  );
}
