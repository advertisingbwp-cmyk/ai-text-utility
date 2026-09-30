"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Star } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BrandLogo } from "@/components/BrandLogo";
import { getFavorites } from "@/lib/storage";

interface NavbarProps {
  onOpenCommandPalette?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCommandPalette }) => {
  const [favCount, setFavCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 16);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleFavoritesClick = () => {
    if (pathname === "/") {
      window.dispatchEvent(new CustomEvent("show-favorites"));
      document.getElementById("tools-section")?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/#favorites");
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        scrolled
          ? "border-b border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md shadow-navScrolled"
          : "border-b border-slate-200/60 dark:border-slate-800/60 bg-white/75 dark:bg-slate-950/75 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-6">
        {/* Brand Logo */}
        <Link
          href="/"
          className="focus:outline-none focus:ring-2 focus:ring-brand-500/30 rounded-xl p-1 -ml-1 group shrink-0 transition-transform active:scale-[0.98]"
          aria-label="AI Text Utility Home"
        >
          <BrandLogo size="md" showSubtitle={true} />
        </Link>

        {/* Centered Command Launcher Search Trigger */}
        <div className="hidden sm:flex flex-1 max-w-sm mx-auto justify-center">
          <button
            type="button"
            onClick={onOpenCommandPalette}
            aria-label="Search tools (Press Ctrl+K)"
            className="w-full flex items-center justify-between gap-3 px-3.5 py-2 rounded-xl border border-slate-200/90 dark:border-slate-800/90 bg-white/80 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-900 hover:border-brand-500/40 dark:hover:border-brand-500/40 text-xs text-slate-500 dark:text-slate-400 transition-all duration-180 shadow-subtle hover:shadow-card group cursor-pointer active:scale-[0.985]"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-md bg-brand-50 dark:bg-brand-950/60 flex items-center justify-center text-brand-600 dark:text-brand-400 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                <Search
                  size={13}
                  className="transition-transform group-hover:scale-110"
                  aria-hidden="true"
                />
              </div>
              <span className="font-medium text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                Search tools...
              </span>
            </div>
            <kbd
              aria-label="Command K shortcut"
              className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700/80 bg-slate-100/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-2xs group-hover:border-brand-300 dark:group-hover:border-brand-700 transition-colors"
            >
              <span className="text-xs font-semibold" aria-hidden="true">⌘</span>K
            </kbd>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Mobile Search Button (44px touch target) */}
          <button
            type="button"
            onClick={onOpenCommandPalette}
            aria-label="Search tools"
            className="sm:hidden p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer active:scale-[0.97]"
          >
            <Search size={18} aria-hidden="true" />
          </button>

          {/* Favorites Indicator Button (44px touch target) */}
          <button
            type="button"
            onClick={handleFavoritesClick}
            aria-label={`View ${favCount} favorite tools`}
            className="relative p-2.5 rounded-xl text-slate-600 hover:text-amber-500 dark:text-slate-300 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer active:scale-[0.97] group"
            title={favCount > 0 ? `View ${favCount} favorite tools` : "View favorites"}
          >
            <Star
              size={18}
              className={`transition-all duration-200 group-hover:scale-110 ${
                favCount > 0 ? "fill-amber-400 text-amber-400" : ""
              }`}
              aria-hidden="true"
            />
            {favCount > 0 && (
              <span className="absolute top-1.5 right-1.5 px-1 min-w-[16px] h-[16px] rounded-full bg-amber-500 text-[10px] font-black text-slate-950 flex items-center justify-center leading-none shadow-2xs animate-in zoom-in-50 duration-150">
                {favCount}
              </span>
            )}
          </button>

          {/* Theme Switcher */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
