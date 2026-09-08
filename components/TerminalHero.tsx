"use client";

import React, { useEffect, useRef } from "react";

interface CommandPart {
  text: string;
  cls: "base" | "flag" | "arg";
}

interface CommandItem {
  parts: CommandPart[];
  output: string;
}

const SEQUENCE: CommandItem[] = [
  {
    parts: [
      { text: "run word-counter ", cls: "base" },
      { text: "--text ", cls: "flag" },
      { text: '"Hello world"', cls: "arg" },
    ],
    output: "2 words · 11 chars · 1s read",
  },
  {
    parts: [
      { text: "run json-formatter ", cls: "base" },
      { text: "--file ", cls: "flag" },
      { text: "data.json", cls: "arg" },
    ],
    output: "valid JSON · formatted · 3 levels deep",
  },
  {
    parts: [
      { text: "run jwt-decode ", cls: "base" },
      { text: "--token ", cls: "flag" },
      { text: "eyJhbGci...", cls: "arg" },
    ],
    output: "alg: HS256 · exp: valid · claims: 4",
  },
];

export const TerminalHero: React.FC = () => {
  const terminalBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isCancelled = false;

    const sleep = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    const runSequence = async () => {
      const container = terminalBodyRef.current;
      if (!container) return;

      while (!isCancelled) {
        container.innerHTML = "";
        container.style.opacity = "1";

        for (let i = 0; i < SEQUENCE.length; i++) {
          if (isCancelled) return;
          const item = SEQUENCE[i];

          // 1. Create Command Line Container
          const group = document.createElement("div");
          group.className = "mb-2 sm:mb-2.5";

          const cmdLine = document.createElement("div");
          cmdLine.className =
            "flex items-center flex-wrap break-all text-[12.5px] leading-relaxed";

          const prompt = document.createElement("span");
          prompt.className = "text-[#0d9488] font-semibold mr-2 select-none";
          prompt.textContent = "❯";
          cmdLine.appendChild(prompt);

          const contentSpan = document.createElement("span");
          cmdLine.appendChild(contentSpan);

          const cursor = document.createElement("span");
          cursor.className =
            "terminal-cursor-blink inline-block w-[7px] h-[13.5px] bg-[#0d9488] -mb-0.5 ml-0.5";
          cmdLine.appendChild(cursor);

          group.appendChild(cmdLine);
          container.appendChild(group);

          // 2. Type parts character by character
          for (let p = 0; p < item.parts.length; p++) {
            if (isCancelled) return;
            const part = item.parts[p];
            const partSpan = document.createElement("span");
            if (part.cls === "base") partSpan.className = "text-[#14151a]";
            if (part.cls === "flag") partSpan.className = "text-[#6d28d9]";
            if (part.cls === "arg") partSpan.className = "text-[#b45309]";
            contentSpan.appendChild(partSpan);

            for (let c = 0; c < part.text.length; c++) {
              if (isCancelled) return;
              partSpan.textContent += part.text[c];
              await sleep(26);
            }
          }

          // 3. Remove cursor from finished line (keep on the last item so it stays on line 3)
          if (i < SEQUENCE.length - 1) {
            cursor.remove();
          }
          await sleep(140);
          if (isCancelled) return;

          // 4. Render output with fadeInUp
          const outLine = document.createElement("div");
          outLine.className =
            "terminal-output-fade text-[#6b7078] pl-4 mt-0.5 flex items-center gap-2 text-[12.5px]";

          const arrow = document.createElement("span");
          arrow.className = "text-[#2563eb] font-semibold select-none";
          arrow.textContent = "→";

          const outText = document.createElement("span");
          outText.textContent = item.output;

          outLine.appendChild(arrow);
          outLine.appendChild(outText);
          group.appendChild(outLine);

          await sleep(480);
        }

        if (isCancelled) return;

        // Pause on 3rd command before looping (no 4th line)
        await sleep(2400);
        if (isCancelled) return;

        // Fade out
        container.style.transition = "opacity 350ms ease";
        container.style.opacity = "0";
        await sleep(380);
      }
    };

    runSequence();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <section className="relative w-full">
      <style>{`
        @keyframes pulseRing {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.85;
          }
          100% {
            transform: translate(-50%, -50%) scale(2.85);
            opacity: 0;
          }
        }
        @keyframes blinkDot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(4px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes blinkCursor {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        .pulse-ring::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 6.5px;
          height: 6.5px;
          border-radius: 50%;
          border: 1.5px solid #0d9488;
          transform: translate(-50%, -50%);
          animation: pulseRing 1.9s cubic-bezier(0.22, 0.61, 0.36, 1) infinite;
        }
        .live-dot-blink {
          animation: blinkDot 2.2s ease-in-out infinite;
        }
        .terminal-cursor-blink {
          animation: blinkCursor 0.75s step-end infinite;
        }
        .terminal-output-fade {
          animation: fadeInUp 350ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Subtle Background Radial Glow Blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_14%_12%,rgba(109,40,217,0.035)_0%,transparent_42%),radial-gradient(circle_at_86%_14%,rgba(13,148,136,0.04)_0%,transparent_44%)]"
      />

      <div className="max-w-[1180px] mx-auto pt-0 pb-1 sm:pt-1 sm:pb-2 lg:pt-1 lg:pb-3">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 lg:gap-10 items-center">
          {/* LEFT COLUMN */}
          <div className="flex flex-col items-start text-left">
            {/* 1. Kicker Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-medium tracking-tight">
              <span className="relative w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0 pulse-ring" />
              <span>system online — 43 tools loaded</span>
            </div>

            {/* 2. Headline */}
            <h1 className="text-[26px] sm:text-[34px] lg:text-[40px] font-bold tracking-[-0.035em] leading-[1.15] text-slate-900 dark:text-slate-100 mt-3 mb-2">
              Text tools that run like{" "}
              <span className="bg-gradient-to-br from-violet-600 to-teal-600 bg-clip-text text-transparent">
                code
              </span>
              .
            </h1>

            {/* 3. Subheading Paragraph */}
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed max-w-[44ch] mb-4">
              Format, decode, convert, and clean text with the speed and precision
              of a command line — no install, no server, no waiting.
            </p>

            {/* 4. Stats Row - Symmetrical Balanced Grid */}
            <div className="w-full border-t border-slate-200 dark:border-slate-800 pt-3 grid grid-cols-3 divide-x divide-slate-200 dark:divide-slate-800 text-center">
              <div className="flex flex-col items-center px-2">
                <span className="font-mono font-bold text-lg text-slate-900 dark:text-slate-100 tracking-tight leading-none">
                  43+
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                  utilities
                </span>
              </div>

              <div className="flex flex-col items-center px-2">
                <span className="font-mono font-bold text-lg text-slate-900 dark:text-slate-100 tracking-tight leading-none">
                  0ms
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                  server calls
                </span>
              </div>

              <div className="flex flex-col items-center px-2">
                <span className="font-mono font-bold text-lg text-slate-900 dark:text-slate-100 tracking-tight leading-none">
                  100%
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                  local
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: TERMINAL CARD */}
          <div className="w-full">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-card overflow-hidden">
              {/* Window Header */}
              <div className="h-[36px] bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 px-3.5 flex items-center justify-between select-none">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>
                  <span className="font-mono text-xs text-slate-500 dark:text-slate-400 font-medium ml-1 tracking-tight">
                    ai-text-utility — zsh
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 live-dot-blink" />
                  <span className="font-mono text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
                    live
                  </span>
                </div>
              </div>

              {/* Terminal Body */}
              <div
                ref={terminalBodyRef}
                className="font-mono text-xs sm:text-[13px] leading-relaxed p-3.5 sm:p-4 min-h-[175px] text-slate-900 dark:text-slate-100"
              >
                {/* Dynamically typed content */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
