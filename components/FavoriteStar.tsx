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
      className={cn(
        "inline-flex items-center justify-center min-w-[44px] min-h-[44px] p-2 rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-amber-400/50 hover:bg-slate-100/80 dark:hover:bg-slate-800/80",
        favorite
          ? "text-amber-500 hover:text-amber-400"
          : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300",
        className
      )}
    >
      <Star
        size={size}
        className={cn(
          "transition-transform active:scale-125",
          favorite ? "fill-amber-400 text-amber-400" : ""
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
