"use client";

import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { isFavorite, toggleFavorite } from "@/lib/storage";
import { cn } from "@/lib/utils";

interface FavoriteStarProps {
  toolId: string;
  showLabel?: boolean;
  className?: string;
  size?: number;
}

export const FavoriteStar: React.FC<FavoriteStarProps> = ({
  toolId,
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
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
      className={cn(
        "inline-flex items-center gap-1.5 p-1.5 rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-amber-400/50",
        favorite
          ? "text-amber-400 hover:text-amber-300"
          : "text-slate-400 hover:text-slate-200 dark:text-slate-500 dark:hover:text-slate-300",
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
        <span className="text-xs font-medium">
          {favorite ? "Favorited" : "Favorite"}
        </span>
      )}
    </button>
  );
};
