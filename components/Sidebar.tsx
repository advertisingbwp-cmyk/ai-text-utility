"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Sparkles,
  Command as CommandIcon,
  Layers,
  Star,
  Clock,
  ExternalLink,
} from "lucide-react";
import { CATEGORIES, ToolCategory } from "@/data/toolsRegistry";
import { DynamicIcon } from "@/components/DynamicIcon";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BrandLogo } from "@/components/BrandLogo";

interface SidebarProps {
  onOpenCommandPalette?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenCommandPalette }) => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  const sidebarContent = (
    <aside className="flex flex-col h-full bg-slate-950/90 text-slate-200 border-r border-slate-800/80 select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/80">
        <Link
          href="/"
          onClick={closeMobile}
          className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-brand-500/50 rounded-lg p-0.5"
          aria-label="AI Text Utility Home"
        >
          <BrandLogo size="md" showSubtitle={true} />
        </Link>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
            className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Quick Search & Command Trigger */}
      <div className="px-4 py-3">
        <button
          type="button"
          onClick={() => {
            closeMobile();
            if (onOpenCommandPalette) onOpenCommandPalette();
          }}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-slate-800 bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:border-slate-700 text-xs transition-all shadow-inner group"
        >
          <span className="flex items-center gap-2">
            <CommandIcon size={14} className="group-hover:text-brand-400" />
            Quick search...
          </span>
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-slate-700 bg-slate-800 text-slate-400">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-5 scrollbar-thin scrollbar-thumb-slate-800">
        <div>
          <div className="px-3 pb-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Explore
          </div>
          <nav className="space-y-0.5">
            <Link
              href="/"
              onClick={closeMobile}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                pathname === "/"
                  ? "bg-brand-500/10 text-brand-300 font-semibold border border-brand-500/20"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/60"
              }`}
            >
              <Layers size={16} />
              All Utilities
            </Link>

            <Link
              href="/#favorites"
              onClick={closeMobile}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-100 hover:bg-slate-900/60 transition-colors"
            >
              <Star size={16} className="text-amber-400/80" />
              Starred Tools
            </Link>

            <Link
              href="/#recent"
              onClick={closeMobile}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-100 hover:bg-slate-900/60 transition-colors"
            >
              <Clock size={16} className="text-blue-400/80" />
              Recently Used
            </Link>
          </nav>
        </div>

        {/* Categories */}
        <div>
          <div className="px-3 pb-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Categories
          </div>
          <nav className="space-y-0.5">
            {CATEGORIES.map((cat) => {
              const isAI = cat.name === ("AI Magic" as ToolCategory);
              return (
                <Link
                  key={cat.name}
                  href={`/#category-${cat.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  onClick={closeMobile}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors group ${
                    isAI
                      ? "text-purple-300 hover:text-purple-200 hover:bg-purple-950/20"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/60"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    {isAI ? (
                      <Sparkles size={15} className="text-purple-400" />
                    ) : (
                      <DynamicIcon name={cat.icon} size={15} />
                    )}
                    {cat.name}
                  </span>
                  {isAI && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      AI
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 text-[11px] text-slate-500 space-y-2">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Browser Native
          </span>
          <span className="font-mono text-[10px]">100% Private</span>
        </div>
        <div className="flex items-center gap-3 pt-1 text-[10px] text-slate-500">
          <Link href="/privacy" onClick={closeMobile} className="hover:text-slate-300 transition-colors">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link href="/terms" onClick={closeMobile} className="hover:text-slate-300 transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed Left) */}
      <div className="hidden md:block w-64 shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </div>

      {/* Mobile Top Navigation Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            className="p-1.5 text-slate-300 hover:text-white rounded-lg border border-slate-800 bg-slate-900"
          >
            <Menu size={20} />
          </button>
          <Link href="/" className="flex items-center" aria-label="AI Text Utility Home">
            <BrandLogo size="sm" />
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {onOpenCommandPalette && (
            <button
              type="button"
              onClick={onOpenCommandPalette}
              aria-label="Search tools"
              className="p-1.5 text-slate-300 hover:text-white rounded-lg border border-slate-800 bg-slate-900"
            >
              <CommandIcon size={16} />
            </button>
          )}
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Drawer Backdrop & Menu */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-4/5 max-w-xs h-full bg-slate-950 shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
