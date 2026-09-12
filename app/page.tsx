"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Sparkles,
  Star,
  Clock,
  Zap,
  LayoutGrid,
  ShieldCheck,
  Cpu,
  Lock,
  ArrowRight,
} from "lucide-react";
import {
  TOOLS_REGISTRY,
  CATEGORIES,
  ToolCategory,
  ToolDefinition,
  getToolBySlug,
} from "@/data/toolsRegistry";
import { getToolSeoBlueprint, TOP_10_P0_TOOLS } from "@/data/seoBlueprint";
import { ToolCard } from "@/components/ToolCard";
import { EmptyState } from "@/components/EmptyState";
import { DynamicIcon } from "@/components/DynamicIcon";
import { TerminalHero } from "@/components/TerminalHero";
import { AdsterraResponsiveBanner, AdsterraNativeBanner } from "@/components/ads";
import { getFavorites, getRecentTools } from "@/lib/storage";
import { getCategoryTheme } from "@/lib/toolThemes";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [favoritesList, setFavoritesList] = useState<string[]>([]);
  const [recentList, setRecentList] = useState<string[]>([]);

  // Sync favorites & recents on client
  useEffect(() => {
    const updateStorage = () => {
      setFavoritesList(getFavorites());
      setRecentList(getRecentTools());
    };

    const checkFavoritesFromUrl = () => {
      if (typeof window !== "undefined") {
        if (
          window.location.search.includes("favorites=true") ||
          window.location.hash === "#favorites"
        ) {
          setOnlyFavorites(true);
          setTimeout(() => {
            document.getElementById("tools-section")?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }
      }
    };

    updateStorage();
    checkFavoritesFromUrl();

    const handleShowFavorites = () => {
      setOnlyFavorites(true);
      setTimeout(() => {
        document.getElementById("tools-section")?.scrollIntoView({ behavior: "smooth" });
      }, 50);
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

  // Filter tools based on category and favorites
  const filteredTools = useMemo(() => {
    return TOOLS_REGISTRY.filter((tool) => {
      const matchesCat =
        selectedCategory === "ALL" || tool.category === selectedCategory;

      const matchesFav = !onlyFavorites || favoritesList.includes(tool.id);

      return matchesCat && matchesFav;
    });
  }, [selectedCategory, onlyFavorites, favoritesList]);

  // Resolve recently used tool definitions
  const recentTools = useMemo(() => {
    return recentList
      .map((id) => TOOLS_REGISTRY.find((t) => t.id === id))
      .filter((t): t is ToolDefinition => Boolean(t))
      .slice(0, 4);
  }, [recentList]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 sm:space-y-8 pb-16">
      {/* Hero Section */}
      <TerminalHero />

      {/* Filter Tabs (All Tools, Favorites, Categories) */}
      <section id="tools-section" className="space-y-4 scroll-mt-24">
        <div className="flex items-center justify-between gap-3 flex-wrap border-b border-slate-200 dark:border-slate-800/80 pb-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none max-w-full">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("ALL");
                setOnlyFavorites(false);
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === "ALL" && !onlyFavorites
                  ? "bg-slate-900 text-white dark:bg-brand-600 dark:text-white shadow-xs"
                  : "bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/90 dark:border-slate-800"
              }`}
            >
              <LayoutGrid size={13} />
              <span>All Tools ({TOOLS_REGISTRY.length})</span>
            </button>

            {/* Favorites Tab - placed right after All Tools */}
            <button
              type="button"
              onClick={() => {
                setOnlyFavorites((prev) => !prev);
                if (!onlyFavorites) {
                  setSelectedCategory("ALL");
                }
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap cursor-pointer ${
                onlyFavorites
                  ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/40 shadow-xs"
                  : "bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-300 border-slate-200/90 dark:border-slate-800"
              }`}
            >
              <Star
                size={14}
                className={onlyFavorites ? "fill-amber-500 text-amber-500" : "text-amber-500"}
              />
              <span>Favorites ({favoritesList.length})</span>
            </button>

            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.name);
                  setOnlyFavorites(false);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.name && !onlyFavorites
                    ? "bg-slate-900 text-white dark:bg-brand-600 dark:text-white shadow-xs"
                    : "bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/90 dark:border-slate-800"
                }`}
              >
                <span className="text-sm leading-none">{getCategoryTheme(cat.name).emoji}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Recently Used Section (Client only if exists and default view) */}
      {selectedCategory === "ALL" && !onlyFavorites && recentTools.length > 0 && (
        <section id="recent" aria-labelledby="recent-heading" className="space-y-3">
          <h2 id="recent-heading" className="flex items-center gap-2 text-sm sm:text-base font-bold text-slate-900 dark:text-slate-200">
            <Clock size={16} className="text-brand-600 dark:text-brand-400" />
            <span>Recently Used</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
            {recentTools.map((tool) => (
              <ToolCard key={`recent-${tool.id}`} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {/* Main Tools Catalog */}
      {filteredTools.length === 0 ? (
        <EmptyState
          title={onlyFavorites ? "No favorites yet" : "No utilities found"}
          description={
            onlyFavorites
              ? "You haven't saved any favorite tools yet. Click the star icon on any tool to save it here for quick access."
              : "No tools found in this category. Try selecting a different category."
          }
          actionText="Browse All Tools"
          onAction={() => {
            setSelectedCategory("ALL");
            setOnlyFavorites(false);
          }}
        />
      ) : selectedCategory === "ALL" && !onlyFavorites ? (
        // Render by Category sections
        <div className="space-y-12">
          {CATEGORIES.map((cat) => {
            const toolsInCat = TOOLS_REGISTRY.filter((t) => t.category === cat.name);
            const isAI = cat.name === ("AI Magic" as ToolCategory);
            const catTheme = getCategoryTheme(cat.name);

            return (
              <section
                key={cat.name}
                id={`category-${cat.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                className="space-y-4 scroll-mt-20"
              >
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-2xs ${catTheme.bg} ${catTheme.border}`}
                    >
                      <span className="text-lg leading-none select-none">{catTheme.emoji}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                          {cat.name}
                        </h2>
                        {isAI && (
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200/80 dark:border-brand-800/60">
                            AI Powered
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{cat.description}</p>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    {toolsInCat.length} tools
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
                  {toolsInCat.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        // Render filtered grid
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-3">
            <div className="flex items-center gap-2.5">
              {onlyFavorites ? (
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-500 border border-amber-200/80 dark:border-amber-800/60 flex items-center justify-center">
                  <Star size={16} className="fill-amber-400 text-amber-400" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                  <span className="text-sm leading-none">{getCategoryTheme(selectedCategory as ToolCategory).emoji}</span>
                </div>
              )}
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                  {onlyFavorites
                    ? "Your Favorited Utilities"
                    : `${selectedCategory} Utilities`}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {onlyFavorites
                    ? `${filteredTools.length} ${filteredTools.length === 1 ? "tool" : "tools"} saved for fast access`
                    : `${filteredTools.length} tools found`}
                </p>
              </div>
            </div>

            {onlyFavorites && (
              <button
                type="button"
                onClick={() => {
                  setOnlyFavorites(false);
                  setSelectedCategory("ALL");
                }}
                className="text-xs text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 font-medium transition-colors cursor-pointer"
              >
                View All Tools →
              </button>
            )}
          </div>

          {filteredTools.length === 0 ? (
            <div className="p-8 sm:p-12 rounded-2xl border border-dashed border-amber-200 dark:border-amber-900/50 bg-amber-50/30 dark:bg-amber-950/20 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-500 flex items-center justify-center">
                <Star size={24} className="text-amber-400 fill-amber-400" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  No Favorites Saved Yet
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Click the <span className="font-semibold text-amber-600 dark:text-amber-400">⭐ Star</span> icon on the top-right of any tool card to save it here for fast, 1-click access anytime.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOnlyFavorites(false);
                  setSelectedCategory("ALL");
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white dark:bg-brand-600 dark:text-white shadow-xs hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Browse All Tools ({TOOLS_REGISTRY.length})
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Popular Free Tools - SEO Hub */}
      <section aria-labelledby="popular-tools-heading" className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 id="popular-tools-heading" className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Popular Free Developer &amp; Text Tools
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Fast, privacy-focused browser utilities with client-side execution
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {TOP_10_P0_TOOLS.map((slug) => {
            const blueprint = getToolSeoBlueprint(slug);
            const tool = getToolBySlug(slug);
            if (!blueprint || !tool) return null;

            return (
              <Link
                key={slug}
                href={`/tools/${slug}`}
                className="group p-3 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle hover:shadow-cardHover hover:border-brand-500/50 dark:hover:border-brand-500/50 transition-all flex flex-col justify-between space-y-1.5"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800/60 flex items-center justify-center text-brand-600 dark:text-brand-400 shrink-0">
                    <DynamicIcon name={tool.icon} size={13} />
                  </div>
                  <span className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate">
                    {blueprint.popularAnchor}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {blueprint.aboveTheFoldIntro}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Privacy & Architecture Feature Band */}
      <section className="pt-10 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-5 text-left">
        <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/40 shadow-subtle space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <ShieldCheck size={18} />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Client-Side Privacy</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Standard utilities execute 100% inside your local browser memory. Text is never logged or saved to any database.
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/40 shadow-subtle space-y-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Cpu size={18} />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Instant Execution</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            No network overhead or slow roundtrips. Live mode updates character counts, transformations, and regex in real time.
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/40 shadow-subtle space-y-2">
          <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
            <Sparkles size={18} />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">AI Powered Magic</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Connects securely via serverless routes for professional AI-assisted rewriting, proofreading, and summaries.
          </p>
        </div>
      </section>

      {/* Sponsored Adsterra Units */}
      <AdsterraResponsiveBanner />
      <AdsterraNativeBanner />
    </div>
  );
}
