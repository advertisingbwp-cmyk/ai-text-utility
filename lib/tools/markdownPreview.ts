/** Nest generated Markdown headings below the host page title, only in previews.
 * Input must be HTML from our Markdown converter, which emits plain heading tags.
 * Exported HTML and escaped code examples remain unchanged.
 */
export function markdownPreviewHtml(html: string): string {
  return html.replace(/<(\/?)h([1-6])>/g, (_, closing: string, level: string) =>
    `<${closing}h${Math.min(6, Number(level) + 1)}>`);
}
