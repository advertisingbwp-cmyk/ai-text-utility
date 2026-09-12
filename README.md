# AI Smart Text Utility & Assistant

A modern, fast, accessible, and privacy-first web application providing 43+ instant browser-based text transformations, developer utilities, and AI-powered writing assistants.

---

## 🚀 Features & Tool Suite

### 1. Text Analysis & Extraction (10 Tools)
- **Word Counter**: Real-time counts for words, characters, sentences, paragraphs, and reading time.
- **Slug Generator**: Clean, URL-safe permalinks with custom separators and diacritic removal.
- **Remove Emojis**: Strip Unicode emojis and pictographs while preserving text and punctuation.
- **Tabs ↔ Spaces**: Convert indentation with customizable tab widths.
- **Remove Letter Accents**: Normalize diacritics for pure ASCII text (e.g. *résumé* → *resume*).
- **Character Frequency**: Ranked distribution analysis with occurrence percentages.
- **Word Frequency**: Keyword density and occurrence frequency breakdown.
- **Extract Emails & URLs**: Scrape links, domains, and email addresses from messy text.
- **Regex Tester**: Real-time JavaScript regular expression evaluator with capture group inspection.
- **Query String Parser**: Parse and construct URL query parameters to/from formatted JSON.

### 2. Structured Data & Formatting (6 Tools)
- **JSON Formatter & Validator**: Beautify, validate, minify, and inspect JSON with line/column error tracking.
- **JSON to CSV**: Convert JSON arrays into tabular CSV sheets for Excel and Google Sheets.
- **CSV to JSON**: Parse CSV rows into structured JSON objects and arrays.
- **Add Line Numbers**: Prepend sequential line numbers with custom padding and separators.
- **Markdown to HTML**: Render Markdown headings, lists, tables, and links into sanitized HTML.
- **HTML Minifier**: Strip comments, redundant whitespace, and whitespace-only tags.

### 3. Sanitization & Cleanup (7 Tools)
- **Remove Extra Spaces**: Collapse irregular spaces and tabs into uniform single spaces.
- **Remove Duplicate Lines**: Deduplicate text lines with case-sensitive and whitespace options.
- **Remove Empty Lines**: Eliminate blank lines with optional paragraph preservation.
- **Trim Lines**: Strip leading and trailing whitespace per line.
- **Strip HTML Tags**: Extract plain text safely while removing markup and script tags.
- **Remove Line Breaks**: Join multi-line paragraphs into unified continuous text.
- **Remove Special Characters**: Strip symbols and punctuation, leaving clean alphanumeric text.

### 4. Transforms, Ciphers & Generators (12 Tools)
- **Case Converter**: Convert between UPPERCASE, lowercase, Title Case, camelCase, PascalCase, snake_case, and kebab-case.
- **Fancy Unicode Fonts**: Generate 57+ stylistic fonts (Gothic, Script, Bubble, Monospace, Bold Sans) for social bios.
- **Sort Lines**: Sort alphabetically (A-Z, Z-A), numerically, by length, or randomly shuffle.
- **Reverse Text**: Reverse text strings, reverse word order, or invert line order.
- **Base64 Encode / Decode**: Full UTF-8 Unicode compliant Base64 encoding and decoding.
- **URL Encoder / Decoder**: Percent-encode URI components or decode encoded URLs.
- **Hash Generator**: Cryptographic SHA-256, SHA-384, SHA-512, and MD5 hashes via Web Crypto API.
- **JWT Decoder**: Decode and inspect JSON Web Token headers, payloads, and timestamps locally.
- **Password Generator**: Cryptographically secure random passwords with configurable length and character sets.
- **UUID Generator**: RFC 4122 compliant UUID v4 generation using native crypto.
- **Lorem Ipsum Generator**: Standard placeholder Latin text with custom paragraph, sentence, and word counts.
- **ROT13 Cipher**: Classic Caesar cipher obfuscation.

### 5. Date & Time Calculations (2 Tools)
- **Unix Timestamp Converter**: Convert epoch seconds/milliseconds to human-readable UTC and local dates.
- **Date Difference Calculator**: Calculate exact duration, days, hours, and minutes between two calendar dates.

### 6. AI Magic Tools (Powered by Google Gemini / OpenAI)
- **AI Grammar & Proofreader**: Correct punctuation, spelling, and grammar while preserving original intent.
- **AI Professional Tone**: Rewrite casual drafts into executive business prose.
- **AI Friendly & Warm**: Turn stiff messages into empathetic, conversational communication.
- **AI Summarizer**: Condense long articles and documents into high-impact bullet points.
- **AI Paraphraser**: Rephrase sentences with fresh vocabulary and varied structure.
- **AI Content Expander**: Elaborate on short notes with descriptive detail and flow.

---

## 🛡️ Security & Performance Architecture

- **100% Client-Side Privacy**: All 37 standard text utilities execute locally within browser memory. Zero user text is transmitted to external servers.
- **Zero Client Credential Exposure**: API keys are strictly loaded and executed server-side.
- **Serverless Rate Limiting**: Distributed sliding-window limiter supporting Upstash Redis REST with graceful fallback to local memory.
- **Header Injection Defense**: Strict IPv4 and IPv6 validation prioritizing trusted Vercel edge headers (`x-vercel-forwarded-for`).
- **Sensitive Log Redaction**: API keys (`AIza...`, `sk-...`) and authorization tokens are automatically redacted before logging.
- **Zero-CLS Advertising Layouts**: Ad containers have reserved minimum heights (`min-h-[160px]`, `min-h-[250px]`) eliminating Cumulative Layout Shift.
- **Tree-Shaken Icon Bundles**: Custom Lucide icon dictionary strips ~1,450 unused SVG components from client bundles.
- **Adaptive Keystroke Debouncing**: Instant execution on normal text, with gentle 120ms debouncing for large payloads (50k+ characters) to guarantee 60fps typing responsiveness.

---

## 📁 Project Architecture

```
├── app/
│   ├── api/ai/route.ts        # Hardened AI transformation endpoint
│   ├── tools/[slug]/          # Dynamic SSG tool routes (51 paths: 43 tools + 8 aliases)
│   ├── about/page.tsx         # AdSense & EEAT compliance About page
│   ├── contact/page.tsx       # Support & inquiry Contact page
│   ├── privacy/page.tsx       # Privacy Policy
│   ├── terms/page.tsx         # Terms of Service
│   ├── sitemap.ts             # XML Sitemap generator
│   └── robots.ts              # Crawler robots.txt generator
├── components/
│   ├── tools/                 # Domain-split tool workspace components
│   ├── layouts/               # Responsive workspace layout resolvers
│   └── ads/                   # Zero-CLS responsive ad slots
├── data/
│   ├── tools/                 # Category-split tool definitions & validation engine
│   └── seo/                   # Curated SEO blueprints & educational FAQs
├── lib/
│   ├── ai/                    # Pluggable AI provider, rate limiter & IP extraction
│   └── tools/                 # Pure, deterministic, testable text transformation functions
└── tests/                     # Comprehensive test suites (79/79 passing)
```

---

## 🧪 Development & Verification Scripts

```bash
# Run unit tests & edge-case determinism checks
npm test

# Run TypeScript type verification
npm run typecheck

# Build optimized production bundle
npm run build

# Start local production server
npm start
```

---

## ⚙️ Deployment to Vercel

1. Push this repository to GitHub.
2. Import the project in [Vercel Dashboard](https://vercel.com/new).
3. Under **Project Settings -> Environment Variables**, configure:
   - **`GEMINI_API_KEY`**: Your Google Gemini API Key.
   - *(Optional for Production AdSense)*:
     - **`NEXT_PUBLIC_ADSENSE_PUBLISHER_ID`**: `ca-pub-XXXXXXXXXXXXXXXX`
   - *(Optional for Distributed Serverless Rate Limiting)*:
     - **`UPSTASH_REDIS_REST_URL`**: Your Upstash Redis REST URL.
     - **`UPSTASH_REDIS_REST_TOKEN`**: Your Upstash Redis REST Token.
4. Click **Deploy**. All 61 static pages will be generated and served instantly via Vercel Edge CDN.
