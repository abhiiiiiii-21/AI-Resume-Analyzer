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
  <div className={cls('bg-white border border-neutral-200 rounded-[20px] shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden', className)}>
    {children}
  </div>
);

/* ── Step bar ── */
const STEPS = ['Upload', 'Keywords', 'Analyze', 'Results'];

function StepBar({ step }) {
  return (
    <div className="relative flex items-center justify-between mb-10 px-1">
      <div className="absolute top-3 left-0 right-0 h-px bg-neutral-100" />
      <div
        className="absolute top-3 left-0 h-px bg-[#1C4ED6] transition-all duration-500"
        style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
      />
      {STEPS.map((label, i) => {
        const done   = step >  i + 1;
        const active = step === i + 1;
        return (
          <div key={label} className="flex flex-col items-center z-10">
            <div className={cls(
              'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all duration-300 font-manrope',
              done    ? 'bg-[#1C4ED6] border-[#1C4ED6] text-white' :
              active  ? 'bg-white border-[#1C4ED6] text-[#1C4ED6] shadow-[0_0_10px_rgba(28,78,214,0.2)]' :
                        'bg-white border-neutral-200 text-neutral-400'
            )}>
              {done ? <CheckCircle2 size={12} /> : i + 1}
            </div>
            <span className={cls(
              'text-[9px] font-bold uppercase tracking-widest mt-2 transition-colors font-manrope',
              active || done ? 'text-neutral-900' : 'text-neutral-600'
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
        'relative flex flex-col items-center justify-center rounded-[20px] border border-dashed transition-all duration-300 overflow-hidden',
        disabled ? 'opacity-40 pointer-events-none' : 'cursor-pointer',
        dragging  ? 'border-[#1C4ED6] bg-[#1C4ED6]/5 scale-[1.01]' :
        file      ? 'border-[#1C4ED6]/40 bg-blue-50/30 h-24' :
                    'border-neutral-200 bg-white hover:border-[#1C4ED6]/40 hover:bg-neutral-50 h-44 shadow-sm'
      )}
    >
      {file ? (
        <div className="flex items-center gap-4 w-full px-5">
          <div className="w-10 h-10 rounded-xl bg-[#1C4ED6]/5 border border-[#1C4ED6]/10 flex items-center justify-center shrink-0">
            <FileText size={18} className="text-[#1C4ED6]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-neutral-900 truncate font-manrope">{file.name}</p>
            <p className="text-xs text-neutral-600 mt-0.5 font-medium">{(file.size / 1024).toFixed(0)} KB · Ready</p>
          </div>
          <button type="button" onClick={(e) => { e.stopPropagation(); onFile(null); }}
            className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50">
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="text-center px-6 group">
          <div className="w-12 h-12 rounded-[16px] bg-neutral-50 border border-neutral-100 mx-auto mb-3 flex items-center justify-center transition-all group-hover:bg-[#1C4ED6]/5 group-hover:scale-[1.05] group-hover:border-[#1C4ED6]/20 shadow-sm">
            <UploadCloud size={22} className="text-neutral-500 group-hover:text-[#1C4ED6] transition-colors" />
          </div>
          <p className="text-sm font-semibold text-neutral-800 font-manrope">Drop file or <span className="text-[#1C4ED6] underline underline-offset-4 decoration-[#1C4ED6]/30">browse</span></p>
          <p className="text-xs text-neutral-500 mt-1 font-medium">PDF · DOCX · Max 5 MB</p>
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
      'bg-white border rounded-[16px] p-4 transition-all focus-within:border-[#1C4ED6]/40 focus-within:ring-4 focus-within:ring-[#1C4ED6]/5 shadow-sm',
      disabled ? 'border-neutral-100 opacity-40 pointer-events-none' : 'border-neutral-200 hover:border-neutral-300'
    )}>
      <div className="flex flex-wrap gap-2 mb-3 min-h-[28px]">
        {chips.map((c) => (
          <span key={c} className="flex items-center gap-1.5 px-3 py-1 bg-[#1C4ED6]/5 border border-[#1C4ED6]/10 text-[#1C4ED6] rounded-lg text-xs font-semibold tracking-wide font-manrope">
            {c}
            <button type="button" onClick={() => setChips(chips.filter((x) => x !== c))}>
              <X size={12} className="hover:text-red-500 transition-colors" />
            </button>
          </span>
        ))}
        <input
          type="text" value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={onKey}
          placeholder={chips.length === 0 ? 'Type keyword → Enter...' : 'Add more...'}
          className="flex-1 min-w-[120px] bg-transparent text-sm text-neutral-900 placeholder:text-neutral-300 focus:outline-none py-0.5"
        />
      </div>

      {chips.length === 0 && (
        <div className="pt-4 border-t border-neutral-100">
          <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest mb-3 font-manrope">Suggestions</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button key={s} type="button" onClick={() => add(s)}
                className="text-[10px] px-2.5 py-1 bg-neutral-50 text-neutral-700 border border-neutral-200 rounded-lg hover:bg-[#1C4ED6]/5 hover:text-[#1C4ED6] hover:border-[#1C4ED6]/20 transition-all font-bold font-manrope">
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
    <div className="h-full flex flex-col items-center justify-center px-10 py-20 relative z-10 bg-white/40 backdrop-blur-sm">
      <div className="relative w-full max-w-sm h-72 rounded-[24px] bg-white border border-neutral-200 overflow-hidden flex items-center justify-center shadow-2xl mb-10">
        <FileText size={88} className="text-neutral-100" />
        <div className="absolute left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-[#1C4ED6] to-transparent shadow-[0_0_20px_rgba(28,78,214,0.5)] animate-[scan_2s_ease-in-out_infinite]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1C4ED6]/5 via-transparent to-transparent animate-pulse pointer-events-none" />
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes scan {
            0%   { top: 10%;  opacity: 0; }
            10%  { opacity: 1; }
            90%  { opacity: 1; }
            100% { top: 90%; opacity: 0; }
          }
        ` }} />
      </div>
      <p className="text-xl font-bold text-neutral-900 mb-2 font-manrope">Analyzing Your Resume</p>
      <p className="text-sm text-[#1C4ED6] font-bold tracking-widest mb-6 font-manrope uppercase">SCORING · {progress}%</p>
      <div className="w-64 h-2 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200 shadow-inner">
        <div className="h-full bg-[#1C4ED6] rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

/* ── Empty state ── */
function EmptyDashboard() {
  return (
    <div className="h-full flex items-center justify-center p-10 relative z-10 bg-white/40 backdrop-blur-sm">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 rounded-[24px] bg-white border border-neutral-200 flex items-center justify-center mx-auto mb-8 shadow-xl">
          <BarChart3 size={32} className="text-neutral-400" />
        </div>
        <h3 className="text-2xl font-bold text-neutral-900 mb-3 font-manrope">Awaiting Analysis</h3>
        <p className="text-sm text-neutral-700 leading-relaxed font-medium">
          Upload your resume on the left and enter a target job role or keywords to run a complete ATS compatibility scan.
        </p>
        <div className="mt-10 grid grid-cols-2 gap-4 text-left">
          {['Upload PDF or DOCX', 'Add job keywords', 'Run AI analysis', 'Get instant score'].map((t, i) => (
            <div key={t} className="flex items-center gap-3 text-xs text-neutral-800 font-bold font-manrope">
              <span className="w-6 h-6 rounded-lg bg-neutral-100 border border-neutral-200 text-neutral-500 flex items-center justify-center text-[10px] font-bold shadow-sm">{i + 1}</span>
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
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100 mb-4 shadow-sm font-manrope">
            <CheckCircle2 size={11} /> Analysis Complete
          </div>
          <h1 className="text-4xl font-bold text-neutral-900 tracking-tight font-manrope">ATS Score Report</h1>
          <p className="text-xs text-neutral-700 mt-2 font-bold uppercase tracking-wider">
            Analyzed just now &nbsp;·&nbsp; <span className="text-neutral-900 font-black tracking-normal lowercase">{file?.name}</span> &nbsp;·&nbsp; {(file?.size / 1024).toFixed(0)} KB
          </p>
        </div>
        <button onClick={onReset}
          className="flex items-center gap-2 text-xs font-bold text-neutral-700 hover:text-neutral-900 bg-white hover:bg-neutral-50 border border-neutral-300 px-5 py-3 rounded-full transition-all shadow-sm font-manrope">
          <RefreshCw size={13} /> New Scan
        </button>
      </div>

      {/* Score + Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <Card className="md:col-span-4 p-8 flex flex-col items-center justify-center text-center relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1C4ED6]/5 to-transparent pointer-events-none" />
          <CircularScore score={score} />
          <div className={cls(
            'mt-6 px-5 py-2 rounded-full border text-[10px] font-bold uppercase tracking-widest shadow-sm font-manrope',
            atsCompatible
              ? 'bg-green-50 border-green-100 text-green-600'
              : 'bg-red-50 border-red-100 text-red-600'
          )}>
            {atsCompatible ? 'ATS Compatible ✓' : 'Needs Improvement'}
          </div>
        </Card>

        <div className="md:col-span-8 space-y-6">
          <Card className="p-6 flex items-start gap-5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#1C4ED6]/5 to-blue-400/5 pointer-events-none" />
            <div className="absolute -left-px top-0 bottom-0 w-1 bg-[#1C4ED6] shadow-[0_0_10px_rgba(28,78,214,0.3)]" />
            <div className="shrink-0 w-12 h-12 rounded-[16px] bg-white border border-neutral-100 flex items-center justify-center shadow-sm relative z-10">
              <Sparkles size={20} className="text-[#1C4ED6]" />
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-[#1C4ED6] uppercase tracking-widest mb-2 font-manrope">AI Intelligence Summary</p>
              <p className="text-sm text-neutral-800 leading-relaxed font-medium">{aiSummary}</p>
            </div>
          </Card>

          <div className="grid grid-cols-3 gap-6">
            {[
              { label: 'Matched', value: matchedSkills.length, sub: 'found', color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Missing', value: missingSkills.length, sub: 'absent', color: 'text-red-600', bg: 'bg-red-50' },
              { label: 'Actions', value: suggestions.length, sub: 'tips', color: 'text-[#1C4ED6]', bg: 'bg-blue-50' },
            ].map(({ label, value, sub, color, bg }) => (
              <Card key={label} className="p-5 text-center group">
                <div className={cls("text-4xl font-bold mb-1 font-manrope", color)}>{value}</div>
                <div className="text-[10px] font-bold text-neutral-700 uppercase tracking-wider font-manrope">{label}</div>
                <div className="text-[9px] text-neutral-600 font-bold mt-1 uppercase tracking-tighter">{sub}</div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Section breakdown + keyword density */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-7">
          <div className="flex items-center gap-3 mb-7">
            <div className="p-2 bg-neutral-50 rounded-lg border border-neutral-100">
              <Target size={16} className="text-[#1C4ED6]" />
            </div>
            <h3 className="text-sm font-bold text-neutral-900 font-manrope">Section Breakdown</h3>
          </div>
          <SectionScores scores={sectionScores} />
        </Card>
        <Card className="p-7">
          <div className="flex items-center gap-3 mb-7">
            <div className="p-2 bg-neutral-50 rounded-lg border border-neutral-100">
              <TrendingUp size={16} className="text-blue-400" />
            </div>
            <h3 className="text-sm font-bold text-neutral-900 font-manrope">Keyword Density</h3>
          </div>
          <KeywordDensity keywordDensity={keywordDensity} />
        </Card>
      </div>

      {/* Matched / Missing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-7">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg border border-green-100">
                <CheckCircle2 size={16} className="text-green-600" />
              </div>
              <h3 className="text-sm font-bold text-neutral-900 font-manrope">Found Keywords</h3>
            </div>
            <span className="text-[10px] font-bold bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded-lg border border-neutral-200 font-manrope shadow-inner">{matchedSkills.length}</span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {matchedSkills.length > 0
              ? matchedSkills.map((s) => (
                  <span key={s} className="px-3.5 py-1.5 bg-green-50 border border-green-100 text-green-600 text-xs font-semibold rounded-[12px] capitalize shadow-sm tracking-wide font-manrope">{s}</span>
                ))
              : <p className="text-neutral-400 text-sm italic">No exact matches found.</p>
            }
          </div>
        </Card>

        <Card className="p-7">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 rounded-lg border border-red-100">
                <XCircle size={16} className="text-red-600" />
              </div>
              <h3 className="text-sm font-bold text-neutral-900 font-manrope">Missing Keywords</h3>
            </div>
            <span className="text-[10px] font-bold bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded-lg border border-neutral-200 font-manrope shadow-inner">{missingSkills.length}</span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {missingSkills.length > 0
              ? missingSkills.map((s) => (
                  <span key={s} className="px-3.5 py-1.5 bg-red-50 border border-red-100 text-red-600 text-xs font-semibold rounded-[12px] capitalize shadow-sm tracking-wide font-manrope">{s}</span>
                ))
              : <p className="text-green-600 text-sm font-semibold bg-green-50 px-3 py-1.5 rounded-lg inline-block font-manrope">All keywords detected ✓</p>
            }
          </div>
        </Card>
      </div>

      {/* Suggestions */}
      <Card className="p-8 relative overflow-hidden border-none shadow-xl bg-gradient-to-br from-neutral-900 to-black text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#1C4ED6]/20 blur-[100px] pointer-events-none" />
        <div className="flex items-center gap-4 mb-10">
          <div className="w-10 h-10 rounded-[12px] bg-white/10 border border-white/10 flex items-center justify-center shadow-inner relative z-10">
            <Sparkles size={18} className="text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold text-white tracking-wide relative z-10 font-manrope">AI Recommendations</h3>
          <span className="text-[10px] font-bold bg-white/10 border border-white/10 text-blue-400 px-4 py-1.5 rounded-full ml-auto relative z-10 shadow-sm font-manrope uppercase tracking-widest">{suggestions.length} actions</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
          {suggestions.map((s, i) => (
            <div key={i} className="flex items-start gap-4 bg-white/5 border border-white/5 rounded-[18px] p-6 hover:bg-white/10 hover:border-white/10 hover:-translate-y-0.5 transition-all duration-300 group">
              <div className="mt-1 shrink-0 bg-blue-500/20 p-1.5 rounded-lg text-blue-400 group-hover:scale-110 transition-transform">
                <ArrowRight size={14} />
              </div>
              <p className="text-sm text-neutral-100 leading-relaxed font-semibold">{s}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 relative z-10">
          <p className="text-xs text-neutral-200 max-w-sm leading-relaxed font-medium">Apply these expert suggestions to significantly boost your resume's ATS compatibility and capture recruiter attention instantly.</p>
          <div className="flex w-full sm:w-auto gap-4">
            <button onClick={() => window.print()}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-sm font-bold text-neutral-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3 rounded-full transition-all font-manrope">
              <Download size={15} /> Export Report
            </button>
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-sm font-bold text-white bg-[#1C4ED6] hover:bg-blue-700 px-8 py-3 rounded-full transition-all shadow-[0_8px_20px_rgba(28,78,214,0.4)] font-manrope">
              Optimize Resume <ArrowRight size={15} />
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
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#FAFAFA] text-neutral-900 font-inter relative overflow-hidden transition-colors duration-500">

      {/* ── BACKGROUND ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Base background color */}
        <div className="absolute inset-0 bg-[#FAFAFA]" />
        
        {/* Dotted pattern with linear fade-out mask */}
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.15) 1px, transparent 0)",
            backgroundSize: "24px 24px",
            maskImage: "linear-gradient(to bottom, black 10%, transparent 60%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 10%, transparent 60%)",
          }}
        />

        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-[#1C4ED6]/5 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-blue-400/5 blur-[100px]" />
      </div>

      {/* ── LEFT SIDEBAR ── */}
      <aside className="w-full lg:w-[420px] shrink-0 flex flex-col h-screen sticky top-0 bg-white/80 backdrop-blur-xl border-r border-neutral-200 z-20 shadow-xl overflow-y-auto">
        <div className="flex flex-col flex-1 p-8 md:p-10">

          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-[12px] bg-[#1C4ED6] flex items-center justify-center shadow-[0_4px_14px_rgba(28,78,214,0.3)]">
              <Layers size={18} className="text-white" />
            </div>
            <span className="font-bold text-neutral-900 text-xl tracking-tight font-manrope">Resumind</span>
          </div>

          <StepBar step={step} />

          <div className="space-y-10 flex-1">

            {/* Upload */}
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-neutral-600 uppercase tracking-[0.2em] flex items-center gap-2 font-manrope">
                <span className="w-5 h-5 rounded-lg bg-neutral-100 border border-neutral-200 text-neutral-700 flex items-center justify-center text-[9px] shadow-sm">1</span>
                Upload Resume
              </label>
              <DropZone file={resumeFile} onFile={handleFile} disabled={isAnalyzing} />
            </div>

            {/* Job Context */}
            <div className={cls('space-y-6 transition-all duration-500', step >= 2 ? 'opacity-100' : 'opacity-30 pointer-events-none')}>
              
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-neutral-600 uppercase tracking-[0.2em] flex items-center gap-2 font-manrope">
                  <span className="w-5 h-5 rounded-lg bg-neutral-100 border border-neutral-200 text-neutral-700 flex items-center justify-center text-[9px] shadow-sm">2</span>
                  Job Context
                </label>
              </div>

              {/* Job Role Input */}
              <div className="space-y-2">
                <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest px-1 font-manrope">Job Role</p>
                <input
                  type="text"
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full bg-white border border-neutral-200 rounded-[12px] p-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#1C4ED6]/50 focus:ring-4 focus:ring-[#1C4ED6]/5 transition-all shadow-sm"
                />
              </div>

              {/* Experience & Keywords Row */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest px-1 font-manrope">Experience Level</p>
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-[12px] p-3 text-sm text-neutral-900 focus:outline-none focus:border-[#1C4ED6]/50 focus:ring-4 focus:ring-[#1C4ED6]/5 transition-all appearance-none cursor-pointer shadow-sm font-medium"
                  >
                    <option value="">Select Experience</option>
                    <option value="intern">Internship / Student</option>
                    <option value="entry">Entry Level (0-2 years)</option>
                    <option value="mid">Mid Level (3-5 years)</option>
                    <option value="senior">Senior (5-8 years)</option>
                    <option value="lead">Lead / Architect (8+ years)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest font-manrope">Required Skills</p>
                    {jobSkills.length > 0 && <span className="text-[9px] font-bold text-[#1C4ED6]">{jobSkills.length} selected</span>}
                  </div>
                  <ChipInput chips={jobSkills} setChips={setJobSkills} disabled={isAnalyzing} />
                </div>
              </div>

              {/* Filters */}
              <div className="space-y-3 pt-2">
                <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest px-1 font-manrope">Work Preferences</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(filters).map(([key, active]) => (
                    <button
                      key={key}
                      onClick={() => setFilters(prev => ({ ...prev, [key]: !prev[key] }))}
                      className={cls(
                        'px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all duration-300 font-manrope',
                        active 
                          ? 'bg-[#1C4ED6] border-[#1C4ED6] text-white shadow-[0_4px_12px_rgba(28,78,214,0.2)]' 
                          : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300 shadow-sm'
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
              <div className="flex items-center gap-3 text-red-600 bg-red-50 border border-red-100 p-4 rounded-[14px] text-sm font-semibold shadow-sm">
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
                'w-full py-4 rounded-full text-[15px] font-bold tracking-wide flex items-center justify-center gap-3 transition-all duration-300 relative overflow-hidden font-manrope',
                canAnalyze
                  ? 'bg-[#1C4ED6] text-white hover:scale-[1.02] shadow-[0_8px_20px_rgba(28,78,214,0.3)] hover:shadow-[0_12px_28px_rgba(28,78,214,0.4)] active:scale-100'
                  : 'bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200'
              )}
            >
              {isAnalyzing
                ? <><div className="w-5 h-5 border-[3px] border-white/20 border-t-white rounded-full animate-spin" /> Analyzing...</>
                : <span className="flex items-center gap-2">Analyze Resume <Sparkles size={16} className="ml-1" /></span>
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
