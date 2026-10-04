"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Star, Clock, LayoutGrid, ArrowRight, Search } from "lucide-react";
import { TOOLS_REGISTRY, CATEGORIES, ToolCategory, ToolDefinition } from "@/data/toolsRegistry";
import { ToolCard } from "@/components/ToolCard";
import { EmptyState } from "@/components/EmptyState";
import { TerminalHero } from "@/components/TerminalHero";
import { DynamicIcon } from "@/components/DynamicIcon";
import { AdsterraSmartLink } from "@/components/ads";
import { getFavorites, getRecentTools } from "@/lib/storage";
import { getCategoryTheme, getToolTheme } from "@/lib/toolThemes";

import { FavoriteStar } from "@/components/FavoriteStar";
import { ScrollReveal } from "@/components/ScrollReveal";

function getRecentCardTheme(category: ToolCategory) {
  switch (category) {
    case "AI Magic":
      return {
        cardBg: "from-violet-500/10 via-fuchsia-500/5 to-white/70 dark:from-violet-950/30 dark:to-slate-900/50",
        border: "border-white/70 dark:border-violet-800/40 hover:border-violet-400/60",
        badge: "bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-400/25",
      };
    case "Transform":
      return {
        cardBg: "from-purple-500/10 via-indigo-500/5 to-white/70 dark:from-purple-950/30 dark:to-slate-900/50",
        border: "border-white/70 dark:border-purple-800/40 hover:border-purple-400/60",
        badge: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-400/25",
      };
    case "Text":
      return {
        cardBg: "from-cyan-500/10 via-blue-500/5 to-white/70 dark:from-blue-950/30 dark:to-slate-900/50",
        border: "border-white/70 dark:border-blue-800/40 hover:border-blue-400/60",
        badge: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-400/25",
      };
    case "Format":
      return {
        cardBg: "from-emerald-500/10 via-teal-500/5 to-white/70 dark:from-emerald-950/30 dark:to-slate-900/50",
        border: "border-white/70 dark:border-emerald-800/40 hover:border-emerald-400/60",
        badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-400/25",
      };
    case "Cleanup":
      return {
        cardBg: "from-amber-500/10 via-orange-500/5 to-white/70 dark:from-amber-950/30 dark:to-slate-900/50",
        border: "border-white/70 dark:border-amber-800/40 hover:border-amber-400/60",
        badge: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-400/25",
      };
    case "Date & Time":
      return {
        cardBg: "from-sky-500/10 via-blue-500/5 to-white/70 dark:from-sky-950/30 dark:to-slate-900/50",
        border: "border-white/70 dark:border-sky-800/40 hover:border-sky-400/60",
        badge: "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-400/25",
      };
    default:
      return {
        cardBg: "from-white/80 via-white/60 to-white/70 dark:from-slate-900/60 dark:to-slate-900/80",
        border: "border-white/70 dark:border-slate-800/60 hover:border-brand-400/80",
        badge: "bg-blue-500/10 text-slate-700 dark:text-slate-300 border-blue-500/20",
      };
  }
}

const RecentToolCard: React.FC<{ tool: ToolDefinition }> = ({ tool }) => {
  const theme = getToolTheme(tool.id, tool.category);
  const recentTheme = getRecentCardTheme(tool.category);

  return (
    <div
      className={`card-3d group relative flex flex-col justify-between rounded-2xl bg-gradient-to-br ${recentTheme.cardBg} ${recentTheme.border} p-3.5 sm:p-4 active:scale-[0.99]`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2 sm:mb-2.5">
          <div
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110 shrink-0 border ${theme.bg} ${theme.border} icon-3d`}
            aria-hidden="true"
          >
            <DynamicIcon
              name={tool.icon}
              size={18}
              className={`${theme.text} transition-transform duration-200 group-hover:rotate-3`}
            />
          </div>

          <div className="relative z-20 flex items-center -mr-1 -mt-1">
            <FavoriteStar toolId={tool.id} toolName={tool.name} size={15} />
          </div>
        </div>

        <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors mb-1 line-clamp-1">
          <Link
            href={`/tools/${tool.slug}`}
            className="focus:outline-none focus:underline after:content-[''] after:absolute after:inset-0 after:rounded-2xl after:z-0"
          >
            {tool.name}
          </Link>
        </h3>
        <p className="text-[11px] sm:text-xs text-[#5F6F89] dark:text-slate-400 leading-relaxed line-clamp-2">
          {tool.description}
        </p>
      </div>

      <div className="mt-3 pt-2.5 border-t border-[rgba(100,120,160,0.12)] dark:border-slate-800/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 truncate max-w-[70%]">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border truncate ${recentTheme.badge} shadow-2xs backdrop-blur-xs`}>
            {tool.category}
          </span>
          <span className="text-[9px] font-medium px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0">
            Recent
          </span>
        </div>
        <span
          className="relative z-10 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/70 dark:bg-slate-800/70 border border-white/80 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white group-hover:border-transparent group-hover:shadow-[0_4px_10px_rgba(37,99,235,0.30)] flex items-center justify-center transition-all shadow-2xs shrink-0"
          aria-hidden="true"
        >
          <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-0.5" />
        </span>
      </div>
    </div>
  );
};

export function HomeToolsClient({ children }: { children: React.ReactNode }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [favoritesList, setFavoritesList] = useState<string[]>([]);
  const [recentList, setRecentList] = useState<string[]>([]);

  useEffect(() => {
    const updateStorage = () => {
      setFavoritesList(getFavorites());
      setRecentList(getRecentTools());
    };
    const checkFavoritesFromUrl = () => {
      if (typeof window !== "undefined" && (window.location.search.includes("favorites=true") || window.location.hash === "#favorites")) {
        setOnlyFavorites(true);
        setTimeout(() => document.getElementById("tools-section")?.scrollIntoView({ behavior: "smooth" }), 100);
      }
    };
    updateStorage();
    checkFavoritesFromUrl();
    const handleShowFavorites = () => {
      setOnlyFavorites(true);
      setTimeout(() => document.getElementById("tools-section")?.scrollIntoView({ behavior: "smooth" }), 50);
    };
    window.addEventListener("show-favorites", handleShowFavorites);
    window.addEventListener("favorites-updated", updateStorage);
    window.addEventListener("recent-updated", updateStorage);
    window.addEventListener("storage", updateStorage);
    window.addEventListener("hashchange", checkFavoritesFromUrl);
    window.addEventListener("popstate", checkFavoritesFromUrl);
    return () => {
      window.removeEventListener("show-favorites", handleShowFavorites);
      window.removeEventListener("favorites-updated", updateStorage);
      window.removeEventListener("recent-updated", updateStorage);
      window.removeEventListener("storage", updateStorage);
      window.removeEventListener("hashchange", checkFavoritesFromUrl);
      window.removeEventListener("popstate", checkFavoritesFromUrl);
    };
  }, []);

  const filteredTools = useMemo(() => TOOLS_REGISTRY.filter((tool) => {
    const matchesCat = selectedCategory === "ALL" || tool.category === selectedCategory;
    const matchesFav = !onlyFavorites || favoritesList.includes(tool.id);
    return matchesCat && matchesFav;
  }), [selectedCategory, onlyFavorites, favoritesList]);

  const recentTools = useMemo(() => recentList.map((id) => TOOLS_REGISTRY.find((t) => t.id === id)).filter((t): t is ToolDefinition => Boolean(t)).slice(0, 3), [recentList]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 sm:space-y-8 pb-16">
      <TerminalHero />

      {/* Floating Search Bar (Balanced SaaS Capsule) */}
      <div className="relative group w-full max-w-xl mx-auto -mt-2 sm:-mt-3">
        {/* Subtle Outer Ambient Glows: Soft Blue & Violet Accent */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/15 via-sky-400/10 to-purple-500/20 rounded-full blur-xs opacity-30 group-hover:opacity-60 transition duration-300 -z-10" />
        
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
          aria-label="Search tools, categories or features"
          className="search-glass-bar w-full flex items-center justify-between gap-3 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full cursor-pointer group text-left active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <Search size={17} className="text-brand-600 dark:text-brand-400 group-hover:scale-110 transition-transform shrink-0" />
            <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal group-hover:text-slate-800 dark:group-hover:text-slate-200">
              Search tools, categories or features...
            </span>
          </div>
          <div className="flex items-center shrink-0">
            <div className="relative">
              <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-3d-button group-hover:scale-105 active:scale-95 transition-all">
                <ArrowRight size={13} />
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Category Filter Rail (Functional Filters Only) */}
      <section id="tools-section" className="w-full min-w-0 scroll-mt-24 space-y-2">
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-2 scrollbar-none gap-2 sm:gap-2.5">
          <button
            type="button"
            onClick={() => { setSelectedCategory("ALL"); setOnlyFavorites(false); }}
            className={`pill-3d inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer ${
              selectedCategory === "ALL" && !onlyFavorites
                ? "pill-glass-active"
                : "pill-glass-inactive"
            }`}
          >
            <LayoutGrid size={14} />
            <span>All Tools ({TOOLS_REGISTRY.length})</span>
          </button>

          <button
            type="button"
            onClick={() => { setOnlyFavorites((prev) => !prev); if (!onlyFavorites) setSelectedCategory("ALL"); }}
            className={`pill-3d inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer ${
              onlyFavorites
                ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/40 shadow-xs backdrop-blur-md"
                : "pill-glass-inactive"
            }`}
          >
            <Star size={14} className={onlyFavorites ? "fill-amber-500 text-amber-500" : "text-amber-500"} />
            <span>Favorites ({favoritesList.length})</span>
          </button>

          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.name && !onlyFavorites;
            const catTheme = getCategoryTheme(cat.name);
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => { setSelectedCategory(cat.name); setOnlyFavorites(false); }}
                className={`pill-3d flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? "pill-glass-active"
                    : "pill-glass-inactive"
                }`}
              >
                <DynamicIcon
                  name={cat.icon}
                  size={14}
                  className={isSelected ? "text-white" : catTheme.text}
                />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Promotional Secondary Callout (Cleanly separated from category rail) */}
        <div className="flex items-center justify-end px-1">
          <AdsterraSmartLink variant="badge" label="Featured Deals" />
        </div>
      </section>

      {selectedCategory === "ALL" && !onlyFavorites && recentTools.length > 0 && (
        <ScrollReveal as="section" id="recent" aria-labelledby="recent-heading" className="space-y-3.5">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center border border-blue-500/20 backdrop-blur-sm shadow-2xs">
                <Clock size={16} />
              </div>
              <div>
                <h2 id="recent-heading" className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  Recently Used
                </h2>
                <p className="text-xs text-[#5F6F89] dark:text-slate-400">
                  Your recently accessed tools for quick access
                </p>
              </div>
            </div>
            <a
              href="#tools-section"
              className="btn-secondary h-8 px-3 rounded-full text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 group/viewall inline-flex items-center gap-1.5 transition-all duration-200"
            >
              <span>View all tools</span>
              <ArrowRight size={12} className="transition-transform duration-200 group-hover/viewall:translate-x-0.5" />
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 scroll-stagger">
            {recentTools.map((tool, idx) => (
              <div key={`recent-${tool.id}`} style={{ "--stagger-i": idx } as React.CSSProperties}>
                <RecentToolCard tool={tool} />
              </div>
            ))}
          </div>
        </ScrollReveal>
      )}

      {filteredTools.length === 0 ? (
        <EmptyState
          title={onlyFavorites ? "No favorites yet" : "No utilities found"}
          description={onlyFavorites ? "You haven't saved any favorite tools yet. Click the star icon on any tool to save it here for quick access." : "No tools found in this category. Try selecting a different category."}
          actionText="Browse All Tools"
          onAction={() => { setSelectedCategory("ALL"); setOnlyFavorites(false); }}
        />
      ) : selectedCategory === "ALL" && !onlyFavorites ? (
        <div className="space-y-10 sm:space-y-12">
          {CATEGORIES.map((cat) => {
            const toolsInCat = TOOLS_REGISTRY.filter((t) => t.category === cat.name);
            const isAI = cat.name === ("AI Magic" as ToolCategory);
            const catTheme = getCategoryTheme(cat.name);
            return (
              <ScrollReveal
                as="section"
                key={cat.name}
                id={`category-${cat.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                className="space-y-3.5 scroll-mt-20"
              >
                <div className="flex items-center justify-between border-b border-[rgba(100,120,160,0.12)] dark:border-slate-800/80 pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-xs ${catTheme.bg} ${catTheme.border} icon-3d`}>
                      <DynamicIcon name={cat.icon} size={18} className={catTheme.text} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                          {cat.name} Tools
                        </h2>
                        {isAI && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-300 border border-brand-500/20 backdrop-blur-xs">
                            AI Powered
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#5F6F89] dark:text-slate-400 mt-0.5">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-500/20 dark:border-blue-800/70 backdrop-blur-xs">
                      {toolsInCat.length} tools
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory(cat.name)}
                      className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 hover:underline inline-flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>View all</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-3.5 scroll-stagger">
                  {toolsInCat.map((tool, idx) => (
                    <div key={tool.id} style={{ "--stagger-i": idx % 5 } as React.CSSProperties}>
                      <ToolCard tool={tool} />
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      ) : (
        <ScrollReveal as="section" className="space-y-4">
          <div className="flex items-center justify-between border-b border-[rgba(100,120,160,0.12)] dark:border-slate-800/80 pb-3.5">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                {onlyFavorites ? "Your Favorited Utilities" : `${selectedCategory} Utilities`}
              </h2>
              <p className="text-xs sm:text-sm text-[#5F6F89] dark:text-slate-400 mt-0.5">
                {onlyFavorites ? `${filteredTools.length} saved tools` : `${filteredTools.length} tools found`}
              </p>
            </div>
            {onlyFavorites && (
              <button
                type="button"
                onClick={() => { setOnlyFavorites(false); setSelectedCategory("ALL"); }}
                className="text-xs sm:text-sm text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 font-semibold inline-flex items-center gap-1.5 transition-colors"
              >
                <span>View All Tools</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-3.5 scroll-stagger">
            {filteredTools.map((tool, idx) => (
              <div key={tool.id} style={{ "--stagger-i": idx % 5 } as React.CSSProperties}>
                <ToolCard tool={tool} />
              </div>
            ))}
          </div>
        </ScrollReveal>
      )}

      {children}
    </div>
  );
}
