"use client";

import React from "react";

export const AdsterraBanner300x250: React.FC<{ className?: string }> = ({ className = "" }) => {
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body {
      margin: 0;
      padding: 0;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      background: transparent;
    }
  </style>
</head>
<body>
  <script>
    atOptions = {
      'key' : 'dc60669d213c871b2e2024882d61f041',
      'format' : 'iframe',
      'height' : 250,
      'width' : 300,
      'params' : {}
    };
  </script>
  <script src="https://bibleearthquake.com/dc60669d213c871b2e2024882d61f041/invoke.js"></script>
</body>
</html>`;

  return (
    <div className={`flex flex-col items-center justify-center my-4 ${className}`}>
      <span className="text-xs uppercase font-mono tracking-wider text-slate-600 dark:text-slate-400 font-semibold mb-1">
        Advertisement
      </span>
      <iframe
        srcDoc={html}
        width={300}
        height={250}
        title="Sponsored Ad 300x250"
        frameBorder="0"
        scrolling="no"
        className="rounded-xl overflow-hidden shadow-xs border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900"
      />
    </div>
  );
};
