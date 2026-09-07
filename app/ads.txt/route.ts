import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  const rawPublisherId =
    process.env.ADSENSE_PUBLISHER_ID ||
    process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID ||
    "pub-3168330263525370";

  // Standardize publisher ID: extract "pub-XXXXXXXXXXXXXXXX"
  const cleanPubId = rawPublisherId.replace(/^ca-/, "");

  const content = `google.com, ${cleanPubId}, DIRECT, f08c47fec0942fa0\n`;

  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
