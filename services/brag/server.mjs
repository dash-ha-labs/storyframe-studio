// Storyframe brag video-strip API. Standalone node:http + node:sqlite, like services/community.
// The browser never sees provider URLs or keys: Gemini is called server-side via 9Router.
import http from 'node:http';
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { generateStrip, TEMPLATE_NAMES, TONE_NAMES, TEMPLATES } from './brag.mjs';

export function openStore(dbPath) {
  mkdirSync(dirname(dbPath), { recursive: true });
  const db = new DatabaseSync(dbPath);
  db.exec(`PRAGMA journal_mode=WAL;
CREATE TABLE IF NOT EXISTS strips(id TEXT PRIMARY KEY,project TEXT NOT NULL,template TEXT,tone TEXT NOT NULL,model TEXT NOT NULL,scenes TEXT NOT NULL,cues TEXT NOT NULL,created TEXT NOT NULL);`);
  return db;
}

export function createBragServer({ dbPath = 'data/brag.sqlite', origins = [] } = {}) {
  const db = openStore(dbPath);
  const json = (res, status, data) => {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    res.end(JSON.stringify(data));
  };
  const server = http.createServer(async (req, res) => {
    const path = new URL(req.url, 'http://local').pathname;
    try {
      if (req.method === 'GET' && path === '/api/health') return json(res, 200, { ok: true });
      if (req.method === 'GET' && path === '/api/brag/templates') {
        return json(res, 200, {
          templates: TEMPLATE_NAMES.map((k) => ({ id: k, label: TEMPLATES[k].label, category: TEMPLATES[k].category, intent: TEMPLATES[k].intent })),
          tones: TONE_NAMES,
        });
      }
      if (req.method === 'GET' && /^\/api\/brag\/strips\/[a-f0-9-]{36}$/.test(path)) {
        const row = db.prepare('SELECT * FROM strips WHERE id=?').get(path.split('/').at(-1));
        if (!row) return json(res, 404, { error: 'Strip not found.' });
        return json(res, 200, { strip: { id: row.id, project: JSON.parse(row.project), template: row.template, tone: row.tone, model: row.model, scenes: JSON.parse(row.scenes), cues: JSON.parse(row.cues), generatedAt: row.created } });
      }
      if (req.method !== 'POST' || path !== '/api/strips') return json(res, 404, { error: 'Page not found.' });
      if (!origins.includes(req.headers.origin)) return json(res, 403, { error: 'Open the Storyframe studio to generate strips.' });
      if (!(req.headers['content-type'] || '').startsWith('application/json')) return json(res, 415, { error: 'Use JSON for this request.' });
      let bytes = 0, body = '';
      for await (const chunk of req) {
        bytes += chunk.length;
        if (bytes > 20000) return json(res, 413, { error: 'Keep the brief short.' });
        body += chunk;
      }
      let input;
      try { input = JSON.parse(body || '{}'); } catch { return json(res, 400, { error: 'This request could not be read.' }); }
      const strip = await generateStrip(input); // throws status 400 on bad input, 503 on provider down
      db.prepare('INSERT INTO strips VALUES(?,?,?,?,?,?,?,?)').run(strip.id, JSON.stringify(strip.project), strip.template, strip.tone, strip.model, JSON.stringify(strip.scenes), JSON.stringify(strip.cues), strip.generatedAt);
      return json(res, 201, { strip });
    } catch (error) {
      const status = error?.status || 500;
      if (status >= 500) console.error('Brag request failed:', error instanceof Error ? error.message : 'unknown');
      if (!res.headersSent) return json(res, status, { error: status >= 500 ? 'Generation failed. Please try again.' : error.message });
      res.end();
    }
  });
  server.requestTimeout = 120000; // generation can take a while
  server.on('close', () => db.close());
  return server;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const server = createBragServer({
    dbPath: process.env.BRAG_DB || 'data/brag.sqlite',
    origins: (process.env.BRAG_ORIGINS || 'http://127.0.0.1:5173,http://localhost:5173').split(','),
  });
  server.listen(Number(process.env.BRAG_PORT || 9184), process.env.HOST || '127.0.0.1', () => console.log('Storyframe brag API listening'));
  for (const signal of ['SIGTERM', 'SIGINT']) process.on(signal, () => server.close(() => process.exit(0)));
}
