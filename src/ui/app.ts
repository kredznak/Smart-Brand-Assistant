import { type AnalysisInput, type BrandKit, type PaletteEntry, type FontRef } from '../state/types.js';
import { extractPalette } from '../analysis/color/extract.js';
import { identifyFonts } from '../analysis/font/identify.js';
import { inferTone, mapToneToStyle } from '../analysis/tone/map.js';
import { buildA11yPanel } from './panels/a11y.js';
import { createPreviews } from './panels/preview.js';

export async function analyzeBrandInputs(input: AnalysisInput): Promise<{ kit: BrandKit; renders: { previews: HTMLDivElement[]; a11y: HTMLElement } }>
{
  const onProgress = input.onProgress ?? (() => {});
  onProgress(10);

  // Derive candidate image URL or blob
  let imageDataUrl: string | null = null;
  if (input.file) {
    imageDataUrl = await fileToDataUrl(input.file);
  } else if (input.url) {
    // Try fetch OG image or favicon
    try {
      const meta = await fetchSiteHints(input.url);
      imageDataUrl = meta.logo ?? null;
    } catch {
      imageDataUrl = null;
    }
  }

  onProgress(25);
  const palette: PaletteEntry[] = await extractPalette({ imageDataUrl, url: input.url });

  onProgress(55);
  const fonts: { primary: FontRef; secondary?: FontRef } = await identifyFonts({ imageDataUrl, url: input.url });

  onProgress(75);
  const tone = await inferTone({ url: input.url, handle: input.handle });
  const _styleTokens = mapToneToStyle(tone);

  const kit: BrandKit = { palette, fonts, tone, logo: imageDataUrl ? { url: imageDataUrl } : undefined };

  onProgress(85);
  const previews = createPreviews(kit);
  const a11y = buildA11yPanel(kit);
  onProgress(100);
  return { kit, renders: { previews, a11y } };
}

async function fetchSiteHints(url: string): Promise<{ logo?: string; themeColor?: string; fonts?: string[] }> {
  // Call server to avoid CORS and parse site content
  const resp = await fetch(`/api/hints?url=${encodeURIComponent(url)}`);
  if (!resp.ok) throw new Error('Failed to fetch site hints');
  return await resp.json();
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

