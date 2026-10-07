"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ScrollRevealProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  stagger?: boolean;
  as?: React.ElementType;
}

/**
 * Clean semantic pass-through container.
 * Scroll animation removed to ensure smooth, 60fps scrolling without stutter or lag.
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = "",
  as: Component = "div",
  ...props
}) => {
  return (
    <Component className={cn(className)} {...props}>
      {children}
    </Component>
  );
};
