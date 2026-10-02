import { readFile, writeFile, mkdir, copyFile, stat } from "node:fs/promises";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
import { compositionDocument } from "../../packages/composition/src/index.mjs";
import { fail } from "./catalog.mjs";
const root = fileURLToPath(new URL("../../", import.meta.url));
export function command(binary, args, { cwd, timeout = 300000 } = {}) {
  return new Promise((ok, no) => {
    const child = spawn(binary, args, {
      cwd,
      env: {
        ...process.env,
        DO_NOT_TRACK: "1",
        HYPERFRAMES_TELEMETRY_DISABLED: "1",
      },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let log = "";
    const collect = (data) => {
      log = (log + data.toString()).slice(-100000);
    };
    child.stdout.on("data", collect);
    child.stderr.on("data", collect);
    const timer = setTimeout(() => {
      child.kill("SIGTERM");
      no(new Error("Video processing timed out."));
    }, timeout);
    child.on("error", (e) => {
      clearTimeout(timer);
      no(e);
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      code === 0
        ? ok(log)
        : no(
            Object.assign(new Error("Video processing failed."), {
              detail: log,
            }),
          );
    });
  });
}
export async function renderProject({
  id,
  project,
  media,
  outputRoot,
  onStage = () => {},
}) {
  if (project.scenes.some((s) => !s.layout))
    throw fail(
      "This video includes legacy scenes. Export support for those scenes is not validated yet.",
      422,
    );
  const dir = join(outputRoot, id),
    composition = join(dir, "composition");
  await mkdir(join(composition, "assets"), { recursive: true });
  const mediaUrls = {};
  for (const asset of project.assets) {
    const uploaded = media[asset.id];
    if (uploaded) {
      const target = "assets/" + uploaded.id + "." + uploaded.extension;
      await copyFile(uploaded.path, join(composition, target));
      mediaUrls[asset.id] = target;
    } else if (
      /^\/demo\/(?:template-[012]|brand-canvas)\.svg$/.test(asset.src)
    ) {
      const name = asset.src.slice(6);
      await copyFile(
        join(root, "apps/web/public/demo", name),
        join(composition, "assets", name),
      );
      mediaUrls[asset.id] = "assets/" + name;
    } else if (
      project.scenes.some(
        (s) => s.assetId === asset.id && s.kind !== "endcard",
      ) ||
      project.musicId === asset.id
    )
      throw fail("Upload the original media before exporting.");
  }
  await copyFile(
    join(root, "node_modules/gsap/dist/gsap.min.js"),
    join(composition, "assets/gsap.min.js"),
  );
  await copyFile(
    join(
      root,
      "node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
    ),
    join(composition, "assets/inter.woff2"),
  );
  await writeFile(
    join(composition, "index.html"),
    compositionDocument(project, { mediaUrls }),
  );
  await writeFile(join(dir, "project.json"), JSON.stringify(project, null, 2), {
    flag: "wx",
  });
  const cli = join(root, "node_modules/hyperframes/bin/hyperframes.mjs");
  onStage("validating");
  let checks;
  try {
    checks = await command(process.execPath, [cli, "check", "--json"], {
      cwd: composition,
    });
    await writeFile(join(dir, "check.json"), checks);
  } catch (e) {
    await writeFile(join(dir, "check-failed.log"), e.detail || e.message);
    throw fail(
      "The composition needs a layout correction before export. Your edit is preserved.",
      422,
    );
  }
  onStage("rendering");
  const logs = await command(
    process.execPath,
    [
      cli,
      "render",
      "--quality",
      "draft",
      "--workers",
      "1",
      "--output",
      join(dir, "video.mp4"),
    ],
    { cwd: composition, timeout: 600000 },
  );
  await writeFile(join(dir, "render.log"), logs);
  const probe = JSON.parse(
    await command("ffprobe", [
      "-v",
      "error",
      "-show_format",
      "-show_streams",
      "-of",
      "json",
      join(dir, "video.mp4"),
    ]),
  );
  const duration = project.scenes.reduce((n, s) => n + s.duration / 30, 0),
    actual = Number(probe.format?.duration);
  if (!Number.isFinite(actual) || Math.abs(actual - duration) > 0.15)
    throw fail("The encoded duration did not match the timeline.", 422);
  await command("ffmpeg", [
    "-n",
    "-ss",
    String(Math.min(0.9, duration / 2)),
    "-i",
    join(dir, "video.mp4"),
    "-frames:v",
    "1",
    join(dir, "poster.jpg"),
  ]);
  const bytes = await readFile(join(dir, "video.mp4")),
    checksum = createHash("sha256").update(bytes).digest("hex");
  await writeFile(
    join(dir, "manifest.json"),
    JSON.stringify(
      {
        id,
        createdAt: new Date().toISOString(),
        duration: actual,
        sha256: checksum,
        bytes: bytes.length,
        renderer: "hyperframes@0.8.111",
        project: "project.json",
        video: "video.mp4",
        poster: "poster.jpg",
        review:
          "Technical validation only; watch and listen before publishing.",
      },
      null,
      2,
    ),
  );
  return {
    duration: actual,
    sha256: checksum,
    bytes: (await stat(join(dir, "video.mp4"))).size,
  };
}
