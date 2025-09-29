import { applyBrandKitToDocument } from './editor/applyBrandKit.js';
import { type BrandKit } from './state/types.js';

// Document-side message handling (runs in editor context in Playground)
window.addEventListener('message', async (ev: MessageEvent) => {
  const data = ev.data;
  if (!data || typeof data !== 'object') return;
  if (data.type === 'SBA_APPLY_BRAND_KIT') {
    const kit: BrandKit = data.payload;
    try {
      await applyBrandKitToDocument(kit, { targets: 'all' });
      window.parent.postMessage({ type: 'SBA_APPLY_DONE', correlationId: data.correlationId }, '*');
    } catch (e) {
      console.error(e);
      window.parent.postMessage({ type: 'SBA_APPLY_ERROR', error: (e as Error).message, correlationId: data.correlationId }, '*');
    }
  }
});

