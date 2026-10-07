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
    // Check user preference for reduced motion
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) {
      document.documentElement.style.setProperty("--scroll-p", "0");
      document.documentElement.style.setProperty("--hero-parallax-y", "0px");
      document.documentElement.style.setProperty("--hero-parallax-distance", "0");
      document.documentElement.style.setProperty("--hero-parallax-reverse", "0px");
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
        document.documentElement.style.setProperty("--scroll-p", currentProgress.toFixed(4));
        document.documentElement.style.setProperty("--hero-parallax-y", `${currentHeroY.toFixed(2)}px`);
        document.documentElement.style.setProperty("--hero-parallax-distance", currentHeroY.toFixed(2));
        document.documentElement.style.setProperty(
          "--hero-parallax-reverse",
          `${(-currentHeroY * 0.5).toFixed(2)}px`
        );
        isRunning = false;
        rafId = null;
        return;
      }

      document.documentElement.style.setProperty("--scroll-p", currentProgress.toFixed(4));
      document.documentElement.style.setProperty("--hero-parallax-y", `${currentHeroY.toFixed(2)}px`);
      document.documentElement.style.setProperty("--hero-parallax-distance", currentHeroY.toFixed(2));
      document.documentElement.style.setProperty(
        "--hero-parallax-reverse",
        `${(-currentHeroY * 0.5).toFixed(2)}px`
      );

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
