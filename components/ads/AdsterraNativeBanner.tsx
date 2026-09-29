"use client";

import React from "react";

export const AdsterraNativeBanner: React.FC<{ className?: string }> = ({ className = "" }) => {
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body {
      margin: 0;
      padding: 0;
      background: transparent;
      font-family: system-ui, -apple-system, sans-serif;
    }
  </style>
</head>
<body>
  <script async="async" data-cfasync="false" src="https://pl31247526.profitableratecpmnetwork.com/8aca604b8b2ab0a3b2106d4958e02b1d/invoke.js"></script>
  <div id="container-8aca604b8b2ab0a3b2106d4958e02b1d"></div>
</body>
</html>`;

  return (
    <aside
      aria-label="Sponsored advertisement"
      className={`w-full max-w-4xl mx-auto flex flex-col items-center justify-center my-6 p-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-100/60 dark:bg-slate-900/40 ${className}`}
    >
      <div className="flex items-center gap-2 mb-2.5">
        <span className="px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700">
          Advertisement
        </span>
        <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
          Sponsored Content
        </span>
      </div>
      <iframe
        srcDoc={html}
        title="Sponsored Native Banner"
        frameBorder="0"
        scrolling="no"
        className="w-full min-h-[160px] rounded-xl overflow-hidden bg-transparent"
      />
    </aside>
  );
};
