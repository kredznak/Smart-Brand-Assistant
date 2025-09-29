import { describe, it, expect } from 'vitest';
import { extractPalette } from '../../src/analysis/color/extract.js';

describe('Color extraction', () => {
  it('returns at least 5 swatches in mock/local mode', async () => {
    const res = await extractPalette({ imageDataUrl: null, url: null });
    expect(res.length).toBeGreaterThanOrEqual(5);
  });
});

