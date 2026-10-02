import { randomUUID, createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { readJob, updateJob, fail } from "./catalog.mjs";
import { planVideo } from "./planner.mjs";
import { renderProject } from "./render.mjs";
export function jobQueue(
  db,
  { outputRoot, chatFn, renderFn = renderProject, resources = [] } = {},
) {
  let active = false,
    closed = false;
  const queue = [];
  // An interrupted request may have reached the provider. Never resubmit it automatically.
  for (const row of db
    .prepare(
      "SELECT id FROM jobs WHERE stage IN ('queued','planning','validating','rendering')",
    )
    .all())
    updateJob(db, row.id, {
      stage: "interrupted",
      error: "The service restarted. This request was not retried.",
    });
  async function drain() {
    if (active || closed) return;
    const next = queue.shift();
    if (!next) return;
    active = true;
    const { id, owner } = next;
    try {
      const job = readJob(db, id, owner);
      if (!job || job.stage === "canceled") return;
      if (job.kind === "render") {
        const result = await renderFn({
          id,
          project: job.project,
          media: job.media,
          outputRoot,
          onStage: (stage) => updateJob(db, id, { stage }),
        });
        updateJob(db, id, { stage: "complete", output: result });
      } else {
        updateJob(db, id, { stage: "planning" });
        const result = await planVideo(job.request, {
          chatFn,
          resources: resources.filter((r) =>
            job.request.resourceIds.includes(r.slug),
          ),
        });
        const dir = join(outputRoot, id);
        mkdirSync(dir, { recursive: true });
        writeFileSync(
          join(dir, "request.json"),
          JSON.stringify(job.request, null, 2),
          { flag: "wx" },
        );
        writeFileSync(join(dir, "plan.json"), JSON.stringify(result, null, 2), {
          flag: "wx",
        });
        const checksum = createHash("sha256")
          .update(JSON.stringify(result))
          .digest("hex");
        writeFileSync(
          join(dir, "manifest.json"),
          JSON.stringify(
            {
              id,
              checksum,
              provider: "9Router",
              model: result.model,
              templateSlug: job.request.templateSlug,
              templateRevision: job.request.templateRevision,
            },
            null,
            2,
          ),
          { flag: "wx" },
        );
        updateJob(db, id, {
          stage: "ready",
          plan: result.plan,
          cues: result.cues,
          model: result.model,
          checksum,
          templateSlug: job.request.templateSlug,
          templateRevision: job.request.templateRevision,
        });
      }
    } catch (e) {
      updateJob(db, id, {
        stage: "failed",
        error: e.status
          ? e.message
          : "The request failed. Your existing video and saved versions are unchanged.",
      });
    } finally {
      active = false;
      drain();
    }
  }
  return {
    enqueue(owner, key, body) {
      if (typeof key !== "string" || !/^[a-zA-Z0-9_-]{8,100}$/.test(key))
        throw fail("Use a unique request ID.");
      const existing = db
        .prepare("SELECT id FROM jobs WHERE owner=? AND request_key=?")
        .get(owner, key);
      if (existing) return readJob(db, existing.id, owner);
      if (queue.length >= 30)
        throw fail("The generation queue is full. Try again later.", 429);
      const day = new Date(Date.now() - 86400000).toISOString();
      if (
        db
          .prepare("SELECT count(*) n FROM jobs WHERE owner=? AND created>?")
          .get(owner, day).n >= 30
      )
        throw fail("Your free request allowance is used for today.", 429);
      if (
        db
          .prepare(
            "SELECT id FROM jobs WHERE owner=? AND stage IN ('queued','planning','validating','rendering')",
          )
          .get(owner)
      )
        throw fail(
          "A request is already running. Resume it before starting another.",
          409,
        );
      const id = randomUUID(),
        now = new Date().toISOString();
      db.prepare("INSERT INTO jobs VALUES(?,?,?,?,?,?,?)").run(
        id,
        owner,
        key,
        "queued",
        JSON.stringify(body),
        now,
        now,
      );
      queue.push({ id, owner });
      setImmediate(drain);
      return readJob(db, id, owner);
    },
    cancel(id, owner) {
      const job = readJob(db, id, owner);
      if (!job) throw fail("Request not found.", 404);
      if (job.stage !== "queued")
        throw fail(
          "This request has already started. It will be preserved when it finishes.",
          409,
        );
      updateJob(db, id, { stage: "canceled" });
      return readJob(db, id, owner);
    },
    close() {
      closed = true;
    },
    get active() {
      return active;
    },
  };
}
