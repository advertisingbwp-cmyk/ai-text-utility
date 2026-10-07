# Cross-origin advertising

## Original Phase 3 audit
Before Phase 3, Native appended invoke.js directly to the main document. Banners wrote provider scripts into unsandboxed same-origin blank frames. The strict opaque-origin srcDoc trial prevented parent access but the provider threw while accessing document.cookie. Both format flags were then false; banner components returned 70/270/110px blank elements and Native reserved 224px. Homepage and every tool were affected. No provider scripts rendered in the final disabled parent DOM.

The correction removes that global disable and the srcDoc/document.write integration. Provider IDs and the SmartLink destination are unchanged.

## Two deployments
The main Next.js app uses NEXT_PUBLIC_AD_FRAME_ORIGIN. The separate ad-host directory is a dependency-free static Vercel project. Never deploy its files into the main application's public directory or rewrite its routes through the main origin.

Routes:
- /banner-320x50 — 87759585f06f50f90802d1b4cea40a5d
- /banner-300x250 — dc60669d213c871b2e2024882d61f041
- /banner-728x90 — 3b17baca8ac1f38a721ac113ce53e459
- /native — pl31247526.profitableratecpmnetwork.com/8aca604b8b2ab0a3b2106d4958e02b1d/invoke.js

Main app accepts only a bare, separate HTTPS origin with no credentials/path/query/hash. It checks both the canonical configured origin and actual browser origin (including preview aliases). HTTP is accepted only when both the app and ad host use loopback addresses, for the local two-origin test. Missing/invalid configuration omits ads without falling back to same-origin execution.

Sandbox is exactly allow-scripts allow-same-origin allow-popups. The ad document retains its own origin; it does not gain the parent's origin. Popups stay sandboxed. No top navigation, forms, modals, downloads or popup escape permissions are added. Browser cookie/third-party tracking restrictions still apply.

Only the dedicated host loads provider scripts. The main CSP script-src no longer permits arbitrary HTTPS scripts; frame-src permits only the validated ad origin, or none when unconfigured. worker-src explicitly retains self/blob capability previously inherited by workers. No regex logic changes.

## Layout, availability and policy
Only one responsive banner mounts: 320x50 below 640px, 300x250 at 640–767px, 728x90 at 768px and above. Native is fixed at 250px and scrolls internally if taller. Configured slots reserve these dimensions during hydration and loading. Missing configuration renders nothing, including no margins or placeholder.

The dedicated host observes creative markup (including Native CSS backgrounds and provider-created nested frames). It sends a fixed ready/unavailable status with a format identifier, without input, output, cookies or analytics state. The parent authenticates event.origin and event.source and never sends tool values to the frame. Ready means creative markup was observed, not a guaranteed impression or successful destination click. A 12-second host content deadline and 15-second parent deadline collapse unavailable slots. Frame errors collapse the whole slot. Collapse can produce a bounded layout shift; avoiding permanent dead space takes priority after failure. There is no zero-CLS claim.

Sensitive tools retain cross-origin banners and exclude Native: password generator, JWT decoder, hash generator, all AI tools, Base64, URL encoding, query parsing, email/URL extraction and JSON/CSV tools. Other tools and homepage allow both. No blanket disable remains.

## Browser evidence (2026-10-07)
Separate local origins: application 127.0.0.1:3002 and ad host 127.0.0.1:3003. All three banner units and Native rendered actual provider creatives. Provider scripts loaded and creative assets appeared; no opaque-origin cookie errors occurred after the change. An initial integration error from declaring atOptions with var was fixed by assigning window.atOptions, which the provider can delete.

Controlled test at ports 3004/3005 uses no provider scripts and a CSP that disallows outbound connections/images. It places the requested test sentinels only in the controlled parent. The child attempts to read parent document, input, textarea, localStorage and sessionStorage; all five returned SecurityError in the real browser. Sentinels are never included in status messages or sent to Adsterra. Reproduce with node tests/fixtures/ad-isolation-server.mjs.

The real app's password, JWT, hash, AI, cleanup and homepage routes were inspected. Parent documents contained no provider invoke.js. Password preview/copy/download remained consistent; SHA-256(abc) and cleanup output were correct. AI returned the existing unavailable-provider error locally; successful remote AI generation requires configured credentials and was not claimed. Native appeared only on homepage/ordinary cleanup, not the sensitive pages. Ad destination clicks were not exercised; no extra sandbox permission was justified.

## Deployment gate
Local compatibility and security tests do not substitute for deployment verification. A separate Vercel project has NOT been created by this change. Follow ad-host/README.md, configure the main app at build time, then verify all formats on the final HTTPS origin and PR preview before merging. Until configured, previews/production deliberately render no embedded ads. Do not describe monetization as live yet.

## Sources
- [MDN iframe sandbox](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe)
- [MDN same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Same-origin_policy)
- [Vercel Build Output API](https://vercel.com/docs/build-output-api)
