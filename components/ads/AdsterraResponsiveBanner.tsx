"use client";

import React from "react";
import { AdsterraBanner728x90 } from "./AdsterraBanner728x90";
import { AdsterraBanner300x250 } from "./AdsterraBanner300x250";
import { AdsterraBanner320x50 } from "./AdsterraBanner320x50";

export const AdsterraResponsiveBanner: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`w-full flex justify-center items-center my-6 ${className}`}>
      {/* Mobile (< 640px): 320x50 */}
      <div className="block sm:hidden min-h-[50px]">
        <AdsterraBanner320x50 />
      </div>

      {/* Tablet (640px - 768px): 300x250 */}
      <div className="hidden sm:block md:hidden min-h-[250px]">
        <AdsterraBanner300x250 />
      </div>

      {/* Laptop & Desktop (>= 768px): 728x90 Wide Leaderboard */}
      <div className="hidden md:block min-h-[90px]">
        <AdsterraBanner728x90 />
      </div>
    </div>
  );
};
