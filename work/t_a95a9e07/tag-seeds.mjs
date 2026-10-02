// One-time seed update for t_a95a9e07: tag every template with its tone name
// (resolved from CATEGORY_TONES) and every seed scene with its STRIP_SHAPE
// beat (hook/reveal/highlight/punchline). Deterministic; preserves key order.
import { readFileSync, writeFileSync } from "node:fs";
import { CATEGORY_TONES, STRIP_SHAPE } from "../../services/brag/tones.mjs";

const path = new URL("../../packages/catalog/src/seeds.json", import.meta.url);
const seeds = JSON.parse(readFileSync(path, "utf8"));

// Scene title -> beat on the brag skeleton (hook -> reveal -> highlight -> punchline).
const BEATS = {
  // 20s launch/updates/demos/trials/ads/websites/mobile shape
  "The opening": "hook",
  "The product action": "reveal",
  "The useful result": "highlight",
  "The next step": "punchline",
  // 48s YouTube/Education long-form shape
  "The result": "hook",
  "Before you begin": "reveal",
  "The walkthrough": "highlight",
  "Check your work": "highlight",
  "Keep learning": "punchline",
  // 30s Customer stories shape
  "The context": "hook",
  "The workflow": "reveal",
  "The evidence": "highlight",
  "Try the workflow": "punchline",
};

let beats = 0,
  tones = 0;
for (const t of seeds.templates) {
  const tone = CATEGORY_TONES[t.category];
  if (!tone) throw new Error("No tone for category " + t.category);
  if (t.tone !== tone) {
    t.tone = tone;
    tones++;
  }
  // Rebuild each template object so `tone` sits next to `style`, scenes get beat.
  for (const s of t.scenes) {
    const beat = BEATS[s.title];
    if (!beat) throw new Error(`No beat mapping for scene title "${s.title}" (${t.slug})`);
    if (s.beat !== beat) {
      s.beat = beat;
      beats++;
    }
  }
}
writeFileSync(path, JSON.stringify(seeds, null, 2) + "\n");
console.log(`templates tagged with tone: ${tones}, scenes tagged with beat: ${beats}`);
// sanity: every template now has tone + all beats valid
for (const t of seeds.templates) {
  if (!t.tone || !CATEGORY_TONES[t.category]) throw new Error("missing tone " + t.slug);
  for (const s of t.scenes) if (!STRIP_SHAPE.includes(s.beat)) throw new Error("bad beat " + t.slug);
}
console.log("all", seeds.templates.length, "templates validated");
