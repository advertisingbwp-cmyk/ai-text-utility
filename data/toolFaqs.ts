/**
 * Curated SEO Content, How-To Guides, and FAQs for Text Tools
 * Provides genuine, helpful, non-keyword-stuffed educational content for search engines and users.
 */

export interface ToolFaqItem {
  question: string;
  answer: string;
}

export interface ToolEducationalContent {
  slug: string;
  howToSteps: string[];
  features: string[];
  faqs: ToolFaqItem[];
}

const CATEGORY_DEFAULT_CONTENT: Record<
  string,
  { howToSteps: string[]; features: string[]; faqs: ToolFaqItem[] }
> = {
  Text: {
    howToSteps: [
      "Paste or type your source text into the input box on the left.",
      "Adjust tool-specific parameters or options located above the input.",
      "Review the live processed output on the right or click 'Run Tool'.",
      "Copy the result to your clipboard with one click or download as a file.",
    ],
    features: [
      "100% Client-side execution in your browser",
      "Zero server latency and complete data privacy",
      "Full Unicode and UTF-8 multi-byte character support",
      "Supports instant one-click copy and download",
    ],
    faqs: [
      {
        question: "Is my text sent to any remote server?",
        answer:
          "No. All Text tools process your content entirely inside your browser using native JavaScript APIs. Your data never leaves your computer.",
      },
      {
        question: "Does this tool work with emojis and non-English scripts?",
        answer:
          "Yes. The engine uses modern Unicode property escapes and surrogate-pair splitting to ensure full support for emojis, Cyrillic, Arabic, Chinese, and accented letters.",
      },
      {
        question: "Is there any limit to the amount of text I can process?",
        answer:
          "Client-side processing easily handles hundreds of thousands of characters without lag. Memory is only bound by your local browser capacity.",
      },
    ],
  },
  Format: {
    howToSteps: [
      "Paste your raw code or formatted text into the input editor.",
      "Select your desired formatting options (such as indentation or delimiters).",
      "The tool validates syntax and outputs clean, standardized markup.",
      "Copy the formatted result or download it directly to your system.",
    ],
    features: [
      "RFC-compliant parsers and minifiers",
      "Syntax validation with helpful error location reporting",
      "Configurable indentation (2 spaces, 4 spaces, or compact minify)",
      "Protects embedded scripts, styles, and special characters",
    ],
    faqs: [
      {
        question: "How does the validator report syntax errors?",
        answer:
          "When parsing JSON or CSV, any syntax flaw displays the exact line, column, and reason for the failure so you can fix it immediately.",
      },
      {
        question: "Can I convert large spreadsheets or datasets?",
        answer:
          "Yes. Browser-based processing handles typical CSV and JSON datasets instantaneously without uploading sensitive tables to third-party servers.",
      },
    ],
  },
  Cleanup: {
    howToSteps: [
      "Paste your messy list or text into the input area.",
      "Configure your cleanup preferences (e.g. case sensitivity, trimming, separators).",
      "The tool cleans, strips, or deduplicates your text in real time.",
      "Copy the sanitized text for use in your documents or applications.",
    ],
    features: [
      "Preserves original list ordering during deduplication",
      "Configurable paragraph and whitespace preservation",
      "Strips malicious or unwanted HTML tags safely",
      "Handles mixed CRLF (Windows) and LF (Unix) line breaks",
    ],
    faqs: [
      {
        question: "Does deduplication preserve the order of items?",
        answer:
          "Yes. The deduplication algorithm keeps the first occurrence of each unique line and preserves its relative order.",
      },
      {
        question: "Will stripping HTML tags remove script blocks?",
        answer:
          "Yes. Strip HTML tags thoroughly removes `<script>` and `<style>` blocks and their contents, preserving only readable text.",
      },
    ],
  },
  Transform: {
    howToSteps: [
      "Enter your input string or list into the input box.",
      "Select your transformation target (such as case mode, hash algorithm, or encoding variant).",
      "Inspect the transformed output or formatted preview cards.",
      "Copy the result or use it directly in your software workflow.",
    ],
    features: [
      "Native Web Crypto API for secure cryptographic hashes and random generation",
      "Full UTF-8 Base64 support without character corruption",
      "Symmetric ciphers and typographical case transformations",
      "Client-side inspection with zero credential leakage",
    ],
    faqs: [
      {
        question: "Are cryptographic passwords and UUIDs truly random?",
        answer:
          "Yes. Passwords and UUIDs use `window.crypto.getRandomValues()`, the browser's cryptographically secure pseudo-random number generator (CSPRNG).",
      },
      {
        question: "Is JWT decoding secure to use here?",
        answer:
          "Yes. The JWT decoder operates purely locally. It never asks for or transmits secret keys. Note that client-side decoding inspects claims but does not verify cryptographic signatures.",
      },
    ],
  },
  "Date & Time": {
    howToSteps: [
      "Enter a timestamp, date string, or date interval into the input.",
      "Choose your preferred timezone (UTC, Local, or specific international zones).",
      "Review the comprehensive date breakdown, relative time, and metrics.",
      "Copy individual timestamp values or full summary reports.",
    ],
    features: [
      "Bidirectional conversion: timestamp to date and date to timestamp",
      "Auto-detects 10-digit seconds versus 13-digit milliseconds",
      "Exact millisecond calendar and duration calculations",
      "Timezone-safe arithmetic unaffected by daylight saving drift",
    ],
    faqs: [
      {
        question: "How does the tool distinguish seconds from milliseconds?",
        answer:
          "Timestamps with 12 or more digits or values exceeding 30 billion are automatically detected as milliseconds, while 10-digit epoch values are processed as seconds. You can also explicitly force either unit.",
      },
      {
        question: "Are daylight saving time shifts accounted for in date differences?",
        answer:
          "Yes. Calculations compute physical elapsed time using absolute UTC millisecond differences, preventing hour adjustments from corrupting interval precision.",
      },
    ],
  },
  "AI Magic": {
    howToSteps: [
      "Paste your rough draft, bullet points, or message into the text area.",
      "Click the 'Run AI Tool' button to submit your request.",
      "Our serverless AI engine (Claude Sonnet 5 via Experiential Labs) refines your text in seconds.",
      "Review the high-quality rewrite, copy to clipboard, or retry with updated instructions.",
    ],
    features: [
      "State-of-the-art Claude Sonnet 5 AI intelligence",
      "Strict zero-logging policy: user text is never saved or used for training",
      "No client-side API keys: requests are securely proxied server-side",
      "Fast streaming responses with strict rate limiting abuse protection",
    ],
    faqs: [
      {
        question: "Is my text used to train AI models?",
        answer:
          "No. Our serverless endpoint connects via enterprise API agreements where prompt data is ephemeral, never logged to disks, and never used for model training.",
      },
      {
        question: "What is the maximum text limit for AI tools?",
        answer:
          "Each AI request allows up to 10,000 characters (approximately 1,500 - 2,000 words), making it ideal for emails, essays, code explanations, and articles.",
      },
    ],
  },
};

export function getToolEducationalContent(
  category: string,
  slug: string,
  toolName: string
): ToolEducationalContent {
  const defaults =
    CATEGORY_DEFAULT_CONTENT[category] || CATEGORY_DEFAULT_CONTENT["Text"];

  return {
    slug,
    howToSteps: defaults.howToSteps.map((step) =>
      step.replace("Run Tool", `Run ${toolName}`)
    ),
    features: defaults.features,
    faqs: defaults.faqs,
  };
}
