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
        "relative z-20 inline-flex items-center justify-center min-w-[36px] min-h-[36px] w-9 h-9 rounded-full transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-1",
        favorite
          ? "bg-amber-500/15 text-amber-500 border border-amber-400/40 shadow-xs hover:bg-amber-500/25 hover:scale-105"
          : "bg-white/50 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 border border-white/70 dark:border-slate-700/60 shadow-2xs hover:text-amber-500 dark:hover:text-amber-400 hover:bg-white/80 dark:hover:bg-slate-700/60 hover:scale-105",
        className
      )}
    >
      <Star
        size={size}
        strokeWidth={2.2}
        className={cn(
          "transition-transform active:scale-125",
          favorite ? "fill-amber-400 text-amber-500" : ""
        )}
      />
      {showLabel && (
        <span className="text-xs font-medium ml-1.5">
          {favorite ? "Favorited" : "Favorite"}
        </span>
      )}
    </button>
  );
};
