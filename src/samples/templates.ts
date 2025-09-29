export type TemplateDef = {
  id: string;
  name: string;
  width: number;
  height: number;
  safeZone?: { x: number; y: number; width: number; height: number };
};

export const moodTemplates: TemplateDef[] = [
  { id: 'ig-post', name: 'IG Post', width: 1080, height: 1080, safeZone: { x: 60, y: 60, width: 960, height: 960 } },
  { id: 'ig-story', name: 'IG Story', width: 1080, height: 1920, safeZone: { x: 60, y: 200, width: 960, height: 1520 } },
  { id: 'flyer', name: 'Flyer', width: 816, height: 1056, safeZone: { x: 48, y: 48, width: 720, height: 960 } },
  { id: 'email-header', name: 'Email Header', width: 1200, height: 400, safeZone: { x: 40, y: 40, width: 1120, height: 320 } },
  { id: 'presentation', name: 'Presentation', width: 1920, height: 1080, safeZone: { x: 80, y: 80, width: 1760, height: 920 } }
];

