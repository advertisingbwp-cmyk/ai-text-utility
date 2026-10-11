import { micromark } from "micromark";
import { gfmStrikethrough, gfmStrikethroughHtml } from "micromark-extension-gfm-strikethrough";

/** CommonMark plus double-tilde strikethrough. Raw HTML and unsafe URLs stay disabled. */
export function convertMarkdownToHtml(markdown: string): string {
  if (!markdown.trim()) return "";
  return micromark(markdown, {
    extensions: [gfmStrikethrough({ singleTilde: false })],
    htmlExtensions: [gfmStrikethroughHtml()],
    allowDangerousHtml: false,
    allowDangerousProtocol: false,
  });
}
