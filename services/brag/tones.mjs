// Tone system restored from the original brag source (free-video-strips/src/tones.js,
// MIT). Preserves upstream's creative law: every strip follows the STRIP_SHAPE
// skeleton (hook -> reveal -> highlight x1-3 -> punchline), and every plan is
// steered by explicit tone directives (energy/voice/typography/pacing and the
// hook/highlight/outro/transitions styles) instead of a bare scene map.
// See research/template-degradation.md for why these were restored.
export const STRIP_SHAPE = ["hook", "reveal", "highlight", "punchline"];

// Strip-shape law, phrased for the planner's SYSTEM prompt. Ported from the
// upstream brag SYSTEM prompt (free-video-strips/src/brag.js): hook 2-3s,
// reveal 2-4s, highlights 2-4s each (repeat 1-3), punchline 2-3s, 15-25s total
// for launch-shaped strips. Long-form templates (YouTube/Education) keep the
// same skeleton with proportionally longer beats.
export const STRIP_SHAPE_LAW = `Compose the strip on the brag skeleton: hook -> reveal -> highlight (repeat 1-3 times as the material earns) -> punchline. Hook is 2-3s, reveal 2-4s, highlights 2-4s each, punchline 2-3s; launch-shaped strips hold 15-25s total. Each scene carries one idea in finished copy.`;

// Directive fields mirrored from upstream scenePrompt() output.
export const TONE_DIRECTIVE_FIELDS = [
  "energy",
  "voice",
  "typography",
  "pacing",
  "hook",
  "highlight",
  "outro",
  "transitions",
];

// Base tones ported verbatim from upstream BASE_TONES + TEMPLATES
// (free-video-strips/src/tones.js). Storyframe maps each template category to
// one of these; per-template overrides live in seeds.json `tone`.
export const BASE_TONES = {
  default: {
    name: "default",
    category: "General",
    energy:
      "Playful, clean, postable. The product gets to be funny on its own terms.",
    voice: "First person plural. Warm. Direct. No corporate language.",
    typography: "Mixed case. Comfortable weight. Let words breathe.",
    pacing: "4-5 scenes, each 3-5 seconds. Comfortable rhythm.",
    hook: "A simple question or observation that sets up the reveal.",
    highlight: "Short punchy phrases. One idea per scene.",
    outro: "The product name, then a tagline. Light punchline.",
    transitions: "Crossfade or clean slide.",
  },
  polished: {
    name: "polished",
    category: "Product",
    energy: "Confident, crisp, professional. Premium feel, zero fluff.",
    voice: "Declarative product-speak, short lines.",
    typography: "Tight tracking, high contrast, disciplined scale.",
    pacing: "4-6 scenes, 2-4 seconds each, deliberate rhythm.",
    hook: "A bold claim or striking stat that demands the reveal.",
    highlight: "One sharp benefit per scene, no hedging.",
    outro: "Product name over a clean tagline.",
    transitions: "Smooth wipes, subtle motion.",
  },
  "app-store": {
    name: "app-store",
    category: "App",
    energy: "Bright, friendly, feature-forward product tour.",
    voice: "Benefit-first sentences, welcoming.",
    typography: "Rounded friendly type, clear hierarchy.",
    pacing: "4-5 scenes, 2-4 seconds each.",
    hook: "The everyday moment the product fixes.",
    highlight: "One named feature per scene.",
    outro: "Product name + download nudge.",
    transitions: "Playful springs and bounces.",
  },
  "yc-parody": {
    name: "yc-parody",
    category: "Satire",
    energy: "Ruthless startup-optimizer parody, played straight.",
    voice: "Imperative hustle cliches stacked until funny.",
    typography: "ALL CAPS. Significant scale.",
    pacing: "3-5 scenes, 2-3 seconds each, relentless.",
    hook: "An absurd founder cliche delivered dead serious.",
    highlight: "Growth-hack jargon, one cliche per scene.",
    outro: "Product name + parodied mission statement.",
    transitions: "Flash/zoom cuts.",
  },
  chaotic: {
    name: "chaotic",
    category: "Social",
    energy: "Maximal energy, things flying, controlled chaos.",
    voice: "Shouty fragments, escalating.",
    typography: "Wild scale swings, rotated text, clashing weights.",
    pacing: "5-7 scenes, 1-3 seconds each.",
    hook: "Mid-action start, no context given.",
    highlight: "Escalating claims, each bigger than the last.",
    outro: "Hard cut to product name.",
    transitions: "Whip pans, glitch snaps.",
  },
  deadpan: {
    name: "deadpan",
    category: "Satire",
    energy: "Deadpan startup launch, played straight.",
    voice: "Flat declarative lines. No exclamation, ever.",
    typography: "Even weight, generous space, almost bureaucratic.",
    pacing: "3-4 scenes, 4-5 seconds each, slow.",
    hook: "A dry understatement of the problem.",
    highlight: "Plain statements of absurd facts.",
    outro: "Name, then one flat tagline.",
    transitions: "Slow fades, no flourish.",
  },
  cinematic: {
    name: "cinematic",
    category: "Brand",
    energy: "Trailer-epic, weighty, dramatic pauses.",
    voice: "Sparse portentous lines.",
    typography: "Wide tracking, small caps feel, letterboxed layout.",
    pacing: "4-6 scenes, 3-5 seconds each with pauses.",
    hook: "A quiet line that implies scale.",
    highlight: "Vistas of the product, few words.",
    outro: "Slow title reveal.",
    transitions: "Slow pushes, fades to black.",
  },
  changelog: {
    name: "changelog",
    category: "Blog / Updates",
    intent: "Highlight new features and workflow improvements.",
    energy:
      "Punchy, UI-focused, direct. The product update speaks for itself.",
    voice:
      "Direct, feature-focused, release notes style. Crisp announcements without corporate buzzwords.",
    typography:
      "Clean sans-serif, monospaced release tags and UI labels, disciplined hierarchy.",
    pacing: "Snappy zoom cuts to UI elements. 2-3s per scene.",
    hook: "A clear announcement of what just shipped or changed.",
    highlight:
      "One major UI feature or workflow improvement per scene with snappy detail.",
    outro: "Version number or release tag, product name, and update link.",
    transitions: "Snappy zoom cuts to UI elements and rapid slide-ins.",
  },
  tutorial: {
    name: "tutorial",
    category: "Guides / Resource Hub",
    intent: "Step-by-step education and storyboard progression.",
    energy:
      "Clear, instructional, patient. Breaks complex steps into achievable milestones.",
    voice:
      'Second person ("you"), patient guidance, actionable walkthrough commands.',
    typography:
      "Readable sans, numbered step markers (Step 1, Step 2), persistent annotations.",
    pacing: "Slow fades, persistent annotations. 4-5s per scene.",
    hook: "A clear statement of the practical skill or outcome you will learn.",
    highlight:
      "Step-by-step storyboard progression: one concrete action and visible result per scene.",
    outro: "Completed outcome recap and next lesson or docs prompt.",
    transitions: "Slow fades and sequential step wipes.",
  },
  "social-hype": {
    name: "social-hype",
    category: "Gallery / Social",
    intent: "High-engagement visual showcases.",
    energy:
      "Chaotic, high energy, loud. Built for scroll-stopping feed engagement.",
    voice: "Bold, viral, punchy fragments, high impact, confident claims.",
    typography:
      "Large typography, high contrast, kinetic styling, aggressive scale.",
    pacing: "Beat-synced jump cuts. 1-2s per scene.",
    hook:
      "A scroll-stopping visual hook or provocative question that demands attention.",
    highlight: "Rapid-fire visual showcases, beat drops, and feature bursts.",
    outro: "Hard punchline, urgent call-to-action, handle or launch link.",
    transitions: "Beat-synced jump cuts, flash cuts, and glitch snaps.",
  },
  "hero-anthem": {
    name: "hero-anthem",
    category: "Templates / Features",
    intent: "Value prop, hero brand building.",
    energy:
      "Cinematic, premium, aspirational. Blockbuster scale for flagship launches.",
    voice:
      "Aspirational, visionary, grand narrative. High conviction product philosophy.",
    typography:
      "Wide tracking, elegant modern display type, cinematic letterboxing.",
    pacing: "Smooth dolly-ins, high contrast, dramatic reveals. 3-5s per scene.",
    hook: "A sweeping statement about the industry problem or visionary ambition.",
    highlight:
      "Core superpowers and value propositions revealed with dramatic weight.",
    outro: "Inspiring brand tagline and cinematic title reveal.",
    transitions: "Smooth dolly-ins, slow pushes, and dramatic crossfades.",
  },
  "deadpan-log": {
    name: "deadpan-log",
    category: "Status Page",
    intent: "Incident logs, system status.",
    energy: "Factual, serious, plain. Pure signal, zero marketing ornamentation.",
    voice:
      "Monotone, incident report, objective facts only. No apologies, no exclamation.",
    typography: "Monospace / terminal font, minimal contrast, tabular alignment.",
    pacing:
      "Hard cuts, minimal motion, terminal/mono typography. 3-4s per scene.",
    hook: "A dry, factual system status statement or incident timestamp.",
    highlight: "Timestamped resolution steps, measured uptime numbers, verified facts.",
    outro: "Current status indicator and status page URL.",
    transitions: "Instant hard cuts with zero animation flair.",
  },
  "case-study": {
    name: "case-study",
    category: "Customer Stories",
    intent:
      "Customer success stories featuring metric callouts and testimonials.",
    energy:
      "Credible, metric-driven, narrative. Authentic customer proof that earns trust.",
    voice:
      "Customer testimonial narrative, verified ROI figures, genuine before/after perspective.",
    typography:
      "Editorial typography with highlighted metric callouts (+300%, 10x faster) and quote marks.",
    pacing:
      "Moderate, focusing on before/after states and text callouts of ROI. 3-4s per scene.",
    hook: "The customer challenge and baseline friction before using the product.",
    highlight:
      "The specific workflow adopted and quantified ROI metric callouts.",
    outro: "Direct customer endorsement quote, company name, and trial CTA.",
    transitions:
      "Clean before-and-after wipes and subtle metric pop transitions.",
  },
};

// Category -> tone mapping. Storyframe's 10 categories collapse to the closest
// upstream tone so every catalog template keeps a reviewed creative direction.
export const CATEGORY_TONES = {
  Launches: "default",
  "Product updates": "changelog",
  "Feature demos": "polished",
  "Free trials": "app-store",
  YouTube: "tutorial",
  "Social ads": "social-hype",
  Websites: "hero-anthem",
  "Mobile apps": "app-store",
  Education: "tutorial",
  "Customer stories": "case-study",
};

export const TONES = { ...BASE_TONES };
export const TONE_NAMES = Object.keys(TONES);

// Resolve the tone directives for a catalog template. A template may name its
// tone explicitly (seeds.json `tone`); otherwise the category tone applies.
// Unknown tone names fall back to the category tone, then to default.
export function toneForTemplate(template) {
  const categoryName = CATEGORY_TONES[template?.category];
  const byCategory = categoryName && TONES[categoryName];
  const named =
    template?.tone && TONES[template.tone] ? TONES[template.tone] : null;
  const tone = named || byCategory || TONES.default;
  return {
    name: tone.name,
    category: tone.category,
    ...(tone.intent ? { intent: tone.intent } : {}),
    ...Object.fromEntries(TONE_DIRECTIVE_FIELDS.map((f) => [f, tone[f]])),
  };
}

// Render the directives the way upstream scenePrompt() did, labeled.
export function toneDirectiveBlock(tone) {
  const note = tone.intent
    ? `Template Intent: ${tone.intent} (${tone.category})\n`
    : "";
  return `${note}Energy: ${tone.energy}\nVoice: ${tone.voice}\nTypography: ${tone.typography}\nPacing: ${tone.pacing}\nHook style: ${tone.hook}\nHighlight style: ${tone.highlight}\nOutro style: ${tone.outro}\nTransitions: ${tone.transitions}`;
}
