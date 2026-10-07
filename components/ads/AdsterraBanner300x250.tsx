"use client";
import React from "react";
import { AdsterraFrame } from "./AdsterraFrame";
export const AdsterraBanner300x250: React.FC<{ className?: string }> = ({ className }) =>
  <AdsterraFrame format="banner-300x250" className={className} />;
