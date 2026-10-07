"use client";
import React from "react";
import { AdsterraFrame } from "./AdsterraFrame";
export const AdsterraNativeBanner: React.FC<{ className?: string }> = ({ className }) =>
  <AdsterraFrame format="native" className={className} />;
