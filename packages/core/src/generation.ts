import { validateProject, type Project, type Scene, type Asset } from "./model";
import { newId, type SuiteProject, type Storyboard } from "./suite-model";
export type AiScope = "new" | "all" | "selected";
export type CreativePlan = {
  title: string;
  angle: string;
  shareCopy: string;
  scenes: {
    id?: string;
    title: string;
    caption: string;
    seconds: number;
    assetId: string | null;
    layout: "title" | "product" | "device" | "split";
    motion: "fade" | "slide" | "zoom" | "none";
  }[];
};
export type GenerationResult = {
  id: string;
  templateSlug: string;
  templateRevision: number;
  plan: CreativePlan;
};
export function generationContext(
  owner: SuiteProject,
  video: Project,
  board?: Storyboard,
) {
  return {
    product: {
      name: owner.name,
      description: owner.description,
      apps: owner.apps.map((a) => ({
        name: a.name,
        platform: a.platform,
        url: a.url,
      })),
    },
    brand: { ...owner.brand, components: owner.brand.components?.slice(0, 12) },
    storyboard: board?.frames
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((f) => ({ text: f.text, seconds: f.durationSeconds })),
    video: {
      title: video.title,
      brief: video.brief,
      format: video.outputFormat || "16:9",
      scenes: video.scenes.map((s) => ({
        id: s.id,
        title: s.title,
        caption: s.caption,
        seconds: s.duration / 30,
        sourceIn: s.sourceIn,
        assetId: s.assetId,
        locked: s.locked,
        layout: s.layout,
        motion: s.motion,
      })),
    },
    media: video.assets.map((a) => ({
      id: a.id,
      name: a.name,
      type: a.type,
      duration: a.duration,
      origin: a.origin,
    })),
  };
}
export function applyGeneration(
  base: Project,
  result: GenerationResult,
  scope: AiScope,
  selectedIds: string[],
): Project {
  const known = new Map(base.assets.map((a) => [a.id, a]));
  const targets = base.scenes.filter(
    (s) => !s.locked && (scope !== "selected" || selectedIds.includes(s.id)),
  );
  if (!targets.length) throw new Error("Choose at least one unlocked scene.");
  if (
    !result.plan ||
    !Array.isArray(result.plan.scenes) ||
    !result.plan.scenes.length ||
    result.plan.scenes.length > 24
  )
    throw new Error("The generated plan has no valid scenes.");
  if (
    scope === "selected" &&
    (new Set(result.plan.scenes.map((s) => s.id)).size !== targets.length ||
      result.plan.scenes.length !== targets.length ||
      result.plan.scenes.some((s) => !targets.some((t) => t.id === s.id)))
  )
    throw new Error("The AI changed the requested scene scope.");
  // Typography has its own still canvas; never inherit a short video's trim limits.
  const canvas = base.assets.find(
    (a) => a.src === "/demo/brand-canvas.svg",
  ) || {
    id: newId(),
    name: "Brand canvas",
    type: "image" as const,
    src: "/demo/brand-canvas.svg",
    duration: 120,
    origin: "brand" as const,
  };
  const assets =
    result.plan.scenes.some((s) => s.assetId === null) && !known.has(canvas.id)
      ? [...base.assets, canvas]
      : base.assets;
  const generated = result.plan.scenes.map((s, i): Scene => {
    const previous =
      scope === "selected"
        ? targets.find((t) => t.id === s.id)!
        : targets[Math.min(i, targets.length - 1)];
    const asset = s.assetId === null ? canvas : known.get(s.assetId)!;
    if (s.assetId && !known.has(s.assetId))
      throw new Error("The AI referenced media outside this project.");
    if (!asset) throw new Error("No project canvas or media is available.");
    if (!Number.isFinite(s.seconds))
      throw new Error("The AI returned invalid timing.");
    if (asset.type === "audio")
      throw new Error("Audio cannot replace the picture.");
    const seconds = Math.max(0.5, Math.min(120, s.seconds));
    const sourceIn = asset.id === previous.assetId ? previous.sourceIn : 0;
    return {
      ...previous,
      id: scope === "selected" ? previous.id : newId(),
      title: s.title,
      caption: s.caption,
      duration: Math.round(
        Math.min(
          seconds,
          asset.type === "video"
            ? Math.max(0.5, asset.duration - sourceIn)
            : seconds,
        ) * 30,
      ),
      sourceIn,
      assetId: asset.id,
      kind: s.assetId ? "footage" : "endcard",
      layout: s.layout,
      motion: s.motion,
      captionVisible: true,
      locked: false,
    };
  });
  let scenes: Scene[];
  if (scope === "selected")
    scenes = base.scenes.map((s) => generated.find((g) => g.id === s.id) || s);
  else if (base.scenes.some((s) => s.locked)) {
    if (generated.length !== targets.length)
      throw new Error(
        "Keep the number of unlocked scenes while this video contains locked scenes.",
      );
    let i = 0;
    scenes = base.scenes.map((s) => (s.locked ? s : generated[i++]));
  } else scenes = generated;
  const next = {
    ...base,
    assets,
    title: scope === "new" ? result.plan.title : base.title,
    scenes,
    generation: {
      jobId: result.id,
      templateSlug: result.templateSlug,
      templateRevision: result.templateRevision,
    },
  };
  if (!validateProject(next))
    throw new Error(
      "The generated edit could not be validated. Your video is unchanged.",
    );
  return next;
}
