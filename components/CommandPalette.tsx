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
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 shadow-2xl text-slate-900 dark:text-slate-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <Command label="Command Palette" className="w-full">
          <div className="flex items-center border-b border-slate-200/90 dark:border-slate-800 px-4 py-3.5 bg-white/95 dark:bg-slate-900/90">
            <Search className="mr-3 h-5 w-5 shrink-0 text-brand-600 dark:text-brand-400" />
            <Command.Input
              autoFocus
              placeholder={`Search all ${TOOLS_REGISTRY.length} utilities by name, category, or task...`}
              className="w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none"
            />
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close command palette"
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Category Filter Pills */}
          <div className="flex items-center gap-1.5 px-4 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40 overflow-x-auto text-xs scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategory("ALL")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === "ALL"
                  ? "bg-slate-900 text-white dark:bg-brand-600 dark:text-white shadow-xs"
                  : "bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              All Tools ({TOOLS_REGISTRY.length})
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                type="button"
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.name
                    ? "bg-slate-900 text-white dark:bg-brand-600 dark:text-white shadow-xs"
                    : "bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
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
                  className="px-2 py-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider"
                >
                  {toolsInCat.map((tool) => {
                    const theme = getToolTheme(tool.id, tool.category);
                    return (
                      <Command.Item
                        key={tool.id}
                        value={`${tool.name} ${tool.category} ${tool.keywords.join(" ")}`}
                        onSelect={() => handleSelect(tool.slug)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/90 hover:text-slate-900 dark:hover:text-white cursor-pointer data-[selected=true]:bg-brand-50/80 dark:data-[selected=true]:bg-slate-800 data-[selected=true]:text-brand-900 dark:data-[selected=true]:text-white transition-colors"
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${theme.bg} ${theme.border} shadow-2xs`}
                        >
                          <DynamicIcon name={tool.icon} size={16} className={theme.text} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                              {tool.name}
                            </span>
                            {tool.category === "AI Magic" && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.2 rounded bg-brand-500/10 text-brand-600 dark:text-brand-400">
                                <Sparkles size={10} /> AI
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {tool.description}
                          </p>
                        </div>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 shrink-0 font-mono">
                          ↵ Open
                        </span>
                      </Command.Item>
                    );
                  })}
                </Command.Group>
              );
            })}
          </Command.List>

          <div className="flex items-center justify-between border-t border-slate-200/80 dark:border-slate-800 px-4 py-2.5 bg-slate-50/80 dark:bg-slate-950/60 text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>
              Use <kbd className="bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">↑</kbd> <kbd className="bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">↓</kbd> to navigate
            </span>
            <span>
              <kbd className="bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">Esc</kbd> to close
            </span>
          </div>
        </Command>
      </div>
    </div>
  );
};
