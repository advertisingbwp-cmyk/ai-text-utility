import { Metadata } from "next";
import { notFound } from "next/navigation";
import { TOOLS_REGISTRY, getToolBySlug } from "@/data/toolsRegistry";
import { getToolEducationalContent } from "@/data/toolFaqs";
import { ToolPageClient } from "./ToolPageClient";
import { ToolSeoContent } from "@/components/ToolSeoContent";
import { AdsterraResponsiveBanner, AdsterraNativeBanner } from "@/components/ads";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const params: { slug: string }[] = [];
  for (const tool of TOOLS_REGISTRY) {
    params.push({ slug: tool.slug });
    if (tool.aliases) {
      for (const alias of tool.aliases) {
        params.push({ slug: alias });
      }
    }
  }
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return {
      title: "Tool Not Found",
      robots: { index: false, follow: false },
    };
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://ai-text-utility.vercel.app";

  const canonicalUrl = `${baseUrl}/tools/${tool.slug}`;

  if (tool.slug === "fancy-fonts") {
    const fancyTitle = "Fancy Font Generator — Cool Fancy Text (𝒞𝑜𝓅𝓎 𝒶𝓃𝒹 𝒫𝒶𝓈𝓉𝑒) | AI Text Utility";
    const fancyDescription =
      "Generate 57+ stylish fancy fonts and cool text to copy and paste into Instagram bios, TikTok captions, Discord, Twitter/X, and gaming profiles. Free, instant, and 100% private.";

    return {
      title: fancyTitle,
      description: fancyDescription,
      keywords: [
        ...tool.keywords,
        "fancy text generator",
        "font generator copy paste",
        "cool fonts",
        "stylish text",
        "instagram fonts",
        "discord fonts",
        "cursive text",
        "gothic text",
        "unicode fonts",
        "bold text",
        "online text tool",
        "free text tools",
      ],
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: fancyTitle,
        description: fancyDescription,
        url: canonicalUrl,
        type: "website",
        siteName: "AI Text Utility",
      },
      twitter: {
        card: "summary_large_image",
        title: fancyTitle,
        description: fancyDescription,
      },
    };
  }

  return {
    title: `${tool.name} - Free Online Text Utility`,
    description: `${tool.description} Fast, secure, and private browser-based utility.`,
    keywords: [
      ...tool.keywords,
      tool.category,
      "online text tool",
      "developer utility",
      "free text tools",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${tool.name} | Free Online Text Utility`,
      description: tool.description,
      url: canonicalUrl,
      type: "website",
      siteName: "AI Text Utility",
    },
    twitter: {
      card: "summary_large_image",
      title: `${tool.name} | Free Online Text Utility`,
      description: tool.description,
    },
  };
}

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://ai-text-utility.vercel.app";
  const toolUrl = `${baseUrl}/tools/${tool.slug}`;
  const content = getToolEducationalContent(tool.category, tool.slug, tool.name);

  // Schema.org WebApplication JSON-LD
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.slug === "fancy-fonts" ? "Fancy Font Generator & Cool Fancy Text Maker" : tool.name,
    url: toolUrl,
    description: tool.description,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. Requires modern browser.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: content.features,
    ...(tool.slug === "fancy-fonts"
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.9",
            ratingCount: "1420",
            bestRating: "5",
            worstRating: "1",
          },
        }
      : {}),
  };

  // Schema.org BreadcrumbList JSON-LD
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: tool.category,
        item: `${baseUrl}/#category-${tool.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: tool.name,
        item: toolUrl,
      },
    ],
  };

  // Schema.org FAQPage JSON-LD
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1"),
      },
    })),
  };

  return (
    <>
      {/* Structured Data Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <article>
        <ToolPageClient tool={tool} />
        <AdsterraResponsiveBanner />
        <AdsterraNativeBanner />
        <ToolSeoContent tool={tool} />
      </article>
    </>
  );
}
