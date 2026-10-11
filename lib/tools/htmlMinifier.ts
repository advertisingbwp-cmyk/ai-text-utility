import { parse, type DefaultTreeAdapterMap } from "parse5";

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

/**
 * Conservative source edits, never HTML reserialization. Text whitespace can
 * matter under CSS white-space rules, so only tag/attribute gaps are compacted.
 * Attribute values, raw text and malformed/unrecognized source remain untouched.
 */
export function minifyHtml(html: string, options: HtmlMinifierOptions = {}): HtmlMinifierResult {
  const edits: { start: number; end: number; value: string }[] = [];
  const root = parse(html, { sourceCodeLocationInfo: true });
  const stack: DefaultTreeAdapterMap["node"][] = [root];
  while (stack.length) {
    const node = stack.pop()!;
    const location = node.sourceCodeLocation;
    if (node.nodeName === "#comment" && location && (options.stripComments ?? true)) {
      const raw = html.slice(location.startOffset, location.endOffset);
      // Preserve conditional/directive comments and malformed comment syntax.
      if (raw.startsWith("<!--") && raw.endsWith("-->") && !/^<!--\s*(?:\[if\b|<!|>)/i.test(raw)) {
        edits.push({ start: location.startOffset, end: location.endOffset, value: "" });
      }
    }
    if ("tagName" in node && location && "startTag" in location && location.startTag && (options.collapseWhitespace ?? true)) {
      const tag = location.startTag;
      const name = /^<[a-zA-Z][^\t\n\f\r />]*/.exec(html.slice(tag.startOffset, tag.endOffset));
      if (name) {
        let previous = tag.startOffset + name[0].length;
        const attrs = Object.values(location.attrs ?? {}).sort((a, b) => a.startOffset - b.startOffset);
        for (const attr of attrs) {
          const gap = html.slice(previous, attr.startOffset);
          if (/^[\t\n\f\r ]+$/.test(gap)) edits.push({ start: previous, end: attr.startOffset, value: " " });
          previous = attr.endOffset;
        }
        // Keep one separator before a possible slash: it can belong to an unquoted value.
        const tail = html.slice(previous, tag.endOffset);
        if (/^[\t\n\f\r ]+\/?>$/.test(tail)) {
          edits.push({ start: previous, end: tag.endOffset, value: " " + tail.trimStart() });
        }
      }
    }
    if ("childNodes" in node) stack.push(...node.childNodes);
    if ("content" in node) stack.push(node.content);
  }
  edits.sort((a, b) => a.start - b.start);
  const chunks: string[] = [];
  let cursor = 0;
  for (const edit of edits) {
    if (edit.start < cursor) continue;
    chunks.push(html.slice(cursor, edit.start), edit.value);
    cursor = edit.end;
  }
  chunks.push(html.slice(cursor));
  const minified = chunks.join("");
  const originalSizeBytes = new TextEncoder().encode(html).length;
  const minifiedSizeBytes = new TextEncoder().encode(minified).length;
  return { minified, originalSizeBytes, minifiedSizeBytes,
    savedPercentage: originalSizeBytes ? Number((Math.max(0, originalSizeBytes - minifiedSizeBytes) / originalSizeBytes * 100).toFixed(2)) : 0 };
}
