export interface ExtractionResult {
  emails: string[];
  urls: string[];
  totalFound: number;
}

export interface ExtractionOptions {
  deduplicate?: boolean;
  sort?: boolean;
  extractEmails?: boolean;
  extractUrls?: boolean;
}

export function extractEmailsAndUrls(
  input: string,
  options: ExtractionOptions = {}
): ExtractionResult {
  if (!input || !input.trim()) {
    return { emails: [], urls: [], totalFound: 0 };
  }

  const deduplicate = options.deduplicate ?? true;
  const sort = options.sort ?? true;
  const extractEmails = options.extractEmails ?? true;
  const extractUrls = options.extractUrls ?? true;

  let rawEmails: string[] = [];
  let rawUrls: string[] = [];

  // Email regex RFC 5322 simplified for extraction
  if (extractEmails) {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    rawEmails = input.match(emailRegex) || [];
  }

  // URL regex supporting http, https, ftp, www, and common domains
  if (extractUrls) {
    const urlRegex =
      /\b(?:https?:\/\/|ftp:\/\/|www\.)[^\s<>"'{}|\\^`]+[^\s<>"'{}|\\^`.,;:?!)]/gi;
    const matches = input.match(urlRegex) || [];
    rawUrls = matches.map((u) => (u.startsWith("www.") ? `https://${u}` : u));
  }

  let emails = deduplicate
    ? Array.from(new Set(rawEmails.map((e) => e.toLowerCase())))
    : rawEmails;
  let urls = deduplicate ? Array.from(new Set(rawUrls)) : rawUrls;

  if (sort) {
    emails.sort((a, b) => a.localeCompare(b));
    urls.sort((a, b) => a.localeCompare(b));
  }

  return {
    emails,
    urls,
    totalFound: emails.length + urls.length,
  };
}

export function formatExtractionResult(result: ExtractionResult): string {
  const sections: string[] = [];

  sections.push(`=== Extracted Emails (${result.emails.length}) ===`);
  if (result.emails.length > 0) {
    sections.push(...result.emails);
  } else {
    sections.push("(None found)");
  }

  sections.push("");
  sections.push(`=== Extracted URLs (${result.urls.length}) ===`);
  if (result.urls.length > 0) {
    sections.push(...result.urls);
  } else {
    sections.push("(None found)");
  }

  return sections.join("\n");
}
