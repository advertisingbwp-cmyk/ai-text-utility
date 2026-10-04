"use client";

import React from "react";
import { useScrollParallax } from "@/hooks/useScrollParallax";

export const ScrollAurora: React.FC = () => {
  useScrollParallax({
    maxHeroTravel: 36,
    mobileMaxHeroTravel: 14,
    damping: 0.12,
  });

  return null;
};
