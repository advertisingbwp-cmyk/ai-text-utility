"use client";

import React, { useEffect, useState } from "react";
import { Wrench, Star, History, Filter } from "lucide-react";
import { getFavorites, getRecentTools } from "@/lib/storage";

interface StatsBarProps {
  totalTools: number;
  filteredCount: number;
  activeCategory: string;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  totalTools,
  filteredCount,
  activeCategory,
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
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 shadow-subtle backdrop-blur-xs">
        <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 flex items-center justify-center">
          <Wrench size={16} />
        </div>
        <div>
          <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Total Tools</div>
          <div className="text-base font-bold text-slate-900 dark:text-slate-100">{totalTools}</div>
        </div>
      </div>

      <div className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 shadow-subtle backdrop-blur-xs">
        <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60 flex items-center justify-center">
          <Star size={16} />
        </div>
        <div>
          <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Favorites</div>
          <div className="text-base font-bold text-slate-900 dark:text-slate-100">{favCount}</div>
        </div>
      </div>

      <div className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 shadow-subtle backdrop-blur-xs">
        <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-center">
          <History size={16} />
        </div>
        <div>
          <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Recently Used</div>
          <div className="text-base font-bold text-slate-900 dark:text-slate-100">{recentCount}</div>
        </div>
      </div>

      <div className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 shadow-subtle backdrop-blur-xs">
        <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-center">
          <Filter size={16} />
        </div>
        <div>
          <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            {activeCategory === "ALL" ? "Showing" : activeCategory}
          </div>
          <div className="text-base font-bold text-slate-900 dark:text-slate-100">
            {filteredCount}
          </div>
        </div>
      </div>
    </div>
  );
};
