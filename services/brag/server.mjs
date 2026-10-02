import http from "node:http";
import {
  mkdirSync,
  readFileSync,
  writeFileSync,
  existsSync,
  createReadStream,
  statSync,
} from "node:fs";
import { resolve, join, dirname } from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
import { randomUUID, createHash, timingSafeEqual } from "node:crypto";
import {
  openStore,
  getTemplate,
  catalog,
  saveTemplate,
  validateTemplate,
  createSession,
  session,
  readJob,
  updateJob,
  fail,
} from "./catalog.mjs";
import { normalizeRequest, improveTemplate, AUTO_TEMPLATE_SLUG } from "./planner.mjs";
import { jobQueue } from "./jobs.mjs";
import { providerConfigured } from "./gemini.mjs";
import { validateProject } from "../../packages/core/src/model.ts";
const root = fileURLToPath(new URL("../../", import.meta.url));
const escape = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const SAFE_ID = /^[a-f0-9-]{36}$/;
async function body(req, limit = 250000) {
  let size = 0;
  const chunks = [];
  for await (const b of req) {
    size += b.length;
    if (size > limit) throw fail("This request is too large.", 413);
    chunks.push(b);
  }
  return Buffer.concat(chunks);
}
async function jsonBody(req) {
  if (!(req.headers["content-type"] || "").startsWith("application/json"))
    throw fail("Use a JSON request.", 415);
  try {
    return JSON.parse((await body(req)).toString());
  } catch (e) {
    if (e.status) throw e;
    throw fail("This request could not be read.");
  }
}
function publicJob(job) {
  const { request, media, project, ...out } = job;
  return {
    ...out,
    request: request
      ? {
          scope: request.scope,
          prompt: request.prompt,
          selectedIds: request.selectedIds,
        }
      : undefined,
  };
}
export function createBragServer({
  dbPath = "data/studio.sqlite",
  origins = ["http://127.0.0.1:9180", "http://localhost:9180"],
  localAdmin = false,
  adminToken = "",
  secureCookies = false,
  chatFn,
  renderFn,
  websiteDist = resolve(root, "apps/website/dist"),
} = {}) {
  const db = openStore(dbPath),
    dataRoot = dirname(resolve(dbPath)),
    outputRoot = join(dataRoot, "outputs"),
    mediaRoot = join(dataRoot, "media");
  mkdirSync(outputRoot, { recursive: true });
  mkdirSync(mediaRoot, { recursive: true });
  const jobs = jobQueue(db, {
      outputRoot,
      chatFn,
      renderFn,
      resources: catalog(db).resources,
    }),
    rate = new Map();
  const reply = (res, status, data) => {
    res.writeHead(status, {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    });
    res.end(JSON.stringify(data));
  };
  const setSession = (res, id) =>
    res.setHeader(
      "Set-Cookie",
      `sf_session=${id}; HttpOnly; SameSite=Lax; Path=/; Max-Age=604800${secureCookies ? "; Secure" : ""}`,
    );
  const ensureSession = (req, res) => {
    let current = session(db, req);
    if (!current) {
      const id = createSession(db);
      setSession(res, id);
      current = { id, admin: 0 };
    }
    return current;
  };
  const isLocal = (req) =>
    localAdmin &&
    ["127.0.0.1", "::1", "::ffff:127.0.0.1"].includes(
      req.socket.remoteAddress,
    ) &&
    /^127\.0\.0\.1(?::\d+)?$|^localhost(?::\d+)?$/.test(req.headers.host || "");
  const requireAdmin = (req) => {
    const s = session(db, req);
    if (!s?.admin) throw fail("Sign in to the template studio.", 401);
    return s;
  };
  const file = (req, res, path, type) => {
    if (!existsSync(path)) throw fail("File not found.", 404);
    const stat = statSync(path);
    let start = 0,
      end = stat.size - 1,
      status = 200;
    const range = req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
    if (range) {
      start = Number(range[1]);
      end = range[2] ? Math.min(Number(range[2]), end) : end;
      if (start > end || start >= stat.size) {
        res.writeHead(416, { "Content-Range": `bytes */${stat.size}` });
        return res.end();
      }
      status = 206;
    }
    res.writeHead(status, {
      "Content-Type": type,
      "Content-Length": end - start + 1,
      "Accept-Ranges": "bytes",
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      ...(status === 206
        ? { "Content-Range": `bytes ${start}-${end}/${stat.size}` }
        : {}),
    });
    createReadStream(path, { start, end }).pipe(res);
  };
  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, "http://studio.local"),
        path = url.pathname;
      const writes = !["GET", "HEAD"].includes(req.method);
      if (writes) {
        if (!origins.includes(req.headers.origin))
          throw fail("Open the Storyframe app to make changes.", 403);
        const ip = req.socket.remoteAddress || "";
        const now = Date.now();
        const old = rate.get(ip) || { start: now, count: 0 };
        if (now - old.start > 60000) {
          old.start = now;
          old.count = 0;
        }
        old.count++;
        rate.set(ip, old);
        if (rate.size > 10000) rate.clear();
        if (old.count > 100)
          throw fail("Too many requests. Please wait a moment.", 429);
      }
      if (req.method === "GET" && path === "/api/health")
        return reply(res, 200, {
          ok: true,
          provider: providerConfigured(),
          renderer: "hyperframes@0.8.111",
        });
      if (req.method === "GET" && path === "/api/catalog")
        return reply(res, 200, catalog(db));
      if (req.method === "GET" && path === "/api/session") {
        let s = ensureSession(req, res);
        if (isLocal(req) && !s.admin) {
          db.prepare("UPDATE sessions SET admin=1 WHERE id=?").run(s.id);
          s = { ...s, admin: 1 };
        }
        return reply(res, 200, {
          admin: !!s.admin,
          localAdmin: isLocal(req),
          provider: providerConfigured(),
        });
      }
      if (req.method === "POST" && path === "/api/admin/session") {
        const b = await jsonBody(req),
          s = ensureSession(req, res),
          provided = typeof b.token === "string" ? b.token : "";
        const equal =
          adminToken &&
          Buffer.byteLength(provided) === Buffer.byteLength(adminToken) &&
          timingSafeEqual(Buffer.from(provided), Buffer.from(adminToken));
        if (!equal && !isLocal(req))
          throw fail("The admin access key is incorrect.", 401);
        db.prepare("UPDATE sessions SET admin=1 WHERE id=?").run(s.id);
        return reply(res, 200, { admin: true });
      }
      if (req.method === "DELETE" && path === "/api/admin/session") {
        const s = session(db, req);
        if (s) db.prepare("UPDATE sessions SET admin=0 WHERE id=?").run(s.id);
        return reply(res, 200, { admin: false });
      }
      if (path.startsWith("/api/admin/")) {
        requireAdmin(req);
        if (req.method === "GET" && path === "/api/admin/templates")
          return reply(res, 200, catalog(db, true));
        if (req.method === "POST" && path === "/api/admin/templates")
          return reply(res, 201, {
            template: saveTemplate(db, await jsonBody(req), { create: true }),
          });
        if (req.method === "POST" && path === "/api/admin/templates/improve") {
          const b = await jsonBody(req);
          return reply(
            res,
            200,
            await improveTemplate(b.template, b.instruction, { chatFn }),
          );
        }
        const match = path.match(
          /^\/api\/admin\/templates\/([a-z0-9-]+)(\/versions)?$/,
        );
        if (match) {
          if (req.method === "GET" && match[2])
            return reply(res, 200, {
              versions: db
                .prepare(
                  "SELECT revision,body,created FROM catalog_versions WHERE slug=? ORDER BY revision DESC LIMIT 50",
                )
                .all(match[1])
                .map((v) => ({ ...JSON.parse(v.body), createdAt: v.created })),
            });
          if (req.method === "PUT") {
            const b = await jsonBody(req);
            if (b.slug !== match[1])
              throw fail(
                "A saved URL slug cannot change. Duplicate this template instead.",
              );
            return reply(res, 200, { template: saveTemplate(db, b) });
          }
          if (req.method === "DELETE") {
            const b = await jsonBody(req),
              old = getTemplate(db, match[1], true);
            if (!old) throw fail("Template not found.", 404);
            return reply(res, 200, {
              template: saveTemplate(db, {
                ...old,
                revision: b.revision,
                status: "archived",
                featured: false,
              }),
            });
          }
        }
      }
      if (req.method === "POST" && path === "/api/generations") {
        const s = ensureSession(req, res),
          b = await jsonBody(req);
        // Default is raw brag "Auto" planning: no template is forced. An
        // explicit template slug remains honored as optional creative
        // direction (research/template-degradation.md: augment, not delete).
        const wantsAuto =
          !b.templateSlug || b.templateSlug === AUTO_TEMPLATE_SLUG;
        let template = wantsAuto ? null : getTemplate(db, b.templateSlug, s.admin === 1);
        if (b.templateDraft) {
          requireAdmin(req);
          template = {
            ...validateTemplate(b.templateDraft),
            revision: b.templateDraft.revision || 1,
          };
        }
        if (!wantsAuto && !template)
          throw fail("Choose an available template.", 404);
        const request = normalizeRequest(b, template);
        return reply(
          res,
          202,
          publicJob(
            jobs.enqueue(s.id, b.requestId, {
              kind: "generation",
              requestId: b.requestId,
              creationId: String(b.creationId || "").slice(0, 100),
              request,
              templateSlug: request.templateSlug,
              templateRevision: request.templateRevision,
            }),
          ),
        );
      }
      if (req.method === "POST" && path === "/api/media") {
        const s = ensureSession(req, res),
          type = (req.headers["content-type"] || "").split(";")[0];
        const extensions = {
          "image/png": "png",
          "image/jpeg": "jpg",
          "image/webp": "webp",
          "video/mp4": "mp4",
          "video/webm": "webm",
          "audio/mpeg": "mp3",
          "audio/wav": "wav",
          "audio/x-wav": "wav",
          "audio/mp4": "m4a",
          "audio/ogg": "ogg",
        };
        const extension = extensions[type];
        if (!extension)
          throw fail("Use a PNG, JPEG, WebP, MP4, WebM or audio file.");
        const bytes = await body(req, 50 * 1024 * 1024);
        if (!bytes.length) throw fail("This file is empty.");
        const total = db
          .prepare("SELECT body FROM media WHERE owner=?")
          .all(s.id)
          .reduce((n, row) => n + JSON.parse(row.body).bytes, 0);
        if (total + bytes.length > 300 * 1024 * 1024)
          throw fail(
            "This beta workspace has reached its upload allowance.",
            429,
          );
        const checksum = createHash("sha256").update(bytes).digest("hex");
        const existing = db
          .prepare("SELECT body FROM media WHERE owner=?")
          .all(s.id)
          .map((r) => JSON.parse(r.body))
          .find((m) => m.sha256 === checksum);
        if (existing)
          return reply(res, 200, {
            asset: {
              id: existing.id,
              type: existing.type,
              sha256: existing.sha256,
            },
          });
        const id = randomUUID(),
          filePath = join(mediaRoot, id + "." + extension);
        writeFileSync(filePath, bytes, { flag: "wx" });
        const value = {
          id,
          type,
          extension,
          path: filePath,
          bytes: bytes.length,
          sha256: checksum,
        };
        db.prepare("INSERT INTO media VALUES(?,?,?)").run(
          id,
          s.id,
          JSON.stringify(value),
        );
        return reply(res, 201, { asset: { id, type, sha256: checksum } });
      }
      if (req.method === "POST" && path === "/api/renders") {
        const s = ensureSession(req, res),
          b = await jsonBody(req);
        if (!validateProject(b.project))
          throw fail("The video contains invalid editing data.");
        const media = {};
        for (const [assetId, id] of Object.entries(b.media || {})) {
          if (typeof id !== "string" || !SAFE_ID.test(id))
            throw fail("Invalid media reference.");
          const row = db
            .prepare("SELECT body FROM media WHERE id=? AND owner=?")
            .get(id, s.id);
          if (!row) throw fail("Upload the selected project media first.", 404);
          media[assetId] = JSON.parse(row.body);
        }
        return reply(
          res,
          202,
          publicJob(
            jobs.enqueue(s.id, b.requestId, {
              kind: "render",
              requestId: b.requestId,
              creationId: String(b.creationId || "").slice(0, 100),
              project: b.project,
              media,
              templateSlug: b.project.generation?.templateSlug || "",
              templateRevision: b.project.generation?.templateRevision || 1,
            }),
          ),
        );
      }
      if (req.method === "GET" && path === "/api/jobs") {
        const s = ensureSession(req, res);
        return reply(res, 200, {
          jobs: db
            .prepare(
              "SELECT id FROM jobs WHERE owner=? ORDER BY created DESC LIMIT 50",
            )
            .all(s.id)
            .map((r) => readJob(db, r.id, s.id))
            .filter(
              (j) =>
                !url.searchParams.get("creationId") ||
                j.creationId === url.searchParams.get("creationId"),
            )
            .map(publicJob),
        });
      }
      const jobRoute = path.match(
        /^\/api\/jobs\/([a-f0-9-]{36})(?:\/(video|poster|cancel|project))?$/,
      );
      if (jobRoute) {
        const s = session(db, req),
          job = s && readJob(db, jobRoute[1], s.id);
        if (!job) throw fail("Request not found.", 404);
        if (req.method === "POST" && jobRoute[2] === "cancel")
          return reply(res, 200, publicJob(jobs.cancel(job.id, s.id)));
        if (req.method === "GET" && !jobRoute[2])
          return reply(res, 200, publicJob(job));
        if (req.method === "GET" && jobRoute[2] === "project")
          return reply(res, 200, {
            project: job.project || null,
            plan: job.plan || null,
          });
        if (
          req.method === "GET" &&
          job.stage === "complete" &&
          ["video", "poster"].includes(jobRoute[2])
        )
          return file(
            req,
            res,
            join(
              outputRoot,
              job.id,
              jobRoute[2] === "video" ? "video.mp4" : "poster.jpg",
            ),
            jobRoute[2] === "video" ? "video/mp4" : "image/jpeg",
          );
      }
      if (req.method === "POST" && path === "/api/examples") {
        const s = ensureSession(req, res),
          b = await jsonBody(req),
          job = readJob(db, b.jobId, s.id);
        if (!job || job.kind !== "render" || job.stage !== "complete")
          throw fail("Render this video before sharing it.", 409);
        if (b.allowReuse !== true)
          throw fail(
            "Confirm that this video and its media may be public and reused.",
          );
        const title =
          typeof b.title === "string"
            ? b.title.trim().slice(0, 100)
            : job.project.title;
        if (!title) throw fail("Name the example.");
        const slug =
          title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "")
            .slice(0, 65) +
          "-" +
          randomUUID().slice(0, 8);
        const value = {
          slug,
          title,
          description:
            typeof b.description === "string"
              ? b.description.slice(0, 500)
              : "",
          templateSlug: job.templateSlug,
          videoUrl: `/api/examples/${slug}/video`,
          posterUrl: `/api/examples/${slug}/poster`,
          format: job.project.outputFormat || "16:9",
          duration: job.output.duration,
          createdAt: new Date().toISOString(),
          project: job.project,
        };
        db.prepare("INSERT INTO examples VALUES(?,?,?,?)").run(
          slug,
          s.id,
          job.id,
          JSON.stringify(value),
        );
        return reply(res, 201, { example: { ...value, project: undefined } });
      }
      const exampleRoute = path.match(
        /^\/api\/examples\/([a-z0-9-]+)(?:\/(video|poster|project|media)(?:\/([a-f0-9-]{36}))?)?$/,
      );
      if (exampleRoute) {
        const row = db
          .prepare("SELECT * FROM examples WHERE slug=?")
          .get(exampleRoute[1]);
        if (!row) throw fail("Example not found.", 404);
        const value = JSON.parse(row.body),
          job = readJob(db, row.job_id, row.owner);
        if (req.method === "DELETE") {
          const s = session(db, req);
          if (!s || (s.id !== row.owner && !s.admin))
            throw fail("Sign in as the owner to remove this example.", 403);
          db.prepare("DELETE FROM examples WHERE slug=?").run(row.slug);
          return reply(res, 200, { removed: true });
        }
        if (req.method === "GET" && exampleRoute[2] === "project") {
          const project = structuredClone(value.project);
          project.assets = project.assets.map((a) => ({
            ...a,
            publicMediaId: job.media[a.id]?.id,
          }));
          return reply(res, 200, {
            example: { ...value, project: undefined },
            project,
          });
        }
        if (req.method === "GET" && exampleRoute[2] === "media") {
          const asset = Object.values(job.media).find(
            (m) => m.id === exampleRoute[3],
          );
          if (!asset) throw fail("Media not found.", 404);
          return file(req, res, asset.path, asset.type);
        }
        if (
          req.method === "GET" &&
          ["video", "poster"].includes(exampleRoute[2])
        )
          return file(
            req,
            res,
            join(
              outputRoot,
              row.job_id,
              exampleRoute[2] === "video" ? "video.mp4" : "poster.jpg",
            ),
            exampleRoute[2] === "video" ? "video/mp4" : "image/jpeg",
          );
        if (req.method === "GET")
          return reply(res, 200, { example: { ...value, project: undefined } });
      }
      const resource = path.match(/^\/api\/resources\/([a-z0-9-]+)\/download$/);
      if (req.method === "GET" && resource) {
        const item = catalog(db).resources.find((r) => r.slug === resource[1]);
        if (!item) throw fail("Resource not found.", 404);
        const value =
          item.type === "Brand kit"
            ? JSON.stringify(item.brand, null, 2)
            : item.type === "Storyboard"
              ? JSON.stringify(
                  {
                    title: item.title,
                    frames: item.contents.map((text, order) => ({
                      text,
                      durationSeconds: 4,
                      order,
                    })),
                  },
                  null,
                  2,
                )
              : `${item.title}\n\n${item.contents.join("\n\n")}\n`;
        res.writeHead(200, {
          "Content-Type":
            item.format === "JSON"
              ? "application/json"
              : "text/plain; charset=utf-8",
          "Content-Disposition": `attachment; filename="${item.slug}.${item.format.toLowerCase()}"`,
        });
        return res.end(value);
      }
      // Live published templates get crawlable pages immediately, without a frontend rebuild.
      if (req.method === "GET" && /^\/templates\/[a-z0-9-]+\/?$/.test(path)) {
        const template = getTemplate(db, path.split("/")[2]),
          shellPath = join(websiteDist, "community.html");
        if (!existsSync(shellPath))
          throw fail("Build the website before serving production pages.", 503);
        const shell = readFileSync(shellPath, "utf8"),
          title = template
            ? template.title + " template · Storyframe"
            : "Template not found · Storyframe",
          content = template
            ? `<main><h1>${escape(template.title)}</h1><p>${escape(template.description)}</p><a href="https://studio.storyframe.yamu.app/#template=${template.slug}">Use template free</a><ol>${template.scenes.map((s) => `<li><h2>${escape(s.title)}</h2><p>${escape(s.instruction)}</p></li>`).join("")}</ol></main>`
            : '<main><h1>Template not found</h1><a href="/templates">Explore templates</a></main>';
        const page = shell
          .replace(
            /<title>[\s\S]*?<\/title>/,
            `<title>${escape(title)}</title><meta name="description" content="${escape(template?.description || "Explore Storyframe templates.")}"><link rel="canonical" href="https://storyframe.yamu.app${path.replace(/\/$/, "")}"><meta name="robots" content="${template ? "index,follow" : "noindex,follow"}">`,
          )
          .replace('<div id="root"></div>', `<div id="root">${content}</div>`);
        res.writeHead(template ? 200 : 404, {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store",
        });
        return res.end(page);
      }
      if (req.method === "GET" && path === "/sitemap.xml") {
        const p = join(websiteDist, "sitemap.xml");
        const base = existsSync(p)
          ? readFileSync(p, "utf8").replace(
              /<url><loc>[^<]*\/templates\/[^<]+<\/loc><\/url>/g,
              "",
            )
          : '<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>';
        const additions = catalog(db)
          .templates.map(
            (t) =>
              `<url><loc>https://storyframe.yamu.app/templates/${t.slug}</loc></url>`,
          )
          .join("");
        res.writeHead(200, { "Content-Type": "application/xml" });
        return res.end(base.replace("</urlset>", additions + "</urlset>"));
      }
      throw fail("Page not found.", 404);
    } catch (e) {
      if (!res.headersSent)
        reply(res, e.status || 500, {
          error: e.status ? e.message : "The request could not be completed.",
        });
      else res.end();
    }
  });
  server.requestTimeout = 120000;
  server.headersTimeout = 15000;
  server.on("close", () => {
    jobs.close();
    const wait = () => {
      if (jobs.active) setTimeout(wait, 100);
      else db.close();
    };
    wait();
  });
  return server;
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  const server = createBragServer({
    dbPath:
      process.env.STUDIO_DB || process.env.BRAG_DB || "data/studio.sqlite",
    origins: (
      process.env.BRAG_ORIGINS || "http://127.0.0.1:9180,http://localhost:9180"
    ).split(","),
    localAdmin: process.env.STORYFRAME_LOCAL_ADMIN === "1",
    adminToken: process.env.STORYFRAME_ADMIN_TOKEN || "",
    secureCookies: process.env.COOKIE_SECURE === "1",
    websiteDist: process.env.WEBSITE_DIST || resolve(root, "apps/website/dist"),
  });
  server.listen(
    Number(process.env.BRAG_PORT || 9184),
    process.env.HOST || "127.0.0.1",
    () => console.log("Storyframe creation service listening"),
  );
  for (const signal of ["SIGTERM", "SIGINT"])
    process.on(signal, () => server.close(() => process.exit(0)));
}
