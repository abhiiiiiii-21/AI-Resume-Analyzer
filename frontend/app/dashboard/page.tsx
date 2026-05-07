"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useUser, useAuth } from "@clerk/nextjs";
import {
  FileText, ScanSearch, Download, TrendingUp, TrendingDown,
  Plus, ArrowRight, Clock, Pencil, Trash2, Loader2,
  BarChart3, Sparkles, RefreshCw,
} from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

// ── Types ──────────────────────────────────────────────────────────────────────
interface Stats {
  totalDrafts: number;
  totalATSScans: number;
  totalPDFs: number;
  avgATSScore: number;
}

interface Draft {
  id: string;
  title: string;
  theme: string;
  updatedAt: string;
  createdAt: string;
}

interface ATSRecord {
  id: string;
  score: number;
  jobRole: string | null;
  fileName: string | null;
  createdAt: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function timeAgo(date: string) {
  const now = Date.now();
  const diff = now - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return "Just now";
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short", day: "numeric",
  });
}

const themeColors: Record<string, string> = {
  default: "bg-blue-100 text-blue-700",
  modern: "bg-purple-100 text-purple-700",
  professional: "bg-emerald-100 text-emerald-700",
  compact: "bg-orange-100 text-orange-700",
};

// ── Stat Card ──────────────────────────────────────────────────────────────────
function StatCard({
  label, value, sub, icon: Icon, trend, trendValue, highlight,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  trend?: "up" | "down" | null;
  trendValue?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`relative rounded-2xl p-6 flex flex-col gap-3 overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
        highlight
          ? "bg-[#1C4ED6] text-white shadow-[0_8px_30px_rgba(28,78,214,0.35)]"
          : "bg-white border border-neutral-100 shadow-sm"
      }`}
    >
      {/* Background glow for highlighted card */}
      {highlight && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
      )}

      <div className="flex items-start justify-between relative z-10">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center ${
            highlight ? "bg-white/20" : "bg-[#EEF2FF]"
          }`}
        >
          <Icon size={20} className={highlight ? "text-white" : "text-[#1C4ED6]"} />
        </div>
        {trend && trendValue && (
          <span
            className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
              trend === "up"
                ? highlight
                  ? "bg-white/20 text-white"
                  : "bg-green-50 text-green-600"
                : "bg-red-50 text-red-600"
            }`}
          >
            {trend === "up" ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {trendValue}
          </span>
        )}
      </div>

      <div className="relative z-10">
        <p
          className={`text-3xl font-bold font-manrope tracking-tight ${
            highlight ? "text-white" : "text-neutral-900"
          }`}
        >
          {value}
        </p>
        <p
          className={`text-sm font-semibold mt-1 font-manrope ${
            highlight ? "text-blue-100" : "text-neutral-500"
          }`}
        >
          {label}
        </p>
        {sub && (
          <p className={`text-xs mt-0.5 ${highlight ? "text-blue-200" : "text-neutral-400"}`}>
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Chart Config ──────────────────────────────────────────────────────────────
const chartConfig: ChartConfig = {
  score: {
    label: "ATS Score",
    color: "#1C4ED6",
  },
};

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();

  const [stats, setStats] = useState<Stats | null>(null);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [atsHistory, setATSHistory] = useState<ATSRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5005/api";
      const headers = { Authorization: `Bearer ${token}` };

      const [statsRes, draftsRes, atsRes] = await Promise.all([
        fetch(`${baseUrl}/dashboard/stats`, { headers }),
        fetch(`${baseUrl}/dashboard/drafts`, { headers }),
        fetch(`${baseUrl}/dashboard/ats-record`, { headers }),
      ]);
      const [statsJson, draftsJson, atsJson] = await Promise.all([
        statsRes.json(),
        draftsRes.json(),
        atsRes.json(),
      ]);
      if (statsJson.success) setStats(statsJson.data);
      if (draftsJson.success) setDrafts(draftsJson.data);
      if (atsJson.success) setATSHistory(atsJson.data);
    } catch (err) {
      console.error("Dashboard fetchData error:", err);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    if (isLoaded) fetchData();
  }, [isLoaded, fetchData]);

  const handleDeleteDraft = async (id: string) => {
    setDeletingId(id);
    try {
      const token = await getToken();
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5005/api";
      const res = await fetch(`${baseUrl}/resume-builder/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setDrafts((prev) => prev.filter((d) => d.id !== id));
        setStats((prev) => prev ? { ...prev, totalDrafts: prev.totalDrafts - 1 } : prev);
        toast.success("Draft deleted");
      }
    } catch {
      toast.error("Failed to delete draft");
    } finally {
      setDeletingId(null);
    }
  };

  // Chart data — label each point with a short date
  const chartData = atsHistory.map((r) => ({
    date: formatDate(r.createdAt),
    score: r.score,
    role: r.jobRole || "—",
  }));

  // Compute ATS trend
  const lastTwo = atsHistory.slice(-2);
  const atsTrend =
    lastTwo.length === 2
      ? lastTwo[1].score >= lastTwo[0].score
        ? "up"
        : "down"
      : null;
  const atsTrendVal =
    lastTwo.length === 2
      ? `${Math.abs(lastTwo[1].score - lastTwo[0].score)}pts`
      : undefined;

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="text-[#1C4ED6] animate-spin" />
          <p className="text-sm text-neutral-500 font-manrope font-medium">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  const firstName = user?.firstName || user?.emailAddresses[0]?.emailAddress.split("@")[0] || "there";

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto">

      {/* ── HEADER ── */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 font-manrope">
            Hi, {firstName}! 👋
          </h1>
          <p className="text-neutral-500 mt-1 text-sm font-medium">
            Here's what's happening with your resumes today.
          </p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-neutral-900 bg-white border border-neutral-200 px-3 py-2 rounded-xl hover:bg-neutral-50 transition-all shadow-sm font-manrope"
        >
          <RefreshCw size={13} />
          Refresh
        </button>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Resumes Built"
          value={stats?.totalDrafts ?? 0}
          sub="Saved drafts"
          icon={FileText}
          trend="up"
          trendValue={stats?.totalDrafts ? "+1" : undefined}
          highlight
        />
        <StatCard
          label="ATS Scans"
          value={stats?.totalATSScans ?? 0}
          sub="Total analyses run"
          icon={ScanSearch}
          trend={atsTrend}
          trendValue={atsTrendVal}
        />
        <StatCard
          label="Avg ATS Score"
          value={stats?.avgATSScore ? `${stats.avgATSScore}%` : "—"}
          sub="Across all scans"
          icon={BarChart3}
          trend={atsTrend}
          trendValue={atsTrendVal}
        />
        <StatCard
          label="PDFs Generated"
          value={stats?.totalPDFs ?? 0}
          sub="Builder + Optimized"
          icon={Download}
        />
      </div>

      {/* ── MAIN GRID ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ── ATS SCORE CHART (2/3 width) ── */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-neutral-900 font-manrope">ATS Score History</h2>
              <p className="text-xs text-neutral-400 mt-0.5 font-medium">Your score trend over time</p>
            </div>
            <Link
              href="/ats"
              className="flex items-center gap-1.5 text-xs font-bold text-[#1C4ED6] hover:underline font-manrope"
            >
              New Scan <ArrowRight size={12} />
            </Link>
          </div>

          {chartData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#EEF2FF] flex items-center justify-center mb-4">
                <BarChart3 size={24} className="text-[#1C4ED6]" />
              </div>
              <p className="text-sm font-bold text-neutral-700 font-manrope">No scans yet</p>
              <p className="text-xs text-neutral-400 mt-1 max-w-xs">
                Run your first ATS analysis and your score history will appear here.
              </p>
              <Link
                href="/ats"
                className="mt-4 inline-flex items-center gap-2 bg-[#1C4ED6] text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-blue-700 transition-all font-manrope shadow-[0_4px_14px_rgba(28,78,214,0.3)]"
              >
                <ScanSearch size={13} /> Analyze Resume
              </Link>
            </div>
          ) : (
            <ChartContainer config={chartConfig} className="h-56 w-full">
              <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1C4ED6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#1C4ED6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: "#9ca3af", fontFamily: "var(--font-manrope)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: "#9ca3af", fontFamily: "var(--font-manrope)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, _name, item) => (
                        <div className="flex flex-col gap-1 font-manrope">
                          <span className="text-xs font-bold text-neutral-900">Score: {value}%</span>
                          {item.payload?.role && item.payload.role !== "—" && (
                            <span className="text-[10px] text-neutral-500">{item.payload.role}</span>
                          )}
                        </div>
                      )}
                    />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#1C4ED6"
                  strokeWidth={2.5}
                  fill="url(#scoreGradient)"
                  dot={{ fill: "#1C4ED6", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: "#1C4ED6" }}
                />
              </AreaChart>
            </ChartContainer>
          )}
        </div>

        {/* ── QUICK ACTIONS (1/3 width) ── */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 flex flex-col">
          <h2 className="text-base font-bold text-neutral-900 font-manrope mb-5">Quick Actions</h2>
          <div className="flex flex-col gap-3 flex-1">
            {[
              {
                href: "/resume-builder",
                icon: Plus,
                label: "New Resume",
                sub: "Start from scratch",
                color: "bg-[#1C4ED6] text-white shadow-[0_4px_14px_rgba(28,78,214,0.3)] hover:bg-blue-700",
                iconColor: "text-white",
              },
              {
                href: "/ats",
                icon: ScanSearch,
                label: "ATS Analysis",
                sub: "Score your resume",
                color: "bg-[#EEF2FF] text-[#1C4ED6] hover:bg-blue-100",
                iconColor: "text-[#1C4ED6]",
              },
              {
                href: "/dashboard/enhance",
                icon: Sparkles,
                label: "AI Optimizer",
                sub: "Enhance with AI",
                color: "bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border border-neutral-100",
                iconColor: "text-neutral-600",
              },
              {
                href: "/ai-builder",
                icon: FileText,
                label: "AI Resume Builder",
                sub: "Chat to build resume",
                color: "bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border border-neutral-100",
                iconColor: "text-neutral-600",
              },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className={`flex items-center gap-4 px-4 py-4 rounded-xl font-manrope font-semibold text-sm transition-all group ${action.color}`}
                >
                  <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                    <Icon size={17} className={action.iconColor} />
                  </div>
                  <div>
                    <p className="font-bold leading-tight">{action.label}</p>
                    <p className="text-[11px] opacity-70 mt-0.5">{action.sub}</p>
                  </div>
                  <ArrowRight size={15} className="ml-auto opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </Link>
              );
            })}
          </div>

          {/* Latest ATS score pill */}
          {atsHistory.length > 0 && (
            <div className="mt-5 pt-5 border-t border-neutral-100">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2 font-manrope">Latest ATS Score</p>
              <div className="flex items-center gap-3">
                <div
                  className={`text-2xl font-bold font-manrope ${
                    atsHistory[atsHistory.length - 1].score >= 70
                      ? "text-green-600"
                      : atsHistory[atsHistory.length - 1].score >= 50
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {atsHistory[atsHistory.length - 1].score}%
                </div>
                <Badge
                  className={`text-[10px] ${
                    atsHistory[atsHistory.length - 1].score >= 60
                      ? "bg-green-50 text-green-700 border-green-100"
                      : "bg-red-50 text-red-700 border-red-100"
                  }`}
                  variant="outline"
                >
                  {atsHistory[atsHistory.length - 1].score >= 60 ? "ATS Ready ✓" : "Needs Work"}
                </Badge>
              </div>
              {atsHistory[atsHistory.length - 1].jobRole && (
                <p className="text-xs text-neutral-400 mt-1 font-medium">
                  {atsHistory[atsHistory.length - 1].jobRole}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── RECENT DRAFTS ── */}
      <div className="mt-6 bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-neutral-900 font-manrope">
            Recent Drafts
          </h2>
          <Link
            href="/resume-builder"
            className="flex items-center gap-1.5 text-xs font-bold text-[#1C4ED6] hover:underline font-manrope"
          >
            <Plus size={12} /> New Draft
          </Link>
        </div>

        {drafts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#EEF2FF] flex items-center justify-center mb-4">
              <FileText size={24} className="text-[#1C4ED6]" />
            </div>
            <p className="text-sm font-bold text-neutral-700 font-manrope">No drafts yet</p>
            <p className="text-xs text-neutral-400 mt-1 max-w-xs">
              Start building your resume and click Save — it'll appear here so you can continue anytime.
            </p>
            <Link
              href="/resume-builder"
              className="mt-4 inline-flex items-center gap-2 bg-[#1C4ED6] text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-blue-700 transition-all font-manrope shadow-[0_4px_14px_rgba(28,78,214,0.3)]"
            >
              <Plus size={13} /> Create Resume
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* New Draft card */}
            <Link
              href="/resume-builder"
              className="flex flex-col items-center justify-center gap-2 h-36 rounded-xl border-2 border-dashed border-neutral-200 hover:border-[#1C4ED6] hover:bg-[#EEF2FF]/40 transition-all group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-neutral-100 group-hover:bg-[#1C4ED6] flex items-center justify-center transition-all">
                <Plus size={18} className="text-neutral-400 group-hover:text-white" />
              </div>
              <span className="text-xs font-bold text-neutral-400 group-hover:text-[#1C4ED6] font-manrope">New Draft</span>
            </Link>

            {drafts.map((draft) => (
              <div
                key={draft.id}
                className="relative h-36 rounded-xl border border-neutral-100 bg-gradient-to-br from-neutral-50 to-white p-4 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all group overflow-hidden"
              >
                {/* Top accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#1C4ED6] rounded-t-xl" />

                <div>
                  <p className="text-sm font-bold text-neutral-900 font-manrope truncate leading-snug">
                    {draft.title}
                  </p>
                  <span className={`inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${themeColors[draft.theme] || "bg-neutral-100 text-neutral-600"}`}>
                    {draft.theme}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[10px] text-neutral-400 font-medium">
                    <Clock size={10} /> {timeAgo(draft.updatedAt)}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDeleteDraft(draft.id)}
                      disabled={deletingId === draft.id}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                    >
                      {deletingId === draft.id ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Trash2 size={12} />
                      )}
                    </button>
                    <Link
                      href={`/resume-builder?draft=${draft.id}`}
                      className="flex items-center gap-1 text-[11px] font-bold text-[#1C4ED6] hover:text-blue-800 bg-[#EEF2FF] px-2.5 py-1.5 rounded-lg font-manrope transition-all hover:bg-blue-100"
                    >
                      <Pencil size={10} /> Edit
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── AI BUILDER SESSIONS ── */}
      <div className="mt-6 bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-bold text-neutral-900 font-manrope">AI Builder Sessions</h2>
            <p className="text-xs text-neutral-400 mt-0.5 font-medium">Your AI-powered resume building conversations</p>
          </div>
          <Link
            href="/ai-builder"
            className="flex items-center gap-1.5 text-xs font-bold text-[#1C4ED6] hover:underline font-manrope"
          >
            <Plus size={12} /> New Session
          </Link>
        </div>

        <div className="flex flex-col gap-2">
          {/* We'll show a placeholder that links to the AI Builder */}
          <Link
            href="/ai-builder"
            className="flex items-center gap-4 px-4 py-4 rounded-xl bg-gradient-to-r from-[#EEF2FF] to-[#F0F4FF] hover:from-[#E0E7FF] hover:to-[#EEF2FF] border border-blue-100 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#1C4ED6] flex items-center justify-center shrink-0 shadow-[0_4px_14px_rgba(28,78,214,0.3)]">
              <Sparkles size={18} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-neutral-900 font-manrope">Open AI Resume Builder</p>
              <p className="text-[11px] text-neutral-500 mt-0.5 font-medium">
                Chat with AI to build, manage, and download your resumes
              </p>
            </div>
            <ArrowRight size={15} className="text-[#1C4ED6] opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </Link>
        </div>
      </div>

      {/* ── RECENT ATS HISTORY TABLE ── */}
      {atsHistory.length > 0 && (
        <div className="mt-6 bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-neutral-900 font-manrope">ATS Scan History</h2>
            <Link
              href="/ats"
              className="flex items-center gap-1.5 text-xs font-bold text-[#1C4ED6] hover:underline font-manrope"
            >
              New Scan <ArrowRight size={12} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100">
                  <th className="text-left text-[10px] font-bold text-neutral-400 uppercase tracking-widest pb-3 font-manrope">Date</th>
                  <th className="text-left text-[10px] font-bold text-neutral-400 uppercase tracking-widest pb-3 font-manrope">File</th>
                  <th className="text-left text-[10px] font-bold text-neutral-400 uppercase tracking-widest pb-3 font-manrope">Role</th>
                  <th className="text-left text-[10px] font-bold text-neutral-400 uppercase tracking-widest pb-3 font-manrope">Score</th>
                  <th className="text-left text-[10px] font-bold text-neutral-400 uppercase tracking-widest pb-3 font-manrope">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {[...atsHistory].reverse().slice(0, 8).map((record) => (
                  <tr key={record.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="py-3 text-neutral-500 text-xs font-medium font-manrope">
                      {formatDate(record.createdAt)}
                    </td>
                    <td className="py-3 text-neutral-700 font-medium text-xs max-w-[150px] truncate font-manrope">
                      {record.fileName || "—"}
                    </td>
                    <td className="py-3 text-neutral-700 font-medium text-xs max-w-[160px] truncate font-manrope">
                      {record.jobRole || "—"}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${record.score}%`,
                              background: record.score >= 70 ? "#16a34a" : record.score >= 50 ? "#ca8a04" : "#dc2626",
                            }}
                          />
                        </div>
                        <span className="text-xs font-bold text-neutral-900 font-manrope">{record.score}%</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold ${
                          record.score >= 60
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {record.score >= 60 ? "ATS Ready" : "Needs Work"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="pb-8" />
    </div>
  );
}