import { MetadataRoute } from "next";
import { TOOLS_REGISTRY } from "@/data/toolsRegistry";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://ai-text-utility.vercel.app";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // Only index verified public tool pages
  const toolRoutes: MetadataRoute.Sitemap = TOOLS_REGISTRY.map((tool) => ({
    url: `${baseUrl}/tools/${tool.slug}`,
    changeFrequency: "weekly",
    priority: tool.featured ? 0.9 : 0.7,
  }));

  return [...staticRoutes, ...toolRoutes];
}
