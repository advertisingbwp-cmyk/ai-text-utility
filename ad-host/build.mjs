import { readFile, writeFile, mkdir, cp } from "node:fs/promises";
const parents = (process.env.AD_PARENT_ORIGINS || "https://ai-text-utility.vercel.app").split(",").map(value => {
  const url = new URL(value.trim());
  if (url.protocol !== "https:" || url.username || url.password || url.pathname !== "/" || url.search || url.hash) throw new Error("AD_PARENT_ORIGINS must be comma-separated HTTPS origins");
  return url.origin;
});
await mkdir(".vercel/output/static", { recursive: true });
await cp("public", ".vercel/output/static", { recursive: true });
const csp = "default-src 'self' https: data: blob:; script-src 'self' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' https: data: blob:; frame-src https:; connect-src 'self' https:; object-src 'none'; base-uri 'none'; frame-ancestors " + parents.join(" ");
await writeFile(".vercel/output/config.json", JSON.stringify({ version: 3, routes: [
  { src: "/(.*)", headers: { "Content-Security-Policy": csp, "Referrer-Policy": "no-referrer", "X-Content-Type-Options": "nosniff", "Permissions-Policy": "camera=(), microphone=(), geolocation=()", "X-Robots-Tag": "noindex, nofollow" }, continue: true },
  ...["banner-320x50","banner-300x250","banner-728x90","native"].map(route => ({ src: "/" + route, dest: "/" + route + ".html" })),
  { handle: "filesystem" }, { src: "/.*", status: 404 }
]}, null, 2));
console.log("Static ad host built; allowed parents: " + parents.join(", "));
