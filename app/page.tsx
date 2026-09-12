"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Sparkles, Star, Clock, LayoutGrid, ArrowRight } from "lucide-react";
import { TOOLS_REGISTRY, CATEGORIES, ToolCategory, ToolDefinition, getToolBySlug } from "@/data/toolsRegistry";
import { getToolSeoBlueprint, TOP_10_P0_TOOLS } from "@/data/seoBlueprint";
import { ToolCard } from "@/components/ToolCard";
import { EmptyState } from "@/components/EmptyState";
import { TerminalHero } from "@/components/TerminalHero";
import { getFavorites, getRecentTools } from "@/lib/storage";
import { getCategoryTheme } from "@/lib/toolThemes";

export default function HomePage() {
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

  const recentTools = useMemo(() => recentList.map((id) => TOOLS_REGISTRY.find((t) => t.id === id)).filter((t): t is ToolDefinition => Boolean(t)).slice(0, 4), [recentList]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 sm:space-y-8 pb-16">
      <TerminalHero />

      <section className="max-w-4xl mx-auto text-center px-2 space-y-3" aria-labelledby="intro-heading">
        <h2 id="intro-heading" className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Free online text tools for everyday work</h2>
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          AI Text Utility is a collection of browser-based tools for writers, students, developers, and office workflows. Use the tools to count words and characters, clean lists, change text case, format JSON, test regular expressions, encode data, generate identifiers, work with dates, or prepare text for publishing. Most utilities process your input locally in the browser, so routine text transformations do not need a server upload.
        </p>
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          Each tool page includes practical instructions, feature details, common questions, limitations, and links to related utilities. AI Magic tools are optional and clearly separated from the browser-only tools because they require a server request to an AI provider.
        </p>
      </section>

      <section id="tools-section" className="space-y-4 scroll-mt-24">
        <div className="flex items-center justify-between gap-3 flex-wrap border-b border-slate-200 dark:border-slate-800/80 pb-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none max-w-full">
            <button type="button" onClick={() => { setSelectedCategory("ALL"); setOnlyFavorites(false); }} className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${selectedCategory === "ALL" && !onlyFavorites ? "bg-slate-900 text-white dark:bg-brand-600 dark:text-white shadow-xs" : "bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border border-slate-200/90 dark:border-slate-800"}`}>
              <LayoutGrid size={13} /><span>All Tools ({TOOLS_REGISTRY.length})</span>
            </button>
            <button type="button" onClick={() => { setOnlyFavorites((prev) => !prev); if (!onlyFavorites) setSelectedCategory("ALL"); }} className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap cursor-pointer ${onlyFavorites ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/40" : "bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border-slate-200/90 dark:border-slate-800"}`}>
              <Star size={14} className={onlyFavorites ? "fill-amber-500 text-amber-500" : "text-amber-500"} /><span>Favorites ({favoritesList.length})</span>
            </button>
            {CATEGORIES.map((cat) => <button key={cat.name} type="button" onClick={() => { setSelectedCategory(cat.name); setOnlyFavorites(false); }} className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer ${selectedCategory === cat.name && !onlyFavorites ? "bg-slate-900 text-white dark:bg-brand-600 dark:text-white shadow-xs" : "bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border border-slate-200/90 dark:border-slate-800"}`}><span className="text-sm leading-none">{getCategoryTheme(cat.name).emoji}</span><span>{cat.name}</span></button>)}
          </div>
        </div>
      </section>

      {selectedCategory === "ALL" && !onlyFavorites && recentTools.length > 0 && (
        <section id="recent" aria-labelledby="recent-heading" className="space-y-3">
          <h2 id="recent-heading" className="flex items-center gap-2 text-sm sm:text-base font-bold text-slate-900 dark:text-slate-200"><Clock size={16} className="text-brand-600 dark:text-brand-400" /><span>Recently Used</span></h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">{recentTools.map((tool) => <ToolCard key={`recent-${tool.id}`} tool={tool} />)}</div>
        </section>
      )}

      {filteredTools.length === 0 ? (
        <EmptyState title={onlyFavorites ? "No favorites yet" : "No utilities found"} description={onlyFavorites ? "You haven't saved any favorite tools yet. Click the star icon on any tool to save it here for quick access." : "No tools found in this category. Try selecting a different category."} actionText="Browse All Tools" onAction={() => { setSelectedCategory("ALL"); setOnlyFavorites(false); }} />
      ) : selectedCategory === "ALL" && !onlyFavorites ? (
        <div className="space-y-12">
          {CATEGORIES.map((cat) => {
            const toolsInCat = TOOLS_REGISTRY.filter((t) => t.category === cat.name);
            const isAI = cat.name === ("AI Magic" as ToolCategory);
            const catTheme = getCategoryTheme(cat.name);
            return <section key={cat.name} id={`category-${cat.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} className="space-y-4 scroll-mt-20">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-3">
                <div className="flex items-center gap-3"><div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-2xs ${catTheme.bg} ${catTheme.border}`}><span className="text-lg leading-none select-none">{catTheme.emoji}</span></div><div><div className="flex items-center gap-2.5 flex-wrap"><h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">{cat.name}</h2>{isAI && <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200/80 dark:border-brand-800/60">AI Powered</span>}</div><p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{cat.description}</p></div></div>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{toolsInCat.length} tools</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">{toolsInCat.map((tool) => <ToolCard key={tool.id} tool={tool} />)}</div>
            </section>;
          })}
        </div>
      ) : (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-3">
            <div><h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">{onlyFavorites ? "Your Favorited Utilities" : `${selectedCategory} Utilities`}</h2><p className="text-xs text-slate-600 dark:text-slate-400">{onlyFavorites ? `${filteredTools.length} saved tools` : `${filteredTools.length} tools found`}</p></div>
            {onlyFavorites && <button type="button" onClick={() => { setOnlyFavorites(false); setSelectedCategory("ALL"); }} className="text-xs text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 font-medium">View All Tools →</button>}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">{filteredTools.map((tool) => <ToolCard key={tool.id} tool={tool} />)}</div>
        </section>
      )}

      <section aria-labelledby="how-it-works-heading" className="max-w-4xl mx-auto pt-8 border-t border-slate-200 dark:border-slate-800 space-y-5">
        <h2 id="how-it-works-heading" className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">How to choose the right tool</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/30"><h3 className="font-semibold text-slate-900 dark:text-white">For writing</h3><p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">Use Word Counter for length checks, Case Converter for capitalization, Cleanup tools for messy text, and the AI writing tools when you want an assisted rewrite.</p></div>
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/30"><h3 className="font-semibold text-slate-900 dark:text-white">For developers</h3><p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">Use JSON Formatter, Regex Tester, Base64, UUID, JWT, URL encoding, hashing, and date utilities for quick checks during development.</p></div>
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/30"><h3 className="font-semibold text-slate-900 dark:text-white">For privacy</h3><p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">For ordinary transformations, processing stays in your browser. For AI tools, read the Privacy Policy before submitting text because those requests necessarily leave the browser.</p></div>
        </div>
        <div className="flex flex-wrap gap-3 text-sm"><Link href="/about" className="inline-flex items-center gap-1 font-semibold text-brand-700 dark:text-brand-400">About the project <ArrowRight size={14} /></Link><Link href="/privacy" className="inline-flex items-center gap-1 font-semibold text-brand-700 dark:text-brand-400">Privacy Policy <ArrowRight size={14} /></Link><Link href="/contact" className="inline-flex items-center gap-1 font-semibold text-brand-700 dark:text-brand-400">Contact support <ArrowRight size={14} /></Link></div>
      </section>

      <section aria-labelledby="popular-tools-heading" className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-4">
        <div><h2 id="popular-tools-heading" className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">Popular Free Developer &amp; Text Tools</h2><p className="text-xs text-slate-500 dark:text-slate-400">Fast, privacy-focused browser utilities with client-side execution</p></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {TOP_10_P0_TOOLS.map((slug) => { const blueprint = getToolSeoBlueprint(slug); const tool = getToolBySlug(slug); if (!blueprint || !tool) return null; return <Link key={slug} href={`/tools/${slug}`} className="group p-3 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 hover:border-brand-500/50 transition-all flex flex-col justify-between space-y-1"><span className="text-xs font-semibold text-slate-900 dark:text-slate-100">{blueprint.h1}</span><span className="text-[11px] text-slate-500 dark:text-slate-400">{blueprint.primaryKeyword}</span><span className="text-[11px] text-brand-600 dark:text-brand-400 font-medium inline-flex items-center gap-1">Open tool <ArrowRight size={12} /></span></Link>; })}
        </div>
      </section>
    </div>
  );
}
