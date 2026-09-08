"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Sparkles,
  Star,
  Clock,
  Zap,
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
} from "@/data/toolsRegistry";
import { ToolCard } from "@/components/ToolCard";
import { StatsBar } from "@/components/StatsBar";
import { EmptyState } from "@/components/EmptyState";
import { DynamicIcon } from "@/components/DynamicIcon";
import { getFavorites, getRecentTools } from "@/lib/storage";

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

    updateStorage();
    if (typeof window !== "undefined" && window.location.search.includes("favorites=true")) {
      setOnlyFavorites(true);
    }

    window.addEventListener("favorites-updated", updateStorage);
    window.addEventListener("recent-updated", updateStorage);
    window.addEventListener("storage", updateStorage);

    return () => {
      window.removeEventListener("favorites-updated", updateStorage);
      window.removeEventListener("recent-updated", updateStorage);
      window.removeEventListener("storage", updateStorage);
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
    <div className="w-full max-w-7xl mx-auto space-y-10 pb-20">
      {/* Hero Section with Flanking Utilities & Ambient Grid */}
      <section className="relative pt-2 pb-4 sm:pt-6 sm:pb-6 space-y-8 w-full">
        {/* Subtle Developer Dot Grid Backdrop */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_70%_55%_at_50%_45%,#000_70%,transparent_100%)] opacity-70 dark:opacity-40"
        />

        {/* Ambient Glow Backdrop */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 -z-10 w-full max-w-4xl h-72 overflow-hidden blur-3xl opacity-60 dark:opacity-35"
        >
          <div className="w-full h-full bg-gradient-to-r from-brand-500/20 via-indigo-500/15 to-teal-400/20 rounded-full" />
        </div>

        {/* 3-Column Bento Composition on Wide Screens */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left Wing: Popular Utilities (Visible on XL screens) */}
          <div className="hidden xl:block xl:col-span-3">
            <div className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 shadow-subtle backdrop-blur-xs space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800/80">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Popular Utilities
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50">
                  Instant
                </span>
              </div>
              <div className="space-y-1">
                {[
                  { name: "Word Counter", desc: "Live stats & reading time", slug: "word-counter", icon: "Calculator" },
                  { name: "Slug Generator", desc: "SEO-safe clean URLs", slug: "slug-generator", icon: "Link2" },
                  { name: "Case Converter", desc: "camelCase, Pascal, Title", slug: "case-converter", icon: "Shuffle" },
                  { name: "Remove Spaces", desc: "Clean & trim whitespace", slug: "remove-extra-spaces", icon: "Eraser" },
                ].map((t) => (
                  <Link
                    key={t.slug}
                    href={`/tools/${t.slug}`}
                    className="group flex items-center justify-between p-2 rounded-xl hover:bg-slate-100/90 dark:hover:bg-slate-800/80 transition-all border border-transparent hover:border-slate-200/80 dark:hover:border-slate-700/60"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <DynamicIcon name={t.icon} size={14} />
                      </div>
                      <div className="truncate text-left">
                        <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate">
                          {t.name}
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{t.desc}</div>
                      </div>
                    </div>
                    <ArrowRight size={13} className="text-slate-300 dark:text-slate-600 group-hover:text-brand-600 dark:group-hover:text-brand-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Center Column: Main Value Proposition */}
          <div className="col-span-1 xl:col-span-6 text-center space-y-4">
            {/* Eyebrow Status Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-brand-200/80 dark:border-brand-800/80 bg-white/80 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 text-xs font-semibold shadow-2xs backdrop-blur-xs transition-all hover:border-brand-300 dark:hover:border-brand-700">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>43+ Free Utilities</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span>Client-Side Native</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                <Zap size={12} className="fill-current" /> Zero Latency
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12] text-balance">
              Powerful tools for{" "}
              <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-teal-500 dark:from-brand-400 dark:via-indigo-300 dark:to-teal-300 bg-clip-text text-transparent">
                every kind of text
              </span>
            </h1>

            {/* Value Proposition Description */}
            <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto text-balance font-normal">
              Format, clean, convert, analyze, and transform text instantly. Private by design—client tools run locally in your browser.
            </p>

            {/* Trust & Architecture Micro-Badges */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap text-xs text-slate-600 dark:text-slate-400 pt-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/80 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-800/70 font-medium shadow-2xs">
                <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400" />
                <span>100% In-Browser Privacy</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/80 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-800/70 font-medium shadow-2xs">
                <Cpu size={14} className="text-blue-600 dark:text-blue-400" />
                <span>Instant Execution</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/80 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-800/70 font-medium shadow-2xs">
                <Lock size={14} className="text-brand-600 dark:text-brand-400" />
                <span>No Sign-Up or Tracking</span>
              </div>
            </div>
          </div>

          {/* Right Wing: Developer & AI Suite (Visible on XL screens) */}
          <div className="hidden xl:block xl:col-span-3">
            <div className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 shadow-subtle backdrop-blur-xs space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800/80">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Developer & AI
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 border border-brand-200/50 dark:border-brand-800/50">
                  Pro
                </span>
              </div>
              <div className="space-y-1">
                {[
                  { name: "JSON Formatter", desc: "Format & validate tree", slug: "json-formatter", icon: "Code2" },
                  { name: "JWT Decoder", desc: "Inspect claims locally", slug: "jwt-decoder", icon: "Key" },
                  { name: "UUID Generator", desc: "RFC 4122 v4 CSPRNG", slug: "uuid-generator", icon: "Fingerprint" },
                  { name: "AI Text Magic", desc: "Rewriting & proofreading", slug: "ai-grammar", icon: "Sparkles" },
                ].map((t) => (
                  <Link
                    key={t.slug}
                    href={`/tools/${t.slug}`}
                    className="group flex items-center justify-between p-2 rounded-xl hover:bg-slate-100/90 dark:hover:bg-slate-800/80 transition-all border border-transparent hover:border-slate-200/80 dark:hover:border-slate-700/60"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <DynamicIcon name={t.icon} size={14} />
                      </div>
                      <div className="truncate text-left">
                        <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate">
                          {t.name}
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{t.desc}</div>
                      </div>
                    </div>
                    <ArrowRight size={13} className="text-slate-300 dark:text-slate-600 group-hover:text-brand-600 dark:group-hover:text-brand-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 6 Category Interactive Navigation Cards (Full Width Grid) */}
        <div className="pt-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 w-full">
            {CATEGORIES.map((cat) => {
              const count = TOOLS_REGISTRY.filter((t) => t.category === cat.name).length;
              const isSelected = selectedCategory === cat.name && !onlyFavorites;

              return (
                <a
                  key={cat.name}
                  href={`#category-${cat.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  onClick={() => {
                    if (selectedCategory !== "ALL" || onlyFavorites) {
                      setSelectedCategory("ALL");
                      setOnlyFavorites(false);
                    }
                  }}
                  className={`group flex flex-col items-start p-3 sm:p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer shadow-2xs hover:-translate-y-0.5 hover:shadow-xs active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                    isSelected
                      ? "bg-slate-900 text-white dark:bg-brand-600 dark:text-white border-transparent shadow-xs"
                      : "bg-white/90 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200/90 dark:border-slate-800 hover:border-brand-500/40 dark:hover:border-brand-500/40"
                  }`}
                  aria-label={`Jump to ${cat.name} tools (${count} available)`}
                >
                  <div className="w-full flex items-center justify-between mb-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-brand-50 dark:group-hover:bg-brand-950/60 group-hover:text-brand-600 dark:group-hover:text-brand-300"
                      }`}
                    >
                      <DynamicIcon name={cat.icon} size={15} />
                    </div>
                    <span
                      className={`text-[11px] font-mono px-1.5 py-0.5 rounded-md font-semibold ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 dark:bg-slate-800/90 text-slate-500 dark:text-slate-400 group-hover:bg-brand-50 dark:group-hover:bg-brand-950/60 group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors"
                      }`}
                    >
                      {count}
                    </span>
                  </div>
                  <div className="font-bold text-xs sm:text-sm tracking-tight">{cat.name}</div>
                  <div
                    className={`text-[10px] mt-0.5 truncate max-w-full ${
                      isSelected ? "text-slate-200" : "text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    {cat.description.split(",")[0]}
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Real-time Stats Bar */}
      <section>
        <StatsBar
          totalTools={TOOLS_REGISTRY.length}
          filteredCount={filteredTools.length}
          activeCategory={onlyFavorites ? "Favorites" : selectedCategory}
        />
      </section>

      {/* Filter Tabs */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap border-b border-slate-200 dark:border-slate-800/80 pb-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none max-w-full">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("ALL");
                setOnlyFavorites(false);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                selectedCategory === "ALL" && !onlyFavorites
                  ? "bg-slate-900 text-white dark:bg-brand-600 dark:text-white shadow-xs"
                  : "bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/90 dark:border-slate-800"
              }`}
            >
              All Tools ({TOOLS_REGISTRY.length})
            </button>

            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.name);
                  setOnlyFavorites(false);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  selectedCategory === cat.name && !onlyFavorites
                    ? "bg-slate-900 text-white dark:bg-brand-600 dark:text-white shadow-xs"
                    : "bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/90 dark:border-slate-800"
                }`}
              >
                <DynamicIcon name={cat.icon} size={14} />
                <span>{cat.name}</span>
              </button>
            ))}

            <button
              type="button"
              onClick={() => setOnlyFavorites((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap ${
                onlyFavorites
                  ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/40 shadow-xs"
                  : "bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-300 border-slate-200/90 dark:border-slate-800"
              }`}
            >
              <Star
                size={14}
                className={onlyFavorites ? "fill-amber-500 text-amber-500" : ""}
              />
              <span>Favorites ({favoritesList.length})</span>
            </button>
          </div>
        </div>
      </section>

      {/* Recently Used Section (Client only if exists and default view) */}
      {selectedCategory === "ALL" && !onlyFavorites && recentTools.length > 0 && (
        <section id="recent" className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-200">
            <Clock size={16} className="text-brand-600 dark:text-brand-400" />
            <span>Recently Used</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

            return (
              <section
                key={cat.name}
                id={`category-${cat.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                className="space-y-4 scroll-mt-20"
              >
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-xl flex items-center justify-center ${
                        isAI
                          ? "bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 border border-brand-200/80 dark:border-brand-800/60"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
                      }`}
                    >
                      {isAI ? (
                        <Sparkles size={18} />
                      ) : (
                        <DynamicIcon name={cat.icon} size={18} />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
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

                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                    {toolsInCat.length} tools
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {onlyFavorites
                ? "Favorited Utilities"
                : `${selectedCategory} Utilities`}
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {filteredTools.length} tools found
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      )}

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
    </div>
  );
}
