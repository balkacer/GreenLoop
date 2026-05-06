/**
 * Generates AppIcon PNGs from brand SVG for Xcode Asset Catalog.
 * Run from repo root: node mobile/scripts/generate-ios-app-icons.mjs
 * Or: npm run generate:ios-icons --prefix mobile
 */
import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const mobileRoot = join(__dirname, '..');
const svgPath = join(
  mobileRoot,
  'src/assets/brand/logo_green_loop_symbol_green.svg',
);
const outDir = join(
  mobileRoot,
  'ios/GreenLoopMobile/Images.xcassets/AppIcon.appiconset',
);

/** Matches Android adaptive launcher background (values/colors.xml) */
const BG = { r: 245, g: 247, b: 244, alpha: 1 };
const CANVAS = 1024;
/** Logo max width as fraction of canvas (adaptive safe zone feel) */
const LOGO_FRAC = 0.68;

async function buildMasterIcon() {
  const svg = readFileSync(svgPath);
  const maxW = Math.round(CANVAS * LOGO_FRAC);
  const logoPng = await sharp(svg)
    .resize({
      width: maxW,
      height: maxW,
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  return sharp({
    create: {
      width: CANVAS,
      height: CANVAS,
      channels: 4,
      background: BG,
    },
  })
    .composite([{ input: logoPng, gravity: 'center' }])
    .png();
}

async function main() {
  mkdirSync(outDir, { recursive: true });
  const master = await buildMasterIcon();
  const masterBuf = await master.clone().png().toBuffer();

  const outputs = [
    ['Icon-App-20x20@2x.png', 40],
    ['Icon-App-20x20@3x.png', 60],
    ['Icon-App-29x29@2x.png', 58],
    ['Icon-App-29x29@3x.png', 87],
    ['Icon-App-40x40@2x.png', 80],
    ['Icon-App-40x40@3x.png', 120],
    ['Icon-App-60x60@2x.png', 120],
    ['Icon-App-60x60@3x.png', 180],
    ['Icon-App-1024x1024.png', 1024],
  ];

  for (const [name, px] of outputs) {
    await sharp(masterBuf)
      .resize(px, px)
      .png()
      .toFile(join(outDir, name));
  }

  console.log(`Wrote ${outputs.length} icons to ${outDir}`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
