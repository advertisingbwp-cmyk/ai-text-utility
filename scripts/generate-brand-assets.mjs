import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Helper to create ICO file from PNG buffer
function createIco(pngBuffer) {
  // 6 bytes header + 16 bytes directory entry + png data
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // ICO type
  header.writeUInt16LE(1, 4); // 1 image

  const entry = Buffer.alloc(16);
  entry.writeUInt8(32, 0); // width 32
  entry.writeUInt8(32, 1); // height 32
  entry.writeUInt8(0, 2); // color count
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // color planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(pngBuffer.length, 8); // image size
  entry.writeUInt32LE(22, 12); // offset (6 + 16)

  return Buffer.concat([header, entry, pngBuffer]);
}

// 1. Icon SVG (with dark navy rounded square background for app icon / favicon)
export const appIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <defs>
    <linearGradient id="ai_arch_grad" x1="12" y1="52" x2="50" y2="48" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#06B6D4" />
      <stop offset="25%" stop-color="#0EA5E9" />
      <stop offset="50%" stop-color="#3B82F6" />
      <stop offset="72%" stop-color="#7C3AED" />
      <stop offset="88%" stop-color="#9333EA" />
      <stop offset="100%" stop-color="#EC4899" />
    </linearGradient>
    <linearGradient id="ai_ring_back" x1="36" y1="23" x2="48" y2="34" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#3B82F6" />
      <stop offset="60%" stop-color="#6366F1" />
      <stop offset="100%" stop-color="#7E22CE" />
    </linearGradient>
    <linearGradient id="ai_ring_front" x1="19" y1="38" x2="48" y2="28" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0EA5E9" />
      <stop offset="35%" stop-color="#38BDF8" />
      <stop offset="70%" stop-color="#818CF8" />
      <stop offset="90%" stop-color="#A855F7" />
      <stop offset="100%" stop-color="#C084FC" />
    </linearGradient>
    <linearGradient id="ai_sparkle_grad" x1="44" y1="6" x2="52" y2="14" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="40%" stop-color="#E0F2FE" />
      <stop offset="80%" stop-color="#38BDF8" />
      <stop offset="100%" stop-color="#818CF8" />
    </linearGradient>
    <filter id="ribbon_drop_shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="-0.8" dy="1.8" stdDeviation="1.2" flood-color="#020617" flood-opacity="0.55" />
    </filter>
  </defs>

  <!-- Dark navy squircle background -->
  <rect width="64" height="64" rx="16" fill="#0F172A" />

  <g transform="translate(0.5, 0.5)">
    <!-- 1. BACK RING: wraps behind the right leg -->
    <path
      d="M 37 24 C 40 21 44.5 21.5 47 24.5 C 49 27.2 48.5 30.5 46 33.5"
      stroke="url(#ai_ring_back)"
      stroke-width="5.2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />

    <!-- 2. MAIN A ARCH -->
    <path
      d="M 16 49.5 L 28 14 C 29.5 9.8 32.5 9.8 34 14 L 46 49.5"
      stroke="url(#ai_arch_grad)"
      stroke-width="9.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />

    <!-- 3. FRONT RIBBON / CROSSBAR -->
    <path
      d="M 19 37.5 C 23.5 34 31 28.8 38.5 27.8 C 43.5 27 47.2 29 47.8 32 C 48.2 35 45 37.5 40.5 38.5 C 34 40 25.5 41 20 39.2 Z"
      fill="url(#ai_ring_front)"
      filter="url(#ribbon_drop_shadow)"
    />

    <!-- 4. SPECULAR HIGHLIGHT on front ribbon crest -->
    <path
      d="M 23.5 36 C 28 33 34.5 29.5 39.5 28.8 C 43 28.3 45.2 29 45 30.2 C 44 31.5 40 33 35.5 34.2 C 29.5 35.5 25 36.5 23.5 36 Z"
      fill="rgba(255, 255, 255, 0.45)"
    />

    <!-- 5. 4-POINT AI SPARKLE -->
    <path
      d="M 48 5.5 Q 48 11 42.5 11 Q 48 11 48 16.5 Q 48 11 53.5 11 Q 48 11 48 5.5 Z"
      fill="url(#ai_sparkle_grad)"
    />
    <circle cx="48" cy="11" r="1.2" fill="#FFFFFF" />
  </g>
</svg>`;

// 2. Standalone Master Mark SVG (transparent background, for BrandLogo component and brand SVGs)
export const masterMarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <defs>
    <linearGradient id="ai_arch_grad" x1="12" y1="52" x2="50" y2="48" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#06B6D4" />
      <stop offset="25%" stop-color="#0EA5E9" />
      <stop offset="50%" stop-color="#3B82F6" />
      <stop offset="72%" stop-color="#7C3AED" />
      <stop offset="88%" stop-color="#9333EA" />
      <stop offset="100%" stop-color="#EC4899" />
    </linearGradient>
    <linearGradient id="ai_ring_back" x1="36" y1="23" x2="48" y2="34" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#3B82F6" />
      <stop offset="60%" stop-color="#6366F1" />
      <stop offset="100%" stop-color="#7E22CE" />
    </linearGradient>
    <linearGradient id="ai_ring_front" x1="19" y1="38" x2="48" y2="28" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0EA5E9" />
      <stop offset="35%" stop-color="#38BDF8" />
      <stop offset="70%" stop-color="#818CF8" />
      <stop offset="90%" stop-color="#A855F7" />
      <stop offset="100%" stop-color="#C084FC" />
    </linearGradient>
    <linearGradient id="ai_sparkle_grad" x1="44" y1="6" x2="52" y2="14" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="40%" stop-color="#E0F2FE" />
      <stop offset="80%" stop-color="#38BDF8" />
      <stop offset="100%" stop-color="#818CF8" />
    </linearGradient>
    <filter id="ribbon_drop_shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="-0.8" dy="1.8" stdDeviation="1.2" flood-color="#020617" flood-opacity="0.55" />
    </filter>
  </defs>

  <g class="brand-logo-symbol">
    <!-- 1. BACK RING: wraps behind the right leg -->
    <path
      d="M 37 24 C 40 21 44.5 21.5 47 24.5 C 49 27.2 48.5 30.5 46 33.5"
      stroke="url(#ai_ring_back)"
      stroke-width="5.2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />

    <!-- 2. MAIN A ARCH -->
    <path
      d="M 16 49.5 L 28 14 C 29.5 9.8 32.5 9.8 34 14 L 46 49.5"
      stroke="url(#ai_arch_grad)"
      stroke-width="9.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />

    <!-- 3. FRONT RIBBON / CROSSBAR -->
    <path
      d="M 19 37.5 C 23.5 34 31 28.8 38.5 27.8 C 43.5 27 47.2 29 47.8 32 C 48.2 35 45 37.5 40.5 38.5 C 34 40 25.5 41 20 39.2 Z"
      fill="url(#ai_ring_front)"
      filter="url(#ribbon_drop_shadow)"
    />

    <!-- 4. SPECULAR HIGHLIGHT on front ribbon crest -->
    <path
      d="M 23.5 36 C 28 33 34.5 29.5 39.5 28.8 C 43 28.3 45.2 29 45 30.2 C 44 31.5 40 33 35.5 34.2 C 29.5 35.5 25 36.5 23.5 36 Z"
      fill="rgba(255, 255, 255, 0.45)"
    />

    <!-- 5. 4-POINT AI SPARKLE -->
    <g class="brand-sparkle">
      <path
        d="M 48 5.5 Q 48 11 42.5 11 Q 48 11 48 16.5 Q 48 11 53.5 11 Q 48 11 48 5.5 Z"
        fill="url(#ai_sparkle_grad)"
      />
      <circle cx="48" cy="11" r="1.2" fill="#FFFFFF" />
    </g>
  </g>
</svg>`;

async function generateAll() {
  const iconBuffer = Buffer.from(appIconSvg);
  const markBuffer = Buffer.from(masterMarkSvg);

  // Write SVG files
  fs.writeFileSync('app/icon.svg', appIconSvg, 'utf8');
  fs.writeFileSync('public/favicon.svg', appIconSvg, 'utf8');
  fs.writeFileSync('public/brand/logo.svg', masterMarkSvg, 'utf8');
  fs.writeFileSync('public/brand/logo-compact.svg', masterMarkSvg, 'utf8');
  fs.writeFileSync('public/brand/logo-dark.svg', masterMarkSvg, 'utf8');

  // Render PNG icon assets
  const sizes = [
    { file: 'public/favicon-16x16.png', size: 16 },
    { file: 'public/favicon-32x32.png', size: 32 },
    { file: 'public/favicon-48x48.png', size: 48 },
    { file: 'public/apple-touch-icon.png', size: 180 },
    { file: 'public/android-chrome-192x192.png', size: 192 },
    { file: 'public/android-chrome-512x512.png', size: 512 },
    { file: 'public/brand/icon-512.png', size: 512 },
  ];

  for (const item of sizes) {
    await sharp(iconBuffer)
      .resize(item.size, item.size)
      .png()
      .toFile(item.file);
    console.log(`Generated ${item.file} (${item.size}x${item.size})`);
  }

  // Generate public/favicon.ico
  const png32Buffer = await sharp(iconBuffer).resize(32, 32).png().toBuffer();
  const icoBuffer = createIco(png32Buffer);
  fs.writeFileSync('public/favicon.ico', icoBuffer);
  console.log('Generated public/favicon.ico');

  // Also update public/brand/logo.png (512x512 with transparent background)
  await sharp(markBuffer)
    .resize(512, 512)
    .png()
    .toFile('public/brand/logo.png');
  console.log('Generated public/brand/logo.png');

  console.log('All brand assets successfully generated!');
}

generateAll().catch(console.error);
