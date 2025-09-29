Smart Brand Assistant (Adobe Express Add-on)

Production-ready scaffold for an Adobe Express Add-on that analyzes brand inputs (logo/URL/social), generates a Brand Kit (palette, fonts, tone), validates WCAG contrast, and applies styles to Express templates.

References:
- Add-ons Overview: https://developer.adobe.com/express/add-ons/
- UI SDK: https://developer.adobe.com/express/add-ons/docs/references/addonsdk/
- Document APIs: https://developer.adobe.com/express-add-on-apis/docs/
- Spectrum CSS: https://opensource.adobe.com/spectrum-css/

Quickstart

1. Install dependencies
```bash
pnpm i # or npm i / yarn
```

2. Configure environment
```bash
cp .env.example .env
# Edit keys as needed; MOCK_MODE=1 enables offline demo
```

3. Run
```bash
pnpm dev
```
- App: http://localhost:5173
- API: http://localhost:8787

4. Build
```bash
pnpm build && pnpm preview
```

Project Structure
```
/public
/src
  /ui
    /panels
  /sdk
  /editor
  /analysis
  /accessibility
  /state
  iframe.ts
  document.ts
/server
  api.ts
/tests
index.html
styles.css
```

Features
- Color analysis via server adapter (Imagga) with local fallback. See `/server/api.ts` and `/src/analysis/color/extract.ts`.
- Font identification via Google Fonts metadata fallback. See `/server/api.ts` and `/src/analysis/font/identify.ts`.
- Tone mapping via simple heuristic with server stub. See `/src/analysis/tone/map.ts`.
- WCAG contrast utilities: `/src/accessibility/wcag.ts`.
- Document apply bridge: parent iframe posts `SBA_APPLY_BRAND_KIT` to `/src/document.ts` which calls `/src/editor/applyBrandKit.ts`.

Security
- Secrets are only used server-side. Client calls `/api/*` proxies.
- Content Security Policy set in `index.html` (adjust for production origin).

Playground Import
Export built files and map sections:
- HTML: `index.html`
- CSS: `styles.css`
- Iframe JS: `dist/iframe.js`
- Document JS: `dist/document.js`

Scripts
- dev: start vite + API server
- build: bundle client and compile server
- test: unit tests (vitest)
- e2e: Playwright tests
- analyze:demo: run UI in mock mode

Testing
```bash
pnpm test
pnpm e2e
```

Notes
- WCAG references: https://www.w3.org/TR/WCAG22/, https://webaim.org/resources/contrastchecker/
- Color utilities: https://www.thecolorapi.com/
- For OpenCV fallback, integrate `opencv.js` and add a quantizer in `/src/analysis/color/`.

