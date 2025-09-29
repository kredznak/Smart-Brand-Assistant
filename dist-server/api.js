import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import fetch from 'node-fetch';
import { z } from 'zod';
const app = express();
const PORT = Number(process.env.PORT ?? 8787);
const MOCK = process.env.MOCK_MODE === '1' || process.env.MOCK_MODE === 'true';
const ALLOW_ORIGIN = process.env.ALLOW_ORIGIN ?? 'http://localhost:5173';
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: ALLOW_ORIGIN }));
app.use(express.json({ limit: '2mb' }));
app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.get('/api/hints', async (req, res) => {
    const url = String(req.query.url || '');
    if (!url)
        return res.status(400).json({ error: 'url required' });
    if (MOCK)
        return res.json({ logo: sampleLogoDataUrl, themeColor: '#0A84FF', fonts: ['Inter', 'Georgia'] });
    try {
        const html = await (await fetch(url, { redirect: 'follow' })).text();
        const logoMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) || html.match(/<link[^>]+rel=["']icon["'][^>]+href=["']([^"']+)["']/i);
        const themeMatch = html.match(/<meta[^>]+name=["']theme-color["'][^>]+content=["']([^"']+)["']/i);
        const fontMatches = Array.from(html.matchAll(/font-family:\s*([^;\"]+)/gi))
            .slice(0, 3)
            .map(m => (m?.[1] ? m[1].replace(/["']/g, '').trim() : ''))
            .filter(Boolean);
        res.json({ logo: logoMatch?.[1], themeColor: themeMatch?.[1], fonts: fontMatches });
    }
    catch (e) {
        res.status(500).json({ error: 'failed to fetch site' });
    }
});
app.post('/api/analyze/colors', async (req, res) => {
    if (MOCK)
        return res.json({ swatches: mockSwatches });
    // Adapter example: Imagga
    const { imageUrl } = z.object({ imageUrl: z.string().url().optional() }).parse(req.body);
    if (!imageUrl)
        return res.json({ swatches: mockSwatches });
    try {
        const r = await fetch(`https://api.imagga.com/v2/colors?image_url=${encodeURIComponent(imageUrl)}`, {
            headers: {
                Authorization: `Basic ${Buffer.from(process.env.IMAGGA_API_KEY ?? '').toString('base64')}`
            }
        });
        const data = await r.json();
        const swatches = (data?.result?.colors?.image_colors ?? [])
            .slice(0, 8)
            .map((c) => ({ name: c.closest_palette_color ?? 'Color', hex: `#${String(c.html_code).replace('#', '')}`, role: 'accent' }));
        res.json({ swatches });
    }
    catch (e) {
        res.json({ swatches: mockSwatches });
    }
});
app.post('/api/analyze/fonts', async (_req, res) => {
    if (MOCK)
        return res.json({ primary: { family: 'Inter', source: 'google-fonts' }, options: [{ family: 'Roboto' }, { family: 'Open Sans' }] });
    // Without WhatTheFont API, provide Google Fonts as fallback list
    try {
        const key = process.env.GOOGLE_FONTS_KEY;
        const r = await fetch(`https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=${key}`);
        const data = await r.json();
        const fam = data?.items?.[0]?.family ?? 'Roboto';
        res.json({ primary: { family: fam, source: 'google-fonts' }, options: (data.items ?? []).slice(0, 5).map((it) => ({ family: it.family, source: 'google-fonts' })) });
    }
    catch (e) {
        res.json({ primary: { family: 'Roboto', source: 'google-fonts' }, options: [{ family: 'Inter' }, { family: 'Open Sans' }] });
    }
});
app.post('/api/analyze/tone', async (_req, res) => {
    if (MOCK)
        return res.json({ tone: 'friendly' });
    res.json({ tone: 'minimal' });
});
app.get('/api/fonts/google', async (_req, res) => {
    try {
        const key = process.env.GOOGLE_FONTS_KEY;
        const r = await fetch(`https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=${key}`);
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.json(await r.json());
    }
    catch (e) {
        res.status(500).json({ error: 'Failed to fetch' });
    }
});
app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${PORT} (mock=${MOCK})`);
});
const mockSwatches = [
    { name: 'Primary', hex: '#0A84FF', role: 'primary' },
    { name: 'Secondary', hex: '#34C759', role: 'secondary' },
    { name: 'Accent', hex: '#FF9500', role: 'accent' },
    { name: 'Background', hex: '#FFFFFF', role: 'bg' },
    { name: 'Surface', hex: '#F2F2F7', role: 'surface' },
    { name: 'Text', hex: '#111111', role: 'text' }
];
const sampleLogoDataUrl = 'data:image/svg+xml;base64,' + Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect width="256" height="256" fill="#0A84FF"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="64" fill="#fff" font-family="Arial, sans-serif">SBA</text></svg>`).toString('base64');
