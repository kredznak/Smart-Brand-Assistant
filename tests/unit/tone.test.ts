import { describe, it, expect } from 'vitest';
import { mapToneToStyle } from '../../src/analysis/tone/map.js';

describe('Tone mapping', () => {
  it('maps friendly to rounded and comfortable', () => {
    const t = mapToneToStyle('friendly');
    expect(t.corners).toBe('rounded');
  });
});

