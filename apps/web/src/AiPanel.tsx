import { Button, Field, IconButton, Dialog as Modal } from "@storyframe/ui";
import "@storyframe/ui/ui.css";
import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, History, Loader2, Sparkles } from "lucide-react";
import { useCatalog } from "@storyframe/catalog/react";
import {
  applyGeneration,
  generationContext,
  type AiScope,
  type GenerationResult,
} from "@storyframe/core/generation";
import type { Project } from "./model";
import type { SuiteProject, Storyboard } from "./suite-model";
import { listVersions, saveVersion, type SavedVersion } from "./versions";
import CompositionPreview from "./CompositionPreview";
export async function api(path: string, options: RequestInit = {}) {
  const response = await fetch(path, {
    credentials: "same-origin",
    ...options,
    headers: {
      ...(options.body && typeof options.body === "string"
        ? { "Content-Type": "application/json" }
        : {}),
      ...options.headers,
    },
  });
  const data = await response.json();
  if (!response.ok)
    throw Object.assign(new Error(data.error || "The request failed."), {
      status: response.status,
    });
  return data;
}
export default function AiPanel({
  project,
  owner,
  storyboard,
  creationId,
  selectedIds,
  onApply,
  urls,
  sessionOnly = false,
}: {
  sessionOnly?: boolean;
  project: Project;
  owner: SuiteProject;
  storyboard?: Storyboard;
  creationId: string;
  selectedIds: string[];
  onApply: (p: Project) => void;
  urls: Record<string, string>;
}) {
  const catalog = useCatalog(),
    [template, setTemplate] = useState(
      project.templateSlug || project.generation?.templateSlug || "auto",
    ),
    [prompt, setPrompt] = useState(""),
    [scope, setScope] = useState<AiScope>("all"),
    [auto, setAuto] = useState(
      () =>
        typeof localStorage === "undefined" ||
        localStorage.getItem("storyframe.ai.autoApply") !== "false",
    ),
    [busy, setBusy] = useState(""),
    [error, setError] = useState(""),
    [proposal, setProposal] = useState<{
      project: Project;
      base: string;
      scope: AiScope;
      ids: string[];
    } | null>(null),
    [versions, setVersions] = useState<SavedVersion[]>([]),
    [showVersions, setShowVersions] = useState(false),
    [resourceIds, setResourceIds] = useState<string[]>([]);
  const current = useRef(project);
  current.current = project;
  const stopped = useRef(false);
  useEffect(() => {
    stopped.current = false;
    if (!sessionOnly) {
      listVersions(creationId)
        .then(setVersions)
        .catch(() => {});
      const raw = sessionStorage.getItem("storyframe.pending." + creationId);
      if (raw) {
        try {
          void finish(JSON.parse(raw));
        } catch {
          setError("The saved request could not be recovered.");
        }
      }
    }
    return () => {
      stopped.current = true;
    };
  }, [creationId]);
  useEffect(() => {
    if (selectedIds.length) setScope("selected");
  }, [selectedIds.join(",")]);
  function signature(p: Project, s: AiScope, ids: string[]) {
    return JSON.stringify(
      s === "selected"
        ? {
            brand: [p.background, p.accent, p.brandInk],
            format: p.outputFormat,
            scenes: p.scenes.filter((scene) => ids.includes(scene.id)),
            assets: p.assets,
          }
        : p,
    );
  }
  async function apply(next: Project, base: string, s: AiScope, ids: string[]) {
    if (signature(current.current, s, ids) !== base) {
      setError(
        "These scenes changed while AI was working. The proposal is saved in history. Generate a new edit from the current timeline.",
      );
      return;
    }
    const snapshot = current.current;
    await saveVersion(creationId, snapshot, "Before AI edit");
    if (current.current !== snapshot) {
      setError("The timeline changed while saving. Apply the proposal again.");
      return;
    }
    const merged =
      s === "selected"
        ? {
            ...snapshot,
            scenes: snapshot.scenes.map((scene) =>
              ids.includes(scene.id)
                ? next.scenes.find((n) => n.id === scene.id) || scene
                : scene,
            ),
            assets: [
              ...snapshot.assets,
              ...next.assets.filter(
                (a) =>
                  !snapshot.assets.some((existing) => existing.id === a.id),
              ),
            ],
            generation: next.generation,
          }
        : next;
    await saveVersion(creationId, merged, "AI edit");
    if (stopped.current) return;
    if (current.current !== snapshot) {
      setError(
        "The timeline changed while saving. Your proposed version is in history.",
      );
      return;
    }
    onApply(merged);
    setProposal(null);
    sessionStorage.removeItem("storyframe.pending." + creationId);
    setVersions(await listVersions(creationId));
  }
  type Pending = {
    id?: string;
    requestId: string;
    original: Project;
    base: string;
    scope: AiScope;
    actualScope: AiScope;
    ids: string[];
    auto: boolean;
  };
  async function finish(p: Pending) {
    setBusy("Resuming your request");
    setError("");
    try {
      let job = p.id
        ? await api("/api/jobs/" + p.id)
        : (await api("/api/jobs")).jobs.find(
            (j: { request_key?: string; requestId?: string }) =>
              j.requestId === p.requestId,
          );
      if (!job)
        throw new Error(
          "Submission could not be confirmed. Check again before starting another request.",
        );
      while (["queued", "planning"].includes(job.stage)) {
        if (stopped.current) return;
        setBusy(
          job.stage === "queued"
            ? "Waiting for AI capacity"
            : "Planning your edit",
        );
        await new Promise((r) => setTimeout(r, 1200));
        job = await api("/api/jobs/" + job.id);
      }
      if (stopped.current) return;
      if (job.stage !== "ready") {
        sessionStorage.removeItem("storyframe.pending." + creationId);
        throw new Error(job.error || "The request did not finish.");
      }
      const next = applyGeneration(
        p.original,
        job as GenerationResult,
        p.actualScope,
        p.ids,
      );
      const existing = await listVersions(creationId);
      if (!existing.some((v) => v.project.generation?.jobId === job.id))
        await saveVersion(creationId, next, "AI proposal");
      if (stopped.current) return;
      setProposal({ project: next, base: p.base, scope: p.scope, ids: p.ids });
      setVersions(await listVersions(creationId));
      if (p.auto) await apply(next, p.base, p.scope, p.ids);
    } catch (e) {
      if (!stopped.current) setError((e as Error).message);
    } finally {
      if (!stopped.current) setBusy("");
    }
  }
  async function generate() {
    if (sessionOnly) return;
    const saved = sessionStorage.getItem("storyframe.pending." + creationId);
    if (saved) {
      await finish(JSON.parse(saved));
      return;
    }
    setError("");
    setBusy("Submitting your request");
    const original = structuredClone(project),
      ids = [...selectedIds],
      requestId = crypto.randomUUID();
    const actualScope: AiScope =
      !project.generation &&
      project.scenes.length === 1 &&
      project.scenes[0].kind === "endcard" &&
      scope === "all"
        ? "new"
        : scope;
    const pending: Pending = {
      requestId,
      original,
      base: signature(original, scope, ids),
      scope,
      actualScope,
      ids,
      auto,
    };
    sessionStorage.setItem(
      "storyframe.pending." + creationId,
      JSON.stringify(pending),
    );
    try {
      const request = {
        requestId,
        creationId,
        prompt,
        scope: actualScope,
        selectedIds: ids,
        templateSlug: template,
        resourceIds,
        context: generationContext(owner, original, storyboard),
        parentJobId: project.generation?.jobId,
      };
      const job = await api("/api/generations", {
        method: "POST",
        body: JSON.stringify(request),
      });
      pending.id = job.id;
      sessionStorage.setItem(
        "storyframe.pending." + creationId,
        JSON.stringify(pending),
      );
      await finish(pending);
    } catch (e) {
      if (
        (
          e as Error & {
            status?: number;
          }
        ).status
      )
        sessionStorage.removeItem("storyframe.pending." + creationId);
      setError((e as Error).message);
      setBusy("");
    }
  }
  async function restore(version: SavedVersion) {
    await saveVersion(creationId, project, "Before restoring a version");
    onApply(structuredClone(version.project));
    setVersions(await listVersions(creationId));
    setShowVersions(false);
  }
  if (sessionOnly)
    return (
      <div className="ai-panel">
        <h2>Create and edit with AI</h2>
        <p>
          Open Studio to create a video with your project’s brand and media.
        </p>
        <a
          className="sf-button sf-button-primary sf-button-studio"
          href={
            typeof window !== "undefined" &&
            ["127.0.0.1", "localhost"].includes(window.location.hostname)
              ? "http://127.0.0.1:9180/"
              : "https://studio.storyframe.yamu.app/"
          }
          target="_top"
        >
          Open Studio
        </a>
      </div>
    );
  return (
    <div className="ai-panel">
      <div className="ai-panel-intro">
        <Sparkles size={21} />
        <h2>Create and edit with AI</h2>
        <p>Describe the result. Keep control of every scene.</p>
      </div>
      <div className="ai-context">
        <span className="brand-dots">
          {[owner.brand.background, owner.brand.accent, owner.brand.ink].map(
            (color, i) => (
              <i key={i} style={{ background: color }} />
            ),
          )}
        </span>
        <div>
          <strong>{owner.name}</strong>
          <small>
            {project.assets.length} assets
            {storyboard
              ? ` · ${storyboard.frames.length} storyboard frames`
              : ""}
          </small>
        </div>
        <IconButton
          label="Version history"
          onClick={() => setShowVersions(!showVersions)}
        >
          <History size={18} />
        </IconButton>
      </div>
      <Field>
        Creative direction
        <select
          aria-label="AI creative direction"
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
        >
          <option value="auto">Auto · plan from your project</option>
          {catalog.templates.map((t) => (
            <option key={t.slug} value={t.slug}>
              {t.title}
            </option>
          ))}
        </select>
      </Field>
      <Field>
        Edit scope
        <select
          aria-label="AI edit scope"
          value={scope}
          onChange={(e) => setScope(e.target.value as AiScope)}
        >
          <option value="all">Whole video · preserve locked scenes</option>
          <option value="selected" disabled={!selectedIds.length}>
            {selectedIds.length} selected scene
            {selectedIds.length !== 1 ? "s" : ""}
          </option>
        </select>
      </Field>
      <Field>
        Video or edit request
        <textarea
          aria-label="Describe your video or edit"
          rows={5}
          value={prompt}
          maxLength={5000}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Create a product demo, shorten this scene, or change the tone…"
        />
      </Field>
      <details className="ai-resources">
        <summary>Add a resource or skill</summary>
        {catalog.resources
          .filter((r) => r.type !== "Brand kit")
          .map((r) => (
            <label key={r.slug}>
              <input
                type="checkbox"
                checked={resourceIds.includes(r.slug)}
                onChange={() =>
                  setResourceIds((ids) =>
                    ids.includes(r.slug)
                      ? ids.filter((id) => id !== r.slug)
                      : [...ids, r.slug].slice(0, 8),
                  )
                }
              />
              <span>
                {r.title}
                <small>{r.type}</small>
              </span>
            </label>
          ))}
      </details>
      <label className="ai-apply-option">
        <input
          type="checkbox"
          checked={auto}
          onChange={(e) => {
            setAuto(e.target.checked);
            localStorage.setItem(
              "storyframe.ai.autoApply",
              String(e.target.checked),
            );
          }}
        />
        <span>
          Apply AI changes immediately
          <small>Every version stays in your history.</small>
        </span>
      </label>
      <Button
        disabled={
          !!busy ||
          !prompt.trim() ||
          (scope === "selected" && !selectedIds.length)
        }
        onClick={generate}
        variant="primary"
        size="studio"
        className="full"
      >
        {busy ? <Loader2 size={17} className="spin" /> : <Sparkles size={17} />}{" "}
        {busy || "Create with AI"}
      </Button>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      {catalog.error && <p className="hint">{catalog.error}</p>}
      {proposal && (
        <section className="ai-proposal">
          <h3>Proposed version</h3>
          <CompositionPreview project={proposal.project} urls={urls} />
          <Button
            onClick={() =>
              void apply(
                proposal.project,
                proposal.base,
                proposal.scope,
                proposal.ids,
              ).catch((e) => setError(e.message))
            }
            variant="primary"
            size="studio"
            className="full"
          >
            Apply to timeline <ArrowRight size={16} />
          </Button>
          <Button
            onClick={() => {
              setProposal(null);
              sessionStorage.removeItem("storyframe.pending." + creationId);
            }}
            variant="secondary"
            size="studio"
            className="full"
          >
            Keep current video
          </Button>
        </section>
      )}
      {showVersions && (
        <section className="ai-history">
          <h3>Version history</h3>
          {versions.length ? (
            versions.slice(0, 40).map((v) => (
              <Button
                variant="secondary"
                size="studio"
                key={v.id}
                onClick={() =>
                  void restore(v).catch((e) => setError(e.message))
                }
              >
                <strong>{v.label}</strong>
                <small>{new Date(v.createdAt).toLocaleString()}</small>
              </Button>
            ))
          ) : (
            <p className="hint">
              Your first AI edit will save both versions here.
            </p>
          )}
        </section>
      )}
      <p className="hint">
        Shift-click or ⌘/Ctrl-click timeline blocks to select a group. Locked
        scenes stay unchanged.
      </p>
    </div>
  );
}
