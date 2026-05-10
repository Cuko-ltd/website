// Generates public/og-image.png at 1200x630 from an inline SVG template.
// Runs as a prebuild step so social cards always match the latest brand output.
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const out = resolve(root, 'public/og-image.png');
const fontPath = resolve(
  root,
  'node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2',
);

// Skip regen if PNG newer than this script and the font file (idempotent prebuild).
if (existsSync(out)) {
  const outMtime = statSync(out).mtimeMs;
  const scriptMtime = statSync(fileURLToPath(import.meta.url)).mtimeMs;
  const fontMtime = existsSync(fontPath) ? statSync(fontPath).mtimeMs : 0;
  if (outMtime > scriptMtime && outMtime > fontMtime) {
    console.log('[og-image] up to date, skipping');
    process.exit(0);
  }
}

const PAPER = '#f4f3ee';
const INK = '#0a0a0a';
const INK_SOFT = '#565656';
const ACCENT = '#1f4dff';
const GRID = 'rgba(10,10,10,0.06)';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <pattern id="grid" width="1200" height="64" patternUnits="userSpaceOnUse">
      <rect width="1200" height="1" fill="${GRID}"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="${PAPER}"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <rect x="80" y="80" width="64" height="6" fill="${ACCENT}"/>
  <text x="80" y="150" font-family="JetBrains Mono" font-size="22" font-weight="500" fill="${INK_SOFT}" letter-spacing="2">CUKO LTD</text>
  <text x="80" y="290" font-family="JetBrains Mono" font-size="84" font-weight="500" fill="${INK}" letter-spacing="-2">Fractional</text>
  <text x="80" y="380" font-family="JetBrains Mono" font-size="84" font-weight="500" fill="${INK}" letter-spacing="-2">Hands-On <tspan fill="${ACCENT}">CTO</tspan></text>
  <text x="80" y="500" font-family="JetBrains Mono" font-size="24" font-weight="400" fill="${INK_SOFT}" letter-spacing="0">Crypto-native finance · Healthcare · AI · Cloud</text>
  <text x="80" y="540" font-family="JetBrains Mono" font-size="20" font-weight="400" fill="${INK_SOFT}" letter-spacing="0">Samuel Ventimiglia · London</text>
  <text x="80" y="600" font-family="JetBrains Mono" font-size="18" font-weight="500" fill="${INK}" letter-spacing="2">CUKO.UK</text>
</svg>`;

const fontBuffers = existsSync(fontPath) ? [readFileSync(fontPath)] : [];
if (fontBuffers.length === 0) {
  console.warn(`[og-image] font not found at ${fontPath} — falling back to system fonts`);
}

const resvg = new Resvg(svg, {
  background: PAPER,
  fitTo: { mode: 'width', value: 1200 },
  font: {
    fontBuffers,
    loadSystemFonts: fontBuffers.length === 0,
    defaultFontFamily: 'JetBrains Mono',
  },
});

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, resvg.render().asPng());
console.log(`[og-image] wrote ${out}`);
