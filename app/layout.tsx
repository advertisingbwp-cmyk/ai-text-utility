import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/AppShell";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://ai-text-utility.vercel.app"
  ),
  title: {
    default: "AI Text Utility - Modern Browser-Based Text Tools & AI Assistants",
    template: "%s | AI Text Utility",
  },
  description:
    "Instant, private, browser-based text utilities. Word counters, regex testers, JSON formatters, slug generators, case converters, and AI text assistants.",
  keywords: [
    "text utility",
    "word counter",
    "slug generator",
    "json formatter",
    "case converter",
    "regex tester",
    "base64",
    "ai grammar",
    "text tools",
    "developer utilities",
  ],
  authors: [{ name: "AI Text Utility Team" }],
  creator: "AI Text Utility",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "AI Text Utility",
    title: "AI Text Utility - Fast, Private Browser-Based Text Tools",
    description:
      "Privacy-first browser text tools with local client execution and optional AI writing assistance.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI Text Utility - Fast, Private Browser-Based Text Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Text Utility - Browser Text Tools",
    description:
      "Fast, private browser-based utilities for developers, writers, and students.",
    images: ["/og-image.png"],
  },
  verification: {
    google: "googlef25910401568c702",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://ai-text-utility.vercel.app";

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AI Text Utility",
    url: baseUrl,
    description:
      "Instant, private, browser-based text utilities. Word counters, regex testers, JSON formatters, slug generators, case converters, and AI writing assistants.",
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AI Text Utility",
    url: baseUrl,
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Global WebSite & Organization JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />

      </head>
      <body className="bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 antialiased selection:bg-brand-500/15 selection:text-brand-700 dark:selection:text-brand-300">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
