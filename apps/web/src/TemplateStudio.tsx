import { Button, Field, Badge } from "@storyframe/ui";
import "@storyframe/ui/ui.css";
import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Copy, Plus, Save, Sparkles, Trash2 } from "lucide-react";
import { type CatalogTemplate, TEMPLATE_CATEGORIES } from "@storyframe/catalog";
import { refreshCatalog } from "@storyframe/catalog/react";
import {
  applyGeneration,
  generationContext,
} from "@storyframe/core/generation";
import { blankBrand, makeVideo, type SuiteProject } from "./suite-model";
import type { Project } from "./model";
import { api } from "./AiPanel";
import CompositionPreview from "./CompositionPreview";
import "./workspace-layout.css";
export default function TemplateStudio() {
  const [admin, setAdmin] = useState(false),
    [token, setToken] = useState(""),
    [items, setItems] = useState<CatalogTemplate[]>([]),
    [draft, setDraft] = useState<CatalogTemplate | null>(null),
    [isNew, setNew] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(""),
    [query, setQuery] = useState(""),
    [instruction, setInstruction] = useState(""),
    [preview, setPreview] = useState<Project | null>(null);
  const [section, setSection] = useState<"details" | "direction" | "scenes">(
    "direction",
  );
  const layoutPreview = useMemo(() => {
    if (!draft) return null;
    const owner: SuiteProject = {
      id: "layout-preview",
      folderId: "admin",
      name: "Template preview",
      description: "",
      brand: {
        ...blankBrand(),
        background: "#ffffff",
        accent: "#2142e7",
        ink: "#182b4e",
      },
      apps: [],
      sources: [],
      media: [],
      creations: [],
      metrics: [],
    };
    const video = makeVideo(owner, draft.title, draft.format);
    return {
      ...video,
      scenes: draft.scenes.map((scene, i) => ({
        ...video.scenes[0],
        id: "scene-" + i,
        title: scene.title,
        caption: scene.title,
        captionVisible: true,
        duration: scene.seconds * 30,
        layout: "title" as const,
        motion: "slide" as const,
      })),
    };
  }, [draft]);
  async function load() {
    const session = await api("/api/session");
    setAdmin(session.admin);
    if (session.admin) {
      const data = await api("/api/admin/templates");
      setItems(data.templates);
      setDraft((d) => d || data.templates[0]);
    }
  }
  useEffect(() => {
    void load().catch((e) => setError(e.message));
  }, []);
  function patch(values: Partial<CatalogTemplate>) {
    setDraft((d) => (d ? { ...d, ...values } : null));
    setNotice("");
  }
  async function action(name: string, fn: () => Promise<void>) {
    setBusy(name);
    setError("");
    try {
      await fn();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy("");
    }
  }
  function duplicate() {
    if (!draft) return;
    setDraft({
      ...draft,
      slug: "",
      title: draft.title + " copy",
      status: "draft",
      featured: false,
      revision: undefined,
    });
    setNew(true);
    setPreview(null);
    setSection("details");
    setNotice("Choose a unique URL slug, then save the draft.");
  }
  async function save() {
    if (!draft) return;
    const data = await api(
      isNew ? "/api/admin/templates" : "/api/admin/templates/" + draft.slug,
      { method: isNew ? "POST" : "PUT", body: JSON.stringify(draft) },
    );
    setDraft(data.template);
    setNew(false);
    await load();
    await refreshCatalog();
    setNotice(
      data.template.status === "published"
        ? "Published to the website and Studio library."
        : "Draft saved.",
    );
  }
  async function generatePreview() {
    if (!draft) return;
    const owner: SuiteProject = {
      id: "template-preview",
      folderId: "admin",
      name: "Sample product",
      description: draft.sampleBrief || "",
      brand: {
        ...blankBrand(),
        background: "#ffffff",
        accent: "#2142e7",
        ink: "#182b4e",
        font: "Inter",
      },
      apps: [],
      sources: [],
      media: [],
      creations: [],
      metrics: [],
    };
    const original = makeVideo(owner, draft.title, draft.format);
    let job = await api("/api/generations", {
      method: "POST",
      body: JSON.stringify({
        requestId: crypto.randomUUID(),
        creationId: "template-preview-" + draft.slug,
        templateSlug: draft.slug,
        templateDraft: draft,
        scope: "new",
        prompt:
          draft.sampleBrief ||
          "Demonstrate this template using only the supplied sample product facts.",
        context: generationContext(owner, original),
      }),
    });
    setNotice("Preview request " + job.id + " is saved on the server.");
    while (["queued", "planning"].includes(job.stage)) {
      await new Promise((r) => setTimeout(r, 1200));
      job = await api("/api/jobs/" + job.id);
    }
    if (job.stage !== "ready")
      throw new Error(job.error || "Preview did not finish.");
    setPreview(applyGeneration(original, job, "new", []));
  }
  if (!admin)
    return (
      <main className="template-access">
        <a href="/">
          <ArrowLeft size={17} />
          Studio
        </a>
        <h1>Template studio</h1>
        <p>Manage the shared library and preview AI directions.</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void action("Signing in", async () => {
              await api("/api/admin/session", {
                method: "POST",
                body: JSON.stringify({ token }),
              });
              setToken("");
              await load();
            });
          }}
        >
          <Field>
            Admin access key
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              autoComplete="current-password"
            />
          </Field>
          <Button
            type="submit"
            disabled={!!busy}
            variant="primary"
            size="studio"
          >
            Sign in
          </Button>
        </form>
        {error && <p role="alert">{error}</p>}
      </main>
    );
  return (
    <div className="suite-shell template-studio">
      <header className="appbar suite-appbar">
        <Button href="/" variant="subtle" size="studio">
          <ArrowLeft size={17} />
          Studio
        </Button>
        <strong>Template studio</strong>
        <span className="template-count">{items.length} templates</span>
        <Button
          disabled={!!busy}
          onClick={duplicate}
          variant="secondary"
          size="studio"
        >
          <Plus size={17} />
          New template
        </Button>
      </header>
      <div className="template-workspace">
        <aside className="template-list">
          <Field>
            <span className="page-eyebrow">Library</span>
            <input
              aria-label="Find a template"
              placeholder="Search templates"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </Field>
          {items
            .filter((t) =>
              `${t.title} ${t.status}`
                .toLowerCase()
                .includes(query.toLowerCase()),
            )
            .map((t) => (
              <Button
                key={t.slug}
                variant="subtle"
                size="studio"
                aria-pressed={draft?.slug === t.slug && !isNew}
                onClick={() => {
                  if (
                    draft &&
                    JSON.stringify(draft) !==
                      JSON.stringify(
                        items.find((i) => i.slug === draft.slug),
                      ) &&
                    !window.confirm("Discard unsaved template changes?")
                  )
                    return;
                  setDraft(t);
                  setNew(false);
                  setPreview(null);
                  setNotice("");
                }}
              >
                <strong>{t.title}</strong>
                <small>
                  {t.status} · v{t.revision}
                </small>
              </Button>
            ))}
        </aside>
        {draft && (
          <main className="template-form">
            <div className="template-form-heading">
              <div>
                <span className="page-eyebrow">Template editor</span>
                <h1>{isNew ? "New template" : draft.title}</h1>
              </div>
              <Button
                disabled={!!busy}
                onClick={() => void action("Saving", save)}
                variant="primary"
                size="studio"
              >
                <Save size={17} />
                {busy || "Save changes"}
              </Button>
            </div>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            {notice && (
              <p className="hint" role="status">
                {notice}
              </p>
            )}
            <nav className="template-tabs" aria-label="Template settings">
              {(["direction", "scenes", "details"] as const).map((id) => (
                <Button
                  key={id}
                  variant="subtle"
                  size="studio"
                  aria-pressed={section === id}
                  onClick={() => setSection(id)}
                >
                  {id === "direction"
                    ? "AI direction"
                    : id === "scenes"
                      ? "Scene structure"
                      : "Publishing"}
                </Button>
              ))}
            </nav>
            <div className="template-edit-columns">
              <div className="template-edit-fields">
                {section === "direction" && (
                  <>
                    <Field>
                      Creative direction
                      <textarea
                        rows={8}
                        value={draft.prompt || ""}
                        onChange={(e) => patch({ prompt: e.target.value })}
                      />
                    </Field>
                    <Field>
                      Improve with AI
                      <input
                        value={instruction}
                        placeholder="e.g. Make the opening more product-focused"
                        onChange={(e) => setInstruction(e.target.value)}
                      />
                    </Field>
                    <Button
                      variant="secondary"
                      size="studio"
                      disabled={!!busy || !instruction.trim()}
                      onClick={() =>
                        void action("Improving prompt", async () => {
                          const data = await api(
                            "/api/admin/templates/improve",
                            {
                              method: "POST",
                              body: JSON.stringify({
                                template: draft,
                                instruction,
                              }),
                            },
                          );
                          patch({ prompt: data.prompt });
                          setNotice(
                            "Direction updated. Preview and save when ready.",
                          );
                        })
                      }
                    >
                      <Sparkles size={17} />
                      Improve direction
                    </Button>
                    <Field>
                      Sample product facts
                      <textarea
                        rows={3}
                        value={draft.sampleBrief || ""}
                        placeholder="Product name, features and audience for your test."
                        onChange={(e) => patch({ sampleBrief: e.target.value })}
                      />
                    </Field>
                    <Button
                      variant="primary"
                      size="studio"
                      disabled={!!busy || !draft.sampleBrief?.trim() || isNew}
                      onClick={() =>
                        void action("Generating preview", generatePreview)
                      }
                    >
                      <Sparkles size={17} />
                      Generate preview
                    </Button>
                  </>
                )}
                {section === "details" && (
                  <>
                    <Field>
                      Template name
                      <input
                        value={draft.title}
                        onChange={(e) => patch({ title: e.target.value })}
                      />
                    </Field>
                    <Field>
                      Description
                      <textarea
                        rows={3}
                        value={draft.description}
                        onChange={(e) => patch({ description: e.target.value })}
                      />
                    </Field>
                    <div className="template-fields">
                      <Field>
                        Visibility
                        <select
                          value={draft.status}
                          onChange={(e) => patch({ status: e.target.value })}
                        >
                          {["draft", "published", "archived"].map((v) => (
                            <option key={v}>{v}</option>
                          ))}
                        </select>
                      </Field>
                      <Field>
                        Category
                        <select
                          value={draft.category}
                          onChange={(e) =>
                            patch({
                              category: e.target
                                .value as CatalogTemplate["category"],
                            })
                          }
                        >
                          {TEMPLATE_CATEGORIES.map((v) => (
                            <option key={v}>{v}</option>
                          ))}
                        </select>
                      </Field>
                      <Field>
                        Format
                        <select
                          value={draft.format}
                          onChange={(e) =>
                            patch({
                              format: e.target
                                .value as CatalogTemplate["format"],
                            })
                          }
                        >
                          {["16:9", "9:16", "1:1"].map((v) => (
                            <option key={v}>{v}</option>
                          ))}
                        </select>
                      </Field>
                      <Field>
                        Product
                        <select
                          value={draft.platform}
                          onChange={(e) =>
                            patch({
                              platform: e.target
                                .value as CatalogTemplate["platform"],
                            })
                          }
                        >
                          {["Web", "Mobile", "Any"].map((v) => (
                            <option key={v}>{v}</option>
                          ))}
                        </select>
                      </Field>
                    </div>
                    <Field>
                      URL slug
                      <input
                        disabled={!isNew}
                        value={draft.slug}
                        onChange={(e) => patch({ slug: e.target.value })}
                      />
                    </Field>
                    <label className="template-check">
                      <input
                        type="checkbox"
                        checked={draft.featured}
                        onChange={(e) => patch({ featured: e.target.checked })}
                      />
                      Feature on the homepage
                    </label>
                  </>
                )}
                {section === "scenes" && (
                  <>
                    {draft.scenes.map((scene, i) => (
                      <section className="template-scene" key={i}>
                        <span>{i + 1}</span>
                        <Field>
                          Scene title
                          <input
                            value={scene.title}
                            onChange={(e) =>
                              patch({
                                scenes: draft.scenes.map((s, n) =>
                                  n === i ? { ...s, title: e.target.value } : s,
                                ),
                              })
                            }
                          />
                        </Field>
                        <Field>
                          Seconds
                          <input
                            type="number"
                            min={1}
                            max={30}
                            value={scene.seconds}
                            onChange={(e) =>
                              patch({
                                scenes: draft.scenes.map((s, n) =>
                                  n === i
                                    ? { ...s, seconds: Number(e.target.value) }
                                    : s,
                                ),
                              })
                            }
                          />
                        </Field>
                        <Field className="scene-instruction">
                          Instruction
                          <textarea
                            rows={3}
                            value={scene.instruction}
                            onChange={(e) =>
                              patch({
                                scenes: draft.scenes.map((s, n) =>
                                  n === i
                                    ? { ...s, instruction: e.target.value }
                                    : s,
                                ),
                              })
                            }
                          />
                        </Field>
                        <Button
                          variant="subtle"
                          size="studio"
                          aria-label={`Remove scene ${i + 1}`}
                          disabled={draft.scenes.length === 1}
                          onClick={() =>
                            patch({
                              scenes: draft.scenes.filter((_, n) => n !== i),
                            })
                          }
                        >
                          <Trash2 size={16} />
                        </Button>
                      </section>
                    ))}
                    <Button
                      variant="secondary"
                      size="studio"
                      disabled={draft.scenes.length >= 12}
                      onClick={() =>
                        patch({
                          scenes: [
                            ...draft.scenes,
                            {
                              title: "New scene",
                              instruction: "Show a specific product benefit.",
                              seconds: 4,
                            },
                          ],
                        })
                      }
                    >
                      <Plus size={16} />
                      Add scene
                    </Button>
                  </>
                )}
              </div>
              <aside className="template-preview-column">
                <div className="section-heading">
                  <h2>{preview ? "Generated preview" : "Structure preview"}</h2>
                  <Badge
                    variant={
                      draft.status === "published" ? "accent" : "neutral"
                    }
                  >
                    {draft.status}
                  </Badge>
                </div>
                {(preview || layoutPreview) && (
                  <PreviewPlayer
                    key={draft.slug}
                    project={(preview || layoutPreview)!}
                  />
                )}
                <p className="hint">
                  {preview
                    ? "Generated from the sample facts and current direction."
                    : "Scene headings show the structure. Generate a preview to test the AI direction."}
                </p>
              </aside>
            </div>
            <div className="template-bottom-actions">
              <Button variant="subtle" size="studio" onClick={duplicate}>
                <Copy size={16} />
                Duplicate
              </Button>
              <Button
                variant="subtle"
                size="studio"
                disabled={isNew || !!busy}
                onClick={() =>
                  void action("Archiving", async () => {
                    const data = await api(
                      "/api/admin/templates/" + draft.slug,
                      {
                        method: "DELETE",
                        body: JSON.stringify({ revision: draft.revision }),
                      },
                    );
                    setDraft(data.template);
                    await load();
                    await refreshCatalog();
                    setNotice(
                      "Archived. Existing videos and prior versions are preserved.",
                    );
                  })
                }
              >
                <Trash2 size={16} />
                Archive
              </Button>
              <Button
                variant="subtle"
                size="studio"
                href={
                  (typeof window !== "undefined" &&
                  ["127.0.0.1", "localhost"].includes(window.location.hostname)
                    ? "http://127.0.0.1:9182"
                    : "https://storyframe.yamu.app") +
                  "/templates/" +
                  draft.slug
                }
              >
                Website page
              </Button>
            </div>
          </main>
        )}
      </div>
    </div>
  );
}
function PreviewPlayer({ project }: { project: Project }) {
  const [time, setTime] = useState(0.8);
  return (
    <>
      <div
        className="template-preview-frame"
        style={{
          aspectRatio: project.outputFormat?.replace(":", "/") || "16/9",
        }}
      >
        <CompositionPreview project={project} time={time} fit />
      </div>
      <Field>
        Preview time
        <input
          type="range"
          min={0}
          max={project.scenes.reduce((n, s) => n + s.duration / 30, 0) - 0.04}
          step={0.0333}
          value={time}
          onChange={(e) => setTime(Number(e.target.value))}
        />
      </Field>
    </>
  );
}
