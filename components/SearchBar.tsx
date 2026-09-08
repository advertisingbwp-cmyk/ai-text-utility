"use client";

import React, { useState, useEffect } from "react";
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
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      setIsMac(/Mac|iPod|iPhone|iPad/.test(navigator.platform || ""));
    }
  }, []);

  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <div className="absolute left-4 text-slate-400 dark:text-slate-500 pointer-events-none">
        <Search size={20} />
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search tools"
        className="w-full pl-12 pr-28 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800/90 bg-white dark:bg-slate-900/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm sm:text-base focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 transition-all shadow-card hover:shadow-cardHover"
      />

      <div className="absolute right-3.5 flex items-center gap-2">
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Clear search"
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={16} />
          </button>
        ) : (
          <kbd
            className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700/80 bg-slate-100/90 dark:bg-slate-800/80 text-xs font-mono text-slate-500 dark:text-slate-400 select-none shadow-xs"
            title="Press to quick search"
          >
            {isMac ? "⌘K" : "Ctrl K"}
          </kbd>
        )}

        {onOpenPalette && (
          <button
            type="button"
            onClick={onOpenPalette}
            aria-label="Open Command Palette"
            className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700/80 bg-slate-100/90 dark:bg-slate-800/80 text-xs font-mono text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
            title="Open Command Palette"
          >
            {isMac ? "⌘K" : "Ctrl K"}
          </button>
        )}
      </div>
    </div>
  );
};
