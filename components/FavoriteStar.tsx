"use client";

import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { isFavorite, toggleFavorite } from "@/lib/storage";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface FavoriteStarProps {
  toolId: string;
  toolName?: string;
  showLabel?: boolean;
  className?: string;
  size?: number;
}

export const FavoriteStar: React.FC<FavoriteStarProps> = ({
  toolId,
  toolName,
  showLabel = false,
  className = "",
  size = 18,
}) => {
  const [favorite, setFavorite] = useState<boolean>(false);

  useEffect(() => {
    setFavorite(isFavorite(toolId));

    const handleUpdate = () => {
      setFavorite(isFavorite(toolId));
    };

    window.addEventListener("favorites-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("favorites-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [toolId]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = toggleFavorite(toolId);
    setFavorite(newState);
    if (newState) {
      trackEvent("favorite_added", { toolSlug: toolId });
    }
  };

  const labelText = toolName
    ? favorite
      ? `Remove ${toolName} from favorites`
      : `Add ${toolName} to favorites`
    : favorite
    ? "Remove from favorites"
    : "Add to favorites";

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={labelText}
      title={labelText}
      className={cn(
        "group/fav relative z-20 inline-flex items-center justify-center min-w-[44px] min-h-[44px] w-11 h-11 rounded-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-1 p-0 transition-transform active:scale-[0.98]",
        showLabel && "w-auto px-1",
        className
      )}
    >
      <span
        className={cn(
          "w-9 h-9 min-w-[36px] min-h-[36px] rounded-full flex items-center justify-center transition-all duration-150 pointer-events-none",
          favorite
            ? "bg-amber-500/15 text-amber-500 border border-amber-400/40 shadow-xs group-hover/fav:bg-amber-500/25 group-hover/fav:scale-105"
            : "bg-white/50 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 border border-white/70 dark:border-slate-700/60 shadow-2xs group-hover/fav:text-amber-500 dark:group-hover/fav:text-amber-400 group-hover/fav:bg-white/80 dark:group-hover/fav:bg-slate-700/60 group-hover/fav:scale-105",
          showLabel && "w-auto px-2.5"
        )}
      >
        <Star
          size={size}
          strokeWidth={2.2}
          className={cn(
            "transition-transform group-active/fav:scale-125 shrink-0",
            favorite ? "fill-amber-400 text-amber-500" : ""
          )}
        />
        {showLabel && (
          <span className="text-xs font-medium ml-1.5 shrink-0">
            {favorite ? "Favorited" : "Favorite"}
          </span>
        )}
      </span>
    </button>
  );
};
