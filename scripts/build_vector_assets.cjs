const fs = require('fs');
const path = require('path');

const layers = JSON.parse(fs.readFileSync('/tmp/masks/traced_layers.json', 'utf8'));

// 1. Separate dark green into emblem and wordmark
const darkGreenSubpaths = layers.logo_dark_green.d.split(/(?=M\s)/).filter(Boolean);
const emblemDSubpaths = [];
const wordmarkSubpaths = [];

for (const sp of darkGreenSubpaths) {
  const nums = sp.match(/-?\d+(\.\d+)?/g);
  if (!nums) continue;
  let maxX = -Infinity;
  for (let i = 0; i < nums.length; i += 2) {
    const x = parseFloat(nums[i]);
    if (!isNaN(x) && x > maxX) maxX = x;
  }
  if (maxX < 320) {
    emblemDSubpaths.push(sp);
  } else {
    wordmarkSubpaths.push(sp);
  }
}

const emblemDPath = emblemDSubpaths.join(' ');
const wordmarkPath = wordmarkSubpaths.join(' ');

// 2. Separate orange dots into emblem dot and wordmark dot
const orangeSubpaths = layers.logo_orange.d.split(/(?=M\s)/).filter(Boolean);
let emblemOrangeDot = '';
let wordmarkOrangeDot = '';

for (const sp of orangeSubpaths) {
  const nums = sp.match(/-?\d+(\.\d+)?/g);
  if (!nums) continue;
  let maxX = -Infinity;
  for (let i = 0; i < nums.length; i += 2) {
    const x = parseFloat(nums[i]);
    if (!isNaN(x) && x > maxX) maxX = x;
  }
  if (maxX < 400) {
    emblemOrangeDot = sp;
  } else {
    wordmarkOrangeDot = sp;
  }
}

const tealPath = layers.logo_teal.d;
const neonPath = layers.logo_neon.d;
const idotPath = layers.logo_idot.d;

// Bounding box of full horizontal logo:
// x: [66, 958] -> width = 892, padding 20 -> minX = 55, width = 915
// y: [139, 365] -> height = 226, padding 15 -> minY = 130, height = 245
const logoViewBox = "55 130 915 245";

// Assemble Full Vector Logo (Light mode: dark green text/D)
const logoSvgLight = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${logoViewBox}" fill="none">
  <defs>
    <linearGradient id="dwTealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00e58c" />
      <stop offset="100%" stop-color="#00b0ff" />
    </linearGradient>
    <linearGradient id="dwNeonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#26f07a" />
      <stop offset="100%" stop-color="#00e676" />
    </linearGradient>
  </defs>

  <!-- Emblem Mark -->
  <g id="dw-emblem">
    <!-- Teal Ribbon Fold -->
    <path d="${tealPath}" fill="url(#dwTealGrad)" fill-rule="evenodd" />
    <!-- Neon Lime Pill -->
    <path d="${neonPath}" fill="url(#dwNeonGrad)" fill-rule="evenodd" />
    <!-- D Outer Loop (Dark Pine Green) -->
    <path d="${emblemDPath}" fill="#023826" fill-rule="evenodd" />
    <!-- Orange Floating Accent Dot -->
    <path d="${emblemOrangeDot}" fill="#ffba05" fill-rule="evenodd" />
  </g>

  <!-- Wordmark 'DigiWorku' -->
  <g id="dw-wordmark">
    <!-- Main Letterforms -->
    <path d="${wordmarkPath}" fill="#023826" fill-rule="evenodd" />
    <!-- Emerald Dot on first 'i' -->
    <path d="${idotPath}" fill="#00c051" fill-rule="evenodd" />
    <!-- Amber Dot on final 'u' -->
    <path d="${wordmarkOrangeDot}" fill="#ffba05" fill-rule="evenodd" />
  </g>
</svg>`;

// Assemble Full Vector Logo (Dark mode: crisp white text/D)
const logoSvgDark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${logoViewBox}" fill="none">
  <defs>
    <linearGradient id="dwTealGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00e58c" />
      <stop offset="100%" stop-color="#00b0ff" />
    </linearGradient>
    <linearGradient id="dwNeonGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#26f07a" />
      <stop offset="100%" stop-color="#00e676" />
    </linearGradient>
  </defs>

  <!-- Emblem Mark -->
  <g id="dw-emblem">
    <!-- Teal Ribbon Fold -->
    <path d="${tealPath}" fill="url(#dwTealGradDark)" fill-rule="evenodd" />
    <!-- Neon Lime Pill -->
    <path d="${neonPath}" fill="url(#dwNeonGradDark)" fill-rule="evenodd" />
    <!-- D Outer Loop (Crisp White) -->
    <path d="${emblemDPath}" fill="#ffffff" fill-rule="evenodd" />
    <!-- Orange Floating Accent Dot -->
    <path d="${emblemOrangeDot}" fill="#ffba05" fill-rule="evenodd" />
  </g>

  <!-- Wordmark 'DigiWorku' -->
  <g id="dw-wordmark">
    <!-- Main Letterforms (White) -->
    <path d="${wordmarkPath}" fill="#ffffff" fill-rule="evenodd" />
    <!-- Emerald Dot on first 'i' -->
    <path d="${idotPath}" fill="#00c051" fill-rule="evenodd" />
    <!-- Amber Dot on final 'u' -->
    <path d="${wordmarkOrangeDot}" fill="#ffba05" fill-rule="evenodd" />
  </g>
</svg>`;

// 3. Standalone Emblem Mark SVG (ViewBox 60 135 245 235)
const emblemViewBox = "60 135 245 235";
const emblemSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${emblemViewBox}" fill="none">
  <defs>
    <linearGradient id="dwTealGradIcon" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00e58c" />
      <stop offset="100%" stop-color="#00b0ff" />
    </linearGradient>
    <linearGradient id="dwNeonGradIcon" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#26f07a" />
      <stop offset="100%" stop-color="#00e676" />
    </linearGradient>
  </defs>
  <path d="${tealPath}" fill="url(#dwTealGradIcon)" fill-rule="evenodd" />
  <path d="${neonPath}" fill="url(#dwNeonGradIcon)" fill-rule="evenodd" />
  <path d="${emblemDPath}" fill="currentColor" fill-rule="evenodd" />
  <path d="${emblemOrangeDot}" fill="#ffba05" fill-rule="evenodd" />
</svg>`;

// 4. App Icon / Favicon SVG (512x512 with squircle container)
// Center of emblem is x=182.5, y=252. Size is ~235 x 226.
// To fit nicely inside 512x512 with padding:
// Scale = 1.45, translation so (182.5, 252) maps to (256, 256)
// targetX = 256 - 182.5 * 1.45 = 256 - 264.6 = -8.6
// targetY = 256 - 252 * 1.45 = 256 - 365.4 = -109.4
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <defs>
    <linearGradient id="iconSquircleBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#003522" />
      <stop offset="100%" stop-color="#002216" />
    </linearGradient>
    <linearGradient id="dwTealGradApp" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00e58c" />
      <stop offset="100%" stop-color="#00b0ff" />
    </linearGradient>
    <linearGradient id="dwNeonGradApp" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#26f07a" />
      <stop offset="100%" stop-color="#00e676" />
    </linearGradient>
  </defs>

  <!-- Deep Forest Green Squircle Background (iOS/Android shape) -->
  <rect width="512" height="512" rx="118" fill="url(#iconSquircleBg)" />
  <rect x="1" y="1" width="510" height="510" rx="117" stroke="#00e58c" stroke-opacity="0.15" stroke-width="2" />

  <!-- Centered Emblem Mark scaled by 1.42 -->
  <g transform="translate(-1.5, -102) scale(1.42)">
    <path d="${tealPath}" fill="url(#dwTealGradApp)" fill-rule="evenodd" />
    <path d="${neonPath}" fill="url(#dwNeonGradApp)" fill-rule="evenodd" />
    <path d="${emblemDPath}" fill="#ffffff" fill-rule="evenodd" />
    <path d="${emblemOrangeDot}" fill="#ffba05" fill-rule="evenodd" />
  </g>
</svg>`;

fs.writeFileSync('public/logo.svg', logoSvgLight);
fs.writeFileSync('public/logo-dark.svg', logoSvgDark);
fs.writeFileSync('public/logo-icon.svg', emblemSvg);
fs.writeFileSync('public/favicon.svg', iconSvg);

console.log('Saved:');
console.log(' - public/logo.svg');
console.log(' - public/logo-dark.svg');
console.log(' - public/logo-icon.svg');
console.log(' - public/favicon.svg');
