import type { Metadata } from "next";
import { HomeToolsClient } from "@/components/HomeToolsClient";
import { HomeSeoContent } from "@/components/HomeSeoContent";

const title = "Free Online Text Tools & AI Writing | AI Text Utility";
const description = "Count words, clean text, generate URL slugs and format JSON with 43 online tools. Standard tools run in your browser; AI writing tools use an AI provider.";
export const metadata: Metadata = {
  title: { absolute: title }, description,
  alternates: { canonical: "/" },
  openGraph: { title, description, url: "/", type: "website", siteName: "AI Text Utility", images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "AI Text Utility" }] },
  twitter: { card: "summary_large_image", title, description, images: ["/og-image.png"] },
};

export default function HomePage() {
  return <HomeToolsClient><HomeSeoContent /></HomeToolsClient>;
}
