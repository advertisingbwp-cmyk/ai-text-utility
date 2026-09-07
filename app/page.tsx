"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Sparkles,
  Star,
  Clock,
  Layers,
  Search,
  Zap,
  ShieldCheck,
  Cpu,
} from "lucide-react";
import {
  TOOLS_REGISTRY,
  CATEGORIES,
  ToolCategory,
  ToolDefinition,
} from "@/data/toolsRegistry";
import { ToolCard } from "@/components/ToolCard";
import { StatsBar } from "@/components/StatsBar";
import { SearchBar } from "@/components/SearchBar";
import { EmptyState } from "@/components/EmptyState";
import { DynamicIcon } from "@/components/DynamicIcon";
import { getFavorites, getRecentTools } from "@/lib/storage";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
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
    window.addEventListener("favorites-updated", updateStorage);
    window.addEventListener("recent-updated", updateStorage);
    window.addEventListener("storage", updateStorage);

    return () => {
      window.removeEventListener("favorites-updated", updateStorage);
      window.removeEventListener("recent-updated", updateStorage);
      window.removeEventListener("storage", updateStorage);
    };
  }, []);

  // Filter tools based on search, category, and favorites
  const filteredTools = useMemo(() => {
    return TOOLS_REGISTRY.filter((tool) => {
      const matchesSearch =
        !searchQuery ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.keywords.some((k) =>
          k.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCat =
        selectedCategory === "ALL" || tool.category === selectedCategory;

      const matchesFav = !onlyFavorites || favoritesList.includes(tool.id);

      return matchesSearch && matchesCat && matchesFav;
    });
  }, [searchQuery, selectedCategory, onlyFavorites, favoritesList]);

  // Resolve recently used tool definitions
  const recentTools = useMemo(() => {
    return recentList
      .map((id) => TOOLS_REGISTRY.find((t) => t.id === id))
      .filter((t): t is ToolDefinition => Boolean(t))
      .slice(0, 4);
  }, [recentList]);

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      {/* Hero Section */}
      <section className="text-center py-6 sm:py-10 space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-400 text-xs font-semibold">
          <Zap size={14} />
          <span>Lightning Fast • Client-Side Native • Zero Latency</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
          All Your Text Utilities in{" "}
          <span className="bg-gradient-to-r from-brand-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent">
            One Unified Workspace
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
          Format, clean, convert, analyze, and transform text instantly with 40+ specialized tools.
          Private by design—your data never leaves your browser.
        </p>

        {/* Global Search Bar */}
        <div className="pt-2 max-w-xl mx-auto">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search tools by name, description, or keyword (e.g. slug, regex, json)..."
          />
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
        <div className="flex items-center justify-between gap-3 flex-wrap border-b border-slate-800 pb-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none max-w-full">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("ALL");
                setOnlyFavorites(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                selectedCategory === "ALL" && !onlyFavorites
                  ? "bg-brand-600 text-white shadow-sm"
                  : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  selectedCategory === cat.name && !onlyFavorites
                    ? "bg-brand-600 text-white shadow-sm"
                    : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
                }`}
              >
                <DynamicIcon name={cat.icon} size={14} />
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setOnlyFavorites((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              onlyFavorites
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                : "bg-slate-900 text-slate-400 hover:text-amber-300 border-slate-800"
            }`}
          >
            <Star
              size={14}
              className={onlyFavorites ? "fill-amber-400 text-amber-400" : ""}
            />
            <span>Favorites only ({favoritesList.length})</span>
          </button>
        </div>
      </section>

      {/* Recently Used Section (Client only if exists and no active query) */}
      {!searchQuery && selectedCategory === "ALL" && !onlyFavorites && recentTools.length > 0 && (
        <section id="recent" className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
            <Clock size={16} className="text-blue-400" />
            <span>Recently Used</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentTools.map((tool) => (
              <ToolCard key={`recent-${tool.id}`} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {/* Main Tools Catalog (Grouped by category or flat filtered list) */}
      {filteredTools.length === 0 ? (
        <EmptyState
          title="No utilities match your search"
          description={`No tools found matching "${searchQuery}". Try a different keyword or reset filters.`}
          actionText="Reset Search & Filters"
          onAction={() => {
            setSearchQuery("");
            setSelectedCategory("ALL");
            setOnlyFavorites(false);
          }}
        />
      ) : selectedCategory === "ALL" && !onlyFavorites && !searchQuery ? (
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
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`p-1.5 rounded-lg ${
                        isAI
                          ? "bg-purple-500/10 text-purple-400"
                          : "bg-slate-800 text-slate-200"
                      }`}
                    >
                      {isAI ? (
                        <Sparkles size={18} />
                      ) : (
                        <DynamicIcon name={cat.icon} size={18} />
                      )}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                        {cat.name}
                        {isAI && (
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30">
                            Experiential Labs AI
                          </span>
                        )}
                      </h2>
                      <p className="text-xs text-slate-400">{cat.description}</p>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-slate-500">
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
            <h2 className="text-base font-bold text-slate-200">
              {onlyFavorites
                ? "Favorited Utilities"
                : selectedCategory !== "ALL"
                ? `${selectedCategory} Utilities`
                : `Search results for "${searchQuery}"`}
            </h2>
            <span className="text-xs text-slate-400 font-medium">
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
      <section className="pt-10 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-5 text-left">
        <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/30 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <ShieldCheck size={18} />
          </div>
          <h3 className="text-sm font-bold text-slate-200">Client-Side Privacy</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Standard utilities execute 100% inside your local browser memory. Text is never logged or saved to any database.
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/30 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <Cpu size={18} />
          </div>
          <h3 className="text-sm font-bold text-slate-200">Instant Execution</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            No network overhead or slow roundtrips. Live mode updates character counts, transformations, and regex in real time.
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/30 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <Sparkles size={18} />
          </div>
          <h3 className="text-sm font-bold text-slate-200">AI Powered Magic</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Connects securely via serverless routes to Experiential Labs AI for professional rewriting, proofreading, and summaries.
          </p>
        </div>
      </section>
    </div>
  );
}
