"use client";

import React, { useEffect } from "react";

export const ScrollAurora: React.FC = () => {
  useEffect(() => {
    // Respect accessibility settings
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let targetProgress = 0;
    let currentProgress = 0;
    let rafId: number | null = null;
    let isRunning = false;

    const calculateProgress = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const maxScroll = docHeight - winHeight;

      if (maxScroll <= 0) return 0;
      return Math.min(1, Math.max(0, scrollY / maxScroll));
    };

    const updateLoop = () => {
      // Smooth camera-like interpolation (~0.10 damping factor)
      const diff = targetProgress - currentProgress;
      currentProgress += diff * 0.10;

      // When settled, snap cleanly and pause loop to preserve CPU/battery
      if (Math.abs(diff) < 0.0005) {
        currentProgress = targetProgress;
        document.documentElement.style.setProperty("--scroll-p", currentProgress.toFixed(4));
        isRunning = false;
        rafId = null;
        return;
      }

      document.documentElement.style.setProperty("--scroll-p", currentProgress.toFixed(4));
      rafId = requestAnimationFrame(updateLoop);
    };

    const startLoop = () => {
      targetProgress = calculateProgress();
      if (!isRunning) {
        isRunning = true;
        rafId = requestAnimationFrame(updateLoop);
      }
    };

    // Calculate initial position on mount
    startLoop();

    window.addEventListener("scroll", startLoop, { passive: true });
    window.addEventListener("resize", startLoop, { passive: true });

    return () => {
      window.removeEventListener("scroll", startLoop);
      window.removeEventListener("resize", startLoop);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return null;
};
