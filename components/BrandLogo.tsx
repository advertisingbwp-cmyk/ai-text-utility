import React from "react";

export interface BrandLogoProps {
  variant?: "full" | "icon" | "compact";
  size?: "sm" | "md" | "lg";
  className?: string;
  showSubtitle?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = "full",
  size = "md",
  className = "",
  showSubtitle = false,
}) => {
  // Dimension mapping
  const iconDimensions = {
    sm: { size: 28, radius: 8, fontSize: "text-xs" },
    md: { size: 36, radius: 10, fontSize: "text-sm" },
    lg: { size: 44, radius: 12, fontSize: "text-base" },
  }[size];

  const iconSvg = (
    <svg
      width={iconDimensions.size}
      height={iconDimensions.size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform group-hover:scale-105"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="bl_body" x1="14" y1="15" x2="34" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
        <linearGradient id="bl_cyan" x1="12" y1="10" x2="36" y2="14" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
      </defs>

      {/* Obsidian Squircle Base */}
      <rect
        width="48"
        height="48"
        rx="12"
        fill="#0f172a"
        stroke="#334155"
        strokeWidth="1.5"
      />

      {/* T-Top Header Rail */}
      <path
        d="M12 12C12 10.8954 12.8954 10 14 10H34C35.1046 10 36 10.8954 36 12C36 13.1046 35.1046 14 34 14H14C12.8954 14 12 13.1046 12 12Z"
        fill="url(#bl_cyan)"
      />

      {/* Interlocking A-Legs & Central Nib */}
      <path
        d="M14 36L22.5 15H25.5L34 36H29.5L27.5 31H20.5L18.5 36H14Z"
        fill="url(#bl_body)"
      />

      {/* Stylus Slit / Negative Space */}
      <polygon points="24,19 22.2,27 25.8,27" fill="#0f172a" />

      {/* Text Cursor Crossbar */}
      <rect x="18" y="28.5" width="12" height="2.5" rx="1.25" fill="#38bdf8" />
    </svg>
  );

  if (variant === "icon") {
    return <div className={`inline-flex items-center ${className}`}>{iconSvg}</div>;
  }

  if (variant === "compact") {
    return (
      <div className={`inline-flex items-center gap-2 group ${className}`}>
        {iconSvg}
        <span className="font-extrabold text-brand-600 dark:text-brand-400 tracking-tight">
          AI
        </span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 group ${className}`}>
      {iconSvg}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight flex items-center gap-1">
            <span className="text-brand-600 dark:text-brand-400 font-black">AI</span>
            <span>Text Utility</span>
          </span>
        </div>
        {showSubtitle && (
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-none mt-0.5">
            Fast, Private &amp; Client-Side
          </span>
        )}
      </div>
    </div>
  );
};
