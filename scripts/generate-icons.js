#!/usr/bin/env node

/**
 * Convert SVG icon to PNG images using Sharp.
 * Generates icon-192.png, icon-192-maskable.png, icon-512.png, icon-512-maskable.png, and icon-96.png
 * Run: node scripts/generate-icons.js
 */

const fs = require('fs');
const path = require('path');

async function generateIcons() {
  let sharp;
  try {
    sharp = require('sharp');
  } catch (e) {
    console.error('❌ Sharp not installed. Install with: npm install --save-dev sharp');
    process.exit(1);
  }

  const svgPath = path.resolve(__dirname, '../assets/icon.svg');
  const assetsDir = path.resolve(__dirname, '../assets');

  if (!fs.existsSync(svgPath)) {
    console.error(`❌ SVG not found: ${svgPath}`);
    process.exit(1);
  }

  const sizes = [
    { name: 'icon-96.png', size: 96 },
    { name: 'icon-192.png', size: 192 },
    { name: 'icon-192-maskable.png', size: 192, maskable: true },
    { name: 'icon-512.png', size: 512 },
    { name: 'icon-512-maskable.png', size: 512, maskable: true },
  ];

  try {
    console.log('📦 Generating PNG icons from SVG...');
    for (const { name, size, maskable } of sizes) {
      const outPath = path.join(assetsDir, name);
      let pipeline = sharp(svgPath).resize(size, size, { fit: 'contain', background: maskable ? 'rgba(0,0,0,0)' : '#ffffff' });
      await pipeline.png().toFile(outPath);
      console.log(`✅ Generated: ${name}`);
    }
    console.log('✨ Done! Icons ready for PWA and native apps.');
  } catch (err) {
    console.error('❌ Error generating icons:', err.message);
    process.exit(1);
  }
}

generateIcons();
