export function initializeThemeSync(): void {
  // In real Add-on, subscribe to Adobe UI SDK theme signals; here mirror prefers-color-scheme
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  function applyTheme(dark: boolean) {
    const html = document.documentElement;
    html.classList.toggle('spectrum--dark', dark);
    html.classList.toggle('spectrum--light', !dark);
  }
  applyTheme(mq.matches);
  mq.addEventListener('change', e => applyTheme(e.matches));
}

export async function requestDocumentApply(kit: unknown): Promise<void> {
  const correlationId = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? (crypto as any).randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return new Promise((resolve, reject) => {
    function onMessage(ev: MessageEvent) {
      const data = ev.data;
      if (!data || typeof data !== 'object') return;
      if (data.correlationId !== correlationId) return;
      if (data.type === 'SBA_APPLY_DONE') {
        window.removeEventListener('message', onMessage);
        resolve();
      } else if (data.type === 'SBA_APPLY_ERROR') {
        window.removeEventListener('message', onMessage);
        reject(new Error(String(data.error)));
      }
    }
    window.addEventListener('message', onMessage);
    window.parent.postMessage({ type: 'SBA_APPLY_BRAND_KIT', payload: kit, correlationId }, '*');
  });
}

