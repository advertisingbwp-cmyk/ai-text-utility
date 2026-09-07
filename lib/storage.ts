"use client";

const FAVORITES_KEY = "omnitext_favorites";
const RECENT_KEY = "omnitext_recent";

export function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
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
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("favorites-updated", { detail: updated }));
    return nowFav;
  } catch {
    return false;
  }
}

export function getRecentTools(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addRecentTool(toolId: string): void {
  if (typeof window === "undefined") return;
  try {
    const current = getRecentTools().filter((id) => id !== toolId);
    const updated = [toolId, ...current].slice(0, 10);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("recent-updated", { detail: updated }));
  } catch {
    // Ignore storage quota or disabled errors safely
  }
}
