"use client";

import React from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onOpenPalette?: () => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onOpenPalette,
  placeholder = "Search 40+ text utilities...",
  className = "",
}) => {
  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <div className="absolute left-3.5 text-slate-400 pointer-events-none">
        <Search size={18} />
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search tools"
        className="w-full pl-10 pr-24 py-2.5 rounded-xl border border-slate-800 bg-slate-900/70 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500/80 focus:ring-2 focus:ring-brand-500/20 transition-all shadow-inner"
      />

      <div className="absolute right-3 flex items-center gap-1.5">
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Clear search"
            className="p-1 text-slate-400 hover:text-slate-200 rounded-md transition-colors"
          >
            <X size={16} />
          </button>
        ) : null}

        {onOpenPalette && (
          <button
            type="button"
            onClick={onOpenPalette}
            aria-label="Open Command Palette"
            className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-slate-700/80 bg-slate-800/80 text-[10px] font-mono text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-colors"
            title="Open Command Palette"
          >
            <span className="text-[11px]">⌘</span>K
          </button>
        )}
      </div>
    </div>
  );
};
