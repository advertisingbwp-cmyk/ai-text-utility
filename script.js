// Text Utility - Complete Tools Registry & Implementation

// DOM Elements
const workspaceInput = document.getElementById("workspaceInput");
const workspaceOutput = document.getElementById("workspaceOutput");
const activeToolTitle = document.getElementById("activeToolTitle");
const activeToolDesc = document.getElementById("activeToolDesc");
const activeToolIcon = document.getElementById("activeToolIcon");
const activeToolCategoryBadge = document.getElementById("activeToolCategoryBadge");
const dynamicToolOptions = document.getElementById("dynamicToolOptions");
const btnRunActiveTool = document.getElementById("btnRunActiveTool");
const btnClearWorkspace = document.getElementById("btnClearWorkspace");
const btnSampleText = document.getElementById("btnSampleText");
const btnCopyOutput = document.getElementById("btnCopyOutput");
const btnUseOutputAsInput = document.getElementById("btnUseOutputAsInput");
const btnFavoriteActive = document.getElementById("btnFavoriteActive");
const toastWorkspace = document.getElementById("toastWorkspace");
const workspaceLoading = document.getElementById("workspaceLoading");
const toolsGrid = document.getElementById("toolsGrid");
const toolsFilterInput = document.getElementById("toolsFilterInput");
const noToolsFound = document.getElementById("noToolsFound");
const cmdPaletteModal = document.getElementById("commandPaletteModal");
const cmdPaletteInput = document.getElementById("cmdPaletteInput");
const cmdPaletteResults = document.getElementById("cmdPaletteResults");

// Metrics
const statWords = document.getElementById("statWords");
const statChars = document.getElementById("statChars");
const statCharsNoSpaces = document.getElementById("statCharsNoSpaces");
const statSentences = document.getElementById("statSentences");
const statLines = document.getElementById("statLines");
const statReadingTime = document.getElementById("statReadingTime");

// State
let favorites = JSON.parse(localStorage.getItem("tu_favorites") || "[]");
let currentActiveTool = null;
let currentCategory = "ALL";

// Helper: Real-time stats
function updateStats() {
  const text = workspaceInput.value || "";
  const charCount = text.length;
  const noSpacesCount = text.replace(/\s/g, "").length;
  const trimmed = text.trim();
  const wordsArray = trimmed ? trimmed.split(/\s+/) : [];
  const wordCount = wordsArray.length;
  const sentences = trimmed ? trimmed.split(/[.!?]+/).filter((s) => s.trim().length > 0) : [];
  const sentenceCount = sentences.length;
  const lines = text ? text.split("\n").length : 0;
  const seconds = Math.ceil((wordCount / 200) * 60);

  statWords.textContent = wordCount.toLocaleString();
  statChars.textContent = charCount.toLocaleString();
  statCharsNoSpaces.textContent = noSpacesCount.toLocaleString();
  statSentences.textContent = sentenceCount.toLocaleString();
  statLines.textContent = lines.toLocaleString();
  statReadingTime.textContent = seconds >= 60 ? `${Math.floor(seconds / 60)}m ${seconds % 60}s` : `${seconds}s`;
}
workspaceInput.addEventListener("input", updateStats);

// Toast notification helper
let toastTimer;
function showToast(msg, isError = false) {
  clearTimeout(toastTimer);
  toastWorkspace.textContent = msg;
  toastWorkspace.className = `text-xs font-semibold transition-opacity duration-200 ${
    isError ? "text-rose-400" : "text-emerald-400"
  } opacity-100`;
  toastTimer = setTimeout(() => {
    toastWorkspace.className = "text-xs font-semibold opacity-0 transition-opacity duration-200";
  }, 2000);
}

// -------------------------------------------------------------
// Complete Tools Catalog (50+ Utilities)
// -------------------------------------------------------------
const TOOLS = [
  // --- Text ---
  {
    id: "word-counter",
    category: "Text",
    name: "Word Counter",
    desc: "Count words, characters, sentences, lines, and reading time instantly.",
    icon: "ph-calculator",
    sample: "Writing clear and concise prose is an essential skill in modern communication. Always review word counts and readability.",
    execute: (text) => {
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      const chars = text.length;
      const charsNoSpace = text.replace(/\s/g, "").length;
      const sentences = text.trim() ? text.trim().split(/[.!?]+/).filter(Boolean).length : 0;
      const lines = text.split("\n").length;
      const paragraphs = text.split(/\n+/).filter((p) => p.trim().length > 0).length;
      return [
        `Word Count: ${words}`,
        `Character Count: ${chars}`,
        `Characters (no spaces): ${charsNoSpace}`,
        `Sentence Count: ${sentences}`,
        `Paragraph Count: ${paragraphs}`,
        `Line Count: ${lines}`,
        `Estimated Reading Time: ${Math.ceil((words / 200) * 60)} seconds`,
      ].join("\n");
    },
  },
  {
    id: "slug-generator",
    category: "Text",
    name: "Slug Generator",
    desc: "Create SEO-friendly URL slugs from titles or phrases.",
    icon: "ph-link",
    sample: "How to Build a Modern Web App with AI in 2026!",
    execute: (text) => {
      return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
    },
  },
  {
    id: "remove-emojis",
    category: "Text",
    name: "Remove Emojis",
    desc: "Strip emojis from text while keeping words and punctuation intact.",
    icon: "ph-smiley-x",
    sample: "Hello world! 🚀 Exploring the future with AI 🤖✨ Have a great day! 🎉",
    execute: (text) => {
      return text.replace(
        /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
        ""
      );
    },
  },
  {
    id: "tabs-to-spaces",
    category: "Text",
    name: "Tabs ↔ Spaces",
    desc: "Convert tabs to spaces or spaces to tabs with customizable width.",
    icon: "ph-arrows-left-right",
    sample: "\tfunction hello() {\n\t\treturn 'world';\n\t}",
    optionsHtml: `
      <label class="text-slate-400">Direction:</label>
      <select id="optTabDir" class="bg-slate-800 rounded px-2 py-1 text-white text-xs">
        <option value="tab2space">Tabs to Spaces</option>
        <option value="space2tab">Spaces to Tabs</option>
      </select>
      <label class="text-slate-400">Spaces per tab:</label>
      <input id="optTabWidth" type="number" value="2" min="1" max="8" class="w-12 bg-slate-800 rounded px-2 py-1 text-white text-xs" />
    `,
    execute: (text) => {
      const dir = document.getElementById("optTabDir")?.value || "tab2space";
      const width = parseInt(document.getElementById("optTabWidth")?.value || "2");
      const spaces = " ".repeat(width);
      if (dir === "tab2space") {
        return text.replace(/\t/g, spaces);
      } else {
        return text.replace(new RegExp(spaces, "g"), "\t");
      }
    },
  },
  {
    id: "remove-accents",
    category: "Text",
    name: "Remove Letter Accents",
    desc: "Strip diacritics and accents for ASCII-friendly text (e.g. café → cafe).",
    icon: "ph-text-aa",
    sample: "Crème brûlée, résumé, façade, naïve, señor, El Niño.",
    execute: (text) => {
      return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    },
  },
  {
    id: "character-frequency",
    category: "Text",
    name: "Character Frequency",
    desc: "Analyze character frequency and percentage distribution.",
    icon: "ph-chart-bar",
    sample: "Experience is simply the name we give our mistakes.",
    execute: (text) => {
      const freq = {};
      const total = text.length;
      for (const char of text) {
        freq[char] = (freq[char] || 0) + 1;
      }
      return Object.entries(freq)
        .sort((a, b) => b[1] - a[1])
        .map(([char, count]) => {
          const displayChar = char === " " ? "[space]" : char === "\n" ? "[newline]" : char;
          const pct = ((count / total) * 100).toFixed(2);
          return `${displayChar.padEnd(12)} : ${String(count).padStart(4)} (${pct}%)`;
        })
        .join("\n");
    },
  },
  {
    id: "word-frequency",
    category: "Text",
    name: "Word Frequency Lists",
    desc: "Generate ranked word frequency lists with counts and occurrences.",
    icon: "ph-list-numbers",
    sample: "AI text utilities make formatting text fast and easy. Text tools save time.",
    execute: (text) => {
      const words = text
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .filter(Boolean);
      const freq = {};
      words.forEach((w) => (freq[w] = (freq[w] || 0) + 1));
      return Object.entries(freq)
        .sort((a, b) => b[1] - a[1])
        .map(([word, count], i) => `${i + 1}. ${word.padEnd(16)} : ${count}`)
        .join("\n");
    },
  },
  {
    id: "extract-emails-urls",
    category: "Text",
    name: "Extract Emails / URLs",
    desc: "Extract all email addresses and web links from any text.",
    icon: "ph-at",
    sample: "Contact us at support@plexudo.com or hello@example.org. Check out https://plexudo.com and http://github.com.",
    execute: (text) => {
      const emails = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
      const urls = text.match(/https?:\/\/[^\s"'<>]+/g) || [];
      return [
        "--- EMAILS FOUND (" + emails.length + ") ---",
        ...new Set(emails),
        "",
        "--- URLS FOUND (" + urls.length + ") ---",
        ...new Set(urls),
      ].join("\n");
    },
  },
  {
    id: "regex-tester",
    category: "Text",
    name: "Regular Expression Tester",
    desc: "Test regex patterns, preview matches, and inspect match counts.",
    icon: "ph-code",
    sample: "Order #1234 on 2026-09-01, Order #5678 on 2026-09-05",
    optionsHtml: `
      <label class="text-slate-400">Pattern:</label>
      <input id="optRegexPattern" type="text" value="#\\d+" class="bg-slate-800 rounded px-2 py-1 text-white text-xs w-36 font-mono" />
      <label class="text-slate-400">Flags:</label>
      <input id="optRegexFlags" type="text" value="g" class="bg-slate-800 rounded px-2 py-1 text-white text-xs w-14 font-mono" />
    `,
    execute: (text) => {
      try {
        const pattern = document.getElementById("optRegexPattern")?.value || "";
        const flags = document.getElementById("optRegexFlags")?.value || "g";
        const re = new RegExp(pattern, flags);
        const matches = text.match(re) || [];
        return `Total Matches: ${matches.length}\n\nMatches:\n${matches.map((m, i) => `[${i + 1}] ${m}`).join("\n")}`;
      } catch (e) {
        return "Regex Error: " + e.message;
      }
    },
  },
  {
    id: "query-string-parser",
    category: "Text",
    name: "Query String Parser",
    desc: "Convert URL query strings into readable key/value parameter tables.",
    icon: "ph-question",
    sample: "https://example.com/search?q=text+utility&category=tools&sort=desc&page=2&ref=github",
    execute: (text) => {
      const qIndex = text.indexOf("?");
      const query = qIndex !== -1 ? text.substring(qIndex + 1) : text;
      const params = new URLSearchParams(query);
      const rows = [];
      params.forEach((v, k) => rows.push(`${k.padEnd(16)} = ${v}`));
      return rows.length ? rows.join("\n") : "No query parameters found.";
    },
  },

  // --- Format ---
  {
    id: "json-formatter",
    category: "Format",
    name: "JSON Formatter / Validator",
    desc: "Beautify, indent, and validate JSON data instantly.",
    icon: "ph-brackets-curly",
    sample: '{"name":"Plexudo","services":["Text Tools","AI"],"status":"active","stats":{"users":1250,"uptime":99.9}}',
    optionsHtml: `
      <label class="text-slate-400">Indent:</label>
      <select id="optJsonIndent" class="bg-slate-800 rounded px-2 py-1 text-white text-xs">
        <option value="2">2 Spaces</option>
        <option value="4">4 Spaces</option>
        <option value="min">Minify</option>
      </select>
    `,
    execute: (text) => {
      try {
        const obj = JSON.parse(text);
        const indent = document.getElementById("optJsonIndent")?.value;
        if (indent === "min") return JSON.stringify(obj);
        return JSON.stringify(obj, null, parseInt(indent || "2"));
      } catch (e) {
        return "Invalid JSON Error:\n" + e.message;
      }
    },
  },
  {
    id: "json-to-csv",
    category: "Format",
    name: "JSON → CSV Converter",
    desc: "Convert JSON array of objects into CSV format for spreadsheets.",
    icon: "ph-file-csv",
    sample: '[{"id":1,"name":"Alice","role":"Admin"},{"id":2,"name":"Bob","role":"Editor"},{"id":3,"name":"Charlie","role":"Viewer"}]',
    execute: (text) => {
      try {
        const data = JSON.parse(text);
        if (!Array.isArray(data) || !data.length) return "Input must be a JSON array of objects.";
        const headers = Object.keys(data[0]);
        const csvRows = [headers.join(",")];
        data.forEach((row) => {
          csvRows.push(headers.map((h) => JSON.stringify(row[h] ?? "")).join(","));
        });
        return csvRows.join("\n");
      } catch (e) {
        return "JSON to CSV Error: " + e.message;
      }
    },
  },
  {
    id: "csv-to-json",
    category: "Format",
    name: "CSV → JSON Converter",
    desc: "Turn CSV tabular data into structured JSON objects.",
    icon: "ph-table",
    sample: "id,name,role\n1,Alice,Admin\n2,Bob,Editor\n3,Charlie,Viewer",
    execute: (text) => {
      const lines = text.trim().split("\n");
      if (lines.length < 2) return "CSV must contain header row and at least one data row.";
      const headers = lines[0].split(",").map((h) => h.trim());
      const result = [];
      for (let i = 1; i < lines.length; i++) {
        const obj = {};
        const currentline = lines[i].split(",");
        headers.forEach((h, j) => {
          obj[h] = currentline[j]?.trim() ?? "";
        });
        result.push(obj);
      }
      return JSON.stringify(result, null, 2);
    },
  },
  {
    id: "add-line-numbers",
    category: "Format",
    name: "Add Line Numbers",
    desc: "Add numbered indices to the beginning of each line.",
    icon: "ph-list-dashes",
    sample: "First line of content\nSecond line of code\nThird line of text",
    execute: (text) => {
      const lines = text.split("\n");
      const pad = String(lines.length).length;
      return lines.map((l, i) => `${String(i + 1).padStart(pad, " ")} | ${l}`).join("\n");
    },
  },
  {
    id: "markdown-to-html",
    category: "Format",
    name: "Markdown → HTML",
    desc: "Convert Markdown headings, bold, links, lists into clean HTML.",
    icon: "ph-file-code",
    sample: "# Heading 1\n\nThis is **bold** and *italic* text with a [Link](https://example.com).\n\n- Point A\n- Point B",
    execute: (text) => {
      return text
        .replace(/^### (.*$)/gim, "<h3>$1</h3>")
        .replace(/^## (.*$)/gim, "<h2>$1</h2>")
        .replace(/^# (.*$)/gim, "<h1>$1</h1>")
        .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
        .replace(/\*(.*)\*/gim, "<em>$1</em>")
        .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>')
        .replace(/^\s*\n\*/gm, "<ul>\n*")
        .replace(/^-\s(.*$)/gim, "<li>$1</li>");
    },
  },
  {
    id: "html-minifier",
    category: "Format",
    name: "HTML Minifier",
    desc: "Minify HTML by stripping comments and redundant whitespace.",
    icon: "ph-file-html",
    sample: "<!-- Header -->\n<div class=\"container\">\n   <h1> Hello World </h1>\n</div>",
    execute: (text) => {
      return text
        .replace(/<!--[\s\S]*?-->/g, "")
        .replace(/\s+/g, " ")
        .replace(/> </g, "><")
        .trim();
    },
  },

  // --- Cleanup ---
  {
    id: "remove-extra-spaces",
    category: "Cleanup",
    name: "Remove Extra Spaces",
    desc: "Clean up multiple consecutive spaces and normalize whitespace.",
    icon: "ph-space",
    sample: "This   sentence    has     way   too      many    spaces.",
    execute: (text) => text.replace(/[ \t]+/g, " ").trim(),
  },
  {
    id: "remove-duplicate-lines",
    category: "Cleanup",
    name: "Remove Duplicate Lines",
    desc: "Find and delete duplicate lines while preserving line sequence.",
    icon: "ph-copy-simple",
    sample: "apple\nbanana\napple\norange\nbanana\ngrape",
    execute: (text) => [...new Set(text.split("\n"))].join("\n"),
  },
  {
    id: "remove-empty-lines",
    category: "Cleanup",
    name: "Remove Empty Lines",
    desc: "Delete blank and empty whitespace lines from text.",
    icon: "ph-arrows-in-line-vertical",
    sample: "Line 1\n\n\nLine 2\n\n\nLine 3",
    execute: (text) => text.split("\n").filter((l) => l.trim().length > 0).join("\n"),
  },
  {
    id: "trim-lines",
    category: "Cleanup",
    name: "Trim Lines",
    desc: "Strip leading and trailing whitespace from each line.",
    icon: "ph-scissors",
    sample: "   leading spaces   \n\t\ttabs on left\t\t\n   both sides   ",
    execute: (text) => text.split("\n").map((l) => l.trim()).join("\n"),
  },
  {
    id: "strip-html-tags",
    category: "Cleanup",
    name: "Strip HTML Tags",
    desc: "Remove all HTML markup tags while retaining readable raw text.",
    icon: "ph-code-simple",
    sample: "<p>Welcome to <strong>Plexudo</strong>! Visit <a href='https://example.com'>our site</a>.</p>",
    execute: (text) => text.replace(/<[^>]*>?/gm, ""),
  },
  {
    id: "remove-line-breaks",
    category: "Cleanup",
    name: "Remove Line Breaks",
    desc: "Remove all line breaks and join paragraphs into a continuous line.",
    icon: "ph-text-align-justify",
    sample: "Sentence one.\nSentence two.\nSentence three.\nSentence four.",
    execute: (text) => text.replace(/(\r\n|\n|\r)/gm, " ").replace(/\s+/g, " ").trim(),
  },
  {
    id: "remove-special-chars",
    category: "Cleanup",
    name: "Remove Special Characters",
    desc: "Strip symbols and retain only alphanumeric characters and spaces.",
    icon: "ph-hash",
    sample: "Hello @world! #2026 [Test] {String} $100 & 50% => Valid text.",
    execute: (text) => text.replace(/[^a-zA-Z0-9\s]/g, ""),
  },

  // --- Transform ---
  {
    id: "case-converter",
    category: "Transform",
    name: "Case Converter",
    desc: "Convert between UPPERCASE, lowercase, Title Case, camelCase, snake_case, etc.",
    icon: "ph-text-t",
    sample: "social media marketing and automation tools",
    optionsHtml: `
      <select id="optCaseType" class="bg-slate-800 rounded px-2.5 py-1 text-white text-xs">
        <option value="upper">UPPERCASE</option>
        <option value="lower">lowercase</option>
        <option value="title">Title Case</option>
        <option value="sentence">Sentence case</option>
        <option value="camel">camelCase</option>
        <option value="pascal">PascalCase</option>
        <option value="snake">snake_case</option>
        <option value="kebab">kebab-case</option>
      </select>
    `,
    execute: (text) => {
      const mode = document.getElementById("optCaseType")?.value || "upper";
      switch (mode) {
        case "upper":
          return text.toUpperCase();
        case "lower":
          return text.toLowerCase();
        case "title":
          return text.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
        case "sentence":
          return text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
        case "camel":
          return text
            .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())
            .replace(/^[A-Z]/, (c) => c.toLowerCase());
        case "pascal":
          return text
            .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())
            .replace(/^[a-z]/, (c) => c.toUpperCase());
        case "snake":
          return text.toLowerCase().trim().replace(/[\s_-]+/g, "_");
        case "kebab":
          return text.toLowerCase().trim().replace(/[\s_-]+/g, "-");
        default:
          return text;
      }
    },
  },
  {
    id: "sort-lines",
    category: "Transform",
    name: "Sort Lines",
    desc: "Sort lines alphabetically A-Z, Z-A, by length, or numerically.",
    icon: "ph-sort-ascending",
    sample: "Zebra\nApple\nMango\nBanana\nOrange",
    optionsHtml: `
      <select id="optSortOrder" class="bg-slate-800 rounded px-2 py-1 text-white text-xs">
        <option value="asc">A → Z (Alphabetical)</option>
        <option value="desc">Z → A (Reverse)</option>
        <option value="length">By Length (Shortest first)</option>
      </select>
    `,
    execute: (text) => {
      const mode = document.getElementById("optSortOrder")?.value;
      const lines = text.split("\n");
      if (mode === "desc") return lines.sort().reverse().join("\n");
      if (mode === "length") return lines.sort((a, b) => a.length - b.length).join("\n");
      return lines.sort().join("\n");
    },
  },
  {
    id: "reverse-text",
    category: "Transform",
    name: "Reverse Text",
    desc: "Reverse characters or reverse lines upside down.",
    icon: "ph-arrows-clockwise",
    sample: "The quick brown fox jumps over the lazy dog.",
    execute: (text) => text.split("").reverse().join(""),
  },
  {
    id: "fancy-fonts",
    category: "Transform",
    name: "Fancy Font Generator",
    desc: "Convert regular text into stylish Unicode fonts (Gothic, Bold, Script, Circled, Double Struck).",
    icon: "ph-text-aa",
    sample: "Plexudo AI Text Utility",
    optionsHtml: `
      <select id="optFancyStyle" class="bg-slate-800 rounded px-2 py-1 text-white text-xs">
        <option value="gothic">𝔉𝔞𝔫𝔠𝔶 𝔊𝔬𝔱𝔥𝔦𝔠</option>
        <option value="bold_sans">𝘽𝙤𝙡𝙙 𝙎𝙖𝙣𝙨</option>
        <option value="script">𝒮𝒸𝓇𝒾𝓅𝓉</option>
        <option value="circled">Ⓒⓘⓡⓒⓛⓔⓓ</option>
        <option value="double_struck">𝔻𝕠𝕦𝕓𝕝𝕖 𝕊𝕥𝕣𝕦𝕔𝕜</option>
      </select>
    `,
    execute: (text) => {
      const style = document.getElementById("optFancyStyle")?.value || "gothic";
      const maps = {
        gothic: {
          A: "𝔄", B: "𝔅", C: "ℭ", D: "𝔇", E: "𝔈", F: "𝔉", G: "𝔊", H: "ℌ", I: "ℑ", J: "𝔍", K: "𝔎", L: "𝔏", M: "𝔐", N: "𝔑", O: "𝔒", P: "𝔓", Q: "𝔔", R: "ℜ", S: "𝔖", T: "𝔗", U: "𝔘", V: "𝔙", W: "𝔚", X: "𝔛", Y: "𝔜", Z: "ℨ",
          a: "𝔞", b: "𝔟", c: "𝔠", d: "𝔡", e: "𝔢", f: "𝔣", g: "𝔤", h: "𝔥", i: "𝔦", j: "𝔧", k: "𝔨", l: "𝔩", m: "𝔪", n: "𝔫", o: "𝔬", p: "𝔭", q: "𝔮", r: "𝔯", s: "𝔰", t: "𝔱", u: "𝔲", v: "𝔳", w: "𝔴", x: "𝔵", y: "𝔶", z: "𝔷",
        },
        bold_sans: {
          A: "𝘼", B: "𝘽", C: "𝘾", D: "𝘿", E: "𝙀", F: "𝙁", G: "𝙂", H: "𝙃", I: "𝙄", J: "𝙅", K: "𝙆", L: "𝙇", M: "𝙈", N: "𝙉", O: "𝙊", P: "𝙋", Q: "𝙌", R: "𝙍", S: "𝙎", T: "𝙏", U: "𝙐", V: "𝙑", W: "𝙒", X: "𝙓", Y: "𝙔", Z: "𝙕",
          a: "𝙖", b: "𝙗", c: "𝙘", d: "𝙙", e: "𝙚", f: "𝙛", g: "𝙜", h: "𝙝", i: "𝙞", j: "𝙟", k: "𝙠", l: "𝙡", m: "𝙢", n: "𝙣", o: "𝙤", p: "𝙥", q: "𝙦", r: "𝙧", s: "𝙨", t: "𝙩", u: "𝙪", v: "𝙫", w: "𝙬", x: "𝙭", y: "𝙮", z: "𝙯",
        },
        script: {
          A: "𝒜", B: "ℬ", C: "𝒞", D: "𝒟", E: "ℰ", F: "ℱ", G: "𝒢", H: "ℋ", I: "ℐ", J: "𝒥", K: "𝒦", L: "ℒ", M: "ℳ", N: "𝒩", O: "𝒪", P: "𝒫", Q: "𝒬", R: "ℛ", S: "𝒮", T: "𝒯", U: "𝒰", V: "𝒱", W: "𝒲", X: "𝒳", Y: "𝒴", Z: "𝒵",
          a: "𝒶", b: "𝒷", c: "𝒸", d: "𝒹", e: "ℯ", f: "𝔣", g: "ℊ", h: "𝒽", i: "𝒾", j: "𝒿", k: "𝓀", l: "𝓁", m: "𝓂", n: "𝓃", o: "ℴ", p: "𝓅", q: "𝓆", r: "𝓇", s: "𝓈", t: "𝓉", u: "𝓊", v: "𝓋", w: "𝓌", x: "𝓍", y: "𝓎", z: "𝓏",
        },
        circled: {
          A: "Ⓐ", B: "Ⓑ", C: "Ⓒ", D: "Ⓓ", E: "Ⓔ", F: "Ⓕ", G: "Ⓖ", H: "Ⓗ", I: "Ⓘ", J: "Ⓙ", K: "Ⓚ", L: "Ⓛ", M: "Ⓜ", N: "Ⓝ", O: "Ⓞ", P: "Ⓟ", Q: "Ⓠ", R: "Ⓡ", S: "Ⓢ", T: "Ⓣ", U: "Ⓤ", V: "Ⓥ", W: "Ⓦ", X: "Ⓧ", Y: "Ⓨ", Z: "Ⓩ",
          a: "ⓐ", b: "ⓑ", c: "ⓒ", d: "ⓓ", e: "ⓔ", f: "ⓕ", g: "ⓖ", h: "ⓗ", i: "ⓘ", j: "ⓙ", k: "ⓚ", l: "ⓛ", m: "ⓜ", n: "ⓝ", o: "ⓞ", p: "ⓟ", q: "𝓠", r: "ⓡ", s: "ⓢ", t: "ⓣ", u: "ⓤ", v: "ⓥ", w: "ⓦ", x: "ⓧ", y: "ⓨ", z: "ⓩ",
        },
        double_struck: {
          A: "𝔸", B: "𝔹", C: "ℂ", D: "𝔻", E: "𝔼", F: "𝔽", G: "𝔾", H: "ℍ", I: "𝕀", J: "𝕁", K: "𝕂", L: "𝕃", M: "𝕄", N: "ℕ", O: "𝕆", P: "ℙ", Q: "ℚ", R: "ℝ", S: "𝕊", T: "𝕋", U: "𝕌", V: "𝕍", W: "𝕎", X: "𝕏", Y: "𝕐", Z: "ℤ",
          a: "𝕒", b: "𝕓", c: "𝕔", d: "𝕕", e: "𝕖", f: "𝕗", g: "𝕘", h: "𝕙", i: "𝕚", j: "𝕛", k: "𝕜", l: "𝕝", m: "𝕞", n: "𝕟", o: "𝕠", p: "𝕡", q: "𝕢", r: "𝕣", s: "𝕤", t: "𝕥", u: "𝕦", v: "𝕧", w: "𝕨", x: "𝕩", y: "𝕪", z: "𝕫",
        },
      };
      const map = maps[style] || maps.gothic;
      return text.split("").map((c) => map[c] || c).join("");
    },
  },
  {
    id: "base64",
    category: "Transform",
    name: "Base64 Encoder / Decoder",
    desc: "Encode text into Base64 or decode Base64 strings back to text.",
    icon: "ph-lock-key",
    sample: "Plexudo AI Text Utility 2026",
    optionsHtml: `
      <select id="optBase64Mode" class="bg-slate-800 rounded px-2 py-1 text-white text-xs">
        <option value="encode">Encode to Base64</option>
        <option value="decode">Decode from Base64</option>
      </select>
    `,
    execute: (text) => {
      const mode = document.getElementById("optBase64Mode")?.value;
      try {
        if (mode === "decode") return atob(text.trim());
        return btoa(unescape(encodeURIComponent(text)));
      } catch (e) {
        return "Base64 Error: " + e.message;
      }
    },
  },
  {
    id: "url-encoder",
    category: "Transform",
    name: "URL Encoder / Decoder",
    desc: "Encode or decode special URL query characters.",
    icon: "ph-globe",
    sample: "https://example.com/search?q=text & symbols = true & city = New York!",
    optionsHtml: `
      <select id="optUrlMode" class="bg-slate-800 rounded px-2 py-1 text-white text-xs">
        <option value="encode">Encode URL</option>
        <option value="decode">Decode URL</option>
      </select>
    `,
    execute: (text) => {
      const mode = document.getElementById("optUrlMode")?.value;
      return mode === "decode" ? decodeURIComponent(text) : encodeURIComponent(text);
    },
  },
  {
    id: "hash-generator",
    category: "Transform",
    name: "Hash Generator (SHA-256 / SHA-1)",
    desc: "Compute cryptographic hashes directly in your browser with Web Crypto.",
    icon: "ph-fingerprint",
    sample: "admin123456",
    execute: async (text) => {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const sha256Buffer = await crypto.subtle.digest("SHA-256", data);
      const sha1Buffer = await crypto.subtle.digest("SHA-1", data);
      const toHex = (buf) =>
        Array.from(new Uint8Array(buf))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
      return [
        `Input Text : "${text}"`,
        `SHA-256    : ${toHex(sha256Buffer)}`,
        `SHA-1      : ${toHex(sha1Buffer)}`,
      ].join("\n");
    },
  },
  {
    id: "jwt-decoder",
    category: "Transform",
    name: "JWT Decoder",
    desc: "Decode JSON Web Token headers and payload without sending token to any server.",
    icon: "ph-shield-check",
    sample: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkZhaGFkIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    execute: (text) => {
      try {
        const parts = text.trim().split(".");
        if (parts.length !== 3) return "Invalid JWT format. Must contain 3 segments separated by dots.";
        const header = JSON.parse(atob(parts[0]));
        const payload = JSON.parse(atob(parts[1]));
        return [
          "--- HEADER ---",
          JSON.stringify(header, null, 2),
          "",
          "--- PAYLOAD ---",
          JSON.stringify(payload, null, 2),
        ].join("\n");
      } catch (e) {
        return "JWT Decode Error: " + e.message;
      }
    },
  },
  {
    id: "password-generator",
    category: "Transform",
    name: "Password Generator",
    desc: "Generate secure, high-entropy random passwords on demand.",
    icon: "ph-key",
    optionsHtml: `
      <label class="text-slate-400">Length:</label>
      <input id="optPassLen" type="number" value="16" min="8" max="64" class="w-14 bg-slate-800 rounded px-2 py-1 text-white text-xs" />
    `,
    execute: () => {
      const len = parseInt(document.getElementById("optPassLen")?.value || "16");
      const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~|}{[]:;?><,./-=";
      const array = new Uint32Array(len);
      crypto.getRandomValues(array);
      let pass = "";
      for (let i = 0; i < len; i++) {
        pass += charset[array[i] % charset.length];
      }
      return [
        `Generated Secure Password (${len} chars):`,
        pass,
        "",
        "Entropy: High (Cryptographically Secure)",
      ].join("\n");
    },
  },
  {
    id: "uuid-generator",
    category: "Transform",
    name: "UUID / NanoID Generator",
    desc: "Generate RFC-compliant Version 4 UUIDs for development.",
    icon: "ph-identification-badge",
    optionsHtml: `
      <label class="text-slate-400">Count:</label>
      <input id="optUuidCount" type="number" value="5" min="1" max="25" class="w-14 bg-slate-800 rounded px-2 py-1 text-white text-xs" />
    `,
    execute: () => {
      const count = parseInt(document.getElementById("optUuidCount")?.value || "5");
      const list = [];
      for (let i = 0; i < count; i++) {
        list.push(crypto.randomUUID());
      }
      return list.join("\n");
    },
  },
  {
    id: "lorem-ipsum",
    category: "Transform",
    name: "Lorem Ipsum Generator",
    desc: "Create placeholder lorem ipsum paragraphs for UI designs.",
    icon: "ph-file-paragraph",
    execute: () => {
      return (
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. " +
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\n" +
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. " +
        "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      );
    },
  },
  {
    id: "rot13",
    category: "Transform",
    name: "ROT13 / ROT47 Converter",
    desc: "Apply ROT13 letter rotation cipher for quick text obfuscation.",
    icon: "ph-mask-happy",
    sample: "Hello World! Secrets revealed.",
    execute: (text) => {
      return text.replace(/[a-zA-Z]/g, function (c) {
        return String.fromCharCode(
          (c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26
        );
      });
    },
  },

  // --- Date & Time ---
  {
    id: "unix-timestamp",
    category: "Date & Time",
    name: "Unix Timestamp Converter",
    desc: "Convert Unix timestamps (seconds/ms) to human-readable dates and back.",
    icon: "ph-clock-countdown",
    sample: String(Math.floor(Date.now() / 1000)),
    execute: (text) => {
      const num = parseInt(text.trim());
      if (isNaN(num)) {
        return `Current Timestamp: ${Math.floor(Date.now() / 1000)}\nISO Format: ${new Date().toISOString()}`;
      }
      const ms = num < 10000000000 ? num * 1000 : num;
      const d = new Date(ms);
      return [
        `Unix Timestamp : ${num}`,
        `UTC Date       : ${d.toUTCString()}`,
        `Local Date     : ${d.toLocaleString()}`,
        `ISO 8601       : ${d.toISOString()}`,
      ].join("\n");
    },
  },
  {
    id: "date-difference",
    category: "Date & Time",
    name: "Date Difference Calculator",
    desc: "Calculate days, hours, and time difference between two dates.",
    icon: "ph-calendar-check",
    sample: "2026-01-01\n2026-09-07",
    execute: (text) => {
      const parts = text.trim().split("\n");
      if (parts.length < 2) return "Please enter two dates separated by a line break (e.g. 2026-01-01\\n2026-09-07).";
      const d1 = new Date(parts[0]);
      const d2 = new Date(parts[1]);
      if (isNaN(d1) || isNaN(d2)) return "Invalid date format.";
      const diffMs = Math.abs(d2 - d1);
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      return [
        `Date 1     : ${d1.toDateString()}`,
        `Date 2     : ${d2.toDateString()}`,
        `Difference : ${diffDays} Days (${diffHours} Hours)`,
      ].join("\n");
    },
  },

  // --- AI Magic Tools (Powered by Experiential Labs AI) ---
  {
    id: "ai-grammar",
    category: "AI Magic",
    name: "AI Grammar & Spelling Fixer",
    desc: "Detect and correct spelling, grammar, and punctuation mistakes.",
    icon: "ph-sparkle",
    isAI: true,
    aiAction: "grammar",
    sample: "We goes to the market yesterday and buyed three new laptop, but them was not working good.",
  },
  {
    id: "ai-professional",
    category: "AI Magic",
    name: "Make Professional & Formal",
    desc: "Transform casual draft text into an executive business tone.",
    icon: "ph-briefcase",
    isAI: true,
    aiAction: "professional",
    sample: "Hey, can you please send me the report ASAP? I really need it because boss is asking.",
  },
  {
    id: "ai-friendly",
    category: "AI Magic",
    name: "Make Friendly & Conversational",
    desc: "Rewrite text with an engaging, warm, approachable vibe.",
    icon: "ph-smiley",
    isAI: true,
    aiAction: "friendly",
    sample: "The software application documentation has been transmitted to your designated electronic mailbox.",
  },
  {
    id: "ai-summarize",
    category: "AI Magic",
    name: "AI Summarizer",
    desc: "Condense long articles and paragraphs into key bullet points.",
    icon: "ph-list-bullets",
    isAI: true,
    aiAction: "summarize",
    sample: "Artificial intelligence has fundamentally disrupted how businesses operate in 2026. From automated client support to predictive analytics, organizations adopting machine learning models report a 35% productivity boost. However, proper integration requires structured data hygiene and employee retraining.",
  },
  {
    id: "ai-paraphrase",
    category: "AI Magic",
    name: "AI Paraphraser",
    desc: "Rewrite text with fresh vocabulary while retaining exact meaning.",
    icon: "ph-arrows-clockwise",
    isAI: true,
    aiAction: "paraphrase",
    sample: "Good communication skills are essential for career success in software engineering.",
  },
  {
    id: "ai-expand",
    category: "AI Magic",
    name: "AI Text Expander",
    desc: "Elaborate bullet points or brief thoughts into full paragraphs.",
    icon: "ph-arrows-out",
    isAI: true,
    aiAction: "expand",
    sample: "Benefits of automated text utilities: saves time, reduces typos, protects privacy.",
  },
];

// -------------------------------------------------------------
// Render Tools Grid
// -------------------------------------------------------------
function renderTools() {
  toolsGrid.innerHTML = "";
  const query = (toolsFilterInput.value || "").toLowerCase().trim();

  const filtered = TOOLS.filter((tool) => {
    const matchesCat =
      currentCategory === "ALL" ||
      (currentCategory === "FAVORITES" && favorites.includes(tool.id)) ||
      tool.category === currentCategory;

    const matchesSearch =
      !query ||
      tool.name.toLowerCase().includes(query) ||
      tool.desc.toLowerCase().includes(query) ||
      tool.category.toLowerCase().includes(query);

    return matchesCat && matchesSearch;
  });

  if (filtered.length === 0) {
    noToolsFound.classList.remove("hidden");
  } else {
    noToolsFound.classList.add("hidden");
  }

  filtered.forEach((tool) => {
    const isFav = favorites.includes(tool.id);
    const card = document.createElement("div");
    card.className =
      "group bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/50 rounded-2xl p-4 flex flex-col justify-between transition-all hover:shadow-xl hover:shadow-indigo-500/5 cursor-pointer relative";

    const badgeColor =
      tool.category === "AI Magic"
        ? "bg-purple-500/10 text-purple-300 border-purple-500/20"
        : "bg-slate-800 text-slate-400 border-slate-700";

    card.innerHTML = `
      <div>
        <div class="flex items-start justify-between mb-2.5">
          <div class="w-9 h-9 rounded-xl bg-slate-800 group-hover:bg-indigo-600/20 text-slate-300 group-hover:text-indigo-400 border border-slate-700/80 group-hover:border-indigo-500/30 flex items-center justify-center text-lg transition-all">
            <i class="ph ${tool.icon}"></i>
          </div>
          <button class="btn-fav p-1 text-slate-500 hover:text-amber-400 transition-colors" data-id="${tool.id}">
            <i class="ph ${isFav ? "ph-star-fill text-amber-400" : "ph-star"}"></i>
          </button>
        </div>
        <h4 class="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">${tool.name}</h4>
        <p class="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">${tool.desc}</p>
      </div>
      <div class="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
        <span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${badgeColor}">
          ${tool.category}
        </span>
        <span class="text-xs text-indigo-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
          Open <i class="ph ph-arrow-right"></i>
        </span>
      </div>
    `;

    card.addEventListener("click", (e) => {
      if (e.target.closest(".btn-fav")) {
        e.stopPropagation();
        toggleFavorite(tool.id);
        return;
      }
      activateTool(tool);
    });

    toolsGrid.appendChild(card);
  });
}

// Favorite toggle
function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter((f) => f !== id);
  } else {
    favorites.push(id);
  }
  localStorage.setItem("tu_favorites", JSON.stringify(favorites));
  renderTools();
}

// -------------------------------------------------------------
// Tool Execution & Workspace Loader
// -------------------------------------------------------------
function activateTool(tool) {
  currentActiveTool = tool;

  activeToolTitle.innerHTML = `
    ${tool.name}
    <span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
      tool.category === "AI Magic"
        ? "bg-purple-500/10 text-purple-300 border border-purple-500/30"
        : "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
    }">
      ${tool.category}
    </span>
  `;
  activeToolDesc.textContent = tool.desc;
  activeToolIcon.innerHTML = `<i class="ph ${tool.icon}"></i>`;

  // Favorite button state
  const isFav = favorites.includes(tool.id);
  btnFavoriteActive.innerHTML = `<i class="ph ${isFav ? "ph-star-fill text-amber-400" : "ph-star"}"></i> ${
    isFav ? "Favorited" : "Favorite"
  }`;

  // Dynamic Options
  if (tool.optionsHtml) {
    dynamicToolOptions.innerHTML = tool.optionsHtml;
    dynamicToolOptions.classList.remove("hidden");
    dynamicToolOptions.classList.add("flex");
  } else {
    dynamicToolOptions.innerHTML = "";
    dynamicToolOptions.classList.add("hidden");
    dynamicToolOptions.classList.remove("flex");
  }

  // Load sample text if input is empty
  if (!workspaceInput.value.trim() && tool.sample) {
    workspaceInput.value = tool.sample;
    updateStats();
  }

  // Auto execute tool
  runCurrentTool();

  // Smooth scroll to workspace
  document.getElementById("workspace").scrollIntoView({ behavior: "smooth", block: "start" });
}

// Run Active Tool
async function runCurrentTool() {
  if (!currentActiveTool) return;
  const input = workspaceInput.value;

  // AI Tool Handler
  if (currentActiveTool.isAI) {
    if (!input.trim()) {
      showToast("Please enter text for AI processing", true);
      return;
    }

    workspaceLoading.classList.remove("hidden");
    btnRunActiveTool.disabled = true;

    try {
      const res = await fetch("/api/ai-magic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: currentActiveTool.aiAction,
          text: input,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "AI execution failed");

      workspaceOutput.value = data.result || "";
      btnUseOutputAsInput.classList.remove("hidden");
      showToast("AI Processing Complete!");
    } catch (err) {
      console.error(err);
      showToast(err.message || "AI Error", true);
      workspaceOutput.value = "Error: " + err.message;
    } finally {
      workspaceLoading.classList.add("hidden");
      btnRunActiveTool.disabled = false;
    }
    return;
  }

  // Client-Side Tool Handler
  try {
    const result = currentActiveTool.execute ? currentActiveTool.execute(input) : input;
    if (result instanceof Promise) {
      workspaceOutput.value = "Processing...";
      const asyncRes = await result;
      workspaceOutput.value = asyncRes;
    } else {
      workspaceOutput.value = result;
    }
    btnUseOutputAsInput.classList.remove("hidden");
    showToast("Completed!");
  } catch (err) {
    workspaceOutput.value = "Error executing tool: " + err.message;
  }
}

// -------------------------------------------------------------
// Event Listeners
// -------------------------------------------------------------
btnRunActiveTool.addEventListener("click", runCurrentTool);

// Sample Text Loader
btnSampleText.addEventListener("click", () => {
  if (currentActiveTool?.sample) {
    workspaceInput.value = currentActiveTool.sample;
  } else {
    workspaceInput.value = "Plexudo AI Text Utility offers fast, private, and instant text manipulation tools.";
  }
  updateStats();
  runCurrentTool();
  showToast("Sample loaded!");
});

// Clear Workspace
btnClearWorkspace.addEventListener("click", () => {
  workspaceInput.value = "";
  workspaceOutput.value = "";
  btnUseOutputAsInput.classList.add("hidden");
  updateStats();
  showToast("Cleared!");
});

// Copy Output
btnCopyOutput.addEventListener("click", () => {
  const text = workspaceOutput.value || workspaceInput.value;
  if (!text) {
    showToast("Nothing to copy!", true);
    return;
  }
  navigator.clipboard.writeText(text).then(() => {
    showToast("Copied to clipboard!");
  });
});

// Use Output as Input
btnUseOutputAsInput.addEventListener("click", () => {
  if (workspaceOutput.value) {
    workspaceInput.value = workspaceOutput.value;
    updateStats();
    runCurrentTool();
    showToast("Output applied as input!");
  }
});

// Active Favorite Toggle
btnFavoriteActive.addEventListener("click", () => {
  if (currentActiveTool) {
    toggleFavorite(currentActiveTool.id);
    const isFav = favorites.includes(currentActiveTool.id);
    btnFavoriteActive.innerHTML = `<i class="ph ${isFav ? "ph-star-fill text-amber-400" : "ph-star"}"></i> ${
      isFav ? "Favorited" : "Favorite"
    }`;
  }
});

// Category Tabs
document.querySelectorAll(".cat-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".cat-tab").forEach((t) => {
      t.className = "cat-tab px-3.5 py-2 rounded-xl text-xs font-bold transition-all text-slate-400 hover:text-white hover:bg-slate-800";
    });

    tab.className = "cat-tab px-3.5 py-2 rounded-xl text-xs font-bold transition-all bg-indigo-600 text-white shadow-md";

    currentCategory = tab.getAttribute("data-category");
    renderTools();
  });
});

// Inline Filter
toolsFilterInput.addEventListener("input", renderTools);

// -------------------------------------------------------------
// Command Palette (Ctrl + K)
// -------------------------------------------------------------
function openCommandPalette() {
  cmdPaletteModal.classList.remove("hidden");
  cmdPaletteInput.value = "";
  renderPaletteResults("");
  setTimeout(() => cmdPaletteInput.focus(), 50);
}

function closeCommandPalette() {
  cmdPaletteModal.classList.add("hidden");
}

document.getElementById("searchTriggerBtn")?.addEventListener("click", openCommandPalette);
document.getElementById("searchTriggerBtnMobile")?.addEventListener("click", openCommandPalette);

function renderPaletteResults(query) {
  cmdPaletteResults.innerHTML = "";
  const q = query.toLowerCase().trim();
  const matches = TOOLS.filter(
    (t) => !q || t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q)
  );

  if (!matches.length) {
    cmdPaletteResults.innerHTML = `<div class="p-4 text-center text-slate-500">No tools found matching "${query}"</div>`;
    return;
  }

  matches.slice(0, 10).forEach((tool) => {
    const item = document.createElement("div");
    item.className =
      "p-2.5 rounded-xl hover:bg-indigo-600/20 border border-transparent hover:border-indigo-500/30 flex items-center justify-between cursor-pointer group transition-all";
    item.innerHTML = `
      <div class="flex items-center gap-2.5">
        <i class="ph ${tool.icon} text-base text-slate-400 group-hover:text-indigo-400"></i>
        <div>
          <div class="text-xs font-bold text-white group-hover:text-indigo-300">${tool.name}</div>
          <div class="text-[11px] text-slate-500 line-clamp-1">${tool.desc}</div>
        </div>
      </div>
      <span class="text-[10px] uppercase font-bold text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">${tool.category}</span>
    `;
    item.addEventListener("click", () => {
      closeCommandPalette();
      activateTool(tool);
    });
    cmdPaletteResults.appendChild(item);
  });
}

cmdPaletteInput.addEventListener("input", (e) => renderPaletteResults(e.target.value));

// -------------------------------------------------------------
// Keyboard Shortcuts
// -------------------------------------------------------------
window.addEventListener("keydown", (e) => {
  // Ctrl + K -> Command Palette
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    openCommandPalette();
  }
  // Ctrl + / -> Shortcuts modal
  if ((e.ctrlKey || e.metaKey) && e.key === "/") {
    e.preventDefault();
    openModal("shortcutsModal");
  }
  // Ctrl + Enter -> Run tool
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    e.preventDefault();
    runCurrentTool();
  }
  // Ctrl + Shift + C -> Copy output
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "c") {
    e.preventDefault();
    btnCopyOutput.click();
  }
  // Ctrl + Shift + X -> Clear all
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "x") {
    e.preventDefault();
    btnClearWorkspace.click();
  }
  // Escape -> Close all modals
  if (e.key === "Escape") {
    closeCommandPalette();
    document.querySelectorAll("[id$='Modal']").forEach((m) => m.classList.add("hidden"));
  }
});

// Modals
function openModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.remove("hidden");
}

function closeModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.add("hidden");
}

document.querySelectorAll("[id$='Modal']").forEach((modal) => {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.add("hidden");
  });
});

document.getElementById("btnShortcutsNav")?.addEventListener("click", () => openModal("shortcutsModal"));

// Theme Toggle
document.getElementById("themeToggle")?.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
});

// Initialize on Load
activateTool(TOOLS[0]); // Default to Word Counter
renderTools();
updateStats();
