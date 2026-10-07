"use client";
import React from "react";
import { AdsterraFrame } from "./AdsterraFrame";
export const AdsterraBanner320x50: React.FC<{ className?: string }> = ({ className }) =>
  <AdsterraFrame format="banner-320x50" className={className} />;
