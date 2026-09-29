import React from "react";
import Link from "next/link";
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
  ArrowRight,
  Globe,
  Sparkles,
  Table,
  FileSpreadsheet,
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

// ==========================================
// 11. SLUG GENERATOR EDITORIAL
// ==========================================
export const SlugGeneratorEditorial: React.FC = () => {
  return (
    <div className="space-y-12 pt-6 border-t border-slate-200 dark:border-slate-800">
      {/* 1. What is a URL Slug & What is a Slug Generator */}
      <section aria-labelledby="slug-overview-heading" className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800/60 flex items-center justify-center text-brand-600 dark:text-brand-400 shrink-0">
            <Link2 size={18} />
          </div>
          <div>
            <h2
              id="slug-overview-heading"
              className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight"
            >
              What is a URL Slug &amp; How Does a Slug Generator Work?
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Understanding readable permalinks, character sanitization, and clean URL structure
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            A <strong className="text-slate-900 dark:text-white font-semibold">URL slug</strong> is the human-readable, identifying portion at the end of a web address that specifies a particular page or post. For instance, in the URL <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-xs text-brand-600 dark:text-brand-400">https://example.com/blog/how-to-improve-website-seo</code>, the slug is <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-xs">how-to-improve-website-seo</code>. Slugs provide visitors and search engine crawlers with an immediate, clear preview of the topic before the page even loads.
          </p>
          <p>
            A <strong className="text-slate-900 dark:text-white font-semibold">slug generator</strong> automates the transition from editorial headlines to web-ready permalinks. Human titles naturally contain spaces, capital letters, punctuation marks, and special symbols that are either illegal in URLs or cause messy percent-encoded sequences (such as <code className="font-mono text-xs">%20</code> for spaces). The generator sanitizes, normalizes, and converts arbitrary text into a standardized, kebab-case string instantly.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
            <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/70 dark:bg-slate-950/40 space-y-1.5">
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-brand-500/10 flex items-center justify-center text-[11px]">1</span>
                Input Title
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Paste or type your article title, headline, or product name into the editor.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/70 dark:bg-slate-950/40 space-y-1.5">
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-brand-500/10 flex items-center justify-center text-[11px]">2</span>
                Choose Separator
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Select Hyphen (standard for SEO), Underscore, or Dot as your delimiter.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/70 dark:bg-slate-950/40 space-y-1.5">
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-brand-500/10 flex items-center justify-center text-[11px]">3</span>
                Case Preference
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Keep &apos;Lowercase Output&apos; checked to avoid server casing mismatches.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/70 dark:bg-slate-950/40 space-y-1.5">
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-brand-500/10 flex items-center justify-center text-[11px]">4</span>
                Copy Permalink
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Copy the generated slug with one click and paste it into your CMS.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. What Makes a Good SEO-Friendly Slug & Hyphens vs Underscores */}
      <section aria-labelledby="slug-best-practices-heading" className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <Globe size={18} />
          </div>
          <div>
            <h2
              id="slug-best-practices-heading"
              className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight"
            >
              What Makes a Good SEO-Friendly Slug?
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pragmatic principles for clean, descriptive, and durable URL structures
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            An SEO-friendly slug prioritizes user readability and architectural durability. Search engines evaluate URLs as structural signals that complement page content, though keywords in a URL do not guarantee high rankings. Key best practices include:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/70 dark:bg-slate-950/40 space-y-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <span className="text-emerald-500">✓</span> Recommended Best Practices
              </span>
              <ul className="space-y-1.5 text-xs list-disc list-inside text-slate-600 dark:text-slate-400">
                <li><strong className="text-slate-800 dark:text-slate-200">Concise &amp; Focused:</strong> 3 to 5 key descriptive words that convey the core topic.</li>
                <li><strong className="text-slate-800 dark:text-slate-200">Consistent Lowercase:</strong> Ensures cross-platform compatibility across Linux/Unix servers.</li>
                <li><strong className="text-slate-800 dark:text-slate-200">Hyphen-Separated:</strong> Uses hyphens (<code className="font-mono text-[11px]">-</code>) for clean lexical segmentation.</li>
                <li><strong className="text-slate-800 dark:text-slate-200">Natural Keywords:</strong> Accurately reflects the page topic without forced repetition.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/70 dark:bg-slate-950/40 space-y-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <span className="text-amber-500">⚡</span> Hyphens vs. Underscores
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Search engine indexing systems have historically recognized hyphens as distinct word separators. In contrast, underscores (<code className="font-mono text-[11px]">_</code>) can be treated as word connectors, meaning <code className="font-mono text-[11px]">best_slug_maker</code> may be parsed as a single compound token. Using hyphens ensures clear semantic separation and better visual legibility in browser address bars.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Real Transformation Mechanics & Example Table */}
      <section aria-labelledby="slug-mechanics-heading" className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800/60 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
            <Sparkles size={18} />
          </div>
          <div>
            <h2
              id="slug-mechanics-heading"
              className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight"
            >
              Removing Accents, Symbols &amp; Special Characters
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              How our generator accurately normalizes complex input strings in real time
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            When raw text is entered, the engine executes multi-stage normalization strictly in client-side memory:
          </p>

          <ol className="space-y-2 text-xs list-decimal list-inside text-slate-600 dark:text-slate-400">
            <li><strong className="text-slate-800 dark:text-slate-200">Diacritic Normalization:</strong> Strips accent marks using Unicode decomposition (<code className="font-mono text-[11px]">café</code> becomes <code className="font-mono text-[11px]">cafe</code>, <code className="font-mono text-[11px]">über</code> becomes <code className="font-mono text-[11px]">uber</code>).</li>
            <li><strong className="text-slate-800 dark:text-slate-200">Symbol Word Replacement:</strong> Replaces common informational symbols with readable English equivalents (<code className="font-mono text-[11px]">&amp;</code> → <code className="font-mono text-[11px]">and</code>, <code className="font-mono text-[11px]">@</code> → <code className="font-mono text-[11px]">at</code>, <code className="font-mono text-[11px]">%</code> → <code className="font-mono text-[11px]">percent</code>).</li>
            <li><strong className="text-slate-800 dark:text-slate-200">Punctuation Stripping:</strong> Removes unsafe punctuation characters (<code className="font-mono text-[11px]">! ? # $ * ( ) : ; &apos; &quot;</code>) that cause routing or syntax bugs.</li>
            <li><strong className="text-slate-800 dark:text-slate-200">Whitespace &amp; Delimiter Collapsing:</strong> Replaces spaces, tabs, and consecutive separators with a single clean hyphen, trimming any leading or trailing hyphens.</li>
          </ol>

          {/* Examples Table */}
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white">
                  <th className="py-2.5 px-3">Input Title / Headline</th>
                  <th className="py-2.5 px-3">Generated Slug</th>
                  <th className="py-2.5 px-3">Transformations Applied</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                <tr>
                  <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-300">Best Free JSON Tools 2026</td>
                  <td className="py-2.5 px-3 font-mono text-brand-600 dark:text-brand-400">best-free-json-tools-2026</td>
                  <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">Lowercased, spaces to hyphens</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-300">Hello World!</td>
                  <td className="py-2.5 px-3 font-mono text-brand-600 dark:text-brand-400">hello-world</td>
                  <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">Stripped exclamation, lowercased</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-300">Café &amp; Restaurant Guide @ 50% Off</td>
                  <td className="py-2.5 px-3 font-mono text-brand-600 dark:text-brand-400">cafe-and-restaurant-guide-at-50-percent-off</td>
                  <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">Accent stripped, &amp; @ % to words</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-300">What is Next.js? (Beginner&apos;s Guide)</td>
                  <td className="py-2.5 px-3 font-mono text-brand-600 dark:text-brand-400">what-is-nextjs-beginners-guide</td>
                  <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">Stripped ?, parentheses, apostrophe, dot</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. CMS Compatibility & Common Slug Mistakes */}
      <section aria-labelledby="cms-and-mistakes-heading" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* CMS Compatibility */}
          <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              🌐 CMS &amp; Platform Compatibility
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Clean kebab-case slugs integrate smoothly into any modern content management system or web development framework:
            </p>
            <ul className="space-y-1.5 text-xs list-disc list-inside text-slate-600 dark:text-slate-400">
              <li><strong className="text-slate-800 dark:text-slate-200">WordPress:</strong> Perfect for post and page permalinks under Settings → Permalinks.</li>
              <li><strong className="text-slate-800 dark:text-slate-200">Shopify:</strong> Ideal for collection handles and product URL paths.</li>
              <li><strong className="text-slate-800 dark:text-slate-200">Next.js / Nuxt:</strong> Fits standard dynamic file-system routes like <code className="font-mono text-[11px]">app/blog/[slug]/page.tsx</code>.</li>
              <li><strong className="text-slate-800 dark:text-slate-200">Technical Docs:</strong> Great for markdown anchor links and Hugo/Docusaurus documentation routes.</li>
            </ul>
          </div>

          {/* Common Mistakes to Avoid */}
          <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              ⚠️ Common Slug Mistakes to Avoid
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><strong className="text-rose-600 dark:text-rose-400 font-semibold">Excessively Long Slugs:</strong> Slugs with 15+ words get truncated in search snippets and look cluttered on mobile devices.</li>
              <li><strong className="text-rose-600 dark:text-rose-400 font-semibold">Keyword Stuffing:</strong> Repeating the same term (e.g. <code className="font-mono text-[11px]">best-shoes-cheap-shoes-buy-shoes</code>) triggers spam perceptions and damages click confidence.</li>
              <li><strong className="text-rose-600 dark:text-rose-400 font-semibold">Random Machine IDs:</strong> Non-descriptive paths like <code className="font-mono text-[11px]">/post/847291</code> fail to communicate context to users and crawlers.</li>
              <li><strong className="text-rose-600 dark:text-rose-400 font-semibold">Unnecessary Stop Words:</strong> Leaving words like &quot;in the&quot;, &quot;of a&quot; unnecessarily inflates length when they add no clarity.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. URL Slug vs URL Encoding & Contextual Tools */}
      <section aria-labelledby="slug-vs-encoding-heading" className="space-y-4">
        <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <h3 id="slug-vs-encoding-heading" className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            URL Slug vs. URL Encoding: What&apos;s the Difference?
          </h3>
          <p>
            It is common to confuse <strong className="text-slate-900 dark:text-white font-semibold">slug generation</strong> with <strong className="text-slate-900 dark:text-white font-semibold">URL encoding</strong> (percent-encoding), but they serve distinct engineering functions:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/70 dark:bg-slate-950/40 space-y-1.5">
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                URL Slug Generation
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Permanently rewrites, lowercases, and simplifies text into a clean human-readable path. Unsafe symbols are removed or expanded into words for permanent permalink structures.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/70 dark:bg-slate-950/40 space-y-1.5">
              <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                URL Percent Encoding
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Temporarily preserves arbitrary characters by translating them into hexadecimal escape codes (such as space to <code className="font-mono text-[11px]">%20</code>) so they can pass safely across query parameters. For percent-encoding, use our{" "}
                <Link
                  href="/tools/url-encoder"
                  className="text-brand-600 dark:text-brand-400 font-semibold underline underline-offset-2 hover:text-brand-700 dark:hover:text-brand-300"
                >
                  URL Encoder / Decoder
                </Link>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Contextual Internal Linking Grid */}
      <section aria-labelledby="slug-related-tools-heading" className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <Layers size={18} />
          </div>
          <div>
            <h2
              id="slug-related-tools-heading"
              className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight"
            >
              Related Text &amp; URL Utilities
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Complementary tools to prepare, sanitize, and measure text before publishing
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-2.5">
            <div className="flex items-center justify-between">
              <Link
                href="/tools/url-encoder"
                className="text-sm font-bold text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors inline-flex items-center gap-1.5"
              >
                URL Encoder / Decoder <ArrowRight size={14} />
              </Link>
              <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400">Encoding</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Convert special characters and query strings into percent-encoded formats for safe web transmissions and API parameters.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-2.5">
            <div className="flex items-center justify-between">
              <Link
                href="/tools/case-converter"
                className="text-sm font-bold text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors inline-flex items-center gap-1.5"
              >
                Case Converter <ArrowRight size={14} />
              </Link>
              <span className="text-[11px] font-mono text-brand-600 dark:text-brand-400">Transform</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Convert strings between camelCase, snake_case, PascalCase, Title Case, and uppercase for code identifiers or editorial titles.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-2.5">
            <div className="flex items-center justify-between">
              <Link
                href="/tools/remove-accents"
                className="text-sm font-bold text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors inline-flex items-center gap-1.5"
              >
                Remove Accents <ArrowRight size={14} />
              </Link>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">Sanitize</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Strip diacritics and foreign accent marks from international text while preserving base Latin letters.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-2.5">
            <div className="flex items-center justify-between">
              <Link
                href="/tools/remove-special-chars"
                className="text-sm font-bold text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors inline-flex items-center gap-1.5"
              >
                Remove Special Characters <ArrowRight size={14} />
              </Link>
              <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400">Cleanup</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Clean messy strings by removing symbols, punctuation, or non-alphanumeric noise from copy and dataset entries.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-2.5">
            <div className="flex items-center justify-between">
              <Link
                href="/tools/word-counter"
                className="text-sm font-bold text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors inline-flex items-center gap-1.5"
              >
                Word Counter <ArrowRight size={14} />
              </Link>
              <span className="text-[11px] font-mono text-purple-600 dark:text-purple-400">Metrics</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Measure character lengths and word counts to ensure your article titles and URLs remain within optimal search snippet thresholds.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

// ==========================================
// 12. JSON TO CSV EDITORIAL
// ==========================================
export const JsonToCsvEditorial: React.FC = () => {
  return (
    <div className="space-y-12 pt-6 border-t border-slate-200 dark:border-slate-800">
      {/* 1. What is JSON to CSV Conversion & Real Example */}
      <section aria-labelledby="json-to-csv-overview-heading" className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800/60 flex items-center justify-center text-brand-600 dark:text-brand-400 shrink-0">
            <FileSpreadsheet size={18} />
          </div>
          <div>
            <h2
              id="json-to-csv-overview-heading"
              className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight"
            >
              What is JSON to CSV Conversion &amp; How Does It Work?
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Transforming hierarchical key-value objects into clean, spreadsheet-ready tabular data
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            <strong className="text-slate-900 dark:text-white font-semibold">JSON</strong> (JavaScript Object Notation) and <strong className="text-slate-900 dark:text-white font-semibold">CSV</strong> (Comma-Separated Values) represent two fundamentally different data models. JSON is designed for web applications and APIs, organizing data as nested hierarchies, objects, and typed key-value pairs. Conversely, CSV is designed for tabular analysis, organizing data into flat two-dimensional grids composed of column headers and delimited rows.
          </p>
          <p>
            Our <strong className="text-slate-900 dark:text-white font-semibold">JSON to CSV Converter</strong> parses structured JSON records, extracts unique keys across all items to construct a unified header row, and formats each record into an RFC 4180-compliant row.
          </p>

          {/* Side-by-side Visual Code Example */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/70 dark:bg-slate-950/40 space-y-2">
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                Source JSON Input (Array of Objects)
              </span>
              <pre className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-[11px] font-mono text-slate-800 dark:text-slate-200 overflow-x-auto">
{`[
  {"name": "Alice", "age": 28},
  {"name": "Bob", "age": 31}
]`}
              </pre>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/70 dark:bg-slate-950/40 space-y-2">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Resulting CSV Output (Tabular Grid)
              </span>
              <pre className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-[11px] font-mono text-slate-800 dark:text-slate-200 overflow-x-auto">
{`name,age
Alice,28
Bob,31`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Step-by-Step Converter Workflow */}
      <section aria-labelledby="json-to-csv-workflow-heading" className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800/60 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
            <Table size={18} />
          </div>
          <div>
            <h2
              id="json-to-csv-workflow-heading"
              className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight"
            >
              How to Convert JSON to CSV Step-by-Step
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Straightforward browser-based workflow with instant live updates
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-1.5">
            <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-brand-500/10 flex items-center justify-center text-[11px]">1</span>
              Paste JSON
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Paste your JSON array or single object into the Source Input editor, or click &apos;Load Sample&apos;.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-1.5">
            <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-brand-500/10 flex items-center justify-center text-[11px]">2</span>
              Configure Delimiter
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Select Comma (,), Semicolon (;), Tab (\\t), or Pipe (|) to match your target spreadsheet software.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-1.5">
            <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-brand-500/10 flex items-center justify-center text-[11px]">3</span>
              Live Generation
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              The converter parses syntax and updates the tabular CSV instantly with automatic error feedback.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-1.5">
            <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-brand-500/10 flex items-center justify-center text-[11px]">4</span>
              Copy or Download
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Copy the CSV text directly with one click, or click the download button to save as a local file.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Input Shapes, Missing Keys & Nested Data Mechanics */}
      <section aria-labelledby="json-structure-heading" className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <Layers size={18} />
          </div>
          <div>
            <h2
              id="json-structure-heading"
              className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight"
            >
              JSON Arrays vs. Objects &amp; Nested Data Handling
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Understanding input schemas, missing fields, and object serialization
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/70 dark:bg-slate-950/40 space-y-2">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                1. Arrays vs. Single Objects
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                The standard structure is an array of objects (<code className="font-mono text-[11px]">[&#123;...&#125;, &#123;...&#125;]</code>). If you provide a single JSON object (<code className="font-mono text-[11px]">&#123;&quot;id&quot;: 1&#125;</code>), the tool automatically wraps it into a single-row array. Non-object arrays (like <code className="font-mono text-[11px]">[1, 2, 3]</code>) will prompt a structure validation error.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/70 dark:bg-slate-950/40 space-y-2">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                2. Missing Keys &amp; Sparse Records
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                In real-world API data, records often have optional fields. The converter builds a union of all unique keys across every object in the array. When an individual record lacks a specific key, it outputs an empty cell (<code className="font-mono text-[11px]">&quot;&quot;</code>), preserving row alignment.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/70 dark:bg-slate-950/40 space-y-2">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                3. Nested Objects &amp; Arrays
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Because CSV is strictly two-dimensional, nested objects (e.g. <code className="font-mono text-[11px]">&#123;&quot;geo&quot;: &#123;&quot;lat&quot;: 47.6&#125;&#125;</code>) and arrays are serialized as JSON strings within their cell. This avoids uncontrolled column explosions while preserving complete data fidelity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CSV Escaping Rules (RFC 4180) */}
      <section aria-labelledby="csv-escaping-heading" className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <Code2 size={18} />
          </div>
          <div>
            <h2
              id="csv-escaping-heading"
              className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight"
            >
              CSV Escaping Standards (RFC 4180 Compliance)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              How commas, double quotes, and line breaks are safely preserved in tabular exports
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            Naive string concatenation often breaks CSV spreadsheets when data contains punctuation. Our converter enforces RFC 4180 standards for bulletproof parsing:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/70 dark:bg-slate-950/40 space-y-1.5">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <span className="text-brand-600">●</span> Delimiters &amp; Commas
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Any value containing the chosen delimiter (e.g. <code className="font-mono text-[11px]">&quot;Seattle, WA&quot;</code>) is enclosed in quotes: <code className="font-mono text-[11px]">&quot;&quot;Seattle, WA&quot;&quot;</code>.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/70 dark:bg-slate-950/40 space-y-1.5">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <span className="text-emerald-600">●</span> Quotation Marks
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Internal double quotes (e.g. <code className="font-mono text-[11px]">Leader &quot;Pro&quot;</code>) are escaped by doubling them (<code className="font-mono text-[11px]">&quot;&quot;</code>) and wrapping the field in quotes: <code className="font-mono text-[11px]">&quot;&quot;Leader &quot;&quot;Pro&quot;&quot;&quot;&quot;</code>.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/70 dark:bg-slate-950/40 space-y-1.5">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <span className="text-purple-600">●</span> Multi-line Strings
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Values with newline characters (<code className="font-mono text-[11px]">\\n</code> or <code className="font-mono text-[11px]">\\r</code>) are wrapped in quotes, allowing multi-line cell entries in Excel and Google Sheets.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/70 dark:bg-slate-950/40 space-y-1.5">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <span className="text-cyan-600">●</span> Null &amp; Undefined Values
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Missing or <code className="font-mono text-[11px]">null</code> values render as empty strings (<code className="font-mono text-[11px]">&quot;&quot;</code>), ensuring delimiter column alignment remains strictly preserved.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Spreadsheets Workflows: Excel, Google Sheets & API Pipelines */}
      <section aria-labelledby="spreadsheets-workflow-heading" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              📊 Microsoft Excel &amp; Google Sheets
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Exported CSV files can be opened directly or imported into major spreadsheet software:
            </p>
            <ul className="space-y-1.5 text-xs list-disc list-inside text-slate-600 dark:text-slate-400">
              <li><strong className="text-slate-800 dark:text-slate-200">Microsoft Excel:</strong> Use File → Open, or import via Data → From Text/CSV. For European Excel locales, select the Semicolon (<code className="font-mono text-[11px]">&apos;;&apos;</code>) delimiter option.</li>
              <li><strong className="text-slate-800 dark:text-slate-200">Google Sheets:</strong> Navigate to File → Import → Upload to load the generated CSV into any existing or new sheet.</li>
              <li><strong className="text-slate-800 dark:text-slate-200">Database Tools:</strong> Cleanly imports into PostgreSQL, MySQL, and SQLite via native COPY or CSV import wizards.</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              🚀 API Responses to Analysis Workflows
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Modern REST and GraphQL APIs return JSON responses that business stakeholders often cannot inspect directly. Converting API payloads to CSV empowers developers to:
            </p>
            <ul className="space-y-1.5 text-xs list-disc list-inside text-slate-600 dark:text-slate-400">
              <li>Share user, order, or telemetry logs with product and finance teams.</li>
              <li>Build quick pivot tables, charts, and summary reports in spreadsheets.</li>
              <li>Inspect and clean backend data before conducting bulk SQL migrations.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6. Formatting First & Bi-Directional Conversion */}
      <section aria-labelledby="formatting-and-roundtrip-heading" className="space-y-4">
        <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <h3 id="formatting-and-roundtrip-heading" className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            JSON Formatting &amp; Bi-Directional Conversion
          </h3>
          <p>
            If your input JSON is minified into a single unreadable line or triggers a syntax error, we recommend pasting it into our{" "}
            <Link
              href="/tools/json-formatter"
              className="text-brand-600 dark:text-brand-400 font-semibold underline underline-offset-2 hover:text-brand-700 dark:hover:text-brand-300"
            >
              JSON Formatter &amp; Validator
            </Link>{" "}
            first. Beautifying the payload makes it easy to confirm brackets, locate syntax errors, and inspect record schemas.
          </p>
          <p>
            Conversely, if you have an existing spreadsheet or CSV file and need to convert it into structured JSON objects or an array of arrays for web development, use our dedicated{" "}
            <Link
              href="/tools/csv-to-json"
              className="text-brand-600 dark:text-brand-400 font-semibold underline underline-offset-2 hover:text-brand-700 dark:hover:text-brand-300"
            >
              CSV to JSON Converter
            </Link>.
          </p>
          <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/80 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <ShieldCheck size={16} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>
              <strong>100% Client-Side Privacy:</strong> All parsing and CSV formatting run strictly within your local browser memory. No text or files are ever sent to our servers.
            </span>
          </div>
        </div>
      </section>

      {/* 7. Contextual Internal Linking */}
      <section aria-labelledby="json-tools-cluster-heading" className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <Layers size={18} />
          </div>
          <div>
            <h2
              id="json-tools-cluster-heading"
              className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight"
            >
              Complementary Developer &amp; Data Utilities
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Essential tools for parsing, formatting, and inspecting structured data
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-2.5">
            <div className="flex items-center justify-between">
              <Link
                href="/tools/csv-to-json"
                className="text-sm font-bold text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors inline-flex items-center gap-1.5"
              >
                CSV to JSON <ArrowRight size={14} />
              </Link>
              <span className="text-[11px] font-mono text-brand-600 dark:text-brand-400">Reverse</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Convert CSV and TSV spreadsheets back into structured JSON objects with automated number and boolean parsing.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-2.5">
            <div className="flex items-center justify-between">
              <Link
                href="/tools/json-formatter"
                className="text-sm font-bold text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors inline-flex items-center gap-1.5"
              >
                JSON Formatter <ArrowRight size={14} />
              </Link>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">Format</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Beautify, validate, and minify raw JSON payloads with customizable indentation and syntax error highlighting.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-2.5">
            <div className="flex items-center justify-between">
              <Link
                href="/tools/query-string-parser"
                className="text-sm font-bold text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors inline-flex items-center gap-1.5"
              >
                Query String Parser <ArrowRight size={14} />
              </Link>
              <span className="text-[11px] font-mono text-purple-600 dark:text-purple-400">Inspector</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Parse URL query parameters into formatted JSON key-value objects or reconstruct query strings from data.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-2.5">
            <div className="flex items-center justify-between">
              <Link
                href="/tools/base64"
                className="text-sm font-bold text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors inline-flex items-center gap-1.5"
              >
                Base64 Encoder <ArrowRight size={14} />
              </Link>
              <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400">Encoding</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Encode structured JSON strings to Base64 or decode Base64 strings to inspect embedded API tokens and payloads.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

// ==========================================
// 13. CSV TO JSON EDITORIAL
// ==========================================
export const CsvToJsonEditorial: React.FC = () => {
  return (
    <div className="space-y-12 pt-6 border-t border-slate-200 dark:border-slate-800">
      {/* 1. What is CSV to JSON Conversion & Real Example */}
      <section aria-labelledby="csv-to-json-overview-heading" className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800/60 flex items-center justify-center text-brand-600 dark:text-brand-400 shrink-0">
            <FileSpreadsheet size={18} />
          </div>
          <div>
            <h2
              id="csv-to-json-overview-heading"
              className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight"
            >
              What is CSV to JSON Conversion &amp; How Does It Work?
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Transform flat tabular spreadsheets and delimited text into structured, typed JSON arrays and objects
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            <strong className="text-slate-900 dark:text-white font-semibold">CSV</strong> (Comma-Separated Values) and <strong className="text-slate-900 dark:text-white font-semibold">JSON</strong> (JavaScript Object Notation) represent two universal standards for exchanging data. While CSV is designed for tabular grids in software like Microsoft Excel and Google Sheets, modern web applications, REST APIs, and NoSQL databases require structured JSON objects with typed keys and values.
          </p>
          <p>
            Our <strong className="text-slate-900 dark:text-white font-semibold">CSV to JSON Converter</strong> parses delimited text line-by-line using an RFC 4180-compliant state machine. It maps each column to its corresponding header property and automatically detects numbers, booleans, and nulls to output clean, standards-compliant JSON.
          </p>

          {/* Side-by-side Visual Code Example */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/70 dark:bg-slate-950/40 space-y-2">
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                Source CSV Input (Delimited Grid)
              </span>
              <pre className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-[11px] font-mono text-slate-800 dark:text-slate-200 overflow-x-auto">
{`name,age
Alice,28
Bob,31`}
              </pre>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/70 dark:bg-slate-950/40 space-y-2">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Resulting JSON Output (Typed Object Array)
              </span>
              <pre className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-[11px] font-mono text-slate-800 dark:text-slate-200 overflow-x-auto">
{`[
  {
    "name": "Alice",
    "age": 28
  },
  {
    "name": "Bob",
    "age": 31
  }
]`}
              </pre>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
            * Note: With the default &quot;Parse Numbers &amp; Booleans&quot; setting enabled, numeric strings like <code className="font-mono text-[11px]">&quot;28&quot;</code> and <code className="font-mono text-[11px]">&quot;31&quot;</code> are automatically coerced into JavaScript numbers. Disabling this option preserves them as literal strings.
          </p>
        </div>
      </section>

      {/* 2. Step-by-Step Converter Workflow */}
      <section aria-labelledby="csv-to-json-workflow-heading" className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800/60 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
            <Table size={18} />
          </div>
          <div>
            <h2
              id="csv-to-json-workflow-heading"
              className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight"
            >
              How to Convert CSV to JSON Step-by-Step
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Instant browser-based transformation with customizable parsing controls
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-1.5">
            <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-brand-500/10 flex items-center justify-center text-[11px]">1</span>
              Paste CSV or TSV
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Paste your raw delimited text into the editor, or click &apos;Load Sample&apos; to test with example data.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-1.5">
            <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-brand-500/10 flex items-center justify-center text-[11px]">2</span>
              Select Delimiter
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Choose Comma (,), Semicolon (;), Tab (\\t), or Pipe (|) to match your input text or spreadsheet format.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-1.5">
            <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-brand-500/10 flex items-center justify-center text-[11px]">3</span>
              Configure Headers &amp; Types
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Toggle &apos;First Row as Headers&apos; and &apos;Parse Numbers &amp; Booleans&apos; according to your desired JSON structure.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-1.5">
            <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-brand-500/10 flex items-center justify-center text-[11px]">4</span>
              Copy or Download
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Copy the formatted JSON directly to your clipboard or download it as a local <code className="font-mono text-[11px]">.json</code> file.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Headers, Custom Delimiters & Type Coercion */}
      <section aria-labelledby="csv-headers-types-heading" className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <Layers size={18} />
          </div>
          <div>
            <h2
              id="csv-headers-types-heading"
              className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight"
            >
              Header Configuration, Custom Delimiters &amp; Type Coercion
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Precision control over object keys, delimiter dialects, and numeric type handling
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/70 dark:bg-slate-950/40 space-y-2">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                1. Header Rows &amp; Key Naming
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                When <strong>First Row as Headers</strong> is enabled, the first line defines object property keys. If a header column is empty, the parser automatically assigns fallback identifiers (<code className="font-mono text-[11px]">col_1</code>, <code className="font-mono text-[11px]">col_2</code>). If header names are duplicated, subsequent columns overwrite earlier keys. Disabling this option generates a 2D array of rows (<code className="font-mono text-[11px]">[[&quot;Alice&quot;, 28], ...]</code>).
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/70 dark:bg-slate-950/40 space-y-2">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                2. Delimiter Flexibility
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Supports Comma (<code className="font-mono text-[11px]">,</code>), Semicolon (<code className="font-mono text-[11px]">;</code>), Tab (<code className="font-mono text-[11px]">\t</code>), and Pipe (<code className="font-mono text-[11px]">|</code>). Semicolons are essential for European Excel spreadsheets where commas serve as decimal separators. Tab delimiters let you paste copied cells directly from Google Sheets or Excel without exporting first.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/70 dark:bg-slate-950/40 space-y-2">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                3. Type Coercion &amp; Leading Zeros
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                When enabled, strings like <code className="font-mono text-[11px]">&quot;true&quot;</code>, <code className="font-mono text-[11px]">&quot;false&quot;</code>, and <code className="font-mono text-[11px]">&quot;null&quot;</code> convert to native types, and numeric strings convert to numbers. Crucially, values with leading zeros (e.g., postal codes <code className="font-mono text-[11px]">&quot;01234&quot;</code> or identifiers <code className="font-mono text-[11px]">&quot;007&quot;</code>) remain strings to prevent loss of leading zeros.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. RFC 4180 Escaping & Quoting Mechanics */}
      <section aria-labelledby="csv-rfc-escaping-heading" className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <Code2 size={18} />
          </div>
          <div>
            <h2
              id="csv-rfc-escaping-heading"
              className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight"
            >
              RFC 4180 Escaping Standards &amp; Edge Cases
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Robust state-machine parsing for complex spreadsheet exports with commas, quotes, and newlines
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            Real-world CSV files frequently contain punctuation, line breaks, or special characters inside cell contents. Our parser strictly implements the RFC 4180 standard to guarantee zero data loss:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/70 dark:bg-slate-950/40 space-y-1.5">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <span className="text-brand-600">●</span> Embedded Delimiters
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Cells containing commas or selected delimiters (such as <code className="font-mono text-[11px]">&quot;San Francisco, CA&quot;</code>) are wrapped in double quotes. The parser recognizes quote boundaries and does not split them into separate fields.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/70 dark:bg-slate-950/40 space-y-1.5">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <span className="text-emerald-600">●</span> Escaped Quotation Marks
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Literal quotation marks inside cells are represented per RFC 4180 by two consecutive double quotes: <code className="font-mono text-[11px]">&quot;15&quot;&quot; Laptop&quot;</code> correctly converts into JSON property <code className="font-mono text-[11px]">&quot;15\&quot; Laptop&quot;</code>.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/70 dark:bg-slate-950/40 space-y-1.5">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <span className="text-purple-600">●</span> Multi-line Cell Strings
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                When a spreadsheet cell contains internal newlines (<code className="font-mono text-[11px]">\n</code> or <code className="font-mono text-[11px]">\r\n</code>) enclosed in quotes, the parser preserves the entire string as a single record rather than breaking rows prematurely.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/70 dark:bg-slate-950/40 space-y-1.5">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <span className="text-cyan-600">●</span> Blank Cells &amp; Empty Values
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Empty cells between delimiters are parsed as empty strings (<code className="font-mono text-[11px]">&quot;&quot;</code>), ensuring consistent object key alignment across all rows in the resulting JSON array.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Spreadsheets to API & Developer Workflows */}
      <section aria-labelledby="spreadsheets-to-api-heading" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              📊 Spreadsheets to Developer Pipelines
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Exporting or copying tabular data from desktop and web spreadsheets is the fastest way to bridge non-technical teams and engineering workflows:
            </p>
            <ul className="space-y-1.5 text-xs list-disc list-inside text-slate-600 dark:text-slate-400">
              <li><strong className="text-slate-800 dark:text-slate-200">Microsoft Excel:</strong> Save as CSV or select and copy rows directly using Tab delimiter mode.</li>
              <li><strong className="text-slate-800 dark:text-slate-200">Google Sheets:</strong> Download as CSV (<code className="font-mono text-[11px]">.csv</code>) or copy cell ranges directly to clipboard.</li>
              <li><strong className="text-slate-800 dark:text-slate-200">Regional Locales:</strong> Semicolon delimiter support handles files generated on European and South American operating systems.</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              🚀 API Payloads &amp; Database Seeding
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Transforming flat CSV lists into structured JSON arrays accelerates software engineering tasks:
            </p>
            <ul className="space-y-1.5 text-xs list-disc list-inside text-slate-600 dark:text-slate-400">
              <li>Generate mock JSON payloads for REST and GraphQL endpoints during frontend prototyping.</li>
              <li>Quickly build JSON test fixtures and seeding scripts for unit tests in Jest, Vitest, or Mocha.</li>
              <li>Import tabular data into modern document databases like MongoDB or PostgreSQL <code className="font-mono text-[11px]">JSONB</code> columns.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6. Formatting First & Bi-Directional Conversion */}
      <section aria-labelledby="csv-formatting-and-roundtrip-heading" className="space-y-4">
        <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <h3 id="csv-formatting-and-roundtrip-heading" className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            JSON Formatting &amp; Bi-Directional Conversion
          </h3>
          <p>
            Once your CSV data has been converted into JSON, you can inspect, beautify, and validate its syntax using our{" "}
            <Link
              href="/tools/json-formatter"
              className="text-brand-600 dark:text-brand-400 font-semibold underline underline-offset-2 hover:text-brand-700 dark:hover:text-brand-300"
            >
              JSON Formatter &amp; Validator
            </Link>. It provides customizable indentation (2 spaces, 4 spaces, or minified tabs) and real-time syntax checking.
          </p>
          <p>
            If you need to perform the reverse conversion and turn JSON arrays back into spreadsheet-compatible CSV grids with customized delimiters, use our dedicated{" "}
            <Link
              href="/tools/json-to-csv"
              className="text-brand-600 dark:text-brand-400 font-semibold underline underline-offset-2 hover:text-brand-700 dark:hover:text-brand-300"
            >
              JSON to CSV Converter
            </Link>.
          </p>
          <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/80 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <ShieldCheck size={16} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>
              <strong>100% Client-Side Privacy:</strong> All CSV parsing and JSON serialization run strictly within your local browser memory. No data is ever transmitted to remote servers.
            </span>
          </div>
        </div>
      </section>

      {/* 7. Contextual Internal Linking */}
      <section aria-labelledby="csv-tools-cluster-heading" className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <Layers size={18} />
          </div>
          <div>
            <h2
              id="csv-tools-cluster-heading"
              className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight"
            >
              Complementary Developer &amp; Data Utilities
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Essential utilities for transforming, formatting, and inspecting structured data
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-2.5">
            <div className="flex items-center justify-between">
              <Link
                href="/tools/json-to-csv"
                className="text-sm font-bold text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors inline-flex items-center gap-1.5"
              >
                JSON to CSV <ArrowRight size={14} />
              </Link>
              <span className="text-[11px] font-mono text-brand-600 dark:text-brand-400">Reverse</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Convert JSON arrays back into tabular CSV spreadsheets with customizable delimiters and automatic key union headers.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-2.5">
            <div className="flex items-center justify-between">
              <Link
                href="/tools/json-formatter"
                className="text-sm font-bold text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors inline-flex items-center gap-1.5"
              >
                JSON Formatter <ArrowRight size={14} />
              </Link>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">Format</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Beautify, validate, and minify raw JSON payloads with customizable indentation and syntax error highlighting.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-2.5">
            <div className="flex items-center justify-between">
              <Link
                href="/tools/query-string-parser"
                className="text-sm font-bold text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors inline-flex items-center gap-1.5"
              >
                Query String Parser <ArrowRight size={14} />
              </Link>
              <span className="text-[11px] font-mono text-purple-600 dark:text-purple-400">Inspector</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Parse URL query parameters into formatted JSON key-value objects or reconstruct query strings from data.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-2.5">
            <div className="flex items-center justify-between">
              <Link
                href="/tools/base64"
                className="text-sm font-bold text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors inline-flex items-center gap-1.5"
              >
                Base64 Encoder <ArrowRight size={14} />
              </Link>
              <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400">Encoding</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Encode structured JSON strings to Base64 or decode Base64 strings to inspect embedded API tokens and payloads.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

