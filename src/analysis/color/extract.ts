import { type PaletteEntry } from '../../state/types.js';

type Input = { imageDataUrl: string | null; url: string | null };

export async function extractPalette(input: Input): Promise<PaletteEntry[]> {
  // Prefer server adapter when URL available; otherwise local fallback
  if (input.url) {
    try {
      const resp = await fetch('/api/analyze/colors', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ imageUrl: input.url }) });
      const data = await resp.json();
      if (Array.isArray(data.swatches)) return normalizeRoles(data.swatches);
    } catch {}
  }
  // Simple local fallback: sample fixed palette
  return normalizeRoles([
    { name: 'Primary', hex: '#0A84FF', role: 'primary' },
    { name: 'Secondary', hex: '#34C759', role: 'secondary' },
    { name: 'Accent', hex: '#FF9500', role: 'accent' },
    { name: 'Background', hex: '#FFFFFF', role: 'bg' },
    { name: 'Surface', hex: '#F2F2F7', role: 'surface' },
    { name: 'Text', hex: '#111111', role: 'text' }
  ]);
}

function normalizeRoles(swatches: any[]): PaletteEntry[] {
  const roles: Array<PaletteEntry['role']> = ['primary', 'secondary', 'accent', 'bg', 'surface', 'text'];
  return swatches.slice(0, 8).map((s, i) => ({
    name: String(s.name ?? `Color ${i+1}`),
    hex: String(s.hex ?? s.color ?? '#888888').toUpperCase(),
    role: (s.role ?? roles[Math.min(i, roles.length - 1)])
  }));
}

