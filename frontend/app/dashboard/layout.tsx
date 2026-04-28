"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  ScanSearch,
  Sparkles,
  Settings,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: FileText, label: "Resume Builder", href: "/resume-builder" },
  { icon: ScanSearch, label: "ATS Analyzer", href: "/ats" },
  { icon: Sparkles, label: "AI Optimizer", href: "/dashboard/enhance" },
];

function SidebarIcon({
  item,
  isActive,
}: {
  item: (typeof navItems)[0];
  isActive: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link href={item.href} className="group relative flex items-center justify-center">
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 ${
          isActive
            ? "bg-white/20 shadow-lg shadow-blue-900/30"
            : "hover:bg-white/10"
        }`}
      >
        <Icon
          size={20}
          className={isActive ? "text-white" : "text-blue-200 group-hover:text-white"}
        />
      </div>
      {/* Tooltip */}
      <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl font-manrope">
        {item.label}
        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
      </div>
    </Link>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 font-inter overflow-hidden">
      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden md:flex w-[72px] flex-col items-center py-5 gap-3 bg-[#1C4ED6] shrink-0 z-30 shadow-2xl">
        {/* Logo */}
        <Link href="/dashboard" className="mb-4">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shadow-lg shadow-blue-900/30">
            <FileText size={18} className="text-white" />
          </div>
        </Link>

        {/* Nav Icons */}
        <nav className="flex flex-col gap-2 flex-1">
          {navItems.map((item) => (
            <SidebarIcon
              key={item.href}
              item={item}
              isActive={pathname === item.href}
            />
          ))}
        </nav>

        {/* Bottom — Settings + User */}
        <div className="flex flex-col items-center gap-3 mt-auto">
          <Link href="/dashboard/settings" className="group relative flex items-center justify-center">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all duration-200">
              <Settings size={20} className="text-blue-200 group-hover:text-white" />
            </div>
          </Link>
          <div className="w-9 h-9 flex items-center justify-center">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9 ring-2 ring-white/30 rounded-full",
                },
              }}
            />
          </div>
        </div>
      </aside>

      {/* ── MOBILE SIDEBAR OVERLAY ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`fixed md:hidden left-0 top-0 h-full w-64 bg-[#1C4ED6] z-50 flex flex-col py-5 px-4 transition-transform duration-300 shadow-2xl ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <FileText size={16} className="text-white" />
            </div>
            <span className="text-white font-bold text-lg font-manrope">Resumind</span>
          </div>
          <button onClick={() => setMobileOpen(false)} className="text-blue-200 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all font-manrope font-semibold text-sm ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "text-blue-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {item.label}
                {isActive && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar (mobile only toggle) */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-neutral-200">
          <button onClick={() => setMobileOpen(true)} className="text-neutral-600">
            <Menu size={22} />
          </button>
          <span className="font-bold text-neutral-800 font-manrope">Resumind</span>
          <UserButton />
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      <Toaster position="bottom-right" richColors />
    </div>
  );
}