# Advertising isolation

## Before Phase 3

| Format | Execution | Permissions | Placement | Classification |
| --- | --- | --- | --- | --- |
| Native | useEffect appends provider script directly to main document | Main-document DOM/storage access; no frame boundary | Homepage and every tool, including sensitive tools | NOT ISOLATED |
| 320x50 banner | document.write into an initially same-origin blank iframe | No sandbox; no srcDoc; unrestricted initial frame script capabilities | Responsive banner on homepage and every tool | PARTIALLY ISOLATED |
| 300x250 banner | Same as above | Same as above | Tablet responsive placement | PARTIALLY ISOLATED |
| 728x90 banner | Same as above | Same as above | Desktop responsive placement | PARTIALLY ISOLATED |
| SmartLink | Ordinary outbound anchor, no embedded provider script | target=_blank, rel=noopener noreferrer sponsored | Homepage Featured Deals | SAFE ISOLATED outbound navigation |

The responsive component mounts all three frames and selects visibility with CSS.
On the unmodified local production password page, parent script inspection found
the Native provider invoke.js and three banner frames without sandbox/srcdoc.
This establishes access capability, not evidence that the provider stole user data.

## Compatibility verification and deployed behavior

The strict-sandbox production trial failed for all four current invoke.js scripts:
each threw SecurityError when reading document.cookie without allow-same-origin.
This was observed in browser console on the password and cleanup pages. The cleanup
tool still converted "alpha    beta" to "alpha beta" while frame scripts failed.

AD_FORMAT_ENABLED therefore disables both banner and Native formats globally.
No embedded provider script or ad iframe is rendered in the final implementation.
All existing provider IDs and the isolated implementation remain in source for
future provider compatibility, but must not be re-enabled without verification.
SmartLink remains active. This follows the requirement to disable incompatible
formats instead of weakening the sandbox.

## Policy and retained isolation architecture

The retained implementation would execute embedded advertising inside static srcDoc iframe documents with
sandbox="allow-scripts allow-popups", without allow-same-origin, top-navigation,
forms, or allow-popups-to-escape-sandbox. Popups remain sandboxed. Referrers are
suppressed. No input/output is passed into ad documents or via postMessage.

The provider IDs, banner sizes and placement positions are kept. Disabled slots
reserve the previous geometry with aria-hidden empty elements; they show no fake
ad, sponsored label or loaded-content message. The retained Native design uses a
fixed 160px frame (the previous minimum slot height), with
internal scrolling if content is taller. Provider-driven resizing is not trusted.
Frames reserve their dimensions before and after loading/failure.

The reusable tool policy identifies passwords, JWTs, hashes and all AI tools as
sensitive. Base64, URL encoding and query parsing commonly receive credentials or
tokens; email/URL extraction commonly receives personal contact details; JSON/CSV
tools commonly receive structured personal records. These are also sensitive.
Ordinary cleanup tools are not automatically classified as sensitive merely because
someone could paste private text.

Sensitive tools are eligible only for compatible isolated fixed-size banners;
ordinary tools and the homepage are eligible for isolated Native as well. Current
compatibility flags disable both everywhere. Native is additionally prohibited by
the sensitive-tool policy, independently of the provider compatibility flag.

## Access and limitations

An opaque-origin sandbox prevents ad scripts from reading the parent's textareas,
inputs, passwords, JWTs, AI drafts, outputs, DOM text or localStorage. Access to the
srcDoc frame's own origin storage is also restricted. This does not eliminate ad
network requests, IP/browser metadata, identifiers in nested third-party resources,
or tracking on a clicked destination, subject to browser restrictions.

No parent listener accepts ad messages. Ads can alter their own document, make
permitted network requests and open user-initiated sandboxed popups. Some ad or
destination behavior may not work under these restrictions; sandbox permissions
must not be loosened to restore it.

The existing broad CSP already allows the required HTTPS/frame/inline resources.
No CSP change or weakening is required. CSP itself remains broad; the isolation
boundary in this phase is the iframe sandbox.
