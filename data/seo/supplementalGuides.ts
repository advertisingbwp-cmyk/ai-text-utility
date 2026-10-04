export interface ToolGuide { title: string; description: string; heading: string; example: string; limitations: string; related: string[]; }

export const SUPPLEMENTAL_GUIDES: Record<string, ToolGuide> = {
  "remove-emojis": {
    "title": "Remove Emojis from Text",
    "description": "Remove emoji symbols from copied messages and captions. Preview the cleaned text before copying it into forms or documents.",
    "heading": "Clean captions for plain-text exports",
    "example": "For example, “Hello 🚀” becomes “Hello”. This is useful when a destination rejects pictographs or when you need a plain-text version of a message.",
    "limitations": "Emoji removal is not language translation. Check symbols, spacing, and meaning after cleaning; text emoticons such as :-) are not Unicode emoji.",
    "related": [
      "remove-special-chars",
      "remove-extra-spaces",
      "word-counter"
    ]
  },
  "tabs-to-spaces": {
    "title": "Tabs to Spaces and Spaces to Tabs",
    "description": "Convert tab characters to a chosen number of spaces, or replace groups of spaces with tabs. Review indentation before saving code.",
    "heading": "Standardize indentation in copied code",
    "example": "Choose a width that matches the receiving editor. A tab can be replaced with two or four spaces; reversing the direction replaces matching space groups with tabs.",
    "limitations": "Replacement applies throughout the input, including inside quoted strings. It does not parse code or calculate visual tab stops.",
    "related": [
      "trim-lines",
      "remove-extra-spaces",
      "add-line-numbers"
    ]
  },
  "remove-accents": {
    "title": "Remove Accents and Diacritics",
    "description": "Convert accented Latin letters such as résumé to resume and expand supported ligatures. Clean text locally in your browser.",
    "heading": "Prepare an accent-free copy",
    "example": "Use an accent-free version for legacy imports or matching systems while retaining the original spelling in your source records. “Crème brûlée” becomes “Creme brulee”.",
    "limitations": "This is not a universal transliteration tool. Non-Latin scripts remain, and removing accents can change words or names.",
    "related": [
      "slug-generator",
      "case-converter",
      "remove-special-chars"
    ]
  },
  "character-frequency": {
    "title": "Character Frequency Counter",
    "description": "Count occurrences and percentages of characters. Compare letter frequency with case and whitespace options in your browser.",
    "heading": "Inspect repeated characters",
    "example": "In “aab”, a appears twice and b once. Ignoring case combines A with a; excluding whitespace changes the denominator used for percentages.",
    "limitations": "Counts use Unicode code points. A visible symbol made from combining marks or joined emoji may span several entries. Rounded percentages may not total exactly 100.",
    "related": [
      "word-frequency",
      "word-counter",
      "regex-tester"
    ]
  },
  "word-frequency": {
    "title": "Word Frequency Counter",
    "description": "Find repeated words and compare their occurrence counts. Use a ranked frequency list to review repetition in drafts.",
    "heading": "Review repetition in a draft",
    "example": "Paste a paragraph and inspect its most frequent words. Compare repeated terms with the surrounding sentences before deciding whether to rewrite them.",
    "limitations": "Frequency does not measure writing quality or search ranking. Tokenization and stop-word options affect the totals, especially for languages without spaces.",
    "related": [
      "word-counter",
      "character-frequency",
      "ai-paraphrase"
    ]
  },
  "extract-emails-urls": {
    "title": "Extract Emails and URLs from Text",
    "description": "Find email addresses and web links in pasted text. Review extracted results before exporting or using them in another workflow.",
    "heading": "Separate contact details from notes",
    "example": "Paste a text block containing contact@example.com and https://example.com. The extractor returns matching addresses and links without opening the destination websites.",
    "limitations": "Extraction does not verify mailbox deliverability, ownership, consent, or website safety. Review trailing punctuation and unusual address formats.",
    "related": [
      "remove-duplicate-lines",
      "sort-lines",
      "url-encoder"
    ]
  },
  "query-string-parser": {
    "title": "URL Query String Parser",
    "description": "Inspect decoded URL parameters and export their JSON representation. Repeated keys remain visible as multiple values.",
    "heading": "Inspect tracking and filter parameters",
    "example": "For ?tag=red&tag=blue&q=hello+world, the two tag values form an array and q decodes to “hello world”. A fragment after # is excluded.",
    "limitations": "Parsing does not fetch the URL. Query values remain strings, and malformed percent escapes are preserved rather than guessed. Avoid sharing URLs containing access tokens.",
    "related": [
      "url-encoder",
      "json-formatter",
      "extract-emails-urls"
    ]
  },
  "add-line-numbers": {
    "title": "Add Line Numbers to Text",
    "description": "Number text lines with a starting value, padding, and separator. Prepare readable references for reviews and notes.",
    "heading": "Create references for a text review",
    "example": "Number a copied snippet so reviewers can refer to a specific line. Choose a separator that remains readable when pasted into a plain-text message.",
    "limitations": "Numbers become part of the copied text. Remove them before running code or importing data; blank-line options can change numbering.",
    "related": [
      "remove-empty-lines",
      "trim-lines",
      "sort-lines"
    ]
  },
  "remove-duplicate-lines": {
    "title": "Remove Duplicate Lines Online",
    "description": "Keep unique lines in a text list while preserving their order. Review case and whitespace settings before deduplicating.",
    "heading": "Clean a repeated list",
    "example": "A list containing apple, banana, apple becomes apple, banana with the first occurrence retained. This is useful for repeated IDs or copied entries.",
    "limitations": "Case and whitespace settings define what counts as a duplicate. Removing repeated lines from prose or code may remove intentional content.",
    "related": [
      "trim-lines",
      "sort-lines",
      "remove-empty-lines"
    ]
  },
  "remove-empty-lines": {
    "title": "Remove Empty Lines from Text",
    "description": "Remove blank lines from pasted text and lists. Preview paragraph spacing before copying the compacted output.",
    "heading": "Compact a list for import",
    "example": "Use this when blank rows separate values that need to be imported one per line. Check the whitespace-only setting for rows containing spaces or tabs.",
    "limitations": "Empty lines may carry meaning in paragraphs, poetry, and code. Keep an original copy when layout matters.",
    "related": [
      "trim-lines",
      "remove-line-breaks",
      "remove-duplicate-lines"
    ]
  },
  "trim-lines": {
    "title": "Trim Whitespace from Every Line",
    "description": "Remove leading, trailing, or both kinds of whitespace from each line. Preserve internal word spacing while cleaning lists.",
    "heading": "Clean line boundaries",
    "example": "“  first item  ” becomes “first item” in both-ends mode. Use trailing-only mode when leading indentation needs to stay intact.",
    "limitations": "Leading trim removes indentation. It does not collapse repeated spaces inside a line; use Remove Extra Spaces for that task.",
    "related": [
      "remove-extra-spaces",
      "remove-empty-lines",
      "tabs-to-spaces"
    ]
  },
  "strip-html-tags": {
    "title": "Strip HTML Tags to Plain Text",
    "description": "Extract text from HTML markup with line-break and entity-decoding options. Convert copied markup into readable text.",
    "heading": "Extract copy from a markup snippet",
    "example": "Paste <p>Hello <b>world</b></p> to obtain Hello world. Block boundaries can become line breaks, and supported entities can become readable characters.",
    "limitations": "This is text extraction, not an HTML sanitizer. Malformed markup may produce imperfect output. Never insert the result as trusted HTML; display it as text.",
    "related": [
      "html-minifier",
      "markdown-to-html",
      "remove-extra-spaces"
    ]
  },
  "remove-line-breaks": {
    "title": "Remove Line Breaks and Join Text",
    "description": "Join wrapped lines into a paragraph or delimited string. Preview spacing before copying the result.",
    "heading": "Repair wrapped copied text",
    "example": "When a paragraph is broken after every few words, join its lines with spaces. A custom delimiter is useful for turning a line-based list into one string.",
    "limitations": "Joining lines can erase paragraph boundaries and break code or tabular data. It does not repair hyphenated words automatically.",
    "related": [
      "remove-extra-spaces",
      "trim-lines",
      "remove-empty-lines"
    ]
  },
  "sort-lines": {
    "title": "Sort Text Lines Online",
    "description": "Sort lines alphabetically, numerically, by length, or in shuffled order. Organize a pasted list in your browser.",
    "heading": "Organize a line-based list",
    "example": "Choose alphabetical order for names, numeric order for numbers, or length order for inspecting unusually long entries. Review the result before replacing the original.",
    "limitations": "Sorting changes order and can separate related records. It is not a CSV row sorter; use a spreadsheet for data with linked columns.",
    "related": [
      "remove-duplicate-lines",
      "trim-lines",
      "add-line-numbers"
    ]
  },
  "reverse-text": {
    "title": "Reverse Text, Words, or Lines",
    "description": "Reverse characters within lines, reverse word order, or invert line order. Choose the mode that matches your text task.",
    "heading": "Choose the right reversal",
    "example": "Character mode turns abc into cba. Word mode turns one two into two one within each line. Line mode reverses the document’s line order.",
    "limitations": "Word mode normalizes spacing. Character reversal keeps Unicode surrogate pairs together but can separate combining marks and multi-code-point emoji.",
    "related": [
      "rot13",
      "case-converter",
      "sort-lines"
    ]
  },
  "rot13": {
    "title": "ROT13 Encoder and Decoder",
    "description": "Apply ROT13 to Latin letters to encode or decode simple text puzzles. Apply it twice to restore the original text.",
    "heading": "Hide a puzzle answer casually",
    "example": "Hello becomes Uryyb, and applying ROT13 again returns Hello. Uppercase and lowercase Latin letters rotate while punctuation remains readable.",
    "limitations": "ROT13 is reversible obfuscation, not encryption. Do not use it to protect passwords, private messages, or personal information.",
    "related": [
      "base64",
      "reverse-text",
      "hash-generator"
    ]
  },
  "date-difference": {
    "title": "Date Difference Calculator",
    "description": "Compare two dates and times to view elapsed days, hours, and minutes. Check the timezone and inclusive-end setting.",
    "heading": "Compare elapsed time",
    "example": "Two timestamps exactly 24 hours apart represent one elapsed day. Inclusive-end counting adds a day and should only be used when that matches your counting rule.",
    "limitations": "Elapsed 24-hour days are different from calendar days across daylight-saving changes. Use explicit UTC offsets when precision across timezones matters.",
    "related": [
      "unix-timestamp",
      "word-counter",
      "json-formatter"
    ]
  },
  "ai-grammar": {
    "title": "AI Grammar Checker and Proofreader",
    "description": "Review grammar, spelling, and punctuation with AI assistance. Text is sent to an AI provider; check suggested edits before use.",
    "heading": "Proofread without losing intent",
    "example": "Submit a draft, compare the suggested revision with the original, and check names, tense, and quoted language. Accept only changes that fit your meaning.",
    "limitations": "AI can alter meaning or miss errors. Avoid confidential input and review factual statements; processing requires a network request and may be rate-limited.",
    "related": [
      "ai-paraphrase",
      "ai-professional",
      "word-counter"
    ]
  },
  "ai-professional": {
    "title": "AI Professional Tone Rewriter",
    "description": "Rewrite a casual draft in a more professional tone. Text is processed by an AI provider; review facts and commitments before sending.",
    "heading": "Polish a business message",
    "example": "Provide your actual request and context in the draft. After rewriting, check that the message keeps your intended level of formality and does not invent deadlines.",
    "limitations": "Professional wording is subjective. The model may add unsupported details or soften an important request; keep only language you can stand behind.",
    "related": [
      "ai-friendly",
      "ai-grammar",
      "ai-paraphrase"
    ]
  },
  "ai-summarize": {
    "title": "AI Text Summarizer",
    "description": "Summarize pasted text into a shorter overview with AI. Text is sent to an AI provider; compare key points with the source.",
    "heading": "Create a draft overview",
    "example": "Paste the source passage and review the summary against it. Check that dates, numbers, qualifications, and opposing viewpoints survived compression.",
    "limitations": "A summary can omit context or introduce errors. This tool processes supplied text; it does not independently verify the source or retrieve a linked article.",
    "related": [
      "word-counter",
      "ai-paraphrase",
      "ai-expand"
    ]
  },
  "ai-paraphrase": {
    "title": "AI Paraphrasing Tool",
    "description": "Rephrase a draft with AI assistance. Text is sent to an AI provider; review the rewritten version for meaning and accuracy.",
    "heading": "Try another sentence structure",
    "example": "Use a short passage whose meaning you understand, then compare the new wording sentence by sentence. Retain necessary terminology and attribution.",
    "limitations": "Paraphrasing is not a plagiarism guarantee and does not remove citation obligations. AI may shift emphasis, invent details, or change technical meaning.",
    "related": [
      "ai-grammar",
      "ai-friendly",
      "ai-professional"
    ]
  },
  "ai-expand": {
    "title": "AI Text and Paragraph Expander",
    "description": "Expand a short idea into a longer draft with AI. Text is processed by an AI provider; verify any added examples or claims.",
    "heading": "Develop a short draft",
    "example": "Supply the point you want to explain and any relevant context. Review the expansion, remove repetition, and replace generic examples with facts you can verify.",
    "limitations": "Additional detail may be invented. Do not treat generated statistics, sources, promises, or examples as verified facts. Avoid submitting confidential information.",
    "related": [
      "ai-summarize",
      "ai-grammar",
      "word-counter"
    ]
  }
};
