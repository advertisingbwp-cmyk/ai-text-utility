"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search, Sparkles, X } from "lucide-react";
import { TOOLS_REGISTRY, CATEGORIES } from "@/data/toolsRegistry";
import { DynamicIcon } from "@/components/DynamicIcon";
import { getToolTheme } from "@/lib/toolThemes";

interface CommandPaletteProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
}) => {
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const setIsOpen = externalOnOpenChange || setInternalOpen;

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  const handleSelect = (slug: string) => {
    setIsOpen(false);
    router.push(`/tools/${slug}`);
  };

  const filteredTools =
    selectedCategory === "ALL"
      ? TOOLS_REGISTRY
      : TOOLS_REGISTRY.filter((t) => t.category === selectedCategory);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl text-slate-900 dark:text-slate-100 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <Command label="Command Palette" className="w-full">
          <div className="flex items-center border-b border-slate-200 dark:border-slate-800 px-4 py-3 bg-white/95 dark:bg-slate-900/90">
            <Search className="mr-3 h-5 w-5 shrink-0 text-slate-400 dark:text-slate-500" />
            <Command.Input
              autoFocus
              placeholder="Type to search all 40+ text utilities..."
              className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none"
            />
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close command palette"
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Category Filter Pills */}
          <div className="flex items-center gap-1.5 px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40 overflow-x-auto text-xs scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategory("ALL")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors whitespace-nowrap ${
                selectedCategory === "ALL"
                  ? "bg-brand-600 text-white shadow-xs"
                  : "bg-slate-200/70 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              All Tools ({TOOLS_REGISTRY.length})
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                type="button"
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === cat.name
                    ? "bg-brand-600 text-white shadow-xs"
                    : "bg-slate-200/70 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <Command.List className="max-h-80 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
            <Command.Empty className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
              No matching tools found.
            </Command.Empty>

            {CATEGORIES.map((cat) => {
              const toolsInCat = filteredTools.filter((t) => t.category === cat.name);
              if (toolsInCat.length === 0) return null;

              return (
                <Command.Group
                  key={cat.name}
                  heading={cat.name}
                  className="px-2 py-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  {toolsInCat.map((tool) => {
                    const theme = getToolTheme(tool.id, tool.category);
                    return (
                      <Command.Item
                        key={tool.id}
                        value={`${tool.name} ${tool.category} ${tool.keywords.join(" ")}`}
                        onSelect={() => handleSelect(tool.slug)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/90 hover:text-slate-900 dark:hover:text-white cursor-pointer data-[selected=true]:bg-slate-100 dark:data-[selected=true]:bg-slate-800 data-[selected=true]:text-slate-900 dark:data-[selected=true]:text-white transition-colors"
                      >
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${theme.bg} ${theme.border}`}
                        >
                          <span className="text-sm leading-none select-none" role="img" aria-hidden="true">
                            {theme.emoji}
                          </span>
                        </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-900 dark:text-slate-100 truncate">
                            {tool.name}
                          </span>
                          {tool.category === "AI Magic" && (
                            <span className="inline-flex items-center gap-0.5 text-xs text-brand-600 dark:text-brand-400 font-semibold">
                              <Sparkles size={11} /> AI
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {tool.description}
                        </p>
                      </div>
                      <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0 font-mono">
                        ↵ Open
                      </span>
                    </Command.Item>
                  );
                })}
                </Command.Group>
              );
            })}
          </Command.List>

          <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 px-4 py-2 bg-slate-50/80 dark:bg-slate-950/60 text-xs text-slate-500 dark:text-slate-400">
            <span>
              Use <kbd className="font-mono bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">↑</kbd> <kbd className="font-mono bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">↓</kbd> to navigate
            </span>
            <span>
              <kbd className="font-mono bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">Esc</kbd> to close
            </span>
          </div>
        </Command>
      </div>
    </div>
  );
};
