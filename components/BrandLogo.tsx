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
  // Dimension mapping adhering to: 40-46px desktop, 36-40px tablet, 32-36px mobile
  const sizeClasses = {
    sm: "w-7 h-7 sm:w-8 sm:h-8",
    md: "w-8 h-8 sm:w-9 sm:h-9 md:w-[42px] md:h-[42px]",
    lg: "w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12",
  }[size];

  const textClasses = {
    sm: "text-xs sm:text-sm",
    md: "text-sm sm:text-base md:text-[17px]",
    lg: "text-base sm:text-lg md:text-xl",
  }[size];

  const iconSvg = (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${sizeClasses} shrink-0 transition-transform duration-200 ease-out group-hover:-translate-y-px`}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* Main Ribbon Arch: Cyan -> Sky Blue -> Royal Blue -> Indigo -> Purple -> Fuchsia */}
        <linearGradient id="ai_master_arch" x1="12" y1="52" x2="50" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="25%" stopColor="#0EA5E9" />
          <stop offset="50%" stopColor="#3B82F6" />
          <stop offset="72%" stopColor="#7C3AED" />
          <stop offset="88%" stopColor="#9333EA" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>

        {/* Ring Back (Under Right Leg) */}
        <linearGradient id="ai_master_ring_back" x1="36" y1="23" x2="48" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="60%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#7E22CE" />
        </linearGradient>

        {/* Ring Front (Over Right Leg + Crossbar) */}
        <linearGradient id="ai_master_ring_front" x1="19" y1="38" x2="48" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0EA5E9" />
          <stop offset="35%" stopColor="#38BDF8" />
          <stop offset="70%" stopColor="#818CF8" />
          <stop offset="90%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#C084FC" />
        </linearGradient>

        {/* 4-Point Sparkle Gradient */}
        <linearGradient id="ai_master_spark" x1="44" y1="6" x2="52" y2="14" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#E0F2FE" />
          <stop offset="80%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#818CF8" />
        </linearGradient>

        {/* Subtle drop shadow under front ribbon */}
        <filter id="ai_master_shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="-0.8" dy="1.8" stdDeviation="1.2" floodColor="#020617" floodOpacity="0.5" />
        </filter>
      </defs>

      <g className="brand-logo-symbol">
        {/* 1. BACK RING: wraps behind the right leg */}
        <path
          d="M 37 24 C 40 21 44.5 21.5 47 24.5 C 49 27.2 48.5 30.5 46 33.5"
          stroke="url(#ai_master_ring_back)"
          strokeWidth="5.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 2. MAIN A ARCH (Smooth continuous ribbon stroke) */}
        <path
          d="M 16 49.5 L 28 14 C 29.5 9.8 32.5 9.8 34 14 L 46 49.5"
          stroke="url(#ai_master_arch)"
          strokeWidth="9.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 3. FRONT RIBBON / CROSSBAR (Wrapping across front of right leg) */}
        <path
          d="M 19 37.5 C 23.5 34 31 28.8 38.5 27.8 C 43.5 27 47.2 29 47.8 32 C 48.2 35 45 37.5 40.5 38.5 C 34 40 25.5 41 20 39.2 Z"
          fill="url(#ai_master_ring_front)"
          filter="url(#ai_master_shadow)"
        />

        {/* 4. SPECULAR HIGHLIGHT on front ribbon crest */}
        <path
          d="M 23.5 36 C 28 33 34.5 29.5 39.5 28.8 C 43 28.3 45.2 29 45 30.2 C 44 31.5 40 33 35.5 34.2 C 29.5 35.5 25 36.5 23.5 36 Z"
          fill="rgba(255, 255, 255, 0.45)"
        />

        {/* 5. 4-POINT AI SPARKLE with subtle hover glow */}
        <g className="transition-all duration-200 ease-out group-hover:drop-shadow-[0_0_6px_rgba(56,189,248,0.6)]">
          <path
            d="M 48 5.5 Q 48 11 42.5 11 Q 48 11 48 16.5 Q 48 11 53.5 11 Q 48 11 48 5.5 Z"
            fill="url(#ai_master_spark)"
          />
          <circle cx="48" cy="11" r="1.2" fill="#FFFFFF" />
        </g>
      </g>
    </svg>
  );

  if (variant === "icon") {
    return <div className={`inline-flex items-center ${className}`}>{iconSvg}</div>;
  }

  if (variant === "compact") {
    return (
      <div className={`inline-flex items-center gap-2 group ${className}`}>
        {iconSvg}
        <span className="font-extrabold text-brand-600 dark:text-cyan-400 tracking-tight">
          AI
        </span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 group ${className}`}>
      {iconSvg}
      <div className="flex flex-col justify-center">
        <div className="flex items-center">
          <span className={`font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight flex items-center gap-1.5 ${textClasses}`}>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 dark:from-cyan-400 dark:via-sky-400 dark:to-blue-400 font-black">
              AI
            </span>
            <span className="text-slate-900 dark:text-white">Text Utility</span>
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-none mt-0.5 tracking-normal">
            Fast, Private &amp; Client-Side
          </span>
        )}
      </div>
    </div>
  );
};
