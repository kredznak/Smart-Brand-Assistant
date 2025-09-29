import { initializeThemeSync, requestDocumentApply } from './sdk/ui.js';
import { analyzeBrandInputs } from './ui/app.js';
import { type BrandKit } from './state/types.js';

initializeThemeSync();

const appEl = document.getElementById('app')!;
appEl.setAttribute('aria-busy', 'true');

// Build shell
appEl.innerHTML = `
  <div class="sba-shell">
    <aside class="sba-left" aria-label="Input panel">
      <div class="sba-col">
        <label class="spectrum-FieldLabel">Logo image
          <input id="logoFile" class="spectrum-Textfield" type="file" accept="image/*" />
        </label>
        <label class="spectrum-FieldLabel">Website URL
          <input id="siteUrl" class="spectrum-Textfield" type="url" placeholder="https://example.com" />
        </label>
        <label class="spectrum-FieldLabel">Social handle
          <input id="social" class="spectrum-Textfield" type="text" placeholder="@brand" />
        </label>
        <button id="analyzeBtn" class="spectrum-Button spectrum-Button--cta"><span class="spectrum-Button-label">Analyze Brand</span></button>
        <div id="status" role="status" aria-live="polite"></div>
        <progress id="progress" class="spectrum-ProgressBar" max="100" value="0" aria-label="Analysis progress"></progress>
        <button id="saveApply" class="spectrum-Button" disabled><span class="spectrum-Button-label">One-click Brand Kit</span></button>
      </div>
    </aside>
    <main id="main" class="sba-right" tabindex="-1">
      <div class="spectrum-Tabs" role="tablist" aria-label="Results tabs">
        <button class="spectrum-Tabs-item is-selected" role="tab" aria-selected="true" data-tab="kit">Brand Kit</button>
        <button class="spectrum-Tabs-item" role="tab" aria-selected="false" data-tab="preview">Mood Preview</button>
        <button class="spectrum-Tabs-item" role="tab" aria-selected="false" data-tab="templates">Templates</button>
        <button class="spectrum-Tabs-item" role="tab" aria-selected="false" data-tab="a11y">Accessibility</button>
      </div>
      <section id="panel-kit" class="tab-panels"></section>
      <section id="panel-preview" class="tab-panels" hidden></section>
      <section id="panel-templates" class="tab-panels" hidden></section>
      <section id="panel-a11y" class="tab-panels" hidden></section>
    </main>
  </div>
`;

appEl.setAttribute('aria-busy', 'false');

// Tabs
const tabs = Array.from(document.querySelectorAll('.spectrum-Tabs-item')) as HTMLButtonElement[];
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => { t.classList.remove('is-selected'); t.setAttribute('aria-selected', 'false'); });
    tab.classList.add('is-selected');
    tab.setAttribute('aria-selected', 'true');
    const selected = tab.dataset.tab;
    document.querySelectorAll('.tab-panels').forEach(p => (p as HTMLElement).hidden = true);
    document.getElementById(`panel-${selected}`)!.hidden = false;
    (document.getElementById('main') as HTMLElement).focus();
  });
});

// Analyze
const analyzeBtn = document.getElementById('analyzeBtn') as HTMLButtonElement;
const saveApplyBtn = document.getElementById('saveApply') as HTMLButtonElement;
const statusEl = document.getElementById('status')!;
const progressEl = document.getElementById('progress') as HTMLProgressElement;

let currentKit: BrandKit | null = null;

analyzeBtn.addEventListener('click', async () => {
  analyzeBtn.disabled = true;
  statusEl.textContent = 'Analyzing…';
  progressEl.value = 5;
  try {
    const file = (document.getElementById('logoFile') as HTMLInputElement).files?.[0] ?? null;
    const url = (document.getElementById('siteUrl') as HTMLInputElement).value || null;
    const handle = (document.getElementById('social') as HTMLInputElement).value || null;
    const { kit, renders } = await analyzeBrandInputs({ file, url, handle, onProgress: v => progressEl.value = v });
    currentKit = kit;
    saveApplyBtn.disabled = false;
    statusEl.textContent = 'Analysis complete.';
    renderResults(kit, renders);
    document.querySelector('[data-tab="kit"]')?.dispatchEvent(new Event('click'));
  } catch (e) {
    console.error(e);
    statusEl.textContent = 'Analysis failed. Check inputs or try mock mode.';
  } finally {
    analyzeBtn.disabled = false;
    progressEl.value = 0;
  }
});

saveApplyBtn.addEventListener('click', async () => {
  if (!currentKit) return;
  statusEl.textContent = 'Applying Brand Kit to document…';
  try {
    await requestDocumentApply(currentKit);
    statusEl.textContent = 'Brand Kit applied.';
  } catch (e) {
    console.error(e);
    statusEl.textContent = 'Failed to apply in the editor.';
  }
});

function renderResults(kit: BrandKit, renders: { previews: HTMLDivElement[]; a11y: HTMLElement }) {
  const kitPanel = document.getElementById('panel-kit')!;
  kitPanel.innerHTML = '';
  const palette = document.createElement('div');
  palette.className = 'palette-grid';
  for (const sw of kit.palette) {
    const chip = document.createElement('div');
    chip.className = 'swatch';
    chip.style.background = sw.hex;
    chip.title = `${sw.role}: ${sw.hex}`;
    palette.appendChild(chip);
  }
  const type = document.createElement('div');
  type.innerHTML = `<div>Primary font: <strong>${kit.fonts.primary.family}</strong></div>` +
                   (kit.fonts.secondary ? `<div>Secondary font: <strong>${kit.fonts.secondary.family}</strong></div>` : '') +
                   `<div>Tone: ${kit.tone}</div>`;
  kitPanel.append(palette, type);

  const previewPanel = document.getElementById('panel-preview')!;
  previewPanel.innerHTML = '';
  renders.previews.forEach(p => previewPanel.appendChild(p));

  const a11yPanel = document.getElementById('panel-a11y')!;
  a11yPanel.innerHTML = '';
  a11yPanel.appendChild(renders.a11y);
}

