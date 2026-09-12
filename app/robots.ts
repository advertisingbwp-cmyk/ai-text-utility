import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://ai-text-utility.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/tools/", "/about", "/contact", "/privacy", "/terms"],
        disallow: [
          "/api/",
          "/_next/",
          "/admin/",
          "/private/",
          "/*.json$",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
