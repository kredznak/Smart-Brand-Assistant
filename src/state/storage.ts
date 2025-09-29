import { type BrandKit } from './types.js';

const KEY = 'sba.brandkit';

export function saveBrandKitLocal(kit: BrandKit): void {
  try { localStorage.setItem(KEY, JSON.stringify(kit)); } catch {}
}

export function loadBrandKitLocal(): BrandKit | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as BrandKit;
  } catch { return null; }
}

export async function saveBrandKitServer(kit: BrandKit): Promise<void> {
  try {
    await fetch('/api/brandkit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(kit) });
  } catch {}
}

export async function loadBrandKitServer(): Promise<BrandKit | null> {
  try {
    const r = await fetch('/api/brandkit');
    if (!r.ok) return null;
    return (await r.json()) as BrandKit;
  } catch { return null; }
}

