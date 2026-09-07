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
      <div className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-800 bg-slate-900/40">
        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
          <Wrench size={16} />
        </div>
        <div>
          <div className="text-[11px] font-medium text-slate-400">Total Tools</div>
          <div className="text-base font-bold text-slate-100">{totalTools}</div>
        </div>
      </div>

      <div className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-800 bg-slate-900/40">
        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
          <Star size={16} />
        </div>
        <div>
          <div className="text-[11px] font-medium text-slate-400">Favorites</div>
          <div className="text-base font-bold text-slate-100">{favCount}</div>
        </div>
      </div>

      <div className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-800 bg-slate-900/40">
        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
          <History size={16} />
        </div>
        <div>
          <div className="text-[11px] font-medium text-slate-400">Recently Used</div>
          <div className="text-base font-bold text-slate-100">{recentCount}</div>
        </div>
      </div>

      <div className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-800 bg-slate-900/40">
        <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
          <Filter size={16} />
        </div>
        <div>
          <div className="text-[11px] font-medium text-slate-400">
            {activeCategory === "ALL" ? "Showing" : activeCategory}
          </div>
          <div className="text-base font-bold text-slate-100">
            {filteredCount}
          </div>
        </div>
      </div>
    </div>
  );
};
