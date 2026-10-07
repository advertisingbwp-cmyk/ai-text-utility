"use client";

import { useEffect } from "react";

interface ScrollParallaxOptions {
  /** Maximum vertical parallax travel in pixels for hero background (default: 36px) */
  maxHeroTravel?: number;
  /** Mobile maximum vertical parallax travel in pixels (default: 14px) */
  mobileMaxHeroTravel?: number;
  /** Damping factor for camera-like smooth interpolation (default: 0.12) */
  damping?: number;
}

/**
 * High-performance, jank-free scroll parallax driver.
 * Uses requestAnimationFrame with camera damping and writes directly to CSS variables
 * on document.documentElement, avoiding React re-renders on scroll frames.
 */
export function useScrollParallax(options: ScrollParallaxOptions = {}) {
  const {
    maxHeroTravel = 36,
    mobileMaxHeroTravel = 14,
    damping = 0.12,
  } = options;

  useEffect(() => {
    const applyStyles = (prog: number, hero: number) => {
      const root = document.documentElement.style;
      root.setProperty("--scroll-p", prog.toFixed(4));
      root.setProperty("--aurora-hue-shift", `${(prog * 45).toFixed(1)}deg`);
      root.setProperty("--aurora-glow-scale", (1 + prog * 0.12).toFixed(3));
      root.setProperty("--aurora-shift-y", `${(prog * 100).toFixed(1)}px`);
      root.setProperty("--hero-parallax-y", `${hero.toFixed(2)}px`);
      root.setProperty("--hero-parallax-distance", hero.toFixed(2));
      root.setProperty("--hero-parallax-reverse", `${(-hero * 0.5).toFixed(2)}px`);
    };

    // Check user preference for reduced motion
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) {
      applyStyles(0, 0);
      return;
    }

    let targetProgress = 0;
    let currentProgress = 0;
    let targetHeroY = 0;
    let currentHeroY = 0;
    let rafId: number | null = null;
    let isRunning = false;

    const calculateValues = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const maxScroll = Math.max(1, docHeight - winHeight);
      const isMobile = window.innerWidth <= 768;

      const progress = Math.min(1, Math.max(0, scrollY / maxScroll));
      const heroMax = isMobile ? mobileMaxHeroTravel : maxHeroTravel;
      // Normalize over the first 480px of page scroll (hero viewport)
      const heroRatio = Math.min(1, Math.max(0, scrollY / 480));
      const heroY = heroRatio * heroMax;

      return { progress, heroY };
    };

    const updateLoop = () => {
      const diffProgress = targetProgress - currentProgress;
      const diffHero = targetHeroY - currentHeroY;

      currentProgress += diffProgress * damping;
      currentHeroY += diffHero * damping;

      const settled = Math.abs(diffProgress) < 0.0005 && Math.abs(diffHero) < 0.05;

      if (settled) {
        currentProgress = targetProgress;
        currentHeroY = targetHeroY;
        applyStyles(currentProgress, currentHeroY);
        isRunning = false;
        rafId = null;
        return;
      }

      applyStyles(currentProgress, currentHeroY);

      rafId = requestAnimationFrame(updateLoop);
    };

    const startLoop = () => {
      const { progress, heroY } = calculateValues();
      targetProgress = progress;
      targetHeroY = heroY;

      if (!isRunning) {
        isRunning = true;
        rafId = requestAnimationFrame(updateLoop);
      }
    };

    // Initialize initial state immediately on mount
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
  }, [maxHeroTravel, mobileMaxHeroTravel, damping]);
}
