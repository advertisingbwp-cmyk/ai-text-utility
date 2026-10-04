"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

let sharedObserver: IntersectionObserver | null = null;
const observerCallbacks = new Map<Element, () => void>();

function getSharedObserver(): IntersectionObserver | null {
  if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
    return null;
  }
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const callback = observerCallbacks.get(entry.target);
            if (callback) {
              callback();
              observerCallbacks.delete(entry.target);
            }
            sharedObserver?.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px 100px 0px",
      }
    );
  }
  return sharedObserver;
}

export interface ScrollRevealProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  stagger?: boolean;
  as?: React.ElementType;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = "",
  stagger = false,
  as: Component = "div",
  ...props
}) => {
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    // Respect prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-revealed");
      return;
    }

    const observer = getSharedObserver();
    if (!observer) {
      el.classList.add("is-revealed");
      return;
    }

    // Check if element is already within or close to current viewport
    const rect = el.getBoundingClientRect();
    const isInViewport = rect.top < window.innerHeight + 100 && rect.bottom > 0;

    if (isInViewport) {
      // Reveal immediately without transition to avoid initial blank flash
      el.classList.add("is-revealed");
      return;
    }

    // Arm the reveal transition only for content strictly below the fold
    el.classList.add("scroll-reveal-arm");

    const onReveal = () => {
      el.classList.add("is-revealed");
      // Clean up arming class after transition completes to release GPU memory & leave DOM clean
      setTimeout(() => {
        el.classList.remove("scroll-reveal-arm");
      }, 700);
    };

    observerCallbacks.set(el, onReveal);
    observer.observe(el);

    return () => {
      observerCallbacks.delete(el);
      observer.unobserve(el);
    };
  }, []);

  return (
    <Component
      ref={elementRef}
      className={cn(
        "scroll-reveal",
        stagger && "scroll-stagger",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};
