import type { Metadata } from "next";
import { HomeToolsClient } from "@/components/HomeToolsClient";
import { HomeSeoContent } from "@/components/HomeSeoContent";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function HomePage() {
  return <HomeToolsClient><HomeSeoContent /></HomeToolsClient>;
}
