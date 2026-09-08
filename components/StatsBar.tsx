"use client";

import React, { useEffect, useState } from "react";
import { Wrench, Star, History, Filter } from "lucide-react";
import { getFavorites, getRecentTools } from "@/lib/storage";

interface StatsBarProps {
  totalTools: number;
  filteredCount?: number;
  activeCategory?: string;
  onFavoritesClick?: () => void;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  totalTools,
  onFavoritesClick,
}) => {
  const [favCount, setFavCount] = useState<number>(0);
  const [recentCount, setRecentCount] = useState<number>(0);

  useEffect(() => {
    const update = () => {
      setFavCount(getFavorites().length);
      setRecentCount(getRecentTools().length);
    };

    update();
    window.addEventListener("favorites-updated", update);
    window.addEventListener("recent-updated", update);
    window.addEventListener("storage", update);

    return () => {
      window.removeEventListener("favorites-updated", update);
      window.removeEventListener("recent-updated", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl border border-slate-200/90 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 shadow-2xs backdrop-blur-xs text-xs">
      <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
        <div className="inline-flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 flex items-center justify-center shrink-0">
            <Wrench size={12} />
          </div>
          <span className="text-slate-600 dark:text-slate-400 font-medium">Total Tools:</span>
          <strong className="text-slate-900 dark:text-slate-100 font-bold font-mono">{totalTools}</strong>
        </div>

        <div className="hidden sm:block w-px h-3.5 bg-slate-200 dark:bg-slate-800" />

        <button
          type="button"
          onClick={onFavoritesClick}
          className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer text-left"
          title="Filter by Favorites"
        >
          <div className="w-5 h-5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-500 border border-amber-200/60 dark:border-amber-800/60 flex items-center justify-center shrink-0">
            <Star size={12} className={favCount > 0 ? "fill-amber-400 text-amber-400" : ""} />
          </div>
          <span className="text-slate-600 dark:text-slate-400 font-medium">Favorites:</span>
          <strong className="text-amber-600 dark:text-amber-400 font-bold font-mono">{favCount}</strong>
        </button>

        <div className="hidden sm:block w-px h-3.5 bg-slate-200 dark:bg-slate-800" />

        <div className="inline-flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-center shrink-0">
            <History size={12} />
          </div>
          <span className="text-slate-600 dark:text-slate-400 font-medium">Recently Used:</span>
          <strong className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">{recentCount}</strong>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>100% Client-Side • Zero Latency</span>
      </div>
    </div>
  );
};
