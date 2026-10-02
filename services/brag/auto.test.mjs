// Raw brag "Auto" mode: no forced template; planner composes from project
// context with brag creative discipline; rank scaler cues land on scene cuts.
// Provider is injected as a stub; no live router call.
import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createBragServer } from "./server.mjs";
import { normalizeRequest, planVideo, AUTO_TEMPLATE_SLUG } from "./planner.mjs";
import {
  scoreTimeline,
  dedupeCues,
  strongCues,
  synthesizeCues,
  STRONG_CUE_THRESHOLD,
} from "./scaler.mjs";

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
      {
        id: "a",
        title: "Opening",
        caption: "Original",
        seconds: 4,
        assetId: "photo",
        locked: false,
      },
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
    { id: "a", title: "Close", caption: "Fixture product. Try it free.", seconds: 2, assetId: null, layout: "title", motion: "none" },
  ],
};
const reply = async () => ({ text: JSON.stringify(stripPlan), model: "offline-fixture" });
const delay = () => new Promise((r) => setTimeout(r, 15));

test("scaler port matches upstream constants: weights, threshold, dedupe", () => {
  assert.equal(STRONG_CUE_THRESHOLD, 0.45);
  const frames = [
    { time: 0, onset: 1, contrast: 0, rms: 0, bass: 0 },
    { time: 0.1, onset: 0, contrast: 1, rms: 0, bass: 0 },
    { time: 5, onset: 0.4, contrast: 0.4, rms: 0.4, bass: 0.4 },
  ];
  const ranked = scoreTimeline(frames);
  assert.equal(ranked[0].time, 0);
  assert.ok(Math.abs(ranked[0].intensity - 0.45) < 1e-9);
  const cues = strongCues(frames);
  assert.ok(cues.every((c) => c.intensity >= 0.45));
  // dedupe enforces the 0.18s minimum gap
  const tight = Array.from({ length: 5 }, (_, i) => ({
    time: i * 0.05,
    onset: 1 - i * 0.1,
    contrast: 0,
    rms: 0,
    bass: 0,
  }));
  const deduped = dedupeCues(tight);
  for (let i = 1; i < deduped.length; i++)
    assert.ok(deduped[i].time - deduped[i - 1].time >= 0.18);
});

test("synthesizeCues puts strong beats on scene boundaries", () => {
  const frames = synthesizeCues(10, [2.5, 5.0, 7.5]);
  const strong = strongCues(frames);
  assert.ok(strong.length >= 3);
  for (const boundary of [2.5, 5.0, 7.5])
    assert.ok(
      strong.some((c) => Math.abs(c.time - boundary) < 0.18),
      `missing beat near ${boundary}`,
    );
});

test("auto request skips the template and sends raw brag direction", async () => {
  const request = normalizeRequest(
    { ...context && { context }, prompt: "Make a launch strip", scope: "all" },
    null,
  );
  assert.equal(request.templateSlug, AUTO_TEMPLATE_SLUG);
  assert.equal(request.templateRevision, 1);
  assert.equal(request.template, null);
  let messages;
  const result = await planVideo(request, {
    chatFn: async (m) => {
      messages = m;
      return reply();
    },
  });
  const body = messages[1].content;
  assert.ok(body.includes('"template":{"direction"'));
  assert.ok(body.includes("One idea per scene"));
  // No rigid template scene map is forced on the model.
  assert.ok(!body.includes('"template":{"title"'));
  assert.ok(!/"scenes":\[\{"title":"The opening"/.test(body));
  // Project context still grounds the plan.
  assert.ok(body.includes("Fixture product"));
  assert.ok(body.includes("#2142e7"));
  // Rank scaler cues: present, strong, aligned with the composed cuts.
  assert.ok(result.cues.length >= 3);
  assert.ok(result.cues.every((c) => c.intensity >= 0.45 && c.kind === "beat"));
  let t = 0;
  const cuts = [];
  for (const s of result.plan.scenes.slice(0, -1)) {
    t += s.seconds;
    cuts.push(Math.round(t * 10) / 10);
  }
  for (const cut of cuts)
    assert.ok(
      result.cues.some((c) => Math.abs(c.time - cut) < 0.2),
      `missing cue near cut ${cut}`,
    );
});

test("HTTP generation without a templateSlug runs in auto mode end to end", async () => {
  const dir = mkdtempSync(join(tmpdir(), "storyframe-auto-"));
  const server = createBragServer({
    dbPath: join(dir, "test.sqlite"),
    origins: ["http://studio.test"],
    chatFn: reply,
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const base = `http://127.0.0.1:${server.address().port}`;
  let cookie = "";
  const request = async (path, method = "GET", data) => {
    const res = await fetch(base + path, {
      method,
      headers: {
        Origin: "http://studio.test",
        ...(cookie ? { Cookie: cookie } : {}),
        ...(data ? { "Content-Type": "application/json" } : {}),
      },
      ...(data ? { body: JSON.stringify(data) } : {}),
    });
    if (res.headers.get("set-cookie"))
      cookie = res.headers.get("set-cookie").split(";")[0];
    return { status: res.status, data: await res.json() };
  };
  try {
    const queued = await request("/api/generations", "POST", {
      requestId: "auto-request-001",
      creationId: "creation-1",
      prompt: "Make a launch strip",
      scope: "all",
      context,
    });
    assert.equal(queued.status, 202);
    assert.equal(queued.data.templateSlug, "auto");
    let ready;
    for (let i = 0; i < 60; i++) {
      ready = await request("/api/jobs/" + queued.data.id);
      if (ready.data.stage === "ready") break;
      await delay();
    }
    assert.equal(ready.data.stage, "ready");
    assert.equal(ready.data.templateSlug, "auto");
    assert.equal(ready.data.plan.scenes.length, 4);
    assert.ok(ready.data.cues.length >= 3);
    assert.equal(
      (
        await request("/api/generations", "POST", {
          requestId: "other-request-002",
          prompt: "Other",
          scope: "all",
          templateSlug: "does-not-exist",
          context,
        })
      ).status,
      404,
    );
  } finally {
    await new Promise((r) => server.close(r));
    rmSync(dir, { recursive: true, force: true });
  }
});
