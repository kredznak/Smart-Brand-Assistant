import { type Hex } from '../state/types.js';

export function contrastRatio(hexA: Hex, hexB: Hex): number {
  const L1 = relativeLuminance(hexToRgb(hexA));
  const L2 = relativeLuminance(hexToRgb(hexB));
  const [lighter, darker] = L1 > L2 ? [L1, L2] : [L2, L1];
  return (lighter + 0.05) / (darker + 0.05);
}

export function ensureAA(fg: Hex, bg: Hex): { fg: Hex; bg: Hex; passes: boolean } {
  const ratio = contrastRatio(fg, bg);
  if (ratio >= 4.5) return { fg, bg, passes: true };
  // Simple adjustment: tweak lightness of fg towards max contrast
  const fgRgb = hexToRgb(fg);
  const bgRgb = hexToRgb(bg);
  const fgIsLight = relativeLuminance(fgRgb) > relativeLuminance(bgRgb);
  const tryPath = (dir: 'lighten' | 'darken') => {
    let tmp = fgRgb;
    for (let i = 0; i < 30 && contrastRatio(rgbToHex(tmp), bg) < 4.5; i++) {
      tmp = dir === 'darken' ? darken(tmp, 0.06) : lighten(tmp, 0.06);
    }
    return { color: rgbToHex(tmp), ratio: contrastRatio(rgbToHex(tmp), bg) };
  };
  const primaryPath = tryPath(fgIsLight ? 'darken' : 'lighten');
  const altPath = tryPath(fgIsLight ? 'lighten' : 'darken');
  const best = primaryPath.ratio >= altPath.ratio ? primaryPath : altPath;
  return { fg: best.color, bg, passes: best.ratio >= 4.5 };
}

export function hexToRgb(hex: Hex): { r: number; g: number; b: number } {
  const h = hex.replace('#', '');
  const v = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  const num = parseInt(v, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

export function rgbToHex(rgb: { r: number; g: number; b: number }): Hex {
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(clamp(rgb.r))}${toHex(clamp(rgb.g))}${toHex(clamp(rgb.b))}`.toUpperCase();
}

function clamp(n: number): number { return Math.max(0, Math.min(255, Math.round(n))); }

function relativeLuminance({ r, g, b }: { r: number; g: number; b: number }): number {
  const srgb = [r, g, b].map(v => v / 255).map(v => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  const [R, G, B] = srgb;
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function lighten(rgb: { r: number; g: number; b: number }, amt: number) {
  return { r: rgb.r + 255 * amt, g: rgb.g + 255 * amt, b: rgb.b + 255 * amt };
}

function darken(rgb: { r: number; g: number; b: number }, amt: number) {
  return { r: rgb.r - 255 * amt, g: rgb.g - 255 * amt, b: rgb.b - 255 * amt };
}

