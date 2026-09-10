import React from "react";
import {
  BarChart2,
  Code2,
  KeyRound,
  Fingerprint,
  Regex,
  Type,
  Binary,
  Link2,
  ShieldCheck,
  BookOpen,
  AlertTriangle,
  Layers,
} from "lucide-react";

// ==========================================
// 1. WORD COUNTER EDITORIAL
// ==========================================
export const WordCounterEditorial: React.FC = () => {
  return (
    <div className="space-y-12 pt-6 border-t border-slate-200 dark:border-slate-800">
      <section aria-labelledby="word-counter-guide-heading" className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800/60 flex items-center justify-center text-brand-600 dark:text-brand-400 shrink-0">
            <BarChart2 size={18} />
          </div>
          <div>
            <h2
              id="word-counter-guide-heading"
              className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight"
            >
              Online Word Counter: Real-Time Character, Sentence &amp; Reading Metrics
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Accurate text measurement for writers, students, social media managers, and SEO specialists
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            Whether drafting an academic essay, optimizing an SEO meta description, or crafting an engaging social media post, tracking your text volume is vital. Our <strong className="text-slate-900 dark:text-white font-semibold">Free Online Word Counter</strong> analyzes your copy character-by-character directly in your browser memory, providing instantaneous statistical feedback without delay.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/70 dark:bg-slate-950/40 space-y-2">
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                Volume Metrics
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Measures total words, total characters with whitespace, and characters excluding spaces to satisfy strict publishing guidelines.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/70 dark:bg-slate-950/40 space-y-2">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Structure Breakdown
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Detects sentence boundaries and paragraph breaks using standard typographic punctuation delimiters (. ! ?) for structural balance.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/70 dark:bg-slate-950/40 space-y-2">
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                Pacing Estimates
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Calculates estimated reading time based on a standard adult pace of 200 words per minute (WPM) and speech time at 130 WPM.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="word-counter-platforms-heading" className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <Layers size={18} />
          </div>
          <div>
            <h2
              id="word-counter-platforms-heading"
              className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight"
            >
              Standard Character &amp; Word Limits Reference Guide
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Benchmark requirements across search engines, social networks, and academic publishing
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle">
          <table className="w-full text-left text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50/90 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold">
              <tr>
                <th className="px-4 py-3">Platform / Medium</th>
                <th className="px-4 py-3">Limit / Recommended Length</th>
                <th className="px-4 py-3">Impact &amp; Strategic Goal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800/70">
              <tr>
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">Google Search Meta Title</td>
                <td className="px-4 py-3 font-mono text-xs text-brand-600 dark:text-brand-400">50–60 characters</td>
                <td className="px-4 py-3 text-xs">Prevents SERP title truncation; ensures primary keyword visibility.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">Google Search Meta Description</td>
                <td className="px-4 py-3 font-mono text-xs text-brand-600 dark:text-brand-400">150–160 characters</td>
                <td className="px-4 py-3 text-xs">Maximizes click-through rate before snippet ellipsis kicks in.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">Twitter / X Post</td>
                <td className="px-4 py-3 font-mono text-xs text-brand-600 dark:text-brand-400">280 characters</td>
                <td className="px-4 py-3 text-xs">Standard limit for non-premium accounts; promotes concise messaging.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">Instagram Bio</td>
                <td className="px-4 py-3 font-mono text-xs text-brand-600 dark:text-brand-400">150 characters</td>
                <td className="px-4 py-3 text-xs">High-value profile real estate; demands succinct value propositions.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">LinkedIn Post Body</td>
                <td className="px-4 py-3 font-mono text-xs text-brand-600 dark:text-brand-400">3,000 characters</td>
                <td className="px-4 py-3 text-xs">Ideal for in-depth professional thought leadership and long-form analysis.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">College / High School Essay</td>
                <td className="px-4 py-3 font-mono text-xs text-brand-600 dark:text-brand-400">500–2,500 words</td>
                <td className="px-4 py-3 text-xs">Meeting strict minimum/maximum criteria without grade penalties.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="word-vs-char-heading" className="space-y-4">
        <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <h3 id="word-vs-char-heading" className="text-base font-semibold text-slate-900 dark:text-white">
            Word Count vs. Character Count: What&apos;s the Difference?
          </h3>
          <p>
            While both metrics quantify content, they serve fundamentally different constraints. <strong className="text-slate-900 dark:text-white font-semibold">Word count</strong> measures distinct lexical tokens separated by whitespace or punctuation. It is the gold standard for publishers, translators, and academic evaluators because it approximates cognitive density and reading commitment.
          </p>
          <p>
            Conversely, <strong className="text-slate-900 dark:text-white font-semibold">character count</strong> measures individual typographic glyphs, including letters, digits, punctuation, and optionally whitespace. Character counts dictate technical boundaries—such as database field capacities, SMS payload lengths, and UI layout ceilings where overflow causes visual clipping.
          </p>
        </div>
      </section>
    </div>
  );
};

// ==========================================
// 2. JSON FORMATTER EDITORIAL
// ==========================================
export const JsonFormatterEditorial: React.FC = () => {
  return (
    <div className="space-y-12 pt-6 border-t border-slate-200 dark:border-slate-800">
      <section aria-labelledby="json-formatter-guide-heading" className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800/60 flex items-center justify-center text-brand-600 dark:text-brand-400 shrink-0">
            <Code2 size={18} />
          </div>
          <div>
            <h2
              id="json-formatter-guide-heading"
              className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight"
            >
              Online JSON Formatter: Beautify, Validate &amp; Debug JSON Data
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Clean up unreadable minified payloads, identify syntax bugs, and inspect structured data
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            JavaScript Object Notation (JSON) is the universal lingua franca of modern web APIs, microservices, and database configurations. However, production APIs typically strip all formatting to minimize network payload size, returning dense, single-line strings that are impossible for humans to inspect.
          </p>
          <p>
            Our <strong className="text-slate-900 dark:text-white font-semibold">Online JSON Formatter &amp; Validator</strong> instantly re-indents nested objects and arrays using clean 2-space indentation while verifying strict compliance with <strong className="text-slate-900 dark:text-white font-semibold">RFC 8259</strong>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/70 dark:bg-slate-950/40 space-y-2">
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                JSON Formatting (Pretty Print)
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Transforms compacted, single-line JSON into structured, hierarchical trees with uniform indentation, line breaks, and bracket pairing.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/70 dark:bg-slate-950/40 space-y-2">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                JSON Validation &amp; Error Pinpointing
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Executes native parsing to locate unclosed braces, unexpected trailing commas, single quote violations, and misplaced semicolons.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="json-errors-heading" className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <AlertTriangle size={18} />
          </div>
          <div>
            <h2
              id="json-errors-heading"
              className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight"
            >
              Common JSON Syntax Errors &amp; How to Fix Them
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              The most frequent syntax violations that break API parsers and deserialization
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">1. Trailing Commas in Arrays or Objects</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Unlike modern JavaScript, RFC 8259 strictly forbids commas after the last element.
            </p>
            <div className="p-2.5 rounded-lg bg-red-50/60 dark:bg-red-950/30 border border-red-200/60 dark:border-red-800/60 font-mono text-[11px] text-red-700 dark:text-red-300">
              ❌ &#123; &quot;status&quot;: 200, &quot;ready&quot;: true, &#125;
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/60 font-mono text-[11px] text-emerald-700 dark:text-emerald-300">
              ✅ &#123; &quot;status&quot;: 200, &quot;ready&quot;: true &#125;
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">2. Single Quotes Instead of Double Quotes</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              All keys and string values must be enclosed in standard double quotes (<code className="font-mono text-xs">&quot;</code>).
            </p>
            <div className="p-2.5 rounded-lg bg-red-50/60 dark:bg-red-950/30 border border-red-200/60 dark:border-red-800/60 font-mono text-[11px] text-red-700 dark:text-red-300">
              ❌ &#123; &apos;username&apos;: &apos;alex&apos; &#125;
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/60 font-mono text-[11px] text-emerald-700 dark:text-emerald-300">
              ✅ &#123; &quot;username&quot;: &quot;alex&quot; &#125;
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="json-privacy-heading" className="space-y-4">
        <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white text-base">
            <ShieldCheck className="text-emerald-600 dark:text-emerald-400" size={20} />
            <h3 id="json-privacy-heading">Zero Server Logging: Total Payload Confidentiality</h3>
          </div>
          <p>
            Developers frequently inspect JSON payloads containing session tokens, personal identities, API keys, and financial ledger data. Because our formatter runs entirely inside your local browser via native client-side JavaScript, not a single byte of your data is sent over the internet or logged to any database.
          </p>
        </div>
      </section>
    </div>
  );
};

// ==========================================
// 3. PASSWORD GENERATOR EDITORIAL
// ==========================================
export const PasswordGeneratorEditorial: React.FC = () => {
  return (
    <div className="space-y-12 pt-6 border-t border-slate-200 dark:border-slate-800">
      <section aria-labelledby="pwd-generator-guide-heading" className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800/60 flex items-center justify-center text-brand-600 dark:text-brand-400 shrink-0">
            <KeyRound size={18} />
          </div>
          <div>
            <h2
              id="pwd-generator-guide-heading"
              className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight"
            >
              Generate Strong, Random &amp; Cryptographically Secure Passwords
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Defend your accounts against credential stuffing, brute force, and dictionary attacks
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            According to industry cybersecurity reports, over 80% of data breaches stem from stolen, reused, or easily guessed passwords. Predictable patterns such as replacing &apos;e&apos; with &apos;3&apos; or appending an exclamation mark are systematically tested by automated cracking software within fractions of a second.
          </p>
          <p>
            Our <strong className="text-slate-900 dark:text-white font-semibold">Strong Password Generator</strong> uses your operating system&apos;s cryptographically secure pseudo-random number generator (<code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-xs">crypto.getRandomValues()</code>) to guarantee high mathematical entropy, rendering brute-force attacks computationally infeasible.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/70 dark:bg-slate-950/40 space-y-2">
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                1. Length Matters Most
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Exponential combinatorial math means each extra character added multiplies the total cracking attempts needed by up to 94 times.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/70 dark:bg-slate-950/40 space-y-2">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                2. Character Diversity
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Mixing uppercase letters, lowercase letters, numbers, and special symbols expands the character pool from 26 to 94 distinct glyphs.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/70 dark:bg-slate-950/40 space-y-2">
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                3. Zero Human Bias
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Eliminates cognitive naming habits (birth years, pet names, keyboard walks like &quot;qwerty&quot;) that compromise account security.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="pwd-recommendations-heading" className="space-y-4">
        <div className="overflow-x-auto rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle">
          <table className="w-full text-left text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50/90 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold">
              <tr>
                <th className="px-4 py-3">Account Tier</th>
                <th className="px-4 py-3">Recommended Length</th>
                <th className="px-4 py-3">Best Practice Strategy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800/70">
              <tr>
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">General Web Accounts &amp; Forums</td>
                <td className="px-4 py-3 font-mono text-xs text-brand-600 dark:text-brand-400">14–16 characters</td>
                <td className="px-4 py-3 text-xs">Unique password per site stored in a password manager.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">Primary Email &amp; Financial Services</td>
                <td className="px-4 py-3 font-mono text-xs text-brand-600 dark:text-brand-400">18–24 characters</td>
                <td className="px-4 py-3 text-xs">High length + multi-factor authentication (MFA / 2FA) required.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">Password Manager Master Password</td>
                <td className="px-4 py-3 font-mono text-xs text-brand-600 dark:text-brand-400">24+ characters (or 5-word passphrase)</td>
                <td className="px-4 py-3 text-xs">Memorable Diceware passphrase with high entropy, written in secure offline storage.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

// ==========================================
// 4. UUID GENERATOR EDITORIAL
// ==========================================
export const UuidGeneratorEditorial: React.FC = () => {
  return (
    <div className="space-y-12 pt-6 border-t border-slate-200 dark:border-slate-800">
      <section aria-labelledby="uuid-guide-heading" className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800/60 flex items-center justify-center text-brand-600 dark:text-brand-400 shrink-0">
            <Fingerprint size={18} />
          </div>
          <div>
            <h2
              id="uuid-guide-heading"
              className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight"
            >
              UUID v4 Generator: Universally Unique Identifiers Online
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Generate cryptographically secure 128-bit RFC 4122 compliant identifiers instantly
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            A <strong className="text-slate-900 dark:text-white font-semibold">UUID (Universally Unique Identifier)</strong>, also referred to as a <strong className="text-slate-900 dark:text-white font-semibold">GUID (Globally Unique Identifier)</strong> in Microsoft ecosystems, is a 128-bit label designed to uniquely identify information across computer systems without requiring central coordination.
          </p>
          <p>
            Standardized under <strong className="text-slate-900 dark:text-white font-semibold">RFC 4122</strong>, UUID Version 4 uses pseudo-random numbers to populate 122 of its 128 bits. The mathematical likelihood of generating two identical UUID v4 strings is approximately 1 in 5.3 x 10^36—a probability so remote that collision is practically impossible even at massive global scale.
          </p>

          <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/70 dark:bg-slate-950/40 space-y-2">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Anatomy of a UUID v4 Canonical String
            </h3>
            <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200 overflow-x-auto">
              <span>xxxxxxxx</span>-<span>xxxx</span>-<span className="text-brand-600 dark:text-brand-400 font-bold">4</span>xxx-<span className="text-purple-600 dark:text-purple-400 font-bold">y</span>xxx-<span>xxxxxxxxxxxx</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
              Formatted as 32 hexadecimal characters across five hyphen-separated groups (8-4-4-4-12). The &apos;<span className="text-brand-600 dark:text-brand-400 font-semibold">4</span>&apos; identifies Version 4 (Random), while &apos;<span className="text-purple-600 dark:text-purple-400 font-semibold">y</span>&apos; represents the RFC 4122 variant (fixed to 8, 9, a, or b).
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="uuid-use-cases-heading" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Distributed Database Keys</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Allows nodes in distributed clusters (PostgreSQL, MongoDB, Cassandra) to generate unique record IDs independently without waiting on a central auto-incrementing counter.
            </p>
          </div>
          <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">API Idempotency Keys</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Payment gateways (e.g. Stripe) and webhooks use UUID headers to guarantee that retried network requests do not duplicate transactions.
            </p>
          </div>
          <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Distributed Trace Logs</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Microservice observability frameworks assign a unique correlation ID to incoming web requests, linking logs across dozens of asynchronous services.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

// ==========================================
// 5. REGEX TESTER EDITORIAL
// ==========================================
export const RegexTesterEditorial: React.FC = () => {
  return (
    <div className="space-y-12 pt-6 border-t border-slate-200 dark:border-slate-800">
      <section aria-labelledby="regex-guide-heading" className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800/60 flex items-center justify-center text-brand-600 dark:text-brand-400 shrink-0">
            <Regex size={18} />
          </div>
          <div>
            <h2
              id="regex-guide-heading"
              className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight"
            >
              Online Regex Tester: Test, Validate &amp; Debug Regular Expressions
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive testing with real-time match highlighting, flag controls, and group extraction
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            A <strong className="text-slate-900 dark:text-white font-semibold">Regular Expression (Regex)</strong> is a sequence of characters defining a search pattern. Regularly used for form validation, string searching, web scraping, and text replacement, crafting precise patterns can be tricky without instant feedback.
          </p>
          <p>
            Our <strong className="text-slate-900 dark:text-white font-semibold">Online Regex Tester</strong> executes standard JavaScript RegExp evaluation as you type. It highlights matches directly in the test string, counts total occurrences, and tests capture groups with zero network latency.
          </p>

          <div className="overflow-x-auto rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/70 dark:bg-slate-950/40">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold">
                <tr>
                  <th className="px-3 py-2 font-mono">Flag</th>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Behavior &amp; Function</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50 dark:divide-slate-800/50">
                <tr>
                  <td className="px-3 py-2 font-mono font-bold text-brand-600 dark:text-brand-400">g</td>
                  <td className="px-3 py-2">Global</td>
                  <td className="px-3 py-2">Finds all matches rather than stopping after the first occurrence.</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-mono font-bold text-brand-600 dark:text-brand-400">i</td>
                  <td className="px-3 py-2">Ignore Case</td>
                  <td className="px-3 py-2">Case-insensitive matching (e.g. &apos;a&apos; matches both &apos;a&apos; and &apos;A&apos;).</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-mono font-bold text-brand-600 dark:text-brand-400">m</td>
                  <td className="px-3 py-2">Multiline</td>
                  <td className="px-3 py-2">Treats beginning (^) and end ($) characters as matching each line rather than the entire input string.</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-mono font-bold text-brand-600 dark:text-brand-400">s</td>
                  <td className="px-3 py-2">DotAll</td>
                  <td className="px-3 py-2">Allows the dot character (.) to match newline characters (\n).</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section aria-labelledby="regex-patterns-heading" className="space-y-4">
        <h3 id="regex-patterns-heading" className="text-base font-semibold text-slate-900 dark:text-white">
          Frequently Used Regular Expression Cheat Sheet
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-2">
            <span className="text-xs font-semibold text-slate-900 dark:text-white">Standard Email Address Validation</span>
            <div className="p-2 rounded bg-slate-100 dark:bg-slate-800/80 font-mono text-[11px] text-slate-800 dark:text-slate-200 overflow-x-auto">
              ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]&#123;2,&#125;$
            </div>
          </div>
          <div className="p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-2">
            <span className="text-xs font-semibold text-slate-900 dark:text-white">HTTP / HTTPS URL Matching</span>
            <div className="p-2 rounded bg-slate-100 dark:bg-slate-800/80 font-mono text-[11px] text-slate-800 dark:text-slate-200 overflow-x-auto">
              https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]&#123;1,256&#125;\.[a-zA-Z0-9()]&#123;1,6&#125;\b([-a-zA-Z0-9()@:%_+.~#?&amp;//=]*)
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// ==========================================
// 6. CASE CONVERTER EDITORIAL
// ==========================================
export const CaseConverterEditorial: React.FC = () => {
  return (
    <div className="space-y-12 pt-6 border-t border-slate-200 dark:border-slate-800">
      <section aria-labelledby="case-converter-guide-heading" className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800/60 flex items-center justify-center text-brand-600 dark:text-brand-400 shrink-0">
            <Type size={18} />
          </div>
          <div>
            <h2
              id="case-converter-guide-heading"
              className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight"
            >
              Online Case Converter: Transform Text into Any Letter Case Format
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Instantly convert text between UPPERCASE, lowercase, Title Case, camelCase, snake_case, and more
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            Whether formatting articles for publication, transforming strings for programming naming conventions, or correcting accidentally typed caps lock paragraphs, our <strong className="text-slate-900 dark:text-white font-semibold">Online Case Converter</strong> processes your text immediately in memory with zero formatting errors.
          </p>

          <div className="overflow-x-auto rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/70 dark:bg-slate-950/40">
            <table className="w-full text-left text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold">
                <tr>
                  <th className="px-4 py-3">Case Style</th>
                  <th className="px-4 py-3">Transformed Output</th>
                  <th className="px-4 py-3">Typical Application</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50 dark:divide-slate-800/50">
                <tr>
                  <td className="px-4 py-2.5 font-medium text-slate-900 dark:text-white">Title Case</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-brand-600 dark:text-brand-400">The Quick Brown Fox</td>
                  <td className="px-4 py-2.5 text-xs">Headlines, book titles, email subjects, academic headers.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-medium text-slate-900 dark:text-white">Sentence Case</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-brand-600 dark:text-brand-400">The quick brown fox</td>
                  <td className="px-4 py-2.5 text-xs">Standard body copy, user interface buttons, clean document copy.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-medium text-slate-900 dark:text-white">UPPERCASE</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-brand-600 dark:text-brand-400">THE QUICK BROWN FOX</td>
                  <td className="px-4 py-2.5 text-xs">Acronyms, warning banners, legal notices, call-to-action buttons.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-medium text-slate-900 dark:text-white">camelCase</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-brand-600 dark:text-brand-400">theQuickBrownFox</td>
                  <td className="px-4 py-2.5 text-xs">JavaScript / TypeScript variable names and object properties.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-medium text-slate-900 dark:text-white">snake_case</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-brand-600 dark:text-brand-400">the_quick_brown_fox</td>
                  <td className="px-4 py-2.5 text-xs">Python functions, database column identifiers, configuration keys.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-medium text-slate-900 dark:text-white">kebab-case</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-brand-600 dark:text-brand-400">the-quick-brown-fox</td>
                  <td className="px-4 py-2.5 text-xs">URL slugs, CSS class selectors, HTML custom elements.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

// ==========================================
// 7. BASE64 ENCODER/DECODER EDITORIAL
// ==========================================
export const Base64Editorial: React.FC = () => {
  return (
    <div className="space-y-12 pt-6 border-t border-slate-200 dark:border-slate-800">
      <section aria-labelledby="base64-guide-heading" className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800/60 flex items-center justify-center text-brand-600 dark:text-brand-400 shrink-0">
            <Binary size={18} />
          </div>
          <div>
            <h2
              id="base64-guide-heading"
              className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight"
            >
              Base64 Encoder &amp; Decoder: Convert Text to Base64 &amp; Back Online
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Reliable binary-to-text conversion for data URIs, API tokens, email attachments, and web dev
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            <strong className="text-slate-900 dark:text-white font-semibold">Base64</strong> is a binary-to-text encoding scheme designed to transport binary assets (such as images, PDF documents, or cryptographic hashes) across legacy media channels originally built strictly for 7-bit ASCII text.
          </p>
          <p>
            It converts every 3 bytes (24 bits) of raw binary data into 4 printable ASCII characters selected from a 64-character alphabet consisting of <code className="font-mono text-xs">A–Z</code>, <code className="font-mono text-xs">a–z</code>, <code className="font-mono text-xs">0–9</code>, <code className="font-mono text-xs">+</code>, and <code className="font-mono text-xs">/</code>, with <code className="font-mono text-xs">=</code> utilized for padding missing trailing bytes.
          </p>

          <div className="p-4 rounded-xl border border-amber-200/80 dark:border-amber-900/50 bg-amber-50/60 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 space-y-1">
            <div className="flex items-center gap-2 font-semibold text-xs sm:text-sm">
              <AlertTriangle size={16} className="shrink-0" />
              <span>Critical Notice: Base64 is Encoding, NOT Encryption</span>
            </div>
            <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-300">
              Base64 does not provide data confidentiality or cryptographic security. Anyone possessing a Base64-encoded string can decode it back to plaintext instantaneously without requiring a decryption key or password. Never store confidential passwords in Base64.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="base64-use-cases-heading" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Inline Data URIs</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Embed small icons, SVGs, and background textures directly inside CSS stylesheets and HTML image tags to eliminate extra HTTP network requests.
            </p>
          </div>
          <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">HTTP Basic Authentication</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              HTTP headers format client credentials as <code className="font-mono text-xs">Authorization: Basic &lt;Base64(username:password)&gt;</code> for standardized transmission.
            </p>
          </div>
          <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">JSON Binary Transport</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Because standard JSON cannot natively store raw binary byte streams, files and digital signatures are routinely serialized as Base64 strings.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

// ==========================================
// 8. URL ENCODER/DECODER EDITORIAL
// ==========================================
export const UrlEncoderEditorial: React.FC = () => {
  return (
    <div className="space-y-12 pt-6 border-t border-slate-200 dark:border-slate-800">
      <section aria-labelledby="url-encoder-guide-heading" className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800/60 flex items-center justify-center text-brand-600 dark:text-brand-400 shrink-0">
            <Link2 size={18} />
          </div>
          <div>
            <h2
              id="url-encoder-guide-heading"
              className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight"
            >
              URL Encoder &amp; Decoder: Percent-Encode Special Characters for Safe URLs
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ensure web addresses, query strings, and API parameters follow RFC 3986 standards
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            Uniform Resource Identifiers (URIs) are constrained to a restricted subset of the US-ASCII character set. Characters that carry structural meaning (such as <code className="font-mono text-xs">?</code>, <code className="font-mono text-xs">&amp;</code>, <code className="font-mono text-xs">/</code>, and <code className="font-mono text-xs">=</code>) or characters outside the printable ASCII range (spaces, accented letters, emojis) will corrupt URL parameters if not properly escaped.
          </p>
          <p>
            Under <strong className="text-slate-900 dark:text-white font-semibold">RFC 3986</strong>, <strong className="text-slate-900 dark:text-white font-semibold">URL Encoding (Percent-Encoding)</strong> converts each unsafe character into a percent sign followed by two hexadecimal digits representing its UTF-8 byte value.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/70 dark:bg-slate-950/40 space-y-2">
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                encodeURI vs encodeURIComponent
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                <code className="font-mono text-xs">encodeURI</code> preserves full web addresses (leaving : / ? &amp; intact), while <code className="font-mono text-xs">encodeURIComponent</code> strictly escapes all reserved delimiters so string values safely nest inside URL query parameters.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/70 dark:bg-slate-950/40 space-y-2">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Space Encoding: %20 vs +
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                The RFC 3986 standard mandates <code className="font-mono text-xs">%20</code> for spaces across general URLs, whereas legacy HTML form submissions (<code className="font-mono text-xs">application/x-www-form-urlencoded</code>) frequently encode spaces as <code className="font-mono text-xs">+</code>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// ==========================================
// 9. JWT DECODER EDITORIAL
// ==========================================
export const JwtDecoderEditorial: React.FC = () => {
  return (
    <div className="space-y-12 pt-6 border-t border-slate-200 dark:border-slate-800">
      <section aria-labelledby="jwt-guide-heading" className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800/60 flex items-center justify-center text-brand-600 dark:text-brand-400 shrink-0">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h2
              id="jwt-guide-heading"
              className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight"
            >
              JWT Decoder: Inspect JSON Web Token Header, Payload &amp; Claims Online
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Safely parse, inspect, and debug RFC 7519 JSON Web Tokens in real time
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            A <strong className="text-slate-900 dark:text-white font-semibold">JSON Web Token (JWT)</strong> is an open industry standard (<strong className="text-slate-900 dark:text-white font-semibold">RFC 7519</strong>) for securely transmitting verified information between parties as a compact JSON object. JWTs are overwhelmingly utilized for stateless authentication, session tracking, and single sign-on (SSO) architectures.
          </p>
          <p>
            A typical token consists of three distinct segments separated by periods (<code className="font-mono text-xs">.</code>):
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            <div className="p-4 rounded-xl border border-red-200/70 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/30 space-y-2">
              <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
                1. Header
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Specifies the token type (<code className="font-mono text-xs">typ: &quot;JWT&quot;</code>) and cryptographic signing algorithm (such as <code className="font-mono text-xs">alg: &quot;HS256&quot;</code> or <code className="font-mono text-xs">&quot;RS256&quot;</code>).
              </p>
            </div>
            <div className="p-4 rounded-xl border border-purple-200/70 dark:border-purple-900/60 bg-purple-50/50 dark:bg-purple-950/30 space-y-2">
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                2. Payload (Claims)
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Contains statement claims about the user identity, roles, issuing authority (<code className="font-mono text-xs">iss</code>), and expiration timestamp (<code className="font-mono text-xs">exp</code>).
              </p>
            </div>
            <div className="p-4 rounded-xl border border-blue-200/70 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/30 space-y-2">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                3. Signature
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                A cryptographic hash calculated using the encoded header, encoded payload, and private server secret to prove authenticity and data integrity.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="jwt-security-heading" className="space-y-4">
        <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <h3 id="jwt-security-heading" className="text-base font-semibold text-slate-900 dark:text-white">
            Decoding vs. Cryptographic Verification
          </h3>
          <p>
            Our online JWT Decoder parses and decodes the Base64Url-encoded Header and Payload so developers can instantly examine claim contents, timestamps, and permissions. <strong className="text-slate-900 dark:text-white font-semibold">Note:</strong> Decoding does not cryptographically verify the signature against your secret key.
          </p>
          <p className="text-emerald-700 dark:text-emerald-400 font-medium">
            🔒 Privacy Guarantee: All parsing is executed 100% locally inside your browser memory. Your tokens and claims are never transmitted to any external server.
          </p>
        </div>
      </section>
    </div>
  );
};

// ==========================================
// 10. LOREM IPSUM GENERATOR EDITORIAL
// ==========================================
export const LoremIpsumEditorial: React.FC = () => {
  return (
    <div className="space-y-12 pt-6 border-t border-slate-200 dark:border-slate-800">
      <section aria-labelledby="lorem-guide-heading" className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800/60 flex items-center justify-center text-brand-600 dark:text-brand-400 shrink-0">
            <BookOpen size={18} />
          </div>
          <div>
            <h2
              id="lorem-guide-heading"
              className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight"
            >
              Lorem Ipsum Generator: Generate Dummy &amp; Placeholder Text for Mockups
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Customizable dummy text for designers, web developers, content creators, and typesetters
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            <strong className="text-slate-900 dark:text-white font-semibold">Lorem Ipsum</strong> has served as the printing and typesetting industry&apos;s standard dummy text ever since an unknown printer in the 1500s scrambled a galley of type to assemble a specimen book. It has survived over five centuries of manual printing, transitioning seamlessly into desktop publishing and modern responsive web design.
          </p>
          <p>
            Contrary to popular belief, Lorem Ipsum is not random gibberish. Its roots date back to a classical piece of Latin literature from 45 BC: sections 1.10.32 and 1.10.33 of Marcus Tullius Cicero&apos;s philosophical treatise <em className="italic text-slate-900 dark:text-white">&quot;De Finibus Bonorum et Malorum&quot;</em> (&quot;On the Ends of Good and Evil&quot;), an ethical discourse on the nature of pleasure and pain.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/70 dark:bg-slate-950/40 space-y-2">
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                Why Use Placeholder Copy?
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                When presenting a website prototype, real readable text inevitably distracts clients from evaluating layout balance, typography scale, whitespace rhythm, and interface hierarchy. Lorem Ipsum provides a natural distribution of letters without readable cognitive distraction.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/70 dark:bg-slate-950/40 space-y-2">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                When to Transition to Real Copy
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                While ideal for initial wireframes and design systems, placeholder copy should always be replaced with authentic user copy during content strategy and accessibility auditing to verify real-world container expansion, wrapping, and screen-reader usability.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
