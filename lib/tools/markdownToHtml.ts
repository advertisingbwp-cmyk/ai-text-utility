function sanitizeSafeUrl(url: string, isImage = false): string {
  // Strip control characters and whitespace
  const trimmed = url.replace(/[\u0000-\u001F\u007F-\u009F\s]/g, "");

  if (!isImage) {
    // Links: only allow http, https, mailto, relative paths, or anchors
    if (/^(https?:|\/|#|mailto:)/i.test(trimmed)) {
      return trimmed.replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }
    return "#unsafe-url";
  }

  // Images: allow http, https, relative paths, or raster base64 (no SVG data URIs to prevent XSS)
  if (/^(https?:|\/)/i.test(trimmed)) {
    return trimmed.replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

  if (/^data:image\/(?:png|jpe?g|gif|webp);base64,[A-Za-z0-9+/=]+$/i.test(trimmed)) {
    return trimmed;
  }

  return "#unsafe-url";
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function convertMarkdownToHtml(markdown: string): string {
  if (!markdown || !markdown.trim()) return "";

  const lines = markdown.split(/\r?\n/);
  const output: string[] = [];

  let inCodeBlock = false;
  let codeBlockLang = "";
  let codeBuffer: string[] = [];

  let inList: "ul" | "ol" | null = null;
  let inBlockquote = false;
  let blockquoteBuffer: string[] = [];

  const closeList = () => {
    if (inList) {
      output.push(`</${inList}>`);
      inList = null;
    }
  };

  const closeBlockquote = () => {
    if (inBlockquote) {
      const content = blockquoteBuffer.map(processInline).join("<br />");
      output.push(`<blockquote><p>${content}</p></blockquote>`);
      inBlockquote = false;
      blockquoteBuffer = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Fenced Code Blocks
    const codeMatch = line.match(/^```(\w*)/);
    if (codeMatch) {
      if (inCodeBlock) {
        // End code block
        const codeContent = escapeHtml(codeBuffer.join("\n"));
        const langClass = codeBlockLang ? ` class="language-${escapeHtml(codeBlockLang)}"` : "";
        output.push(`<pre><code${langClass}>${codeContent}</code></pre>`);
        inCodeBlock = false;
        codeBuffer = [];
        codeBlockLang = "";
      } else {
        closeList();
        closeBlockquote();
        inCodeBlock = true;
        codeBlockLang = codeMatch[1] || "";
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // Horizontal Rule
    if (/^(?:---|\*\*\*|___)\s*$/.test(line)) {
      closeList();
      closeBlockquote();
      output.push("<hr />");
      continue;
    }

    // Blockquote
    const bqMatch = line.match(/^>\s?(.*)$/);
    if (bqMatch) {
      closeList();
      inBlockquote = true;
      blockquoteBuffer.push(bqMatch[1]);
      continue;
    } else if (inBlockquote) {
      closeBlockquote();
    }

    // Headers
    const hMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (hMatch) {
      closeList();
      closeBlockquote();
      const level = hMatch[1].length;
      output.push(`<h${level}>${processInline(hMatch[2].trim())}</h${level}>`);
      continue;
    }

    // Unordered List (- or *)
    const ulMatch = line.match(/^[\*\-]\s+(.*)$/);
    if (ulMatch) {
      closeBlockquote();
      if (inList !== "ul") {
        closeList();
        output.push("<ul>");
        inList = "ul";
      }
      output.push(`  <li>${processInline(ulMatch[1].trim())}</li>`);
      continue;
    }

    // Ordered List (1. )
    const olMatch = line.match(/^\d+\.\s+(.*)$/);
    if (olMatch) {
      closeBlockquote();
      if (inList !== "ol") {
        closeList();
        output.push("<ol>");
        inList = "ol";
      }
      output.push(`  <li>${processInline(olMatch[1].trim())}</li>`);
      continue;
    }

    // Empty Line
    if (!line.trim()) {
      closeList();
      closeBlockquote();
      continue;
    }

    // Normal Paragraph
    closeList();
    closeBlockquote();
    output.push(`<p>${processInline(line.trim())}</p>`);
  }

  // Close any unclosed tags at EOF
  if (inCodeBlock) {
    const codeContent = escapeHtml(codeBuffer.join("\n"));
    output.push(`<pre><code>${codeContent}</code></pre>`);
  }
  closeList();
  closeBlockquote();

  return output.join("\n");
}

function processInline(text: string): string {
  // First escape any raw HTML tags in text to prevent XSS
  let str = escapeHtml(text);

  // Images: ![alt](url)
  str = str.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, url) => {
    return `<img src="${sanitizeSafeUrl(url, true)}" alt="${escapeHtml(alt)}" loading="lazy" />`;
  });

  // Links: [title](url)
  str = str.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, title, url) => {
    return `<a href="${sanitizeSafeUrl(url, false)}" target="_blank" rel="noopener noreferrer">${title}</a>`;
  });

  // Inline Code: `code`
  str = str.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Bold + Italic: ***text***
  str = str.replace(/\*\*\*([^*]+)\*\*\*/g, "<strong><em>$1</em></strong>");

  // Bold: **text** or __text__
  str = str.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  str = str.replace(/__([^_]+)__/g, "<strong>$1</strong>");

  // Italic: *text* or _text_
  str = str.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  str = str.replace(/_([^_]+)_/g, "<em>$1</em>");

  // Strikethrough: ~~text~~
  str = str.replace(/~~([^~]+)~~/g, "<del>$1</del>");

  return str;
}
