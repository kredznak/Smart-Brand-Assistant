import { type BrandKit } from '../../state/types.js';
import { contrastRatio, ensureAA } from '../../accessibility/wcag.js';

export function buildA11yPanel(kit: BrandKit): HTMLElement {
  const container = document.createElement('div');
  container.className = 'sba-col';
  const table = document.createElement('table');
  table.className = 'spectrum-Table';
  const header = document.createElement('tr');
  header.innerHTML = '<th>Foreground</th><th>Background</th><th>Ratio</th><th>AA</th><th>AAA</th><th>Suggestion</th>';
  table.appendChild(header);

  const textColors = kit.palette.filter(p => ['text', 'primary', 'secondary'].includes(p.role));
  const bgColors = kit.palette.filter(p => ['bg', 'surface', 'primary', 'secondary'].includes(p.role));
  for (const fg of textColors) {
    for (const bg of bgColors) {
      const ratio = contrastRatio(fg.hex, bg.hex);
      const tr = document.createElement('tr');
      const aa = ratio >= 4.5;
      const aaa = ratio >= 7;
      let suggestion = '';
      if (!aa) {
        const adj = ensureAA(fg.hex, bg.hex);
        suggestion = `${adj.fg} / ${adj.bg}`;
      }
      tr.innerHTML = `<td><span class="swatch" style="background:${fg.hex}"></span> ${fg.hex}</td><td><span class="swatch" style="background:${bg.hex}"></span> ${bg.hex}</td><td>${ratio.toFixed(2)}</td><td>${aa ? 'Pass' : 'Fail'}</td><td>${aaa ? 'Pass' : '—'}</td><td>${suggestion}</td>`;
      table.appendChild(tr);
    }
  }
  container.appendChild(table);
  return container;
}

