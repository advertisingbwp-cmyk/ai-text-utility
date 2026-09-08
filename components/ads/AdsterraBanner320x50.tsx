"use client";

import React from "react";

export const AdsterraBanner320x50: React.FC<{ className?: string }> = ({ className = "" }) => {
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
      'key' : '87759585f06f50f90802d1b4cea40a5d',
      'format' : 'iframe',
      'height' : 50,
      'width' : 320,
      'params' : {}
    };
  </script>
  <script src="https://bibleearthquake.com/87759585f06f50f90802d1b4cea40a5d/invoke.js"></script>
</body>
</html>`;

  return (
    <div className={`flex flex-col items-center justify-center my-3 ${className}`}>
      <span className="text-xs uppercase font-mono tracking-wider text-slate-600 dark:text-slate-400 font-semibold mb-1">
        Advertisement
      </span>
      <iframe
        srcDoc={html}
        width={320}
        height={50}
        title="Sponsored Ad 320x50"
        frameBorder="0"
        scrolling="no"
        className="rounded-lg overflow-hidden shadow-xs border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900"
      />
    </div>
  );
};
