// t_a95a9e07: STRIP_SHAPE + tone directives restored to the template path.
// Offline stub provider; no live router call.
import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { normalizeRequest, planVideo } from "./planner.mjs";
import { templateDefaults, validateTemplate } from "./catalog.mjs";
import {
  STRIP_SHAPE,
  STRIP_SHAPE_LAW,
  TONES,
  TONE_NAMES,
  CATEGORY_TONES,
  toneForTemplate,
  toneDirectiveBlock,
} from "./tones.mjs";

const seeds = JSON.parse(
  readFileSync(new URL("../../packages/catalog/src/seeds.json", import.meta.url), "utf8"),
);
const context = {
  product: { name: "Fixture product", description: "A private test project" },
  brand: {
    background: "#ffffff",
    accent: "#2142e7",
    ink: "#182b4e",
    font: "Inter",
    voice: "Precise",
  },
  video: {
    format: "16:9",
    scenes: [
      { id: "a", title: "Opening", caption: "Original", seconds: 4, assetId: "photo", locked: false },
    ],
  },
  media: [{ id: "photo", name: "Actual screenshot", type: "image", duration: 4 }],
  storyboard: [{ text: "Show the editor", seconds: 4 }],
};
const stripPlan = {
  title: "Product demo",
  angle: "Show the actual tool",
  shareCopy: "A test",
  scenes: [
    { id: "a", title: "Hook", caption: "Editing video is a chore.", seconds: 2, assetId: null, layout: "title", motion: "fade" },
    { id: "a", title: "Reveal", caption: "Fixture product plans it for you.", seconds: 3, assetId: "photo", layout: "product", motion: "slide" },
    { id: "a", title: "Highlight", caption: "Edit any scene. Keep the rest.", seconds: 3, assetId: "photo", layout: "product", motion: "zoom" },
    { id: "a", title: "Punchline", caption: "Fixture product. Try it free.", seconds: 2, assetId: null, layout: "title", motion: "none" },
  ],
};
const reply = async () => ({ text: JSON.stringify(stripPlan), model: "offline-fixture" });

test("STRIP_SHAPE and tone directives are ported from the original brag source", () => {
  assert.deepEqual(STRIP_SHAPE, ["hook", "reveal", "highlight", "punchline"]);
  assert.ok(STRIP_SHAPE_LAW.includes("hook -> reveal -> highlight"));
  assert.ok(STRIP_SHAPE_LAW.includes("punchline"));
  // Directive fields present on every tone, verbatim upstream values kept.
  for (const name of TONE_NAMES) {
    for (const f of ["energy", "voice", "typography", "pacing", "hook", "highlight", "outro", "transitions"])
      assert.equal(typeof TONES[name][f], "string", `${name}.${f}`);
  }
  assert.equal(
    TONES.changelog.energy,
    "Punchy, UI-focused, direct. The product update speaks for itself.",
  );
  assert.equal(TONES["case-study"].intent.includes("metric callouts"), true);
});

test("every seed template carries a tone and strip-shape beats on its scenes", () => {
  for (const t of seeds.templates) {
    assert.ok(TONE_NAMES.includes(t.tone), `${t.slug} tone ${t.tone}`);
    assert.equal(t.tone, CATEGORY_TONES[t.category], `${t.slug} tone matches category`);
    assert.ok(t.scenes.length >= 1);
    const beats = t.scenes.map((s) => s.beat);
    // Skeleton ordering: first beat is hook, last is punchline, one reveal between.
    assert.equal(beats[0], "hook", `${t.slug} first beat`);
    assert.equal(beats[beats.length - 1], "punchline", `${t.slug} last beat`);
    assert.equal(beats.filter((b) => b === "reveal").length, 1, `${t.slug} single reveal`);
    assert.ok(beats.filter((b) => b === "highlight").length >= 1, `${t.slug} highlights`);
    for (const b of beats) assert.ok(STRIP_SHAPE.includes(b));
  }
});

test("toneForTemplate resolves named tone, then category tone, then default", () => {
  const launch = toneForTemplate({ category: "Launches", tone: "cinematic" });
  assert.equal(launch.name, "cinematic");
  assert.equal(launch.category, "Brand");
  const noTone = toneForTemplate({ category: "Product updates" });
  assert.equal(noTone.name, "changelog");
  assert.ok(noTone.intent.includes("workflow improvements"));
  assert.match(toneDirectiveBlock(noTone), /^Template Intent: /);
  assert.ok(toneDirectiveBlock(noTone).includes("Energy: Punchy, UI-focused"));
  const unknown = toneForTemplate({ category: "Elsewhere", tone: "nope" });
  assert.equal(unknown.name, "default");
});

test("template plans now receive labeled tone directives and beats (upstream scenePrompt parity)", async () => {
  const template = templateDefaults(
    seeds.templates.find((t) => t.slug === "changelog-highlight"),
  );
  const request = normalizeRequest(
    { context, prompt: "Make a release strip", scope: "all" },
    template,
  );
  assert.equal(request.templateSlug, "changelog-highlight");
  let messages;
  await planVideo(request, {
    chatFn: async (m) => {
      messages = m;
      return reply();
    },
  });
  const system = messages[0].content;
  const body = messages[1].content;
  // Strip shape is now part of the SYSTEM law for template plans too.
  assert.ok(system.includes("hook -> reveal -> highlight"));
  assert.ok(system.includes("punchline"));
  // The template payload carries the restored creative context...
  assert.ok(body.includes('"category":"Product updates"'));
  assert.ok(body.includes('"tone":{"name":"changelog"'));
  // ...with labeled directives exactly like upstream scenePrompt().
  assert.ok(body.includes("Template Intent: Highlight new features and workflow improvements. (Blog / Updates)"));
  assert.ok(body.includes("Energy: Punchy, UI-focused, direct."));
  assert.ok(body.includes("Voice: Direct, feature-focused"));
  assert.ok(body.includes("Typography: Clean sans-serif"));
  assert.ok(body.includes("Pacing: Snappy zoom cuts"));
  assert.ok(body.includes("Hook style: A clear announcement of what just shipped"));
  assert.ok(body.includes("Highlight style: One major UI feature"));
  assert.ok(body.includes("Outro style: Version number or release tag"));
  assert.ok(body.includes("Transitions: Snappy zoom cuts to UI elements and rapid slide-ins"));
  // Scene guide retains its beats so the model can map beats dynamically.
  assert.ok(body.includes('"beat":"hook"'));
  assert.ok(body.includes('"beat":"reveal"'));
  assert.ok(body.includes('"beat":"highlight"'));
  assert.ok(body.includes('"beat":"punchline"'));
  // The admin-editable prompt still flows through.
  assert.ok(body.includes(template.prompt.slice(0, 40)));
});

test("raw auto mode keeps the default tone directives and gains the shape law", async () => {
  const request = normalizeRequest(
    { context, prompt: "Make a launch strip", scope: "all" },
    null,
  );
  let messages;
  const result = await planVideo(request, {
    chatFn: async (m) => {
      messages = m;
      return reply();
    },
  });
  assert.ok(messages[0].content.includes("hook -> reveal -> highlight"));
  assert.ok(messages[1].content.includes('"template":{"direction"'));
  assert.ok(messages[1].content.includes("One idea per scene"));
  assert.ok(result.cues.length >= 3);
});

test("validateTemplate round-trips tone and scene beats; bad values rejected", () => {
  const template = templateDefaults(
    seeds.templates.find((t) => t.slug === "saas-product-launch"),
  );
  const saved = validateTemplate(template);
  assert.equal(saved.tone, "default");
  assert.equal(saved.scenes[0].beat, "hook");
  assert.equal(saved.scenes[saved.scenes.length - 1].beat, "punchline");
  // tone/beats survive an admin edit that keeps them
  const edited = validateTemplate({ ...template, title: "Edited" });
  assert.equal(edited.tone, "default");
  assert.equal(edited.scenes[1].beat, "reveal");
  // invalid values are rejected with friendly errors
  assert.throws(() => validateTemplate({ ...template, tone: "nope" }), /tone/);
  assert.throws(
    () =>
      validateTemplate({
        ...template,
        scenes: template.scenes.map((s, i) => (i === 0 ? { ...s, beat: "dance" } : s)),
      }),
    /beat/,
  );
  // templates without tone/beat (pre-existing DB rows) still validate
  const legacy = validateTemplate({
    ...template,
    tone: undefined,
    scenes: template.scenes.map(({ beat, ...s }) => s),
  });
  assert.equal(legacy.tone, undefined);
  assert.equal(legacy.scenes[0].beat, undefined);
});
