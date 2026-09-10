import React from "react";
import Link from "next/link";
import { ToolDefinition, getToolsByCategory, getFeaturedTools, getToolBySlug } from "@/data/toolsRegistry";
import { getToolEducationalContent } from "@/data/toolFaqs";
import { getToolSeoBlueprint } from "@/data/seoBlueprint";
import { DynamicIcon } from "@/components/DynamicIcon";
import { AdUnit } from "@/components/AdUnit";
import {
  WordCounterEditorial,
  JsonFormatterEditorial,
  PasswordGeneratorEditorial,
  UuidGeneratorEditorial,
  RegexTesterEditorial,
  CaseConverterEditorial,
  Base64Editorial,
  UrlEncoderEditorial,
  JwtDecoderEditorial,
  LoremIpsumEditorial,
} from "@/components/seo/ToolEditorialSections";
import {
  Check,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  Binary,
  Smartphone,
  Layers,
  Accessibility,
} from "lucide-react";

export interface ToolSeoContentProps {
  tool: ToolDefinition;
}

// Helper to render markdown-style links [text](url) inside FAQ answers
function renderAnswerWithLinks(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const [_, label, url] = match;
    parts.push(
      <Link
        key={match.index}
        href={url}
        className="text-brand-600 dark:text-brand-400 font-semibold underline underline-offset-2 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
      >
        {label}
      </Link>
    );
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

// Deep editorial content specifically for /tools/fancy-fonts (1,400+ words)
const FancyFontsEditorial: React.FC = () => {
  return (
    <div className="space-y-12 pt-6 border-t border-slate-200 dark:border-slate-800">
      {/* Section A: Unicode Mechanics */}
      <section aria-labelledby="unicode-mechanics-heading" className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800/60 flex items-center justify-center text-brand-600 dark:text-brand-400 shrink-0">
            <Binary size={18} />
          </div>
          <div>
            <h2
              id="unicode-mechanics-heading"
              className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight"
            >
              How Unicode Font Generation Works: The Science Behind Copy &amp; Paste
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Why these aesthetic styles work anywhere without installing true type font files
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            When you type in Microsoft Word or Adobe Photoshop, changing the typography involves selecting a
            font file—such as a TrueType (<code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-xs">.ttf</code>)
            or OpenType (<code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-xs">.otf</code>) asset.
            However, social networks like Instagram, TikTok, Twitter/X, and Discord restrict input fields to pure plain text strings,
            stripping away external CSS font styling.
          </p>
          <p>
            Our <strong className="text-slate-900 dark:text-white font-semibold">Fancy Font Generator</strong> bypasses
            this limitation by utilizing the international <strong className="text-slate-900 dark:text-white font-semibold">Unicode Standard</strong>.
            Instead of transforming standard ASCII characters via font files, the generator replaces standard alphanumeric characters with
            visually distinct glyphs from specialized Unicode planes:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/70 dark:bg-slate-950/40 space-y-2">
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                SMP Symbols
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Mathematical Alphanumeric Symbols (<code className="font-mono text-[11px]">U+1D400–U+1D7FF</code>) provide
                native Gothic (Fraktur), Bold Script, Double-Struck, and Monospace glyphs.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/70 dark:bg-slate-950/40 space-y-2">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Enclosed Characters
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Enclosed Alphanumerics (<code className="font-mono text-[11px]">U+2460–U+24FF</code>) supply circled, boxed,
                and parenthesized characters designed originally for official documentation.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/70 dark:bg-slate-950/40 space-y-2">
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                Combining Marks
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Combining Diacritical Marks (<code className="font-mono text-[11px]">U+0300–U+036F</code>) dynamically overlay
                strikethroughs, underlines, and glitch marks onto adjacent characters.
              </p>
            </div>
          </div>

          <p className="pt-1">
            Because modern operating systems (iOS, Android, Windows, macOS, and Linux) include comprehensive fallback font libraries
            that map these character points natively, your styled text renders seamlessly when copied and pasted into bios, comments,
            and messages anywhere in the world.
          </p>
        </div>
      </section>

      {/* Section B: Platform Optimization Guide */}
      <section aria-labelledby="platform-guide-heading" className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800/60 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
            <Smartphone size={18} />
          </div>
          <div>
            <h2
              id="platform-guide-heading"
              className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight"
            >
              Platform-by-Platform Bio &amp; Formatting Guide
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Optimal aesthetic font techniques for Instagram, TikTok, Discord, gaming, and messaging
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Instagram */}
          <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                📸 Instagram
              </h3>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950/50 text-pink-700 dark:text-pink-300 font-medium">
                150 Char Bio
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Use cursive script or small caps for your Display Name and opening tagline. Because Instagram bio fields count grapheme clusters,
              keep Kaomoji wings and decorative accents to 1–2 key lines to prevent truncation.
            </p>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 text-xs font-mono text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800/60">
              ✨ 𝒞𝓇𝑒𝒶𝓉𝒾𝓋𝑒 𝒟𝒾𝓇𝑒𝒸𝓉𝑜𝓇 &bull; ɴᴇᴡ ʏᴏʀᴋ
            </div>
          </div>

          {/* TikTok */}
          <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                🎵 TikTok
              </h3>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                80 Char Bio
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              With an 80-character ceiling, high-contrast bold sans or double-struck fonts deliver immediate hook appeal in video descriptions
              and username headers without wasting valuable space.
            </p>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 text-xs font-mono text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800/60">
              ⚡ 𝕯𝖆𝖎𝖑𝖞 𝕲𝖆𝖒𝖎𝖓𝖌 𝕮𝖑𝖎𝖕𝖘 &bull; 𝕊𝕦𝕓𝕤𝕔𝕣𝕚𝕓𝕖
            </div>
          </div>

          {/* Discord */}
          <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                💬 Discord
              </h3>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-medium">
                Channels &amp; Roles
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Discord channels and community roles stand out when framed with Japanese brackets, corner connectors, and circled letters.
              Ensure channel names remain readable across mobile Discord apps.
            </p>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 text-xs font-mono text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800/60">
              │・「📢」・𝒶𝓃𝓃𝑜𝓊𝓃𝒸𝑒𝓂𝑒𝓃𝓉𝓈
            </div>
          </div>

          {/* Gaming Handles */}
          <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                🎮 Gaming Nicknames
              </h3>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-medium">
                Free Fire &bull; Roblox
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Gaming communities in Free Fire, PUBG Mobile, Steam, and Roblox love Kaomoji wings, cross symbols, and Fraktur lettering
              for guild tags and competitive player handles.
            </p>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 text-xs font-mono text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800/60">
              ꧁༺𝕾𝖍𝖆𝖉𝖔𝖜_𝕾𝖓𝖎𝖕𝖊𝖗༻꧂
            </div>
          </div>

          {/* WhatsApp & Telegram */}
          <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                📱 WhatsApp &amp; Telegram
              </h3>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-300 font-medium">
                Statuses &amp; Groups
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              WhatsApp natively supports basic formatting (such as <code className="font-mono text-[11px]">*bold*</code>), but Unicode
              fancy fonts allow full cursive, bubble lettering, and upside-down text in status updates and group subjects.
            </p>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 text-xs font-mono text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800/60">
              ✨ 𝒲𝑜𝓇𝓀𝒾𝓃𝑔 𝑜𝓃 𝓈𝑜𝓂𝑒𝓉𝒽𝒾𝓃𝑔 𝒷𝒾𝑔...
            </div>
          </div>

          {/* Twitter / X */}
          <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                🐦 Twitter / X
              </h3>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 font-medium">
                Hooks &amp; Display
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Increase engagement on viral thread openers with bold sans or small caps. Use decorative fonts for header callouts
              and keep body copy in readable plain text for optimal retweet readability.
            </p>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 text-xs font-mono text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800/60">
              🧵 𝗧𝗛𝗥𝗘𝗔𝗗: 𝟱 𝗦𝗘𝗢 𝗛𝗮𝗰𝗸𝘀 𝗙𝗼𝗿 𝟮𝟬𝟮𝟲
            </div>
          </div>
        </div>
      </section>

      {/* Section C: Aesthetic Font Taxonomy */}
      <section aria-labelledby="taxonomy-heading" className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <Layers size={18} />
          </div>
          <div>
            <h2
              id="taxonomy-heading"
              className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight"
            >
              Aesthetic Font Styles Taxonomy: 57+ Variations Explained
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Understanding the design history and best applications of each aesthetic font family
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                𝕲𝖔𝖙𝖍𝖎𝖈 &amp; 𝔉𝔯𝔞𝔨𝔱𝔲𝔯 (Blackletter)
              </h3>
              <span className="text-[11px] font-mono text-brand-600 dark:text-brand-400 font-semibold">
                Medieval &bull; Dark Aesthetic
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Rooted in 12th-century European calligraphy, Fraktur and Gothic blackletter feature dramatic broken strokes and ornate angles.
              Today, it is the premier choice for dark academia aesthetics, streetwear logos, metal band branding, and dramatic social handles.
            </p>
            <div className="text-xs font-mono text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-950/60 p-2 rounded-lg">
              Sample: 𝔗𝔥𝔢 𝔔𝔲𝔦𝔠𝔨 𝔅𝔯𝔬𝔴𝔫 𝔉𝔬𝔵 𝕵𝖞𝖒𝖕𝖘 𝕺𝖛𝖊𝖗
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                𝒞𝓊𝓇𝓈𝒾𝓋𝑒 &amp; 𝓒𝓪𝓵𝓵𝓲𝓰𝓻𝓪𝓹𝓱𝔂 (Script)
              </h3>
              <span className="text-[11px] font-mono text-pink-600 dark:text-pink-400 font-semibold">
                Elegant &bull; Handwritten
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Derived from classic cursive penmanship and fountain-pen calligraphy, script characters connect gracefully with delicate flourishes.
              Perfect for lifestyle blogs, beauty influencers, wedding announcements, and aesthetic Instagram bio intros.
            </p>
            <div className="text-xs font-mono text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-950/60 p-2 rounded-lg">
              Sample: 𝒮𝓌𝑒𝑒𝓉 𝒟𝓇𝑒𝒶𝓂𝓈 &bull; 𝓔𝓵𝓮𝓰𝓪𝓷𝓽 𝓛𝓲𝓯𝓮𝓼𝓽𝔂𝓵𝓮
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                𝔻𝕠𝕦𝕓𝕝𝕖-𝕊𝕥𝕣𝕦𝕔𝕜 (Blackboard Bold)
              </h3>
              <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 font-semibold">
                Academic &bull; Cyber
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Originally created by mathematicians lecturing on chalkboards to denote number sets (such as ℝ for real numbers and ℂ for complex numbers),
              double-struck lettering has been adopted across internet culture for its clean, tech-forward, high-contrast look.
            </p>
            <div className="text-xs font-mono text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-950/60 p-2 rounded-lg">
              Sample: 𝔽𝕦𝕥𝕦𝕣𝕖 𝕋𝕖𝕔𝕙𝕟𝕠𝕝𝕠𝕘𝕪 𝟚𝟘𝟚𝟞
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Ⓒⓘⓡⓒⓛⓔⓓ &amp; 🅂🅀🅄🄰🅁🄴 (Bubbles)
              </h3>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                Badges &bull; Playful
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Enclosing letters inside solid dark circles, open outlines, or squares produces a punchy badge effect.
              Ideal for numbered lists, bullet points, button simulation in bios, and retro 90s aesthetic layouts.
            </p>
            <div className="text-xs font-mono text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-950/60 p-2 rounded-lg">
              Sample: ① Ⓕⓞⓒⓤⓢ &bull; 🅂🅃🄰🅁🅃 &bull; 🅵🅸🅽🅸🆂🅷
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Z̷a̷l̷g̷o̷ &amp; G̷l̷i̷t̷c̷h̷ Text
              </h3>
              <span className="text-[11px] font-mono text-red-600 dark:text-red-400 font-semibold">
                Cyberpunk &bull; Corrupted
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Zalgo and glitch typography are generated by stacking combining diacritical marks vertically above, across, and beneath glyphs.
              This simulates corrupted data, analog signal distortion, or horror aesthetics popular in gaming and ARG fiction.
            </p>
            <div className="text-xs font-mono text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-950/60 p-2 rounded-lg">
              Sample: S̷Y̷S̷T̷E̷M̷ O̷V̷E̷R̷L̷O̷A̷D̷
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                ꧁༺ Kaomoji Wings &amp; Framing ༻꧂
              </h3>
              <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                Symmetry &bull; Ornaments
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Japanese Kaomoji characters, Tibetan symbols, floral fleurons, and geometric wings encase words in balanced symmetrical banners.
              They are the most widely copied format for competitive mobile gaming handles and Discord VIP role names.
            </p>
            <div className="text-xs font-mono text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-950/60 p-2 rounded-lg">
              Sample: ꧁༺ 𝕍𝕀ℙ 𝕄𝕖𝕞𝕓𝕖𝕣 ༻꧂ &bull; ⋆｡°✩
            </div>
          </div>
        </div>
      </section>

      {/* Section D: Accessibility & Screen Readers */}
      <section aria-labelledby="a11y-guide-heading" className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800/60 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
            <Accessibility size={18} />
          </div>
          <div>
            <h2
              id="a11y-guide-heading"
              className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight"
            >
              Accessibility (a11y) &amp; Screen Reader Best Practices
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              How assistive technologies interpret Unicode fonts and how to use them responsibly
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            As a platform dedicated to high-standard web engineering, we believe in transparent accessibility guidance.
            While Unicode fancy fonts look stunning visually, they impact users relying on assistive technology
            such as <strong className="text-slate-900 dark:text-white font-semibold">Apple VoiceOver</strong>,{" "}
            <strong className="text-slate-900 dark:text-white font-semibold">NVDA</strong>,{" "}
            <strong className="text-slate-900 dark:text-white font-semibold">JAWS</strong>, and{" "}
            <strong className="text-slate-900 dark:text-white font-semibold">Android TalkBack</strong>.
          </p>

          <div className="p-4 rounded-xl border border-amber-200/80 dark:border-amber-800/80 bg-amber-50/60 dark:bg-amber-950/30 text-xs text-amber-900 dark:text-amber-200 space-y-2">
            <div className="font-bold flex items-center gap-2">
              <span>⚠️</span> How Screen Readers Pronounce Mathematical Symbols
            </div>
            <p>
              When a screen reader encounters a word like <code className="font-mono">𝕳𝖊𝖑𝖑𝖔</code>, it does not read the word &quot;Hello&quot;.
              Instead, it reads aloud:{" "}
              <em className="font-semibold">
                &quot;Mathematical Bold Fraktur Capital H, Mathematical Bold Fraktur Small e, Mathematical Bold Fraktur Small l, Mathematical Bold Fraktur Small l, Mathematical Bold Fraktur Small o.&quot;
              </em>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <span className="text-emerald-500">✓</span> Recommended Best Practices
              </h3>
              <ul className="space-y-1.5 text-xs list-disc list-inside text-slate-600 dark:text-slate-400">
                <li>Use fancy fonts for short display names, handles, and profile accents.</li>
                <li>Decorate short headers (1–3 words) rather than entire paragraphs.</li>
                <li>Frame usernames with kaomoji wings while leaving core keywords in plain text.</li>
                <li>Pair social posts with plain-text captions in the comments or story text.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <span className="text-rose-500">✕</span> What to Avoid
              </h3>
              <ul className="space-y-1.5 text-xs list-disc list-inside text-slate-600 dark:text-slate-400">
                <li>Avoid converting essential contact info, emails, or phone numbers.</li>
                <li>Do not write legal disclaimers or product terms in decorative fonts.</li>
                <li>Avoid using Unicode fonts in web page HTML headings meant for SEO crawling.</li>
                <li>Never replace body articles or instructional text with mathematical symbols.</li>
              </ul>
            </div>
          </div>

          <p className="pt-1 text-xs text-slate-500 dark:text-slate-400">
            For search engine crawlers like Googlebot, mathematical symbols are sometimes normalized, but plain ASCII text
            consistently offers the strongest semantic ranking clarity. Use styling for visual flair where intent and branding thrive!
          </p>
        </div>
      </section>
    </div>
  );
};

const EDITORIAL_MAP: Record<string, React.FC> = {
  "fancy-fonts": FancyFontsEditorial,
  "word-counter": WordCounterEditorial,
  "json-formatter": JsonFormatterEditorial,
  "password-generator": PasswordGeneratorEditorial,
  "uuid-generator": UuidGeneratorEditorial,
  "regex-tester": RegexTesterEditorial,
  "case-converter": CaseConverterEditorial,
  base64: Base64Editorial,
  "url-encoder": UrlEncoderEditorial,
  "jwt-decoder": JwtDecoderEditorial,
  "lorem-ipsum": LoremIpsumEditorial,
};

export const ToolSeoContent: React.FC<ToolSeoContentProps> = ({ tool }) => {
  const content = getToolEducationalContent(tool.category, tool.slug, tool.name);
  const blueprint = getToolSeoBlueprint(tool.slug);
  const EditorialComponent = EDITORIAL_MAP[tool.slug];

  // Prioritize cluster slugs from SEO blueprint if available
  let fallbackTools: ToolDefinition[] = [];
  if (blueprint && blueprint.clusterSlugs && blueprint.clusterSlugs.length > 0) {
    const clusterTools = blueprint.clusterSlugs
      .map((slug) => getToolBySlug(slug))
      .filter((t): t is ToolDefinition => t !== undefined && t.slug !== tool.slug);
    fallbackTools = clusterTools.slice(0, 4);
  }

  // Fill up with category tools
  if (fallbackTools.length < 4) {
    const categoryTools = getToolsByCategory(tool.category).filter(
      (t) => t.slug !== tool.slug && !fallbackTools.some((r) => r.slug === t.slug)
    );
    fallbackTools = [...fallbackTools, ...categoryTools].slice(0, 4);
  }

  // Fill up with featured tools if needed
  if (fallbackTools.length < 4) {
    const featured = getFeaturedTools().filter(
      (t) => t.slug !== tool.slug && !fallbackTools.some((r) => r.slug === t.slug)
    );
    fallbackTools = [...fallbackTools, ...featured].slice(0, 4);
  }

  const isAI = tool.category === "AI Magic";

  return (
    <div className="max-w-6xl mx-auto mt-12 space-y-12 text-slate-600 dark:text-slate-300">
      {/* Educational Guide Section */}
      <section aria-labelledby="about-heading" className="space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <h2 id="about-heading" className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            About {tool.name}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed max-w-3xl">
            {tool.description} Designed for software developers, content writers, students, and data
            professionals who value accuracy, speed, and privacy.
          </p>
        </div>

        {/* How It Works & Key Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* How to Use */}
          <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-4">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center text-xs font-bold">
                ✓
              </span>
              How to Use {tool.name}
            </h3>
            <ol className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 list-decimal list-inside leading-relaxed">
              {content.howToSteps.map((step, idx) => (
                <li key={idx} className="pl-1">
                  <span className="text-slate-800 dark:text-slate-200">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Key Features & Privacy */}
          <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                <ShieldCheck className="text-emerald-600 dark:text-emerald-400" size={20} />
                Key Features &amp; Security
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {content.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <Check size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span>
                {isAI
                  ? "AI requests are encrypted via HTTPS and never saved or used for model training."
                  : "All processing runs 100% locally in your browser memory. Your text never leaves your device."}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Responsive Non-Intrusive Ad Banner */}
      <AdUnit slotId="tool-content-ad" format="horizontal" />

      {/* Dedicated Deep Editorial Guide */}
      {EditorialComponent && <EditorialComponent />}

      {/* Frequently Asked Questions */}
      <section aria-labelledby="faq-heading" className="space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
          <h2 id="faq-heading" className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="text-brand-600 dark:text-brand-400" size={22} />
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Common questions regarding {tool.name}, data safety, and supported capabilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {content.faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/30 shadow-subtle space-y-2 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {faq.question}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {renderAnswerWithLinks(faq.answer)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Tools Recommendation */}
      {fallbackTools.length > 0 && (
        <section aria-labelledby="related-heading" className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center justify-between">
            <h2 id="related-heading" className="text-lg font-bold text-slate-900 dark:text-white">
              Related {tool.category} Tools
            </h2>
            <Link
              href={`/#category-${tool.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
              className="text-xs text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-semibold inline-flex items-center gap-1 transition-colors"
            >
              Explore Category <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {fallbackTools.map((rel) => (
              <Link
                key={rel.id}
                href={`/tools/${rel.slug}`}
                className="group p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 shadow-subtle hover:shadow-cardHover hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 group-hover:text-brand-600 dark:group-hover:text-brand-400 group-hover:bg-brand-50 dark:group-hover:bg-brand-950/40 transition-colors shrink-0">
                    <DynamicIcon name={rel.icon} size={16} />
                  </div>
                  <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-white truncate">
                    {rel.name}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {rel.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
