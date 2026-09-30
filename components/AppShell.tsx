"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CommandPalette } from "@/components/CommandPalette";
import { CursorGlow } from "@/components/CursorGlow";

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
    };

    const handleOpenEvent = () => setPaletteOpen(true);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleOpenEvent);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleOpenEvent);
    };
  }, []);

  return (
    <div className="relative min-h-screen text-slate-900 dark:text-slate-100 flex flex-col transition-colors selection:bg-brand-500/20 selection:text-brand-700 dark:selection:text-brand-300 overflow-x-clip">
      {/* Modern Liquid Glass Aurora Spatial Backdrop System */}
      <div className="aurora-canvas pointer-events-none select-none" aria-hidden="true">
        <div className="aurora-ambient-glows" />
        <div className="liquid-wave-left" />
        <div className="liquid-wave-center-right" />
        <div className="liquid-wave-bottom-right" />
        <div className="liquid-wave-far-right" />
        <div className="liquid-glass-sphere-1" />
        <div className="liquid-glass-sphere-2" />
        <div className="search-ambient-glow" />
      </div>

      {/* Desktop Subtle Cursor-Following Radial Glow */}
      <CursorGlow />

      {/* Main App Content Stack */}
      <div className="relative z-10 flex flex-col flex-1">
        <Navbar onOpenCommandPalette={() => setPaletteOpen(true)} />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12 sm:pt-6 sm:pb-16">
          {children}
        </main>
        <Footer />
      </div>
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
};
