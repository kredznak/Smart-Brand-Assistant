export type Tone = 'friendly' | 'bold' | 'minimal' | 'playful' | 'professional';

export async function inferTone(_input: { url: string | null; handle: string | null }): Promise<Tone> {
  // Call server for tone; if fails, fallback heuristic to 'friendly'
  try {
    const r = await fetch('/api/analyze/tone', { method: 'POST' });
    const data = await r.json();
    return normalizeTone(String(data?.tone ?? 'friendly'));
  } catch {
    return 'friendly';
  }
}

export function mapToneToStyle(tone: Tone): {
  corners: 'rounded' | 'sharp';
  contrast: 'high' | 'medium' | 'low';
  spacing: 'comfortable' | 'compact' | 'loose';
} {
  switch (tone) {
    case 'bold':
      return { corners: 'sharp', contrast: 'high', spacing: 'compact' };
    case 'minimal':
      return { corners: 'sharp', contrast: 'medium', spacing: 'comfortable' };
    case 'playful':
      return { corners: 'rounded', contrast: 'medium', spacing: 'loose' };
    case 'professional':
      return { corners: 'sharp', contrast: 'high', spacing: 'comfortable' };
    case 'friendly':
    default:
      return { corners: 'rounded', contrast: 'medium', spacing: 'comfortable' };
  }
}

function normalizeTone(v: string): Tone {
  const map: Record<string, Tone> = { friendly: 'friendly', bold: 'bold', minimal: 'minimal', playful: 'playful', professional: 'professional' };
  return map[v.toLowerCase()] ?? 'friendly';
}

