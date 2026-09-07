import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/AppShell";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://ai-text-utility.vercel.app"
  ),
  title: {
    default: "OmniText - Modern Browser-Based Text Tools & Utilities",
    template: "%s | OmniText Utility",
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
  authors: [{ name: "OmniText Team" }],
  creator: "OmniText",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "OmniText Utility",
    title: "OmniText - Fast, Private Browser-Based Text Tools",
    description:
      "40+ instant browser-based utilities for text formatting, transformation, cleanup, and AI rewriting. 100% private.",
  },
  twitter: {
    card: "summary_large_image",
    title: "OmniText - Browser Text Tools",
    description:
      "Fast, private browser-based utilities for developers, writers, and students.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adsensePublisherId =
    process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || "ca-pub-3168330263525370";
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://ai-text-utility.vercel.app";

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "OmniText Utility",
    url: baseUrl,
    description:
      "Instant, private, browser-based text utilities. Word counters, regex testers, JSON formatters, slug generators, case converters, and AI writing assistants.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/#search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "OmniText",
    url: baseUrl,
  };

  return (
    <html lang="en" className="dark">
      <head>
        {/* Google AdSense Account Meta Tag for Site Ownership Verification */}
        <meta name="google-adsense-account" content={adsensePublisherId} />

        {/* Global WebSite & Organization JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />

        {/* Google AdSense Script */}
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsensePublisherId}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-brand-500/20 selection:text-brand-300">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
