"use client";

const FAVORITES_KEY = "aitextutility_favorites";
const LEGACY_FAVORITES_KEY = "omnitext_favorites";
const RECENT_KEY = "aitextutility_recent";
const LEGACY_RECENT_KEY = "omnitext_recent";

let cachedFavorites: string[] | null = null;
let cachedRecent: string[] | null = null;

export function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  if (cachedFavorites !== null) return cachedFavorites;
  try {
    const raw =
      localStorage.getItem(FAVORITES_KEY) ||
      localStorage.getItem(LEGACY_FAVORITES_KEY);
    if (!raw) {
      cachedFavorites = [];
      return [];
    }
    const parsed = JSON.parse(raw);
    cachedFavorites = Array.isArray(parsed) ? parsed : [];
    return cachedFavorites;
  } catch {
    cachedFavorites = [];
    return [];
  }
}

export function isFavorite(toolId: string): boolean {
  return getFavorites().includes(toolId);
}

export function toggleFavorite(toolId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const current = getFavorites();
    let updated: string[];
    let nowFav: boolean;
    if (current.includes(toolId)) {
      updated = current.filter((id) => id !== toolId);
      nowFav = false;
    } else {
      updated = [...current, toolId];
      nowFav = true;
    }
    cachedFavorites = updated;
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("favorites-updated", { detail: updated }));
    return nowFav;
  } catch {
    return false;
  }
}

export function getRecentTools(): string[] {
  if (typeof window === "undefined") return [];
  if (cachedRecent !== null) return cachedRecent;
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) {
      cachedRecent = [];
      return [];
    }
    const parsed = JSON.parse(raw);
    cachedRecent = Array.isArray(parsed) ? parsed : [];
    return cachedRecent;
  } catch {
    cachedRecent = [];
    return [];
  }
}

export function addRecentTool(toolId: string): void {
  if (typeof window === "undefined") return;
  try {
    const current = getRecentTools().filter((id) => id !== toolId);
    const updated = [toolId, ...current].slice(0, 10);
    cachedRecent = updated;
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("recent-updated", { detail: updated }));
  } catch {
    // Ignore storage quota or disabled errors safely
  }
}

// Invalidate in-memory cache if another tab/window updates localStorage
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === FAVORITES_KEY || e.key === LEGACY_FAVORITES_KEY) {
      cachedFavorites = null;
    } else if (e.key === RECENT_KEY || e.key === LEGACY_RECENT_KEY) {
      cachedRecent = null;
    }
  });
}
