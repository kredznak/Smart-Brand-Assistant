import { type BrandKit } from '../state/types.js';
import { moodTemplates } from '../samples/templates.js';

export async function applyBrandKitToDocument(kit: BrandKit, _opts: { targets: 'all' }): Promise<void> {
  // If running inside Adobe Express Playground with Document APIs available, attempt to apply.
  // Reference: https://developer.adobe.com/express-add-on-apis/docs/
  const anyWindow = window as any;
  const docApi = anyWindow?.express?.document;
  if (docApi?.transaction) {
    await docApi.transaction(async () => {
      // Update document-level theme variables (pseudo API)
      if (docApi.setThemeVariables) {
        const vars: Record<string, string> = {};
        for (const p of kit.palette) vars[`--sba-${p.role}`] = p.hex;
        await docApi.setThemeVariables(vars);
      }
      // Apply to text styles where available
      if (docApi.queryTextNodes && docApi.setTextStyle) {
        const textNodes = await docApi.queryTextNodes({ all: true });
        for (const node of textNodes) {
          await docApi.setTextStyle(node, { fontFamily: kit.fonts.primary.family });
        }
      }
      // Place logo in safe zone of detected template canvas
      if (kit.logo?.url && docApi.placeImage && docApi.getCanvasSize) {
        const { width, height } = await docApi.getCanvasSize();
        const tmpl = moodTemplates.find(t => t.width === width && t.height === height);
        const zone = tmpl?.safeZone ?? { x: width * 0.05, y: height * 0.05, width: width * 0.3, height: height * 0.15 };
        await docApi.placeImage(kit.logo.url, { x: zone.x, y: zone.y, width: zone.width, height: zone.height });
      }
    });
    return;
  }
  // Fallback: no-op with delay to simulate apply
  console.log('Applying Brand Kit to document (stub)', kit);
  await new Promise(r => setTimeout(r, 300));
}

