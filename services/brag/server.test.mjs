import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtempSync, rmSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createBragServer } from "./server.mjs";
import {
  openStore,
  templateDefaults,
  getTemplate,
  updateJob,
} from "./catalog.mjs";
import { normalizeRequest, parsePlan, planVideo } from "./planner.mjs";
import { jobQueue } from "./jobs.mjs";
const seeds = JSON.parse(
  readFileSync(
    new URL("../../packages/catalog/src/seeds.json", import.meta.url),
  ),
);
const template = templateDefaults(seeds.templates[0]);
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
      {
        id: "b",
        title: "Locked",
        caption: "Keep this",
        seconds: 4,
        assetId: "photo",
        locked: true,
      },
    ],
  },
  media: [
    { id: "photo", name: "Actual screenshot", type: "image", duration: 4 },
  ],
  storyboard: [{ text: "Show the editor", seconds: 4 }],
};
const raw = {
  requestId: "fixture-request-001",
  creationId: "creation-1",
  prompt: "Shorten the opening",
  scope: "selected",
  selectedIds: ["a", "b"],
  templateSlug: template.slug,
  context,
};
const plan = {
  title: "Product demo",
  angle: "Show the actual tool",
  shareCopy: "A test",
  scenes: [
    {
      id: "a",
      title: "Opening",
      caption: "Your project, ready to edit.",
      seconds: 4,
      assetId: "photo",
      layout: "product",
      motion: "slide",
    },
  ],
};
const reply = async () => ({
  text: JSON.stringify(plan),
  model: "offline-fixture",
});
const delay = () => new Promise((r) => setTimeout(r, 15));
test("planner receives brand, storyboard and timeline context; locks and asset validation are enforced", async () => {
  const request = normalizeRequest(raw, template);
  assert.deepEqual(request.selectedIds, ["a"]);
  let messages;
  const result = await planVideo(request, {
    chatFn: async (m) => {
      messages = m;
      return reply();
    },
  });
  assert.equal(result.plan.scenes[0].id, "a");
  assert.ok(messages[1].content.includes("Show the editor"));
  assert.ok(messages[1].content.includes("#2142e7"));
  assert.ok(messages[1].content.includes("Keep this"));
  assert.throws(
    () =>
      parsePlan(
        JSON.stringify({
          ...plan,
          scenes: [{ ...plan.scenes[0], assetId: "foreign" }],
        }),
        request,
      ),
    /unavailable/,
  );
  assert.throws(
    () =>
      parsePlan(
        JSON.stringify({ ...plan, scenes: [{ ...plan.scenes[0], id: "b" }] }),
        request,
      ),
    /selected/,
  );
  assert.throws(
    () => normalizeRequest({ ...raw, selectedIds: ["b"] }, template),
    /unlocked/,
  );
});
test("HTTP jobs are idempotent, private, recoverable; admin publication has revision conflict checks", async () => {
  const dir = mkdtempSync(join(tmpdir(), "storyframe-service-"));
  let calls = 0;
  const server = createBragServer({
    dbPath: join(dir, "test.sqlite"),
    origins: ["http://studio.test"],
    adminToken: "fixture-admin-token",
    chatFn: async () => {
      calls++;
      return reply();
    },
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const base = `http://127.0.0.1:${server.address().port}`;
  let cookie = "";
  const request = async (path, method = "GET", data, own = true) => {
    const res = await fetch(base + path, {
      method,
      headers: {
        Origin: "http://studio.test",
        ...(own && cookie ? { Cookie: cookie } : {}),
        ...(data ? { "Content-Type": "application/json" } : {}),
      },
      ...(data ? { body: JSON.stringify(data) } : {}),
    });
    if (own && res.headers.get("set-cookie"))
      cookie = res.headers.get("set-cookie").split(";")[0];
    return { status: res.status, data: await res.json() };
  };
  try {
    assert.equal((await request("/api/admin/templates")).status, 401);
    assert.equal(
      (
        await fetch(base + "/api/generations", {
          method: "POST",
          headers: { Origin: "http://evil.test" },
        })
      ).status,
      403,
    );
    const queued = await request("/api/generations", "POST", raw);
    assert.equal(queued.status, 202);
    const id = queued.data.id;
    assert.equal((await request("/api/generations", "POST", raw)).data.id, id);
    let ready;
    for (let i = 0; i < 60; i++) {
      ready = await request("/api/jobs/" + id);
      if (ready.data.stage === "ready") break;
      await delay();
    }
    assert.equal(ready.data.stage, "ready");
    assert.equal(calls, 1);
    assert.equal(ready.data.requestId, raw.requestId);
    assert.ok(ready.data.checksum);
    assert.equal(
      (await request("/api/jobs/" + id, "GET", undefined, false)).status,
      404,
    );
    assert.ok(
      !JSON.stringify((await request("/api/catalog")).data).includes(
        "A private test project",
      ),
    );
    assert.equal(
      (
        await request("/api/admin/session", "POST", {
          token: "fixture-admin-token",
        })
      ).status,
      200,
    );
    const created = await request("/api/admin/templates", "POST", {
      ...template,
      slug: "fixture-draft",
      status: "draft",
    });
    assert.equal(created.status, 201);
    assert.ok(
      !(await request("/api/catalog")).data.templates.some(
        (t) => t.slug === "fixture-draft",
      ),
    );
    const published = await request(
      "/api/admin/templates/fixture-draft",
      "PUT",
      { ...created.data.template, status: "published" },
    );
    assert.equal(published.status, 200);
    assert.ok(
      (await request("/api/catalog")).data.templates.some(
        (t) => t.slug === "fixture-draft",
      ),
    );
    assert.equal(
      (
        await request(
          "/api/admin/templates/fixture-draft",
          "PUT",
          created.data.template,
        )
      ).status,
      409,
    );
    assert.equal(
      (
        await request("/api/admin/templates/fixture-draft", "DELETE", {
          revision: published.data.template.revision,
        })
      ).status,
      200,
    );
    assert.equal(
      (await request("/api/admin/templates/fixture-draft/versions")).data
        .versions.length,
      3,
    );
    assert.ok(
      !(await request("/api/catalog")).data.templates.some(
        (t) => t.slug === "fixture-draft",
      ),
    );
  } finally {
    await new Promise((r) => server.close(r));
    rmSync(dir, { recursive: true, force: true });
  }
});
test("restart preserves accepted requests without resubmitting them", () => {
  const dir = mkdtempSync(join(tmpdir(), "storyframe-restart-")),
    path = join(dir, "test.sqlite");
  let db = openStore(path);
  const queue = jobQueue(db, {
    outputRoot: join(dir, "outputs"),
    chatFn: () => {
      throw new Error("Must not run");
    },
  });
  const job = queue.enqueue("owner", "restart-request-001", {
    kind: "generation",
    request: normalizeRequest(raw, template),
  });
  queue.close();
  db.close();
  db = openStore(path);
  const resumed = jobQueue(db, { outputRoot: join(dir, "outputs") });
  assert.equal(
    db.prepare("SELECT stage FROM jobs WHERE id=?").get(job.id).stage,
    "interrupted",
  );
  assert.ok(getTemplate(db, template.slug));
  resumed.close();
  db.close();
  rmSync(dir, { recursive: true, force: true });
});
