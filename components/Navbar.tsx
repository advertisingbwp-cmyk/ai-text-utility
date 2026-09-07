"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Sparkles,
  Star,
  Menu,
  X,
  Layers,
  ArrowRight,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getFavorites } from "@/lib/storage";

interface NavbarProps {
  onOpenCommandPalette?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCommandPalette }) => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [favCount, setFavCount] = useState(0);

  useEffect(() => {
    const updateFav = () => {
      setFavCount(getFavorites().length);
    };
    updateFav();
    window.addEventListener("favorites-updated", updateFav);
    window.addEventListener("storage", updateFav);
    return () => {
      window.removeEventListener("favorites-updated", updateFav);
      window.removeEventListener("storage", updateFav);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500/20 rounded-xl p-1 -ml-1 group"
        >
          <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
            <span className="text-sm font-black tracking-tighter">AI</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm sm:text-base font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              AI Text Utility
            </span>
            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-none">
              Fast, Private & Client-Side
            </span>
          </div>
        </Link>

        {/* Center / Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-300">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-lg transition-colors hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 ${
              pathname === "/" ? "text-slate-900 dark:text-white font-semibold bg-slate-100/80 dark:bg-slate-800/50" : ""
            }`}
          >
            All Utilities
          </Link>
          <Link
            href="/#categories"
            className="px-3 py-1.5 rounded-lg transition-colors hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
          >
            Categories
          </Link>
          <Link
            href="/#category-ai-magic"
            className="px-3 py-1.5 rounded-lg transition-colors hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 flex items-center gap-1.5 text-brand-600 dark:text-brand-400 font-medium"
          >
            <Sparkles size={13} />
            <span>AI Magic</span>
          </Link>
        </nav>

        {/* Right Actions (Search trigger, Favorites, ThemeToggle) */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Quick Search Button / Command Palette Trigger */}
          <button
            type="button"
            onClick={onOpenCommandPalette}
            aria-label="Search tools (Press Ctrl+K)"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/70 hover:bg-slate-100 dark:hover:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 text-xs text-slate-500 dark:text-slate-400 transition-all shadow-subtle group"
          >
            <Search size={14} className="group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors" />
            <span className="hidden sm:inline font-normal">Search tools...</span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-mono px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">
              <span className="text-[11px]">⌘</span>K
            </kbd>
          </button>

          {/* Favorites Filter Indicator */}
          <Link
            href="/?favorites=true"
            aria-label={`View ${favCount} favorite tools`}
            className="relative p-2 rounded-xl text-slate-500 hover:text-amber-500 dark:text-slate-400 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="View saved favorites"
          >
            <Star size={17} className={favCount > 0 ? "fill-amber-400 text-amber-400" : ""} />
            {favCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-brand-600 text-[10px] font-bold text-white flex items-center justify-center">
                {favCount}
              </span>
            )}
          </Link>

          {/* Theme Switcher */}
          <ThemeToggle />

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="md:hidden p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer / Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg px-4 py-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
          <nav className="space-y-1 text-sm font-medium text-slate-700 dark:text-slate-200">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            >
              <span>All 43 Utilities</span>
              <ArrowRight size={15} className="text-slate-400" />
            </Link>
            <Link
              href="/#categories"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            >
              <span>Categories</span>
              <Layers size={15} className="text-slate-400" />
            </Link>
            <Link
              href="/#category-ai-magic"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 text-brand-600 dark:text-brand-400 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Sparkles size={15} />
                AI Magic Assistant
              </span>
              <ArrowRight size={15} />
            </Link>
          </nav>

          <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <Link href="/privacy" onClick={() => setMobileMenuOpen(false)} className="hover:underline">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms" onClick={() => setMobileMenuOpen(false)} className="hover:underline">
              Terms of Service
            </Link>
            <span>•</span>
            <span>100% Client-Side</span>
          </div>
        </div>
      )}
    </header>
  );
};
