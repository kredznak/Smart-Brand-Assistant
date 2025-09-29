import { type FontRef } from '../../state/types.js';

type Input = { imageDataUrl: string | null; url: string | null };

export async function identifyFonts(_input: Input): Promise<{ primary: FontRef; secondary?: FontRef }> {
  // Try server adapter (Google Fonts fallback)
  try {
    const resp = await fetch('/api/analyze/fonts', { method: 'POST' });
    const data = await resp.json();
    if (data?.primary) return { primary: data.primary as FontRef, secondary: data.options?.[1] };
  } catch {}
  // Local fallback
  return { primary: { family: 'Inter', source: 'google-fonts', weights: [400, 600] }, secondary: { family: 'Roboto', source: 'google-fonts', weights: [400, 700] } };
}

