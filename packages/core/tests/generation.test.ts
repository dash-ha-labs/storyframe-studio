import test from "node:test";
import assert from "node:assert/strict";
import demo from "../src/demo.json";
import { applyGeneration, type GenerationResult } from "../src/generation";
import { validateProject, type Project } from "../src/model";
const result = (p: Project, ids: string[]): GenerationResult => ({
  id: "job-fixture",
  templateSlug: "test",
  templateRevision: 1,
  plan: {
    title: "Test",
    angle: "Test",
    shareCopy: "",
    scenes: ids.map((id) => ({
      id,
      title: "Edited",
      caption: "A precise change",
      seconds: 2,
      assetId: p.scenes.find((s) => s.id === id)!.assetId,
      layout: "product",
      motion: "slide",
    })),
  },
});
test("selected edits preserve unrelated and locked scenes, project identity and source offsets", () => {
  const p = structuredClone(demo) as Project;
  p.scenes[1].locked = true;
  const before = JSON.stringify(p);
  const ids = [p.scenes[0].id, p.scenes[1].id];
  const next = applyGeneration(p, result(p, [ids[0]]), "selected", ids);
  assert.equal(JSON.stringify(p), before);
  assert.ok(validateProject(next));
  assert.equal(next.title, p.title);
  assert.equal(next.scenes[0].id, p.scenes[0].id);
  assert.equal(next.scenes[0].sourceIn, p.scenes[0].sourceIn);
  assert.deepEqual(next.scenes.slice(1), p.scenes.slice(1));
  assert.equal(next.musicId, p.musicId);
});
test("duplicate scene targets and foreign media cannot enter the timeline", () => {
  const p = structuredClone(demo) as Project;
  const ids = p.scenes.slice(0, 2).map((s) => s.id),
    r = result(p, ids);
  r.plan.scenes[1].id = ids[0];
  assert.throws(() => applyGeneration(p, r, "selected", ids), /scope/);
  r.plan.scenes[1].id = ids[1];
  r.plan.scenes[0].assetId = "foreign";
  assert.throws(() => applyGeneration(p, r, "selected", ids), /outside/);
});
test("whole-video changes preserve locked scenes and reject a mismatched plan", () => {
  const p = structuredClone(demo) as Project;
  p.scenes[1].locked = true;
  const ids = p.scenes.filter((s) => !s.locked).map((s) => s.id);
  const next = applyGeneration(p, result(p, ids), "all", []);
  assert.deepEqual(next.scenes[1], p.scenes[1]);
  assert.throws(
    () => applyGeneration(p, result(p, [ids[0]]), "all", []),
    /number/,
  );
});

test("a typography replacement gets a still canvas and its full readable duration", () => {
  const p = structuredClone(demo) as Project;
  const id = p.scenes[0].id,
    r = result(p, [id]);
  r.plan.scenes[0].assetId = null;
  r.plan.scenes[0].layout = "title";
  r.plan.scenes[0].seconds = 10;
  const next = applyGeneration(p, r, "selected", [id]);
  assert.equal(next.scenes[0].duration, 300);
  assert.equal(next.scenes[0].sourceIn, 0);
  assert.ok(validateProject(next));
  assert.deepEqual(next.scenes.slice(1), p.scenes.slice(1));
  assert.ok(
    next.assets.some(
      (a) => a.id === next.scenes[0].assetId && a.type === "image",
    ),
  );
});
