import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  const rawPublisherId =
    process.env.ADSENSE_PUBLISHER_ID ||
    process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID ||
    "";

  // Standardize publisher ID: extract "pub-XXXXXXXXXXXXXXXX"
  const cleanPubId = rawPublisherId.replace(/^ca-/, "");

  let content = "# ads.txt - Google AdSense Publisher Record\n";

  if (cleanPubId && cleanPubId.startsWith("pub-")) {
    content += `google.com, ${cleanPubId}, DIRECT, f08c47fec0942fa0\n`;
  } else {
    content += `# To enable Google AdSense, configure NEXT_PUBLIC_ADSENSE_PUBLISHER_ID in environment variables.\n`;
  }

  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
