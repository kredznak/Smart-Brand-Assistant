import { type BrandKit } from '../../state/types.js';

export function createPreviews(kit: BrandKit): HTMLDivElement[] {
  const sizes = [
    { name: 'IG Post', w: 1080, h: 1080 },
    { name: 'IG Story', w: 1080, h: 1920 },
    { name: 'Flyer', w: 816, h: 1056 }, // US Letter @ 72dpi
    { name: 'Email Header', w: 1200, h: 400 },
    { name: 'Presentation', w: 1920, h: 1080 }
  ];
  const primary = kit.palette.find(p => p.role === 'primary')?.hex ?? '#0A84FF';
  const text = kit.palette.find(p => p.role === 'text')?.hex ?? '#111111';
  return sizes.map(size => {
    const el = document.createElement('div');
    el.className = 'sba-col';
    el.style.border = '1px solid var(--spectrum-global-color-gray-300)';
    el.style.padding = '8px';
    el.innerHTML = `<div style="width:100%; aspect-ratio:${size.w}/${size.h}; background:${primary}; color:${text}; display:flex; align-items:center; justify-content:center; font-family:${kit.fonts.primary.family}">${size.name}</div>`;
    const openBtn = document.createElement('button');
    openBtn.className = 'spectrum-Button';
    openBtn.innerHTML = '<span class="spectrum-Button-label">Open in Editor</span>';
    openBtn.addEventListener('click', () => {
      // In a real integration, call Document APIs to instantiate template
      window.alert(`${size.name} would open in the editor.`);
    });
    el.appendChild(openBtn);
    return el;
  });
}

