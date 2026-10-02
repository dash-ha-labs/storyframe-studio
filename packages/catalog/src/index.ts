import seeds from "./seeds.json" with { type: "json" };
export type TemplateCategory =
  | "Launches"
  | "Product updates"
  | "Feature demos"
  | "Free trials"
  | "YouTube"
  | "Social ads"
  | "Websites"
  | "Mobile apps"
  | "Education"
  | "Customer stories";
export type CatalogTemplate = {
  slug: string;
  title: string;
  category: TemplateCategory;
  platform: "Web" | "Mobile" | "Any";
  format: "16:9" | "9:16" | "1:1";
  style: "Clean" | "Bold" | "Editorial";
  description: string;
  proof: string;
  audience: string;
  scenes: { title: string; instruction: string; seconds: number }[];
  duration: number;
  color: string;
  featured: boolean;
  prompt?: string;
  motion?: string;
  layout?: string;
  revision?: number;
  status?: string;
  sampleBrief?: string;
};
export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  "Launches",
  "Product updates",
  "Feature demos",
  "Free trials",
  "YouTube",
  "Social ads",
  "Websites",
  "Mobile apps",
  "Education",
  "Customer stories",
];
export type ResourceType =
  "Brief" | "Brand kit" | "Checklist" | "Storyboard" | "Script" | "Prompt pack";
export type CatalogResource = {
  slug: string;
  title: string;
  type: ResourceType;
  description: string;
  contents: string[];
  use: string;
  template: string;
  format: "TXT" | "JSON";
  downloadLabel: string;
  color: string;
  brand?: {
    background: string;
    accent: string;
    ink: string;
    font: string;
    voice: string;
  };
};

export const TEMPLATES = seeds.templates as CatalogTemplate[];
export const RESOURCES = seeds.resources as CatalogResource[];
export function resourceDownload(resource: CatalogResource): string {
  if (resource.type === "Brand kit")
    return JSON.stringify(resource.brand, null, 2);
  if (resource.type === "Storyboard")
    return JSON.stringify(
      {
        title: resource.title,
        frames: resource.contents.map((text, order) => ({
          text,
          durationSeconds: 4,
          order,
        })),
      },
      null,
      2,
    );
  return `${resource.title.toUpperCase()}\n\n${resource.contents.map((text, i) => `${i + 1}. ${text}`).join("\n")}\n`;
}
export function filterTemplates(
  search: URLSearchParams,
  templates: CatalogTemplate[] = TEMPLATES,
): CatalogTemplate[] {
  const q = (search.get("q") || "").trim().toLowerCase();
  const matches = templates.filter(
    (t) =>
      (!q ||
        `${t.title} ${t.description} ${t.category} ${t.platform}`
          .toLowerCase()
          .includes(q)) &&
      (["category", "platform", "format", "style"] as const).every(
        (key) =>
          !search.getAll(key).length || search.getAll(key).includes(t[key]),
      ) &&
      (!search.get("duration") ||
        (search.get("duration") === "short"
          ? t.duration <= 30
          : t.duration > 30)),
  );
  const sort = search.get("sort");
  return [...matches].sort((a, b) =>
    sort === "name"
      ? a.title.localeCompare(b.title)
      : sort === "duration"
        ? a.duration - b.duration || a.title.localeCompare(b.title)
        : Number(b.featured) - Number(a.featured),
  );
}

export type PublishedExample = {
  slug: string;
  title: string;
  description: string;
  templateSlug: string;
  videoUrl: string;
  posterUrl: string;
  format: string;
  duration: number;
  createdAt: string;
};
export type PublicCatalog = {
  templates: CatalogTemplate[];
  resources: CatalogResource[];
  examples: PublishedExample[];
};
export const SEED_CATALOG: PublicCatalog = {
  templates: TEMPLATES,
  resources: RESOURCES,
  examples: [],
};
export function catalogLink(
  base: string,
  kind: "template" | "resource" | "example",
  slug: string,
) {
  return `${base.replace(/#.*$/, "")}#${kind}=${encodeURIComponent(slug)}`;
}
