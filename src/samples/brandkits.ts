import { type BrandKit } from '../state/types.js';

export const sampleBrandKitBefore: BrandKit = {
  palette: [
    { name: 'Primary', hex: '#0A84FF', role: 'primary' },
    { name: 'Secondary', hex: '#34C759', role: 'secondary' },
    { name: 'Accent', hex: '#FF9500', role: 'accent' },
    { name: 'Background', hex: '#FFFFFF', role: 'bg' },
    { name: 'Surface', hex: '#F2F2F7', role: 'surface' },
    { name: 'Text', hex: '#111111', role: 'text' }
  ],
  fonts: { primary: { family: 'Inter', source: 'google-fonts', weights: [400, 600] } },
  tone: 'friendly',
  logo: { url: '' }
};

export const sampleBrandKitAfter: BrandKit = {
  ...sampleBrandKitBefore,
  palette: [
    { name: 'Primary', hex: '#0055CC', role: 'primary' },
    { name: 'Secondary', hex: '#00A86B', role: 'secondary' },
    { name: 'Accent', hex: '#FF6A00', role: 'accent' },
    { name: 'Background', hex: '#FFFFFF', role: 'bg' },
    { name: 'Surface', hex: '#F7F7FA', role: 'surface' },
    { name: 'Text', hex: '#0B0B0B', role: 'text' }
  ]
};

