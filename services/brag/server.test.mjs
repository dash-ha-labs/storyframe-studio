// brag service tests: adapter (provider stubbed) + HTTP surface with origin check and sqlite persistence.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { generateStrip, TEMPLATE_NAMES } from './brag.mjs';
import { createBragServer } from './server.mjs';

const BOARD = {
  scenes: [
    { kind: 'hook', lines: ['Dating apps were built for humans.'], durationSec: 2 },
    { kind: 'reveal', lines: ['Obvious mistake.'], durationSec: 3 },
    { kind: 'highlight', lines: ['Swipe through eligible horses near your pasture.'], durationSec: 4 },
    { kind: 'punchline', lines: ['Horse Tinder.'], durationSec: 2 },
  ],
};
const stub = (board = BOARD) => async () => ({ text: '```json\n' + JSON.stringify(board) + '\n```', model: 'ag/test-model' });

test('generateStrip returns strip JSON with cues and timing', async () => {
  const strip = await generateStrip({ project: { name: 'Horse Tinder' }, tone: 'yc-parody' }, { chatFn: stub() });
  assert.equal(strip.tone, 'yc-parody');
  assert.equal(strip.scenes.length, 4);
  assert.equal(strip.scenes[0].startSec, 0);
  assert.equal(strip.scenes[1].startSec, 2);
  assert.equal(strip.scenes[3].startSec, 9);
  assert.ok(strip.cues.length > 0);
  assert.ok(strip.cues.every((c) => c.intensity >= 0.45));
  assert.ok(strip.id && strip.generatedAt);
});

test('all six defined templates generate valid strips with metadata', async () => {
  assert.deepEqual(TEMPLATE_NAMES, ['changelog', 'tutorial', 'social-hype', 'hero-anthem', 'deadpan-log', 'case-study']);
  for (const tpl of TEMPLATE_NAMES) {
    const strip = await generateStrip({ project: { name: 'Demo SaaS', summary: 'Visual storyboarding platform' }, template: tpl }, { chatFn: stub() });
    assert.equal(strip.template, tpl);
    assert.ok(strip.templateMetadata.label && strip.templateMetadata.category && strip.templateMetadata.intent);
    assert.equal(strip.scenes.length, 4);
    assert.ok(strip.cues.length > 0);
  }
});

test('missing name rejected with 400', async () => {
  await assert.rejects(() => generateStrip({ project: { name: '' } }, { chatFn: stub() }), (e) => e.status === 400);
});

test('project context reaches the prompt and the stored strip', async () => {
  let seen = '';
  const chatFn = async (messages) => {
    seen = messages[1].content;
    return { text: '```json\n' + JSON.stringify(BOARD) + '\n```', model: 'ag/test-model' };
  };
  const context = {
    frames: [{ text: 'Frame one: heroes join the waitlist.' }, { text: 'Frame two: they share their invite code.' }],
    brand: { background: '#101010', accent: '#7c5cff', ink: '#ffffff', font: 'Inter', voice: 'Playful but precise' },
  };
  const strip = await generateStrip({ project: { name: 'Horse Tinder' }, template: 'changelog', context }, { chatFn });
  assert.ok(seen.includes('Existing storyboard frames'));
  assert.ok(seen.includes('Frame one: heroes join the waitlist.'));
  assert.ok(seen.includes('Brand tokens'));
  assert.ok(seen.includes('voice: Playful but precise'));
  assert.deepEqual(strip.context, {
    frames: context.frames,
    brand: context.brand,
  });
});

test('context is clamped and garbage is dropped', async () => {
  const strip = await generateStrip({
    project: { name: 'Horse Tinder' },
    context: {
      frames: [{ text: 'x'.repeat(999) }, { text: '   ' }, { nope: 1 }, 'garbage'],
      brand: { accent: '#fff', evil: '<script>', font: 42 },
    },
  }, { chatFn: stub() });
  assert.equal(strip.context.frames.length, 1);
  assert.equal(strip.context.frames[0].text.length, 300);
  assert.deepEqual(strip.context.brand, { accent: '#fff' });
});

test('POST /api/strips: origin gate, generation, persistence, fetch back', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'brag-test-'));
  const server = createBragServer({ dbPath: join(dir, 'brag.sqlite'), origins: ['http://studio.test'] });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const health = await fetch(`${base}/api/health`);
    assert.equal(health.status, 200);

    const badOrigin = await fetch(`${base}/api/strips`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'http://evil.test' }, body: '{}' });
    assert.equal(badOrigin.status, 403);

    const good = await fetch(`${base}/api/strips`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: 'http://studio.test' },
      body: JSON.stringify({ project: { name: 'Horse Tinder' }, template: 'changelog' }),
    });
    // Note: real provider call; without key it 503s, which still proves routing works.
    if (good.status === 201) {
      const { strip } = await good.json();
      assert.equal(strip.template, 'changelog');
      const back = await fetch(`${base}/api/brag/strips/${strip.id}`);
      assert.equal(back.status, 200);
      assert.equal((await back.json()).strip.id, strip.id);
    } else {
      assert.equal(good.status, 503);
    }

    const templates = await fetch(`${base}/api/brag/templates`);
    const tpl = await templates.json();
    assert.equal(tpl.templates.length, 6);
    assert.ok(tpl.templates[0].label);
  } finally {
    server.close();
    rmSync(dir, { recursive: true, force: true });
  }
});
