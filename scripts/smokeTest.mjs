import assert from "node:assert/strict";

const BASE_URL = "http://localhost:3000";

const ROUTES_TO_TEST = [
  // Core routes
  "/",
  "/privacy",
  "/terms",
  "/robots.txt",
  "/sitemap.xml",
  "/ads.txt",
  // Text
  "/tools/word-counter",
  "/tools/regex-tester",
  // Format
  "/tools/json-formatter",
  "/tools/csv-to-json",
  // Cleanup
  "/tools/remove-duplicate-lines",
  "/tools/strip-html-tags",
  // Transform
  "/tools/case-converter",
  "/tools/base64-encoder-decoder",
  "/tools/password-generator",
  "/tools/jwt-decoder",
  // Date & Time
  "/tools/unix-timestamp-converter",
  "/tools/date-difference-calculator",
  // AI
  "/tools/grammar-spelling-fixer",
  "/tools/ai-summarizer",
];

async function runSmokeTests() {
  console.log("=== STARTING SMOKE TEST SUITE ===");
  const results = [];

  for (const path of ROUTES_TO_TEST) {
    const url = `${BASE_URL}${path}`;
    const res = await fetch(url);
    const status = res.status;
    const text = await res.text();
    const contentType = res.headers.get("content-type") || "";

    assert.equal(status, 200, `Expected 200 OK for ${path} but got ${status}`);
    assert.ok(text.length > 0, `Expected non-empty response for ${path}`);

    // Verify specific content per route
    if (path === "/robots.txt") {
      assert.ok(/user-agent:\s*\*/i.test(text), "robots.txt must contain User-agent: *");
      assert.ok(text.includes("Disallow: /api/"), "robots.txt must disallow /api/");
      assert.ok(text.includes("sitemap.xml"), "robots.txt must point to sitemap");
    } else if (path === "/sitemap.xml") {
      assert.ok(text.includes("<urlset"), "sitemap.xml must be valid XML urlset");
      assert.ok(text.includes("/tools/word-counter"), "sitemap.xml must contain tools");
      assert.ok(!text.includes("/api/"), "sitemap.xml must NOT contain api routes");
    } else if (path === "/ads.txt") {
      assert.ok(contentType.includes("text/plain"), "ads.txt must have text/plain content type");
      assert.ok(text.includes("Google AdSense"), "ads.txt contains Google AdSense header");
    } else if (path.startsWith("/tools/")) {
      // SEO & Structured data checks
      assert.ok(text.includes('rel="canonical"'), `Canonical tag missing on ${path}`);
      assert.ok(text.includes('application/ld+json'), `JSON-LD missing on ${path}`);
      assert.ok(text.includes('property="og:title"'), `OG title missing on ${path}`);
      assert.ok(text.includes('<h1'), `H1 header missing on ${path}`);

      // Verify JSON-LD parseability
      const jsonLdMatches = [...text.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
      assert.ok(jsonLdMatches.length >= 2, `Expected at least 2 JSON-LD scripts on ${path}`);
      for (const match of jsonLdMatches) {
        const parsed = JSON.parse(match[1]);
        assert.ok(parsed["@context"], `JSON-LD on ${path} must have @context`);
      }
    }

    results.push({ path, status, size: text.length });
    console.log(`✔ [${status}] ${path} (${text.length} bytes)`);
  }

  // Test AI Endpoint Security & Validation
  console.log("\n=== TESTING AI ENDPOINT ===");
  
  // 1. Invalid Mode
  const invalidModeRes = await fetch(`${BASE_URL}/api/ai`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode: "hack_the_planet", text: "Hello" }),
  });
  assert.equal(invalidModeRes.status, 400, "Invalid mode must return HTTP 400");
  const invalidModeJson = await invalidModeRes.json();
  assert.equal(invalidModeJson.success, false);
  console.log("✔ AI Invalid Mode Rejected with HTTP 400");

  // 2. Empty Text
  const emptyTextRes = await fetch(`${BASE_URL}/api/ai`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode: "grammar", text: "   " }),
  });
  assert.equal(emptyTextRes.status, 400, "Empty text must return HTTP 400");
  console.log("✔ AI Empty Text Rejected with HTTP 400");

  // 3. Oversized Text (> 10,000 chars)
  const hugeText = "A".repeat(10001);
  const hugeTextRes = await fetch(`${BASE_URL}/api/ai`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode: "grammar", text: hugeText }),
  });
  assert.equal(hugeTextRes.status, 413, "Oversized request must return HTTP 413");
  console.log("✔ AI Oversized Request Rejected with HTTP 413");

  console.log("\n=== ALL SMOKE TESTS PASSED CLEANLY! ===");
}

runSmokeTests().catch((err) => {
  console.error("SMOKE TEST FAILED:", err);
  process.exit(1);
});
