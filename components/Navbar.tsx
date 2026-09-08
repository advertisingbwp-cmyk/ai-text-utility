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

  const handleFavoritesClick = () => {
    if (pathname === "/") {
      window.dispatchEvent(new CustomEvent("show-favorites"));
      document.getElementById("tools-section")?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/#favorites");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-6">
        {/* Brand Logo */}
        <Link
          href="/"
          className="focus:outline-none focus:ring-2 focus:ring-brand-500/20 rounded-xl p-1 -ml-1 group shrink-0"
          aria-label="AI Text Utility Home"
        >
          <BrandLogo size="md" showSubtitle={true} />
        </Link>

        {/* Centered Compact Search Bar */}
        <div className="hidden sm:flex flex-1 max-w-sm mx-auto justify-center">
          <button
            type="button"
            onClick={onOpenCommandPalette}
            aria-label="Search tools (Press Ctrl+K)"
            className="w-full flex items-center justify-between gap-3 px-3.5 py-2 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 text-xs text-slate-500 dark:text-slate-400 transition-all shadow-subtle group cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Search
                size={15}
                className="text-slate-500 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors"
                aria-hidden="true"
              />
              <span className="font-medium text-slate-600 dark:text-slate-300">
                Search tools...
              </span>
            </div>
            <kbd
              aria-label="Command K shortcut"
              className="inline-flex items-center gap-0.5 text-xs font-mono px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-2xs"
            >
              <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold" aria-hidden="true">⌘</span>K
            </kbd>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Mobile Search Button (Quick 1-tap trigger) */}
          <button
            type="button"
            onClick={onOpenCommandPalette}
            aria-label="Search tools"
            className="sm:hidden p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer"
          >
            <Search size={18} aria-hidden="true" />
          </button>

          {/* Favorites Indicator Button */}
          <button
            type="button"
            onClick={handleFavoritesClick}
            aria-label={`View ${favCount} favorite tools`}
            className="relative p-2.5 rounded-xl text-slate-600 hover:text-amber-500 dark:text-slate-300 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer"
            title={favCount > 0 ? `View ${favCount} favorite tools` : "View favorites"}
          >
            <Star
              size={18}
              className={favCount > 0 ? "fill-amber-400 text-amber-400" : ""}
              aria-hidden="true"
            />
            {favCount > 0 && (
              <span className="absolute top-1 right-1 px-1 min-w-[17px] h-[17px] rounded-full bg-amber-500 text-[10px] font-black text-slate-950 flex items-center justify-center leading-none shadow-2xs">
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
