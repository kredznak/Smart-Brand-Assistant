import { describe, it, expect } from 'vitest';
import { contrastRatio, ensureAA } from '../../src/accessibility/wcag.js';

describe('WCAG utils', () => {
  it('computes contrast ratio', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeGreaterThan(20);
  });
  it('ensures AA by adjusting fg', () => {
    const res = ensureAA('#777777', '#777777');
    expect(res.passes).toBe(true);
  });
});

