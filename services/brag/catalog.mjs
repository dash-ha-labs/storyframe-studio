import { DatabaseSync } from "node:sqlite";
import { mkdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { randomUUID } from "node:crypto";
const seeds = JSON.parse(
  readFileSync(
    new URL("../../packages/catalog/src/seeds.json", import.meta.url),
    "utf8",
  ),
);
export const fail = (message, status = 400) =>
  Object.assign(new Error(message), { status });
export function templateDefaults(t) {
  return {
    ...t,
    prompt:
      t.prompt ||
      `Create a specific, brand-aware video for the supplied product. ${t.description}\nUse this story structure:\n${t.scenes.map((s, i) => `${i + 1}. ${s.title}: ${s.instruction}`).join("\n")}\nUse only supplied facts. Show the user's product assets when available. Keep captions concise and readable.`,
    layout: t.layout || (t.platform === "Mobile" ? "device" : "product"),
    motion: t.motion || "slide",
    status: t.status || "published",
    revision: t.revision || 1,
    sampleBrief: t.sampleBrief || "",
  };
}
export function validateTemplate(raw) {
  if (!raw || typeof raw !== "object") throw fail("Provide a template.");
  const text = (key, max, min = 1) => {
    const v = raw[key];
    if (typeof v !== "string" || v.trim().length < min || v.length > max)
      throw fail(`Check ${key}.`);
    return v.trim();
  };
  const slug = text("slug", 80);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
    throw fail("Use a lowercase URL slug.");
  const category = text("category", 60);
  if (!seeds.categories.includes(category))
    throw fail("Choose a template category.");
  const pick = (k, values) => {
    if (!values.includes(raw[k])) throw fail(`Choose a valid ${k}.`);
    return raw[k];
  };
  if (
    !Array.isArray(raw.scenes) ||
    raw.scenes.length < 1 ||
    raw.scenes.length > 12
  )
    throw fail("Use 1–12 scene instructions.");
  const scenes = raw.scenes.map((s) => {
    if (
      !s ||
      typeof s.title !== "string" ||
      !s.title.trim() ||
      s.title.length > 100 ||
      typeof s.instruction !== "string" ||
      !s.instruction.trim() ||
      s.instruction.length > 1000 ||
      !Number.isFinite(s.seconds) ||
      s.seconds < 1 ||
      s.seconds > 30
    )
      throw fail(
        "Each scene needs a title, instruction and 1–30 second duration.",
      );
    return {
      title: s.title.trim(),
      instruction: s.instruction.trim(),
      seconds: s.seconds,
    };
  });
  const duration = scenes.reduce((a, s) => a + s.seconds, 0);
  if (duration > 120) throw fail("Keep a template within two minutes.");
  return {
    slug,
    title: text("title", 100),
    description: text("description", 500),
    category,
    platform: pick("platform", ["Web", "Mobile", "Any"]),
    format: pick("format", ["16:9", "9:16", "1:1"]),
    style: pick("style", ["Clean", "Bold", "Editorial"]),
    color: pick("color", ["blue", "mint", "peach", "lilac"]),
    prompt: text("prompt", 12000),
    sampleBrief: text("sampleBrief", 2000, 0),
    layout: pick("layout", ["title", "product", "device", "split"]),
    motion: pick("motion", ["fade", "slide", "zoom", "none"]),
    status: pick("status", ["draft", "published", "archived"]),
    featured: raw.featured === true,
    scenes,
    duration,
    audience:
      typeof raw.audience === "string" ? raw.audience.slice(0, 300) : "",
    proof: typeof raw.proof === "string" ? raw.proof.slice(0, 500) : "",
  };
}
export function openStore(path) {
  mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec(`PRAGMA journal_mode=WAL;
 CREATE TABLE IF NOT EXISTS catalog(slug TEXT PRIMARY KEY,revision INTEGER NOT NULL,body TEXT NOT NULL,updated TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS catalog_versions(slug TEXT NOT NULL,revision INTEGER NOT NULL,body TEXT NOT NULL,created TEXT NOT NULL,PRIMARY KEY(slug,revision));
 CREATE TABLE IF NOT EXISTS jobs(id TEXT PRIMARY KEY,owner TEXT NOT NULL,request_key TEXT NOT NULL,stage TEXT NOT NULL,body TEXT NOT NULL,created TEXT NOT NULL,updated TEXT NOT NULL,UNIQUE(owner,request_key));
 CREATE TABLE IF NOT EXISTS media(id TEXT PRIMARY KEY,owner TEXT NOT NULL,body TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS examples(slug TEXT PRIMARY KEY,owner TEXT NOT NULL,job_id TEXT NOT NULL,body TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS sessions(id TEXT PRIMARY KEY,admin INTEGER NOT NULL DEFAULT 0,expires INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS studio_settings(key TEXT PRIMARY KEY,value TEXT NOT NULL);`);
  if (!db.prepare("SELECT 1 FROM studio_settings WHERE key=?").get("seed-v1")) {
    db.exec("BEGIN");
    try {
      const now = new Date().toISOString();
      for (const seed of seeds.templates) {
        const t = templateDefaults(seed);
        db.prepare("INSERT OR IGNORE INTO catalog VALUES(?,?,?,?)").run(
          t.slug,
          t.revision,
          JSON.stringify(t),
          now,
        );
        db.prepare(
          "INSERT OR IGNORE INTO catalog_versions VALUES(?,?,?,?)",
        ).run(t.slug, t.revision, JSON.stringify(t), now);
      }
      db.prepare("INSERT INTO studio_settings VALUES(?,?)").run("seed-v1", "1");
      db.exec("COMMIT");
    } catch (e) {
      db.exec("ROLLBACK");
      throw e;
    }
  }
  return db;
}
export function getTemplate(db, slug, admin = false) {
  const row = db.prepare("SELECT body FROM catalog WHERE slug=?").get(slug);
  const value = row ? JSON.parse(row.body) : null;
  return value && (admin || value.status === "published") ? value : null;
}
export function catalog(db, admin = false) {
  return {
    templates: db
      .prepare("SELECT body FROM catalog ORDER BY updated DESC,slug")
      .all()
      .map((r) => JSON.parse(r.body))
      .filter((t) => admin || t.status === "published"),
    resources: seeds.resources,
    examples: db
      .prepare("SELECT body FROM examples ORDER BY rowid DESC")
      .all()
      .map((r) => {
        const v = JSON.parse(r.body);
        const { project, ...publicValue } = v;
        return publicValue;
      }),
  };
}
export function saveTemplate(db, raw, { create = false } = {}) {
  const t = validateTemplate(raw),
    old = getTemplate(db, t.slug, true);
  if (create && old) throw fail("This URL slug already exists.", 409);
  if (!create && !old) throw fail("Template not found.", 404);
  if (old && raw.revision !== old.revision)
    throw fail("This template changed. Reload before saving.", 409);
  const next = { ...t, revision: (old?.revision || 0) + 1 },
    now = new Date().toISOString();
  db.exec("BEGIN");
  try {
    db.prepare(
      "INSERT INTO catalog VALUES(?,?,?,?) ON CONFLICT(slug) DO UPDATE SET revision=excluded.revision,body=excluded.body,updated=excluded.updated",
    ).run(next.slug, next.revision, JSON.stringify(next), now);
    db.prepare("INSERT INTO catalog_versions VALUES(?,?,?,?)").run(
      next.slug,
      next.revision,
      JSON.stringify(next),
      now,
    );
    db.exec("COMMIT");
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }
  return next;
}
export function createSession(db, admin = false) {
  const id = randomUUID() + randomUUID();
  db.prepare("INSERT INTO sessions VALUES(?,?,?)").run(
    id,
    admin ? 1 : 0,
    Date.now() + 86400000 * 7,
  );
  return id;
}
export function session(db, req) {
  const id = req.headers.cookie
    ?.split(";")
    .map((x) => x.trim())
    .find((x) => x.startsWith("sf_session="))
    ?.slice(11);
  if (!id) return null;
  return (
    db
      .prepare("SELECT * FROM sessions WHERE id=? AND expires>?")
      .get(id, Date.now()) || null
  );
}
export function readJob(db, id, owner) {
  const row = db
    .prepare("SELECT * FROM jobs WHERE id=? AND owner=?")
    .get(id, owner);
  return row
    ? {
        ...JSON.parse(row.body),
        id: row.id,
        stage: row.stage,
        createdAt: row.created,
        updatedAt: row.updated,
      }
    : null;
}
export function updateJob(db, id, patch) {
  const row = db.prepare("SELECT * FROM jobs WHERE id=?").get(id);
  if (!row) return;
  const value = { ...JSON.parse(row.body), ...patch };
  db.prepare("UPDATE jobs SET stage=?,body=?,updated=? WHERE id=?").run(
    value.stage || row.stage,
    JSON.stringify(value),
    new Date().toISOString(),
    id,
  );
}
