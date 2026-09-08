"use client";

import React from "react";
import { AdsterraBanner300x250 } from "./AdsterraBanner300x250";
import { AdsterraBanner320x50 } from "./AdsterraBanner320x50";

export const AdsterraResponsiveBanner: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`w-full flex justify-center items-center my-5 ${className}`}>
      {/* Mobile: 320x50 */}
      <div className="block sm:hidden">
        <AdsterraBanner320x50 />
      </div>

      {/* Tablet & Desktop: 300x250 */}
      <div className="hidden sm:block">
        <AdsterraBanner300x250 />
      </div>
    </div>
  );
};
