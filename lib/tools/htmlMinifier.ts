export interface HtmlMinifierOptions {
  stripComments?: boolean;
  collapseWhitespace?: boolean;
}

export interface HtmlMinifierResult {
  minified: string;
  originalSizeBytes: number;
  minifiedSizeBytes: number;
  savedPercentage: number;
}

export function minifyHtml(
  html: string,
  options: HtmlMinifierOptions = {}
): HtmlMinifierResult {
  if (!html || !html.trim()) {
    return {
      minified: "",
      originalSizeBytes: 0,
      minifiedSizeBytes: 0,
      savedPercentage: 0,
    };
  }

  const stripComments = options.stripComments ?? true;
  const collapseWhitespace = options.collapseWhitespace ?? true;

  const originalSizeBytes = new Blob([html]).size;

  // 1. Preserve verbatim tags: <script>, <style>, <pre>, <textarea>
  const preservedBlocks: string[] = [];
  const placeholderPrefix = "___HTML_VERBATIM_BLOCK_";

  let workingHtml = html.replace(
    /<(script|style|pre|textarea)\b[^>]*>[\s\S]*?<\/\1>/gi,
    (match) => {
      const idx = preservedBlocks.length;
      preservedBlocks.push(match);
      return `${placeholderPrefix}${idx}___`;
    }
  );

  // 2. Strip standard comments (preserve conditional comments)
  if (stripComments) {
    workingHtml = workingHtml.replace(/<!--(?!\s*(?:\[if [^\]]+]|<!|>))(?:(?!-->)[\s\S])*-->/g, "");
  }

  if (collapseWhitespace) {
    // 3. Remove whitespace between closing and opening tags (>   < -> ><)
    workingHtml = workingHtml.replace(/>\s+</g, "><");

    // 4. Collapse spaces inside opening tags (<div    class="foo"   > -> <div class="foo">)
    workingHtml = workingHtml.replace(/<([a-zA-Z0-9\-]+)([^>]*?)>/g, (_, tagName, attrs) => {
      // Collapse whitespace inside attributes without altering quoted values
      const cleanAttrs = attrs.replace(/\s+/g, " ").trim();
      return `<${tagName}${cleanAttrs ? ` ${cleanAttrs}` : ""}>`;
    });

    // 5. Collapse multiple spaces in text nodes to single spaces
    workingHtml = workingHtml.replace(/\s{2,}/g, " ");
  }

  // 6. Restore preserved verbatim blocks
  workingHtml = workingHtml.replace(
    /___HTML_VERBATIM_BLOCK_(\d+)___/g,
    (_, idxStr) => {
      const idx = parseInt(idxStr, 10);
      return preservedBlocks[idx] || "";
    }
  );

  const minified = workingHtml.trim();
  const minifiedSizeBytes = new Blob([minified]).size;
  const savedBytes = Math.max(0, originalSizeBytes - minifiedSizeBytes);
  const savedPercentage =
    originalSizeBytes > 0
      ? Number(((savedBytes / originalSizeBytes) * 100).toFixed(2))
      : 0;

  return {
    minified,
    originalSizeBytes,
    minifiedSizeBytes,
    savedPercentage,
  };
}
