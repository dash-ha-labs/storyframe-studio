// Evidence dump: compare the planner's model payload in raw "Auto" mode vs a
// forced template. Injected stub provider; no live router call.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { normalizeRequest, planVideo, AUTO_TEMPLATE_SLUG } from "../../services/brag/planner.mjs";
import { templateDefaults } from "../../services/brag/catalog.mjs";

const seeds = JSON.parse(
  readFileSync(new URL("../../packages/catalog/src/seeds.json", import.meta.url), "utf8"),
);
const template = templateDefaults(
  seeds.templates.find((t) => t.slug === "changelog-highlight"),
);
const context = {
  product: {
    name: "Kurutu",
    description: "Grocery list app that remembers what you buy.",
  },
  brand: {
    background: "#f7f3ea", accent: "#d5e04b", ink: "#1c2829",
    font: "Bricolage Grotesque", voice: "Warm, direct, no corporate filler.",
  },
  video: {
    format: "9:16",
    scenes: [{ id: "a", title: "Opening", caption: "Original", seconds: 4, assetId: "shot", locked: false }],
  },
  media: [{ id: "shot", name: "cart screenshot", type: "image", duration: 4 }],
  storyboard: [{ text: "Show the remembered list", seconds: 4 }],
};
const stripPlan = {
  title: "Your grocery list remembers",
  angle: "The list that fills itself from what you already buy",
  shareCopy: "Stop rewriting your grocery list every week.",
  scenes: [
    { title: "Hook", caption: "You rewrite the same list every week.", seconds: 2, assetId: null, layout: "title", motion: "fade" },
    { title: "Reveal", caption: "Kurutu fills it from what you buy.", seconds: 3, assetId: "shot", layout: "product", motion: "slide" },
    { title: "Highlight", caption: "One list. Every aisle you actually shop.", seconds: 3, assetId: "shot", layout: "product", motion: "zoom" },
    { title: "Close", caption: "Kurutu. Evolve your grocery run.", seconds: 2, assetId: null, layout: "title", motion: "none" },
  ],
};
const reply = async () => ({ text: JSON.stringify(stripPlan), model: "offline-fixture" });
const capture = async (tpl) => {
  const request = normalizeRequest(
    { prompt: "Make a short launch strip", scope: "all", context }, tpl,
  );
  let messages;
  const result = await planVideo(request, {
    chatFn: async (m) => { messages = m; return reply(); },
  });
  return { payload: messages[1].content, result };
};
const auto = await capture(null);
const forced = await capture(template);
mkdirSync(new URL("./", import.meta.url), { recursive: true });
writeFileSync(
  new URL("./auto-vs-template-payload.json", import.meta.url),
  JSON.stringify(
    {
      auto: {
        templateSlug: AUTO_TEMPLATE_SLUG,
        payload: JSON.parse(auto.payload),
        composedScenes: auto.result.plan.scenes.length,
        cues: auto.result.cues,
      },
      forcedTemplate: {
        templateSlug: template.slug,
        payload: JSON.parse(forced.payload),
        composedScenes: forced.result.plan.scenes.length,
      },
    },
    null,
    2,
  ),
);
console.log("auto payload template block:", JSON.stringify(JSON.parse(auto.payload).template));
console.log("auto scenes:", auto.result.plan.scenes.length, "cues:", auto.result.cues.length);
console.log("forced template block keys:", Object.keys(JSON.parse(forced.payload).template));
