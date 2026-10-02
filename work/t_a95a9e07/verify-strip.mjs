// t_a95a9e07 evidence: generate a strip through the corrected TEMPLATE path
// (offline stub provider — no live router call), apply it to a real Project
// via applyGeneration, and emit the composition HTML for visual verification.
// Also dumps the exact model payload (tone directives + beats) to JSON.
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";
import { normalizeRequest, planVideo } from "../../services/brag/planner.mjs";
import { templateDefaults } from "../../services/brag/catalog.mjs";
import { applyGeneration } from "../../packages/core/src/generation.ts";
import { makeVideo } from "../../packages/core/src/suite-model.ts";
import { compositionDocument } from "../../packages/composition/src/index.mjs";

const seeds = JSON.parse(
  readFileSync(new URL("../../packages/catalog/src/seeds.json", import.meta.url), "utf8"),
);
const template = templateDefaults(
  seeds.templates.find((t) => t.slug === "changelog-highlight"),
);
// A product with real evidence for the strip to ground itself in.
const owner = {
  id: "proof",
  folderId: "f",
  name: "Kurutu",
  description: "Grocery list app that remembers what you buy and refills the list for you.",
  brand: {
    background: "#f7f3ea", accent: "#d5e04b", ink: "#1c2829",
    font: "Bricolage Grotesque", voice: "Warm, direct, no corporate filler.",
  },
  apps: [{ name: "Kurutu", platform: "web", url: "kurutu.example" }],
  sources: [], media: [], creations: [], metrics: [],
};
const context = {
  product: { name: owner.name, description: owner.description, apps: owner.apps },
  brand: owner.brand,
  video: {
    format: "16:9",
    scenes: [{ id: "a", title: "Opening", caption: "Original", seconds: 4, assetId: "shot", locked: false }],
  },
  media: [{ id: "shot", name: "List auto-refill screenshot", type: "image", duration: 4 }],
  storyboard: [{ text: "Show the remembered list", seconds: 4 }],
};
// Offline "model" reply: a strip that follows the STRIP_SHAPE law under the
// changelog tone (what the corrected planner instructs Gemini to produce).
const stripPlan = {
  title: "Your grocery list just shipped itself",
  angle: "The update that refills the list from what you already buy",
  shareCopy: "Stop rewriting your grocery list every week.",
  scenes: [
    { title: "Hook", caption: "You rewrite the same list every week.", seconds: 2.4, assetId: null, layout: "title", motion: "fade" },
    { title: "Reveal", caption: "Kurutu now refills it from what you buy.", seconds: 3, assetId: "shot", layout: "product", motion: "slide" },
    { title: "Highlight", caption: "One list. Every aisle you actually shop.", seconds: 2.6, assetId: "shot", layout: "product", motion: "zoom" },
    { title: "Punchline", caption: "Kurutu. Evolve your grocery run.", seconds: 2.2, assetId: null, layout: "title", motion: "none" },
  ],
};
const reply = async () => ({ text: JSON.stringify(stripPlan), model: "offline-fixture" });

const request = normalizeRequest(
  { prompt: "Turn this release note into a changelog strip", scope: "new", context },
  template,
);
let messages;
const result = await planVideo(request, {
  chatFn: async (m) => { messages = m; return reply(); },
});

// Apply the plan to a canonical Project (the studio path).
const video = makeVideo(
  { ...owner, media: [{ id: "shot", name: "List auto-refill screenshot", type: "image", src: "/demo/template-1.svg", duration: 4, origin: "real-ui" }] },
  stripPlan.title,
  "16:9",
);
const project = applyGeneration(video, {
  id: "proof-job",
  templateSlug: request.templateSlug,
  templateRevision: request.templateRevision,
  plan: result.plan,
}, "new", []);

const outDir = new URL("./", import.meta.url);
mkdirSync(outDir, { recursive: true });
// Local assets so the composition renders offline (safeUrl requires assets/ or /).
const assetDir = new URL("./assets/", import.meta.url);
mkdirSync(assetDir, { recursive: true });
copyFileSync(
  new URL("../../apps/web/public/demo/template-1.svg", import.meta.url),
  new URL("./assets/shot.svg", import.meta.url),
);
copyFileSync(
  new URL("../../node_modules/gsap/dist/gsap.min.js", import.meta.url),
  new URL("./assets/gsap.min.js", import.meta.url),
);
copyFileSync(
  new URL("../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2", import.meta.url),
  new URL("./assets/inter.woff2", import.meta.url),
);
// Composition HTML with inlined preview wiring; the demo asset is copied next to it.
const html = compositionDocument(project, {
  mediaUrls: { shot: "assets/shot.svg" },
  gsapUrl: "assets/gsap.min.js",
  fontUrl: "assets/inter.woff2",
  preview: true,
});
writeFileSync(new URL("./strip-proof.html", import.meta.url), html);
writeFileSync(
  new URL("./template-path-payload.json", import.meta.url),
  JSON.stringify({
    systemPrompt: messages[0].content,
    modelPayload: JSON.parse(messages[1].content),
    plan: result.plan,
    cues: result.cues,
    appliedProject: { title: project.title, scenes: project.scenes.map((s) => ({ title: s.title, caption: s.caption, seconds: s.duration / 30, layout: s.layout, motion: s.motion, kind: s.kind })) },
  }, null, 2),
);
console.log("payload + composition written to work/t_a95a9e07/");
console.log("template tone in payload:", JSON.parse(messages[1].content).template.tone.name);
console.log("plan beats:", result.plan.scenes.map((s) => s.title).join(" -> "));
console.log("cues:", result.cues.length, "strong beats; total", result.plan.scenes.reduce((n, s) => n + s.seconds, 0).toFixed(1) + "s");
