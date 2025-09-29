export type Hex = string;

export type PaletteRole = 'primary' | 'secondary' | 'accent' | 'bg' | 'surface' | 'text';

export type PaletteEntry = {
  name: string;
  hex: Hex;
  role: PaletteRole;
};

export type FontRef = {
  family: string;
  category?: 'serif' | 'sans-serif' | 'display' | 'monospace' | 'handwriting';
  weights?: number[];
  source?: 'whatthefont' | 'google-fonts' | 'local';
  licenseNote?: string;
};

export type BrandKit = {
  palette: PaletteEntry[];
  fonts: { primary: FontRef; secondary?: FontRef };
  tone: string;
  logo?: { url: string; variants?: string[] };
};

export type AnalysisInput = {
  file: File | null;
  url: string | null;
  handle: string | null;
  onProgress?: (value: number) => void;
};

