# Dedicated Adsterra host

Deploy this folder as a **separate Vercel project**, never as routes on the main app.

1. Import advertisingbwp-cmyk/ai-text-utility into a new Vercel project named ai-text-utility-ads.
2. Root Directory: ad-host. Framework preset: Other. Node: 22 or newer.
3. Build Command: node build.mjs. Install Command: echo No dependencies. Leave Output Directory override OFF: build.mjs creates Vercel Build Output API files in .vercel/output.
4. While PR #2 is open, deploy the fix/production-hardening branch explicitly (a project that watches main will not contain this package until merge). Do not merge merely to deploy it.
5. Set the ad project's AD_PARENT_ORIGINS to a comma-separated list of exact allowed HTTPS parent origins. Default: https://ai-text-utility.vercel.app. Add the actual PR preview origin(s) when testing. No paths, wildcards, credentials, query strings or fragments. Redeploy the ad project whenever this list changes.
6. Assign the available domain https://ai-text-utility-ads.vercel.app (proposed, not yet provisioned). If Vercel allocates a different hostname, use that actual hostname instead.
7. The four ad routes must be publicly reachable without Vercel authentication because they are public ad documents; keep any unrelated application/deployment protection unchanged. Verify /banner-320x50, /banner-300x250, /banner-728x90 and /native.
8. In the MAIN application's Vercel project, set NEXT_PUBLIC_AD_FRAME_ORIGIN=https://ai-text-utility-ads.vercel.app using the actual dedicated hostname. Set for the intended Preview and Production environments. Keep NEXT_PUBLIC_SITE_URL=https://ai-text-utility.vercel.app. These are build-time public values; rebuild/redeploy the main app.
9. On the actual preview and production domains, repeat the creative, parent-script, failure and isolation checks in docs/ad-isolation.md. Host CSP frame-ancestors must include the exact parent used; otherwise the parent will collapse the rejected frame after its deadline.

No ad-host secrets or dependencies are required. Existing provider IDs live only in public HTML. SmartLink stays in the main app. No domains, projects or env values were created remotely during implementation.

## Local verification
From this folder run node serve.mjs (loopback port 3003).
Build/start the root application with:
- NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3002
- NEXT_PUBLIC_AD_FRAME_ORIGIN=http://127.0.0.1:3003
- npm run build
- npm run start -- --port 3002

These loopback values are test-only, not production defaults. Run node build.mjs here to validate the standalone static deployment artifact. The build output directory is ignored by Git. Only public contains deployed assets; the local server and controlled security fixtures are not deployed.

## Operational limits
Provider fill, geography, ad blockers and third-party cookie policy can affect availability. Native scrolls inside a fixed 250px frame. Popups remain sandboxed and destination clicks were not tested; add no extra permissions without evidence. Parent unavailable-slot collapse is bounded at 15 seconds and may cause layout shift. Do not share parent cookies or authentication with this origin, and never proxy these routes through the main origin.
