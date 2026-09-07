import fs from "fs";
import path from "path";
import sharp from "sharp";

const rootDir = process.cwd();
const publicDir = path.join(rootDir, "public");
const brandDir = path.join(publicDir, "brand");

if (!fs.existsSync(brandDir)) {
  fs.mkdirSync(brandDir, { recursive: true });
}

const iconSvgPath = path.join(rootDir, "app", "icon.svg");
const iconSvgBuffer = fs.readFileSync(iconSvgPath);

const logoSvgPath = path.join(brandDir, "logo.svg");
const logoSvgBuffer = fs.readFileSync(logoSvgPath);

async function generateAssets() {
  console.log("Generating brand assets with Sharp...");

  // 1. Favicon PNGs
  await sharp(iconSvgBuffer).resize(16, 16).png().toFile(path.join(publicDir, "favicon-16x16.png"));
  console.log("✓ public/favicon-16x16.png");

  await sharp(iconSvgBuffer).resize(32, 32).png().toFile(path.join(publicDir, "favicon-32x32.png"));
  console.log("✓ public/favicon-32x32.png");

  await sharp(iconSvgBuffer).resize(48, 48).png().toFile(path.join(publicDir, "favicon-48x48.png"));
  console.log("✓ public/favicon-48x48.png");

  // Legacy favicon.ico from 32x32 PNG
  await sharp(iconSvgBuffer).resize(32, 32).toFormat("png").toFile(path.join(publicDir, "favicon.ico"));
  console.log("✓ public/favicon.ico");

  // 2. Apple Touch Icon (180x180)
  await sharp(iconSvgBuffer).resize(180, 180).png().toFile(path.join(publicDir, "apple-touch-icon.png"));
  console.log("✓ public/apple-touch-icon.png");

  // 3. Android PWA Icons (192 & 512)
  await sharp(iconSvgBuffer).resize(192, 192).png().toFile(path.join(publicDir, "android-chrome-192x192.png"));
  console.log("✓ public/android-chrome-192x192.png");

  await sharp(iconSvgBuffer).resize(512, 512).png().toFile(path.join(publicDir, "android-chrome-512x512.png"));
  console.log("✓ public/android-chrome-512x512.png");

  // 4. Source 512x512 App Icon
  await sharp(iconSvgBuffer).resize(512, 512).png().toFile(path.join(brandDir, "icon-512.png"));
  console.log("✓ public/brand/icon-512.png");

  // 5. Horizontal Logo PNG (High-Res transparent)
  await sharp(logoSvgBuffer).resize(1300).png().toFile(path.join(brandDir, "logo.png"));
  console.log("✓ public/brand/logo.png");

  // 6. Social OpenGraph Card (1200x630)
  // Create crisp SVG background with brand mark & typography
  const ogSvg = `
  <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#090d16" />
        <stop offset="50%" stop-color="#0f172a" />
        <stop offset="100%" stop-color="#020617" />
      </linearGradient>
      <linearGradient id="ai_cyan" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#38bdf8" />
        <stop offset="100%" stop-color="#2563eb" />
      </linearGradient>
      <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.15" />
        <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.0" />
      </linearGradient>
    </defs>

    <!-- Background -->
    <rect width="1200" height="630" fill="url(#bg)" />

    <!-- Ambient glow circle -->
    <circle cx="600" cy="240" r="340" fill="url(#glow)" />

    <!-- Logo Icon Container (140x140) -->
    <g transform="translate(530, 90)">
      <rect width="140" height="140" rx="35" fill="#1e293b" stroke="#334155" stroke-width="3" />
      <g transform="scale(2.916)">
        <path d="M12 12C12 10.8954 12.8954 10 14 10H34C35.1046 10 36 10.8954 36 12C36 13.1046 35.1046 14 34 14H14C12.8954 14 12 13.1046 12 12Z" fill="#38bdf8" />
        <path d="M14 36L22.5 15H25.5L34 36H29.5L27.5 31H20.5L18.5 36H14Z" fill="#ffffff" />
        <polygon points="24,19 22.2,27 25.8,27" fill="#1e293b" />
        <rect x="18" y="28.5" width="12" height="2.5" rx="1.25" fill="#38bdf8" />
      </g>
    </g>

    <!-- Main Title -->
    <text x="600" y="300" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="52" font-weight="900" letter-spacing="-0.03em" fill="#ffffff">
      AI Text Utility
    </text>

    <!-- Subtitle -->
    <text x="600" y="360" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="500" fill="#94a3b8">
      43+ Fast, Private, Client-Side Text Tools &amp; AI Assistants
    </text>

    <!-- Feature Pill Badges -->
    <g transform="translate(330, 430)">
      <!-- Badge 1 -->
      <rect x="0" y="0" width="160" height="42" rx="21" fill="#1e293b" stroke="#334155" />
      <text x="80" y="26" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="700" fill="#38bdf8">100% PRIVATE</text>

      <!-- Badge 2 -->
      <rect x="190" y="0" width="160" height="42" rx="21" fill="#1e293b" stroke="#334155" />
      <text x="270" y="26" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="700" fill="#10b981">ZERO LATENCY</text>

      <!-- Badge 3 -->
      <rect x="380" y="0" width="160" height="42" rx="21" fill="#1e293b" stroke="#334155" />
      <text x="460" y="26" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="700" fill="#a855f7">AI POWERED</text>
    </g>

    <!-- Domain Footer -->
    <text x="600" y="550" text-anchor="middle" font-family="monospace" font-size="16" font-weight="600" fill="#64748b" letter-spacing="0.1em">
      AI-TEXT-UTILITY.VERCEL.APP
    </text>
  </svg>
  `;

  await sharp(Buffer.from(ogSvg)).png().toFile(path.join(brandDir, "og-image.png"));
  console.log("✓ public/brand/og-image.png");

  // Also copy to public/og-image.png for standard route
  fs.copyFileSync(path.join(brandDir, "og-image.png"), path.join(publicDir, "og-image.png"));
  console.log("✓ public/og-image.png");

  console.log("All brand assets successfully generated!");
}

generateAssets().catch(console.error);
