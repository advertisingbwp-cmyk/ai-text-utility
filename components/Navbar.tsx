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
  const [pastHero, setPastHero] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPod|iPad/.test(navigator.platform);

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
    let prevScrolled = false;
    let prevPastHero = false;

    const handleScroll = () => {
      const y = window.scrollY || window.pageYOffset || 0;
      const isScrolled = y > 16;
      const isPastHero = y > 380;

      if (isScrolled !== prevScrolled) {
        prevScrolled = isScrolled;
        setScrolled(isScrolled);
      }
      if (isPastHero !== prevPastHero) {
        prevPastHero = isPastHero;
        setPastHero(isPastHero);
      }
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
      className={`sticky top-0 z-40 w-full transition-all duration-300 navbar-glass ${
        scrolled ? "shadow-navScrolled backdrop-blur-xl" : ""
      } ${pastHero ? "navbar-past-hero" : ""}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-6">
        {/* Brand Logo */}
        <Link
          href="/"
          className="focus:outline-none focus:ring-2 focus:ring-brand-500/30 rounded-xl p-1 -ml-1 group shrink-0 transition-transform active:scale-[0.98]"
          aria-label="AI Text Utility home"
        >
          <BrandLogo size="md" showSubtitle={true} />
        </Link>

        {/* Desktop Primary Navigation Links (Figma Composition) */}
        <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-1 xl:gap-1.5">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-full text-xs font-medium ${pathname === '/' ? 'text-brand-600' : 'text-slate-600 dark:text-slate-300'} hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/50 transition-colors`}
          >
            Home
          </Link>
          <Link
            href="/about"
            className={`px-3 py-1.5 rounded-full text-xs font-medium ${pathname === '/about' ? 'text-brand-600' : 'text-slate-600 dark:text-slate-300'} hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/70 transition-colors`}
          >
            About
          </Link>
          <Link
            href="/contact"
            className={`px-3 py-1.5 rounded-full text-xs font-medium ${pathname === '/contact' ? 'text-brand-600' : 'text-slate-600 dark:text-slate-300'} hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/70 transition-colors`}
          >
            Contact
          </Link>
        </nav>

        {/* Right Actions: Compact Search, Theme */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Desktop Compact Search Launcher */}
          <button
            type="button"
            onClick={onOpenCommandPalette}
            aria-label={`Search tools (Press ${isMac ? '⌘K' : 'Ctrl K'})`}
            className="hidden sm:flex items-center justify-between gap-2.5 px-3 py-1.5 rounded-full border border-white/70 dark:border-slate-800 bg-white/60 dark:bg-slate-900/50 hover:bg-white/90 dark:hover:bg-slate-900 hover:border-brand-500/40 dark:hover:border-brand-500/40 text-xs text-slate-500 dark:text-slate-400 transition-all shadow-2xs hover:shadow-xs group cursor-pointer backdrop-blur-sm"
          >
            <div className="flex items-center gap-1.5">
              <Search size={13} className="text-slate-400 dark:text-slate-500 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors" />
              <span className="font-normal text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200">
                Search tools...
              </span>
            </div>
            <kbd className="inline-flex items-center gap-0.5 text-[10px] font-mono px-1.5 py-0.5 rounded-md border border-slate-200/80 dark:border-slate-700 bg-white/80 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold shadow-2xs">
              {isMac ? '⌘K' : 'Ctrl K'}
            </kbd>
          </button>

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
            className="relative p-2 rounded-xl text-slate-600 hover:text-amber-500 dark:text-slate-300 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer active:scale-[0.97] group"
            title={favCount > 0 ? `View ${favCount} favorite tools` : "View favorites"}
          >
            <Star
              size={17}
              className={`transition-all duration-200 group-hover:scale-110 ${
                favCount > 0 ? "fill-amber-400 text-amber-400" : ""
              }`}
              aria-hidden="true"
            />
            {favCount > 0 && (
              <span className="absolute top-1 right-1 px-1 min-w-[15px] h-[15px] rounded-full bg-amber-500 text-[9px] font-black text-slate-950 flex items-center justify-center leading-none shadow-2xs animate-in zoom-in-50 duration-150">
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
