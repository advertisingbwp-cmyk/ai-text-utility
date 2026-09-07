"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search, Sparkles, X } from "lucide-react";
import { TOOLS_REGISTRY, CATEGORIES } from "@/data/toolsRegistry";
import { DynamicIcon } from "@/components/DynamicIcon";

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
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl text-slate-100 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <Command label="Command Palette" className="w-full">
          <div className="flex items-center border-b border-slate-850 px-4 py-3 bg-slate-900/90">
            <Search className="mr-3 h-5 w-5 shrink-0 text-slate-400" />
            <Command.Input
              autoFocus
              placeholder="Type to search all 40+ text utilities..."
              className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 outline-none"
            />
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-200 rounded-md transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Category Filter Pills */}
          <div className="flex items-center gap-1.5 px-4 py-2 border-b border-slate-800 bg-slate-950/40 overflow-x-auto text-xs scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategory("ALL")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors whitespace-nowrap ${
                selectedCategory === "ALL"
                  ? "bg-brand-600 text-white"
                  : "bg-slate-800/80 text-slate-400 hover:text-white"
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
                    ? "bg-brand-600 text-white"
                    : "bg-slate-800/80 text-slate-400 hover:text-white"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <Command.List className="max-h-80 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-slate-700">
            <Command.Empty className="py-8 text-center text-xs text-slate-400">
              No matching tools found.
            </Command.Empty>

            {CATEGORIES.map((cat) => {
              const toolsInCat = filteredTools.filter((t) => t.category === cat.name);
              if (toolsInCat.length === 0) return null;

              return (
                <Command.Group
                  key={cat.name}
                  heading={cat.name}
                  className="px-2 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider"
                >
                  {toolsInCat.map((tool) => (
                    <Command.Item
                      key={tool.id}
                      value={`${tool.name} ${tool.category} ${tool.keywords.join(" ")}`}
                      onSelect={() => handleSelect(tool.slug)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-slate-200 hover:bg-slate-800 hover:text-white cursor-pointer data-[selected=true]:bg-slate-800 data-[selected=true]:text-white transition-colors"
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          tool.category === "AI Magic"
                            ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                            : "bg-slate-800 text-slate-300 border border-slate-700"
                        }`}
                      >
                        <DynamicIcon name={tool.icon} size={15} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-100 truncate">
                            {tool.name}
                          </span>
                          {tool.category === "AI Magic" && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] text-purple-400 font-semibold">
                              <Sparkles size={10} /> AI
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">
                          {tool.description}
                        </p>
                      </div>
                      <span className="text-[10px] text-slate-500 shrink-0 font-mono">
                        ↵ Open
                      </span>
                    </Command.Item>
                  ))}
                </Command.Group>
              );
            })}
          </Command.List>

          <div className="flex items-center justify-between border-t border-slate-800 px-4 py-2 bg-slate-950/60 text-[11px] text-slate-400">
            <span>
              Use <kbd className="font-mono bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-slate-300">↑</kbd> <kbd className="font-mono bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-slate-300">↓</kbd> to navigate
            </span>
            <span>
              <kbd className="font-mono bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-slate-300">Esc</kbd> to close
            </span>
          </div>
        </Command>
      </div>
    </div>
  );
};
