// brag adapter: composes the strip via Gemini + tone/template system + rank scaler.
import { randomUUID } from 'node:crypto';
import {
  TONES,
  TONE_NAMES,
  BASE_TONES,
  BASE_TONE_NAMES,
  TEMPLATES,
  TEMPLATE_NAMES,
  STRIP_SHAPE,
} from './tones.mjs';
import { synthesizeCues, strongCues, scoreTimeline } from './scaler.mjs';
import { chat, DEFAULT_MODEL } from './gemini.mjs';

export {
  TONES,
  TONE_NAMES,
  BASE_TONES,
  BASE_TONE_NAMES,
  TEMPLATES,
  TEMPLATE_NAMES,
  STRIP_SHAPE,
};

function parseStoryboard(text) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('Model returned no storyboard JSON');
  return JSON.parse(match[0]);
}

const SYSTEM = `You are the creative director of /brag. You storyboard short 15-25s launch and SaaS videos.
Return ONLY a JSON object, no markdown fence, shaped as:
{"scenes":[{"kind":"hook","lines":["..."],"durationSec":3},...]}
kind must follow this exact sequence: hook, reveal, highlight (repeat 1-3 times), punchline.
hook is 2-3s, reveal 2-4s, highlights 2-4s each, punchline 2-3s. Total 15-25s.
Each scene: 1-2 short on-screen lines. No emoji. No corporate filler.
Follow the selected template/tone guidelines precisely (e.g. metric callouts for case studies, step progression for tutorials, UI updates for changelogs).`;

function scenePrompt(project, toneKey) {
  const t = TONES[toneKey];
  const templateNote = t.intent ? `\nTemplate Intent: ${t.intent} (${t.category})` : '';
  return `Project name: ${project.name}
Project summary: ${project.summary || '(none given — invent a plausible angle from the name)'}
Selected preset "${toneKey}":${templateNote}
- Energy: ${t.energy}
- Voice: ${t.voice}
- Typography: ${t.typography}
- Pacing: ${t.pacing}
- Hook style: ${t.hook}
- Highlight style: ${t.highlight}
- Outro style: ${t.outro}
- Transitions: ${t.transitions}

Write the storyboard JSON now.`;
}

export async function generateStrip(input, { chatFn = chat } = {}) {
  const name = typeof input?.project?.name === 'string' ? input.project.name.trim() : '';
  if (!name || name.length > 80) {
    const err = new Error('project.name is required (max 80 chars)');
    err.status = 400;
    throw err;
  }
  const summary = typeof input?.project?.summary === 'string' ? input.project.summary.slice(0, 500) : '';

  // Determine selected tone / template:
  // Accept input.template or input.tone (template takes priority if valid)
  const candidate = input?.template || input?.tone;
  const tone = TONE_NAMES.includes(candidate) ? candidate : 'default';
  const isTemplate = TEMPLATE_NAMES.includes(tone);

  const { text, model } = await chatFn([
    { role: 'system', content: SYSTEM },
    { role: 'user', content: scenePrompt({ name, summary }, tone) },
  ]);

  const board = parseStoryboard(text);
  const scenes = (Array.isArray(board.scenes) ? board.scenes : []).map((s, i) => ({
    id: `s${i + 1}`,
    kind: STRIP_SHAPE.includes(s.kind) ? s.kind : 'highlight',
    lines: (Array.isArray(s.lines) ? s.lines : [String(s.lines ?? '')]).filter(Boolean).slice(0, 3),
    durationSec: Math.min(6, Math.max(1, Number(s.durationSec) || 3)),
  })).filter((s) => s.lines.length);

  if (scenes.length < 3) throw new Error('Model returned too few scenes');

  let t = 0;
  for (const s of scenes) {
    s.startSec = Math.round(t * 10) / 10;
    t += s.durationSec;
  }
  const boundaries = scenes.map((s) => s.startSec).slice(1); // cuts between scenes

  const frames = synthesizeCues(t, boundaries);
  const cues = strongCues(frames).map((c) => ({
    time: c.time,
    intensity: Math.round(c.intensity * 100) / 100,
    kind: 'beat',
  }));

  return {
    id: randomUUID(),
    project: { name, summary },
    tone,
    template: isTemplate ? tone : null,
    templateMetadata: isTemplate ? {
      label: TEMPLATES[tone].label,
      category: TEMPLATES[tone].category,
      intent: TEMPLATES[tone].intent,
    } : null,
    model,
    defaultModel: model === DEFAULT_MODEL,
    scenes,
    cues,
    generatedAt: new Date().toISOString(),
  };
}

export { scoreTimeline };
