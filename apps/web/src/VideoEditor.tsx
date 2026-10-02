import {
  Button,
  Field,
  IconButton,
  Badge,
  Dialog as Modal,
} from "@storyframe/ui";
import "@storyframe/ui/ui.css";
// NOTE: Retained for storyboard asset editing — core video creation tool
import React, {
  useCallback,
  useMemo,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  AudioLines,
  Check,
  ChevronDown,
  ChevronRight,
  Clapperboard,
  Copy,
  Download,
  Expand,
  Film,
  FolderOpen,
  GripVertical,
  Image as ImageIcon,
  Layers,
  LayoutTemplate,
  Lock,
  Maximize2,
  MoreHorizontal,
  MousePointer2,
  Music2,
  Pause,
  Play,
  Plus,
  Redo2,
  Scissors,
  Search,
  Settings2,
  ShieldCheck,
  SkipBack,
  SkipForward,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Type,
  Undo2,
  Unlock,
  Upload,
  Volume2,
  VolumeX,
  WandSparkles,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { clock, useFrame, usePlaying } from "./clock";
import {
  Asset,
  Project,
  Scene,
  FPS,
  MAX_SCENES,
  layout,
  reorder,
  sceneAt,
  splitScene,
  timecode,
  totalFrames,
  updateScene,
  validateProject,
} from "./model";
import { downloadJson, readMedia, storeMedia } from "./storage";
import demoData from "./demo.json";
import waveformPeaks from "./waveform.json";
import "./style.css";
import "./ai-workspace.css";
import AiPanel from "./AiPanel";
import CompositionPreview from "./CompositionPreview";
import type { SuiteProject, Storyboard } from "./suite-model";
const DEMO = demoData as Project;
const SAVE_KEY = "storyframe.project.v1";
const uid = () => crypto.randomUUID();
const formatDuration = (f: number) => `${(f / 30).toFixed(f % 30 ? 1 : 0)}s`;
function initial(): Project {
  try {
    const raw = JSON.parse(localStorage.getItem(SAVE_KEY) || "null");
    if (validateProject(raw)) return raw;
  } catch {}
  return structuredClone(DEMO);
}
export default function VideoEditor({
  initialProject,
  ownerName,
  owner,
  storyboard,
  creationId,
  onExit,
  onSave,
  sessionOnly = false,
  saveLabel = "Saved in this browser",
}: {
  sessionOnly?: boolean;
  saveLabel?: string;
  initialProject: Project;
  ownerName: string;
  owner: SuiteProject;
  storyboard?: Storyboard;
  creationId: string;
  onExit: (page?: string) => void;
  onSave: (project: Project) => void;
}) {
  const [history, setHistory] = useState<{
    past: Project[];
    present: Project;
    future: Project[];
  }>({ past: [], present: initialProject, future: [] });
  useEffect(() => {
    clock.setDuration(totalFrames(initialProject));
    clock.pause();
    clock.seek(0);
  }, []);
  const project = history.present;
  const [panelOpen, setPanelOpen] = useState(!sessionOnly);
  const saveRef = useRef(onSave);
  saveRef.current = onSave;
  useEffect(() => {
    saveRef.current(project);
    setSaveStatus(saveLabel);
  }, [project, saveLabel]);
  const [selectedId, setSelected] = useState(project.scenes[0].id);
  const [tab, setTab] = useState<"story" | "media" | "ai">("ai");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [inspector, setInspector] = useState<"scene" | "caption" | "audio">(
    "scene",
  );
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<null | "export" | "project" | "reset">(
    null,
  );
  const [toast, setToast] = useState("");
  const [appMenu, setAppMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!appMenu) return;
    const close = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setAppMenu(false);
    };
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAppMenu(false);
        menuRef.current?.querySelector("button")?.focus();
      }
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", escape);
    };
  }, [appMenu]);
  const [saveStatus, setSaveStatus] = useState(saveLabel);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const liveUrls = useRef<Record<string, string>>({});
  const [safe, setSafe] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [importing, setImporting] = useState(false);
  const [filter, setFilter] = useState("All");
  const mediaInput = useRef<HTMLInputElement>(null),
    projectInput = useRef<HTMLInputElement>(null);
  const selected =
    project.scenes.find((s) => s.id === selectedId) || project.scenes[0];
  const selectedAsset = project.assets.find((a) => a.id === selected.assetId)!;
  const notify = useCallback((message: string) => setToast(message), []);
  const commit = useCallback((fn: (p: Project) => Project) => {
    setHistory((h) => {
      const next = fn(h.present);
      return next === h.present
        ? h
        : {
            past: [...h.past.slice(-39), h.present],
            present: next,
            future: [],
          };
    });
  }, []);
  const undo = useCallback(() => {
    clock.pause();
    setHistory((h) =>
      h.past.length
        ? {
            past: h.past.slice(0, -1),
            present: h.past[h.past.length - 1],
            future: [h.present, ...h.future],
          }
        : h,
    );
  }, []);
  const redo = useCallback(() => {
    clock.pause();
    setHistory((h) =>
      h.future.length
        ? {
            past: [...h.past, h.present],
            present: h.future[0],
            future: h.future.slice(1),
          }
        : h,
    );
  }, []);
  const change = (patch: Partial<Scene>) =>
    commit((p) =>
      (selectedIds.length ? selectedIds : [selected.id]).reduce(
        (value, id) => updateScene(value, id, patch),
        p,
      ),
    );
  const resolve = (src?: string) =>
    src?.startsWith("local:") ? urls[src.slice(6)] || "" : src || "";
  const pick = (id: string, e?: React.MouseEvent) => {
    clock.pause();
    if (e?.shiftKey) {
      const ids = project.scenes.map((s) => s.id),
        a = ids.indexOf(selectedId),
        b = ids.indexOf(id);
      setSelectedIds(ids.slice(Math.min(a, b), Math.max(a, b) + 1));
    } else if (e?.metaKey || e?.ctrlKey)
      setSelectedIds((ids) =>
        ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id],
      );
    else setSelectedIds([id]);
    setSelected(id);
    const s = layout(project.scenes).find((s) => s.id === id);
    if (s) clock.seek(s.start);
  };
  useEffect(() => {
    clock.setDuration(totalFrames(project));
  }, [project]);
  useEffect(() => {
    if (modal) clock.pause();
  }, [modal]);
  useEffect(() => {
    document
      .querySelector(".scene-card.selected")
      ?.scrollIntoView({ block: "nearest" });
  }, [selectedId, tab]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 4000);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    let canceled = false;
    for (const a of project.assets) {
      for (const src of [a.src, a.poster]) {
        if (!src?.startsWith("local:")) continue;
        const id = src.slice(6);
        if (liveUrls.current[id]) continue;
        readMedia(id)
          .then((blob) => {
            if (!blob || canceled || liveUrls.current[id]) return;
            const url = URL.createObjectURL(blob);
            liveUrls.current[id] = url;
            setUrls({ ...liveUrls.current });
          })
          .catch(() =>
            notify(
              "Imported media could not be restored. Please import it again.",
            ),
          );
      }
    }
    return () => {
      canceled = true;
    };
  }, [project.assets, notify]);
  useEffect(
    () => () => {
      Object.values(liveUrls.current).forEach(URL.revokeObjectURL);
      clock.pause();
    },
    [],
  );
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        (e.target as HTMLElement).closest(
          "input,textarea,select,[contenteditable],dialog,.app-menu-anchor",
        )
      )
        return;
      if (e.code === "Space") {
        e.preventDefault();
        clock.toggle();
      }
      if (e.code === "ArrowLeft") {
        e.preventDefault();
        clock.seek(clock.frame - (e.shiftKey ? 30 : 1));
      }
      if (e.code === "ArrowRight") {
        e.preventDefault();
        clock.seek(clock.frame + (e.shiftKey ? 30 : 1));
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault();
        e.shiftKey ? redo() : undo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo]);
  const duplicate = () => {
    if (project.scenes.length >= MAX_SCENES)
      return notify("This prototype supports up to 150 scenes.");
    if (selected.locked) return;
    const id = uid();
    commit((p) => {
      const at = p.scenes.findIndex((s) => s.id === selected.id);
      return {
        ...p,
        scenes: [
          ...p.scenes.slice(0, at + 1),
          { ...selected, id, title: `${selected.title} · copy` },
          ...p.scenes.slice(at + 1),
        ],
      };
    });
    setSelected(id);
  };
  const remove = () => {
    if (project.scenes.length === 1)
      return notify("Keep at least one scene in your story.");
    if (selected.locked) return;
    commit((p) => ({
      ...p,
      scenes: p.scenes.filter((s) => s.id !== selected.id),
    }));
    setSelected(project.scenes.find((s) => s.id !== selected.id)!.id);
  };
  const split = () => {
    const active = sceneAt(project, clock.frame);
    const result = splitScene(
      project,
      active.id,
      clock.frame - active.start,
      uid(),
    );
    if (result === project)
      return notify(
        "Place the playhead at least half a second inside an unlocked scene.",
      );
    commit(() => result);
    notify("Scene split. Both source ranges are preserved.");
  };
  const move = (direction: number) => {
    const at = project.scenes.findIndex((s) => s.id === selected.id),
      target = project.scenes[at + direction];
    if (target) commit((p) => reorder(p, selected.id, target.id));
  };
  async function importFiles(files: FileList | null) {
    if (!files) return;
    setImporting(true);
    let count = 0;
    try {
      for (const file of Array.from(files)) {
        const type = file.type.startsWith("video/")
          ? "video"
          : file.type.startsWith("image/")
            ? "image"
            : file.type.startsWith("audio/")
              ? "audio"
              : null;
        if (!type) {
          notify("Use an image, video or audio file.");
          continue;
        }
        if (file.size > 250 * 1024 * 1024) {
          notify("Please use media under 250 MB for this UI preview.");
          continue;
        }
        const id = uid();
        let duration = 4,
          width = 0,
          height = 0;
        const url = URL.createObjectURL(file);
        try {
          if (type !== "image") {
            const element = document.createElement(type);
            element.preload = "metadata";
            element.src = url;
            await new Promise<void>((ok, fail) => {
              const timer = setTimeout(
                () => fail(new Error("Metadata timed out")),
                10000,
              );
              element.onloadedmetadata = () => {
                clearTimeout(timer);
                duration = element.duration;
                if (element instanceof HTMLVideoElement) {
                  width = element.videoWidth;
                  height = element.videoHeight;
                }
                ok();
              };
              element.onerror = () => {
                clearTimeout(timer);
                fail(new Error("Unsupported media"));
              };
            });
            element.removeAttribute("src");
            element.load();
            if (!Number.isFinite(duration) || duration < 0.5)
              throw new Error("Invalid duration");
          }
          await storeMedia(id, file);
          liveUrls.current[id] = url;
          setUrls({ ...liveUrls.current });
          const asset: Asset = {
            id,
            name: file.name,
            type,
            src: `local:${id}`,
            poster: type === "image" ? `local:${id}` : undefined,
            duration,
            width,
            height,
            origin: "imported",
          };
          commit((p) => ({ ...p, assets: [...p.assets, asset] }));
          count++;
        } catch (error) {
          URL.revokeObjectURL(url);
          throw error;
        }
      }
      if (count) {
        setTab("media");
        setPanelOpen(true);
        notify(
          `${count} ${count === 1 ? "asset" : "assets"} imported and saved in this browser.`,
        );
      }
    } catch {
      notify(
        "Could not save this media. Check the format and available browser storage.",
      );
    } finally {
      setImporting(false);
      if (mediaInput.current) mediaInput.current.value = "";
    }
  }
  function useAsset(asset: Asset) {
    if (asset.type === "audio") {
      commit((p) => ({ ...p, musicId: asset.id, musicMuted: false }));
      setInspector("audio");
      notify("Music track updated.");
      return;
    }
    if (project.scenes.length >= MAX_SCENES)
      return notify("Scene limit reached.");
    const id = uid();
    const s: Scene = {
      id,
      title: asset.name.replace(/\.[^.]+$/, ""),
      caption: "",
      duration: Math.min(150, Math.floor(asset.duration * 30)),
      sourceIn: 0,
      assetId: asset.id,
      kind: "footage",
      captionPosition: "top",
      captionSize: 66,
      captionVisible: true,
      scale: 1,
      locked: false,
    };
    commit((p) => ({ ...p, scenes: [...p.scenes, s] }));
    setSelected(id);
    setTab("story");
    clock.pause();
    clock.setDuration(totalFrames(project) + s.duration);
    clock.seek(totalFrames(project));
    notify("Added to the end of your story.");
  }
  async function openProject(file?: File) {
    if (!file) return;
    try {
      if (file.size > 2e6) throw new Error();
      const value = JSON.parse(await file.text());
      if (!validateProject(value)) throw new Error();
      clock.pause();
      commit(() => value);
      setSelected(value.scenes[0].id);
      clock.seek(0);
      notify("Project opened. Imported media must exist in this browser.");
    } catch {
      notify("That file is not a supported Storyframe project.");
    }
    if (projectInput.current) projectInput.current.value = "";
  }
  return (
    <div className="studio suite-editor" data-panel={tab}>
      <input
        ref={mediaInput}
        type="file"
        accept="image/*,video/*,audio/*"
        multiple
        hidden
        onChange={(e) => importFiles(e.target.files)}
      />
      <input
        ref={projectInput}
        type="file"
        accept="application/json,.json"
        hidden
        onChange={(e) => openProject(e.target.files?.[0])}
      />
      <header className="appbar">
        <div className="app-menu-anchor" ref={menuRef}>
          <button
            className={`app-menu-trigger ${appMenu ? "active" : ""}`}
            aria-label="Storyframe application menu"
            aria-expanded={appMenu}
            aria-controls="application-menu"
            onClick={() => setAppMenu(!appMenu)}
          >
            <img src="/mark.svg" alt="" />
            <ChevronDown size={14} />
          </button>
          {appMenu && (
            <div id="application-menu" className="app-menu">
              <div className="menu-brand">
                Storyframe <span>Studio · local workspace</span>
              </div>
              {[
                {
                  label: "Switch app",
                  icon: <LayoutTemplate size={18} />,
                  action: () => onExit("apps"),
                },
                {
                  label: `Back to ${ownerName}`,
                  icon: <ArrowLeft size={18} />,
                  action: () => onExit(),
                },
                {
                  label: "Project media library",
                  icon: <FolderOpen size={18} />,
                  action: () => onExit("media"),
                },
                {
                  label: "Project brand",
                  icon: <SlidersHorizontal size={18} />,
                  action: () => onExit("brand"),
                },
                {
                  label: "Story outline",
                  icon: <Layers size={18} />,
                  action: () => {
                    setTab("story");
                    setPanelOpen((v) => !v);
                  },
                },
                {
                  label: "Start from a template",
                  icon: <LayoutTemplate size={18} />,
                  action: () => {
                    setTab("ai");
                    setPanelOpen(true);
                  },
                },
                {
                  label: "Open project…",
                  icon: <FolderOpen size={18} />,
                  action: () => projectInput.current?.click(),
                },
                {
                  label: "Save project…",
                  icon: <Download size={18} />,
                  action: () => setModal("export"),
                },
                {
                  label: "Manage project media",
                  icon: <Upload size={18} />,
                  action: () => onExit("media"),
                },
                {
                  label: "Video settings",
                  icon: <Settings2 size={18} />,
                  action: () => setModal("project"),
                },
                {
                  label: "Creative direction",
                  icon: <Sparkles size={18} />,
                  action: () => (setTab("ai"), setPanelOpen(true)),
                },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    setAppMenu(false);
                    item.action();
                  }}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
              <div className="menu-shortcuts">
                <span>
                  Play / pause <kbd>Space</kbd>
                </span>
                <span>
                  Undo <kbd>⌘ / Ctrl Z</kbd>
                </span>
                <span>
                  Step a frame <kbd>← →</kbd>
                </span>
              </div>
            </div>
          )}
        </div>
        <button
          className="editor-back"
          title="Back to project"
          onClick={() => onExit()}
        >
          <ArrowLeft size={16} />
          {ownerName}
        </button>
        <span className="crumb-separator">/</span>
        <button className="app-project" onClick={() => setModal("project")}>
          {project.title}
          <ChevronDown size={14} />
        </button>
        <span className="save-indicator" title={saveStatus}>
          <Check size={15} />
          <span>
            {saveStatus === "Saved in this browser" ? "Saved" : saveStatus}
          </span>
        </span>
        <div className="app-actions">
          <div className="undo-group">
            <IconButton
              label="Undo"
              onClick={undo}
              disabled={!history.past.length}
            >
              <Undo2 size={18} />
            </IconButton>
            <IconButton
              label="Redo"
              onClick={redo}
              disabled={!history.future.length}
            >
              <Redo2 size={18} />
            </IconButton>
          </div>
          <Button
            aria-label="AI workspace"
            aria-pressed={panelOpen && tab === "ai"}
            onClick={() => {
              setTab("ai");
              setPanelOpen((v) => (tab === "ai" ? !v : true));
            }}
            variant="secondary"
            size="studio"
            className="ai-trigger"
          >
            <Sparkles size={16} />
            <span>Create with AI</span>
          </Button>
          <Button
            onClick={() => setModal("export")}
            variant="primary"
            size="studio"
          >
            Export
            <ChevronDown size={15} />
          </Button>
        </div>
      </header>
      <main className="workspace">
        {panelOpen && (
          <aside className="library editor-library">
            <div className="drawer-heading">
              <span>
                {tab === "story"
                  ? "Story outline"
                  : tab === "ai"
                    ? "AI workspace"
                    : "Project media"}
              </span>
              <IconButton
                label="Close panel"
                onClick={() => setPanelOpen(false)}
              >
                <X size={17} />
              </IconButton>
            </div>
            {tab === "story" ? (
              <>
                <div className="panel-heading">
                  <div>
                    <h2>
                      Your story <span>{project.scenes.length}</span>
                    </h2>
                  </div>
                  <IconButton
                    label="Add a scene"
                    onClick={() => {
                      setTab("media");
                      setPanelOpen(true);
                    }}
                  >
                    <Plus size={21} />
                  </IconButton>
                </div>
                <div className="story-outline">
                  <span className="outline-dot" />
                  <span>
                    Problem <ArrowRight size={12} /> Product{" "}
                    <ArrowRight size={12} /> Payoff
                  </span>
                </div>
                <div className="scene-list">
                  {layout(project.scenes).map((s, i) => {
                    const a = project.assets.find((a) => a.id === s.assetId)!;
                    return (
                      <button
                        key={s.id}
                        draggable={!s.locked}
                        onDragStart={(e) =>
                          e.dataTransfer.setData("text/storyframe-scene", s.id)
                        }
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          commit((p) =>
                            reorder(
                              p,
                              e.dataTransfer.getData("text/storyframe-scene"),
                              s.id,
                            ),
                          );
                        }}
                        className={`scene-card ${selected.id === s.id ? "selected" : ""}`}
                        onClick={() => pick(s.id)}
                        aria-label={`Select scene ${i + 1}: ${s.title}`}
                      >
                        <span className="scene-number">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="scene-poster">
                          {resolve(a.poster) ? (
                            <img
                              src={resolve(a.poster)}
                              loading="lazy"
                              alt=""
                            />
                          ) : (
                            <ImageIcon size={23} />
                          )}
                          <span>{formatDuration(s.duration)}</span>
                        </div>
                        <div className="scene-copy">
                          <strong>{s.title}</strong>
                          <span>
                            {s.kind === "product" ? (
                              <>
                                <span className="mini-dot" />
                                Real app UI
                              </>
                            ) : s.kind === "endcard" ? (
                              "Call to action"
                            ) : a.origin === "imported" ? (
                              "Your footage"
                            ) : (
                              "Generated scene"
                            )}
                          </span>
                        </div>
                        {s.locked ? (
                          <Lock size={14} />
                        ) : (
                          <GripVertical size={15} className="grip" />
                        )}
                      </button>
                    );
                  })}
                </div>
                <button className="add-scene" onClick={() => setTab("media")}>
                  <Plus size={17} />
                  Add a scene
                </button>
                <div className="library-note">
                  <ShieldCheck size={18} />
                  <span>
                    Your product stays real.
                    <br />
                    <small>Original UI, independently editable.</small>
                  </span>
                </div>
              </>
            ) : tab === "media" ? (
              <>
                <div className="panel-heading">
                  <div>
                    <h2>
                      Media library <span>{project.assets.length}</span>
                    </h2>
                  </div>
                </div>
                <Button
                  onClick={() => onExit("media")}
                  disabled={importing}
                  variant="secondary"
                  size="studio"
                  className="import-button"
                >
                  <Upload size={18} />
                  Manage project media
                </Button>
                <label className="search">
                  <Search size={17} />
                  <input
                    placeholder="Search assets"
                    aria-label="Search assets"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </label>
                <div className="filter-row">
                  {["All", "Video", "Image", "Audio"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={f === filter ? "active" : ""}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <div className="asset-grid">
                  {project.assets
                    .filter(
                      (a) =>
                        (filter === "All" || a.type === filter.toLowerCase()) &&
                        a.name.toLowerCase().includes(search.toLowerCase()),
                    )
                    .map((a) => (
                      <button
                        className="asset-card"
                        key={a.id}
                        onClick={() => useAsset(a)}
                        title={
                          a.type === "audio" ? "Use as music" : "Add to story"
                        }
                      >
                        <div>
                          {resolve(a.poster) ? (
                            <img
                              src={resolve(a.poster)}
                              alt=""
                              loading="lazy"
                            />
                          ) : a.type === "audio" ? (
                            <AudioLines size={34} />
                          ) : a.type === "video" ? (
                            <Film size={34} />
                          ) : (
                            <ImageIcon size={34} />
                          )}
                          <span className="asset-add">
                            <Plus size={16} />
                          </span>
                        </div>
                        <strong>{a.name}</strong>
                        <small>
                          {a.type} ·{" "}
                          {a.type === "image"
                            ? "still"
                            : `${a.duration.toFixed(1)}s`}
                        </small>
                      </button>
                    ))}
                </div>
                <div className="library-note">
                  <Upload size={17} />
                  <span>
                    Images, recordings & audio
                    <br />
                    <small>Kept locally in this browser.</small>
                  </span>
                </div>
              </>
            ) : (
              <AiPanel
                sessionOnly={sessionOnly}
                project={project}
                owner={owner}
                storyboard={storyboard}
                creationId={creationId}
                selectedIds={selectedIds.filter((id) =>
                  project.scenes.some((s) => s.id === id),
                )}
                urls={urls}
                onApply={(next) => {
                  clock.pause();
                  commit(() => next);
                  setSelected(next.scenes[0].id);
                  setSelectedIds([]);
                  clock.seek(0);
                }}
              />
            )}
          </aside>
        )}
        <section className="canvas-panel" aria-label="Video preview">
          <div className="canvas-toolbar">
            <span>
              <button
                title="Toggle story outline"
                aria-label="Toggle story outline"
                className={panelOpen && tab === "story" ? "active" : ""}
                onClick={() => {
                  setTab("story");
                  setPanelOpen((v) => !v);
                }}
              >
                <Layers size={16} />
              </button>
              <button
                aria-label="Add project media"
                onClick={() => {
                  setTab("media");
                  setPanelOpen(true);
                }}
              >
                <Plus size={16} />
              </button>
              <span className="toolbar-divider" />
              Preview
            </span>
            <div>
              <button
                onClick={() => setSafe(!safe)}
                className={safe ? "active" : ""}
              >
                <Maximize2 size={15} />
                Safe area
              </button>
              <span className="toolbar-divider" />
              <span className="quality-label">Fit</span>
              <IconButton
                label="Fullscreen preview"
                onClick={() => {
                  const el = document.querySelector(".canvas-panel");
                  if (document.fullscreenElement) document.exitFullscreen();
                  else
                    el?.requestFullscreen?.().catch(() =>
                      notify("Fullscreen is not available in this browser."),
                    );
                }}
              >
                <Expand size={18} />
              </IconButton>
            </div>
          </div>
          <UnifiedPreview project={project} urls={urls} safe={safe} />
          <Transport project={project} onSelect={setSelected} />
        </section>
        <aside className="inspector">
          <div className="inspector-tabs">
            {(["scene", "caption", "audio"] as const).map((t) => (
              <button
                key={t}
                className={inspector === t ? "selected" : ""}
                onClick={() => setInspector(t)}
              >
                {t === "scene" ? (
                  <SlidersHorizontal size={16} />
                ) : t === "caption" ? (
                  <Type size={16} />
                ) : (
                  <Music2 size={16} />
                )}
                <span>{t[0].toUpperCase() + t.slice(1)}</span>
              </button>
            ))}
          </div>
          <div className="inspector-scroll">
            {inspector === "scene" ? (
              <>
                <div className="selection-heading">
                  <span className="eyebrow">
                    SCENE{" "}
                    {String(project.scenes.indexOf(selected) + 1).padStart(
                      2,
                      "0",
                    )}
                  </span>
                  <IconButton
                    label={selected.locked ? "Unlock scene" : "Lock scene"}
                    onClick={() => change({ locked: !selected.locked })}
                    active={selected.locked}
                  >
                    {selected.locked ? (
                      <Lock size={16} />
                    ) : (
                      <Unlock size={16} />
                    )}
                  </IconButton>
                </div>
                <input
                  className="scene-title-input"
                  aria-label="Scene title"
                  value={selected.title}
                  disabled={selected.locked}
                  onChange={(e) => change({ title: e.target.value })}
                />
                <div className="selection-tags">
                  <Badge>
                    {selected.kind === "product"
                      ? "Real app UI"
                      : selected.kind === "endcard"
                        ? "End card"
                        : "Story scene"}
                  </Badge>
                  <span>{formatDuration(selected.duration)}</span>
                </div>
                <section className="inspector-section">
                  <div className="section-label">
                    <h3>Timing</h3>
                    <span>30 fps</span>
                  </div>
                  <div className="field-grid">
                    <label>
                      Duration{" "}
                      <div className="number-field">
                        <input
                          aria-label="Scene duration"
                          type="number"
                          step="0.5"
                          min="0.5"
                          max="60"
                          value={Number((selected.duration / 30).toFixed(2))}
                          disabled={selected.locked}
                          onChange={(e) => {
                            if (e.target.value !== "")
                              change({ duration: Number(e.target.value) * 30 });
                          }}
                        />
                        <span>s</span>
                      </div>
                    </label>
                    <label>
                      Source start
                      <div className="number-field">
                        <input
                          aria-label="Source start"
                          type="number"
                          step="0.1"
                          min="0"
                          value={selected.sourceIn}
                          disabled={
                            selected.locked || selectedAsset.type !== "video"
                          }
                          onChange={(e) => {
                            if (e.target.value !== "")
                              change({ sourceIn: Number(e.target.value) });
                          }}
                        />
                        <span>s</span>
                      </div>
                    </label>
                  </div>
                  <p className="hint">
                    Changes ripple through the story. Source playback stays at
                    natural speed.
                  </p>
                </section>
                <section className="inspector-section">
                  <div className="section-label">
                    <h3>Composition</h3>
                    <span>
                      <Lock size={12} />
                      Ratio locked
                    </span>
                  </div>
                  <label className="slider-label">
                    Scale<span>{Math.round(selected.scale * 100)}%</span>
                  </label>
                  <input
                    aria-label="Composition scale"
                    type="range"
                    min="0.8"
                    max="1.2"
                    step="0.01"
                    value={selected.scale}
                    disabled={selected.locked}
                    onChange={(e) => change({ scale: Number(e.target.value) })}
                  />
                  {selected.kind === "product" && (
                    <>
                      <Field>Environment</Field>
                      <div className="environment-grid">
                        {["pantry", "supermarket", "cellar", "desk"].map(
                          (place) => (
                            <button
                              key={place}
                              disabled={selected.locked}
                              aria-label={`Use ${place} background`}
                              className={
                                selected.phone?.includes(place)
                                  ? "selected"
                                  : ""
                              }
                              onClick={() =>
                                change({ phone: `/demo/${place}-phone.jpg` })
                              }
                            >
                              <img
                                loading="lazy"
                                src={`/demo/${place}-phone.jpg`}
                                alt=""
                              />
                              <span>{place}</span>
                            </button>
                          ),
                        )}
                      </div>
                    </>
                  )}
                  <Button
                    disabled={selected.locked}
                    onClick={() => change({ scale: 1 })}
                    variant="secondary"
                    size="studio"
                    className="text-button"
                  >
                    Reset framing
                  </Button>
                </section>
                <section className="inspector-section">
                  <div className="section-label">
                    <h3>Caption</h3>
                    <Button
                      onClick={() => setInspector("caption")}
                      variant="secondary"
                      size="studio"
                      className="text-button"
                    >
                      Edit
                      <Type size={14} />
                    </Button>
                  </div>
                  <p className="caption-excerpt">
                    {selected.caption || "No caption on this scene."}
                  </p>
                </section>
                <section className="inspector-section">
                  <h3>Source</h3>
                  <div className="source-row">
                    <span className="source-icon">
                      {selected.kind === "product" ? (
                        <MousePointer2 size={18} />
                      ) : (
                        <Film size={18} />
                      )}
                    </span>
                    <div>
                      <strong>{selectedAsset.name}</strong>
                      <small>
                        {selectedAsset.origin === "real-ui"
                          ? "App components · demo data"
                          : selectedAsset.origin === "generated"
                            ? "Generated footage · retained take"
                            : "Local asset"}
                      </small>
                    </div>
                  </div>
                  {selected.kind === "product" && (
                    <p className="hint">
                      A genuine component capture with fixture data. No live
                      backend connection.
                    </p>
                  )}
                </section>
                <div className="scene-actions">
                  <IconButton
                    label="Move scene earlier"
                    onClick={() => move(-1)}
                    disabled={
                      selected.locked || project.scenes[0].id === selected.id
                    }
                  >
                    <ArrowUp size={18} />
                  </IconButton>
                  <IconButton
                    label="Move scene later"
                    onClick={() => move(1)}
                    disabled={
                      selected.locked ||
                      project.scenes.at(-1)?.id === selected.id
                    }
                  >
                    <ArrowDown size={18} />
                  </IconButton>
                  <IconButton
                    label="Duplicate scene"
                    onClick={duplicate}
                    disabled={selected.locked}
                  >
                    <Copy size={18} />
                  </IconButton>
                  <IconButton
                    label="Delete scene"
                    onClick={remove}
                    disabled={selected.locked || project.scenes.length === 1}
                  >
                    <Trash2 size={18} />
                  </IconButton>
                </div>
              </>
            ) : inspector === "caption" ? (
              <>
                <div className="selection-heading">
                  <span className="eyebrow">EDITORIAL CAPTION</span>
                  <Type size={17} />
                </div>
                <h2 className="inspector-title">Say it simply.</h2>
                <p className="hint">One clear thought. Room for the story.</p>
                <Field htmlFor="caption-copy">Caption text</Field>
                <textarea
                  id="caption-copy"
                  value={selected.caption}
                  rows={4}
                  disabled={selected.locked}
                  onChange={(e) => change({ caption: e.target.value })}
                  maxLength={160}
                />
                <div className="character-count">
                  {selected.caption.length} / 160
                </div>
                <label className="toggle-row">
                  <span>Show caption</span>
                  <input
                    type="checkbox"
                    checked={selected.captionVisible}
                    disabled={selected.locked}
                    onChange={(e) =>
                      change({ captionVisible: e.target.checked })
                    }
                  />
                </label>
                <section className="inspector-section">
                  <h3>Placement</h3>
                  <div className="segmented">
                    <button
                      className={
                        selected.captionPosition === "top" ? "selected" : ""
                      }
                      disabled={selected.locked}
                      onClick={() => change({ captionPosition: "top" })}
                    >
                      <ArrowUp size={15} />
                      Top
                    </button>
                    <button
                      className={
                        selected.captionPosition === "bottom" ? "selected" : ""
                      }
                      disabled={selected.locked}
                      onClick={() => change({ captionPosition: "bottom" })}
                    >
                      <ArrowDown size={15} />
                      Bottom
                    </button>
                  </div>
                  <label className="slider-label">
                    Text size<span>{selected.captionSize}px</span>
                  </label>
                  <input
                    aria-label="Caption size"
                    type="range"
                    min="40"
                    max="100"
                    step="2"
                    value={selected.captionSize}
                    disabled={selected.locked}
                    onChange={(e) =>
                      change({ captionSize: Number(e.target.value) })
                    }
                  />
                  <Button
                    onClick={() => {
                      commit((p) => ({
                        ...p,
                        scenes: p.scenes.map((s) =>
                          s.locked
                            ? s
                            : {
                                ...s,
                                captionPosition: selected.captionPosition,
                                captionSize: selected.captionSize,
                              },
                        ),
                      }));
                      notify(
                        "Caption placement and size applied to unlocked scenes.",
                      );
                    }}
                    variant="secondary"
                    size="studio"
                    className="full"
                  >
                    Apply style to all scenes
                  </Button>
                </section>
                <div className="brand-rule">
                  <ShieldCheck size={19} />
                  <p>
                    Captions are separate layers. Your original footage stays
                    untouched.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="selection-heading">
                  <span className="eyebrow">THE SOUND OF YOUR STORY</span>
                  <Music2 size={18} />
                </div>
                <h2 className="inspector-title">Find the rhythm.</h2>
                <div className="music-card">
                  <span>
                    <AudioLines size={29} />
                  </span>
                  <strong>
                    {project.assets.find((a) => a.id === project.musicId)
                      ?.name || "No music selected"}
                  </strong>
                  <small>
                    {project.musicId === "music-groove"
                      ? "Michael Ramir C. · Mixkit"
                      : "Your imported audio"}
                  </small>
                  <Waveform sample={project.musicId === "music-groove"} />
                </div>
                <label className="slider-label">
                  Music level
                  <span>{Math.round(project.musicVolume * 100)}%</span>
                </label>
                <input
                  aria-label="Music volume"
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={project.musicVolume}
                  onChange={(e) =>
                    commit((p) => ({
                      ...p,
                      musicVolume: Number(e.target.value),
                    }))
                  }
                />
                <label className="toggle-row">
                  <span>Mute music</span>
                  <input
                    type="checkbox"
                    checked={project.musicMuted}
                    onChange={(e) =>
                      commit((p) => ({ ...p, musicMuted: e.target.checked }))
                    }
                  />
                </label>
                <Button
                  onClick={() => {
                    setTab("media");
                    setPanelOpen(true);
                    setFilter("Audio");
                  }}
                  variant="secondary"
                  size="studio"
                  className="full"
                >
                  Choose audio
                  <ArrowRight size={16} />
                </Button>
                <section className="inspector-section">
                  <h3>Rhythm guide</h3>
                  <div className="tempo">
                    <span>
                      120<small>BPM</small>
                    </span>
                    <Badge>4 / 4</Badge>
                  </div>
                  <p className="hint">
                    Sample music is retimed to approximately 120 BPM. The
                    preview uses a simple gain control; final mastering is a
                    later step.
                  </p>
                </section>
              </>
            )}
          </div>
        </aside>
      </main>
      <Timeline
        project={project}
        selectedId={selected.id}
        selectedIds={selectedIds}
        onSelect={pick}
        onSplit={split}
        onUndo={undo}
        onRedo={redo}
        zoom={zoom}
        setZoom={setZoom}
        onCaption={() => setInspector("caption")}
        onAudio={() => setInspector("audio")}
        onReorder={(a, b) => commit((p) => reorder(p, a, b))}
      />
      <footer className="statusbar">
        <span>
          <span className="live-dot" />
          Local workspace <i>·</i> All edits are reversible
        </span>
        <span>
          Space to play <i>·</i> ← → frame by frame <i>·</i> ⌘ Z undo
        </span>
        <span>
          UI preview <span className="version-tag">v0.1</span>
        </span>
      </footer>
      <MusicPlayback project={project} urls={urls} />
      {toast && (
        <div className="toast" role="status">
          <Check size={18} />
          {toast}
          <button aria-label="Dismiss message" onClick={() => setToast("")}>
            <X size={16} />
          </button>
        </div>
      )}
      {modal === "export" && (
        <Modal title="Take your story with you" onClose={() => setModal(null)}>
          <p className="modal-intro">
            Keep your edit flexible. Save a project to continue later.
          </p>
          <div className="export-option">
            <span className="export-icon">
              <Layers size={26} />
            </span>
            <div>
              <strong>Editable project</strong>
              <p>Scenes, captions, timing and brand settings.</p>
            </div>
            <Badge variant="success">Ready</Badge>
          </div>
          <p className="hint">
            {sessionOnly
              ? "Downloads a .json project. Demo imports last only until reset or reload and are not bundled. Keep your original files."
              : "Downloads a .json project. Imported media stays in this browser and is not bundled. Keep your original files."}
          </p>
          <Button
            onClick={() => {
              downloadJson(
                project,
                `${project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.storyframe.json`,
              );
              notify("Editable project downloaded.");
            }}
            variant="primary"
            size="studio"
            className="full"
          >
            <Download size={18} />
            Save project
          </Button>
          <div className="export-option muted">
            <span className="export-icon">
              <Film size={26} />
            </span>
            <div>
              <strong>Final video</strong>
              <p>
                {
                  (
                    {
                      "9:16": "1080 × 1920",
                      "16:9": "1920 × 1080",
                      "1:1": "1080 × 1080",
                      "4:5": "1080 × 1350",
                    } as Record<string, string>
                  )[project.outputFormat || "9:16"]
                }{" "}
                · H.264 · 30 fps
              </p>
            </div>
            <Badge>Next milestone</Badge>
          </div>
          <p className="hint">
            The server rendering pipeline is under validation. Video download
            from this editor is not connected yet; save the editable project to
            preserve your work.
          </p>
        </Modal>
      )}
      {modal === "project" && (
        <Modal title="Video settings" onClose={() => setModal(null)}>
          <Field>Video name</Field>
          <input
            aria-label="Video name"
            value={project.title}
            maxLength={80}
            onChange={(e) => commit((p) => ({ ...p, title: e.target.value }))}
          />
          <Field>
            Output size
            <select
              aria-label="Video output size"
              value={project.outputFormat || "9:16"}
              onChange={(e) =>
                commit((p) => ({
                  ...p,
                  outputFormat: e.target.value as Project["outputFormat"],
                }))
              }
            >
              {["9:16", "16:9", "1:1", "4:5"].map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </Field>
          <div className="project-spec">
            <Badge>{project.outputFormat || "9:16"}</Badge>
            <Badge>30 fps</Badge>
          </div>
          <p className="hint">
            Video size is independent of your web or mobile app. Existing scenes
            fit inside the chosen format. Changes save to this project.
          </p>
          <Button
            onClick={() => {
              projectInput.current?.click();
              setModal(null);
            }}
            variant="secondary"
            size="studio"
            className="full"
          >
            <FolderOpen size={17} />
            Open a saved project
          </Button>
          <Button
            onClick={() => {
              setModal("export");
            }}
            variant="secondary"
            size="studio"
            className="full"
          >
            <Download size={17} />
            Download this project
          </Button>
          <Button
            onClick={() => setModal("reset")}
            variant="secondary"
            size="studio"
            className="text-button danger"
          >
            Restore the sample project
          </Button>
        </Modal>
      )}
      {modal === "reset" && (
        <Modal title="Restore the sample?" onClose={() => setModal(null)}>
          <p className="modal-intro">
            The current edit will stay available through Undo. Imported media
            remains stored in this browser.
          </p>
          <Button
            onClick={() => {
              commit(() => structuredClone(DEMO));
              setSelected("scene-3");
              clock.pause();
              clock.seek(180);
              setModal(null);
            }}
            variant="primary"
            size="studio"
            className="full"
          >
            Restore Kurutu sample
          </Button>
        </Modal>
      )}
    </div>
  );
}
function Preview({
  project,
  urls,
  safe,
}: {
  project: Project;
  urls: Record<string, string>;
  safe: boolean;
}) {
  const frame = useFrame(),
    playing = usePlaying(),
    scene = sceneAt(project, frame),
    asset = project.assets.find((a) => a.id === scene.assetId)!;
  const ref = useRef<HTMLVideoElement>(null),
    stage = useRef<HTMLDivElement>(null);
  const [previewWidth, setPreviewWidth] = useState(220);
  const [outW, outH] = (project.outputFormat || "9:16").split(":").map(Number);
  const ratio = outW / outH;
  const scale = Math.min(previewWidth / 1080, previewWidth / ratio / 1920);
  const [failed, setFailed] = useState(false);
  const src = asset.src.startsWith("local:")
    ? urls[asset.src.slice(6)] || ""
    : asset.src;
  const sourceTime = scene.sourceIn + (frame - scene.start) / FPS;
  const timeRef = useRef(sourceTime);
  timeRef.current = sourceTime;
  useEffect(() => {
    const node = stage.current;
    if (!node) return;
    const fit = () => {
      const css = getComputedStyle(node);
      const w =
        node.clientWidth -
        parseFloat(css.paddingLeft) -
        parseFloat(css.paddingRight);
      const h =
        node.clientHeight -
        parseFloat(css.paddingTop) -
        parseFloat(css.paddingBottom);
      setPreviewWidth(Math.max(1, Math.min(w, h * ratio)));
    };
    const observer = new ResizeObserver(fit);
    observer.observe(node);
    fit();
    return () => observer.disconnect();
  }, [ratio]);
  useEffect(() => {
    setFailed(false);
  }, [src]);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (!playing) {
      video.pause();
      if (
        video.readyState >= 1 &&
        Math.abs(video.currentTime - sourceTime) > 0.015
      )
        video.currentTime = sourceTime;
    } else {
      if (Math.abs(video.currentTime - sourceTime) > 0.22)
        video.currentTime = sourceTime;
      if (video.paused) video.play().catch(() => {});
    }
  }, [sourceTime, playing, src]);
  return (
    <>
      <div className="preview-stage" ref={stage}>
        <div
          className="preview-frame"
          style={{
            width: previewWidth,
            height: previewWidth / ratio,
            flexShrink: 0,
            background: project.background,
          }}
        >
          <div
            className="composition"
            style={{
              transform: `scale(${scale})`,
              left: (previewWidth - 1080 * scale) / 2,
              top: (previewWidth / ratio - 1920 * scale) / 2,
              background: project.background,
            }}
          >
            <div
              className="visual-layer"
              style={{ transform: `scale(${scene.scale})` }}
            >
              {scene.kind === "product" && (
                <>
                  <img className="phone-background" src={scene.phone} alt="" />
                  <div
                    className="phone-fill"
                    style={{
                      background:
                        scene.captureTop === 545 ? "#fff" : project.background,
                    }}
                  />
                </>
              )}
              {scene.kind === "endcard" ? (
                <div
                  className="endcard"
                  style={{ color: project.brandInk || "#282828" }}
                >
                  {project.productName ? (
                    <h2 className="product-wordmark">{project.productName}</h2>
                  ) : (
                    <img src="/demo/kurutu-logo.svg" alt="Kurutu" />
                  )}
                  <h2>
                    {project.headline || (
                      <>
                        Evolve your
                        <br />
                        grocery run.
                      </>
                    )}
                  </h2>
                  <span
                    style={{
                      background: project.accent,
                      color:
                        parseInt(project.accent.slice(1, 3), 16) * 0.299 +
                          parseInt(project.accent.slice(3, 5), 16) * 0.587 +
                          parseInt(project.accent.slice(5, 7), 16) * 0.114 >
                        150
                          ? "#202020"
                          : "#ffffff",
                      boxShadow: project.productName ? "none" : undefined,
                    }}
                  >
                    Get started
                  </span>
                  <p>
                    {project.website ||
                      (project.productName ? "" : "kurutu.com")}
                  </p>
                </div>
              ) : !src || failed ? (
                <div className="missing-media">
                  <Film size={65} />
                  <p>Media unavailable</p>
                  <small>Re-import the original file to continue.</small>
                </div>
              ) : asset.type === "video" ? (
                <video
                  key={asset.id}
                  ref={ref}
                  src={src}
                  muted
                  playsInline
                  preload="auto"
                  className={
                    scene.kind === "product" ? "product-capture" : "footage"
                  }
                  style={
                    scene.kind === "product"
                      ? { top: scene.captureTop }
                      : undefined
                  }
                  onLoadedMetadata={(e) => {
                    e.currentTarget.currentTime = timeRef.current;
                  }}
                  onError={() => setFailed(true)}
                />
              ) : (
                <img className="footage" src={src} alt={asset.name} />
              )}
            </div>
            {scene.captionVisible && scene.caption && (
              <div
                className={`film-caption ${scene.kind === "product" ? "product-caption" : ""}`}
                style={{
                  fontSize: scene.captionSize,
                  top: scene.captionPosition === "top" ? 140 : "auto",
                  bottom: scene.captionPosition === "bottom" ? 190 : "auto",
                }}
              >
                {scene.caption}
              </div>
            )}
            {safe && (
              <div className="safe-area">
                <span>SAFE AREA</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
function Transport({
  project,
  onSelect,
}: {
  project: Project;
  onSelect: (id: string) => void;
}) {
  const frame = useFrame(),
    playing = usePlaying(),
    scene = sceneAt(project, frame);
  const jump = (direction: number) => {
    clock.pause();
    const all = layout(project.scenes),
      active = all.findIndex((s) => s.id === scene.id),
      next = all[Math.min(all.length - 1, Math.max(0, active + direction))];
    clock.seek(next.start);
    onSelect(next.id);
  };
  return (
    <div className="preview-controls">
      <div className="preview-context">
        <span className="scene-badge">
          {String(
            project.scenes.findIndex((s) => s.id === scene.id) + 1,
          ).padStart(2, "0")}
        </span>
        <span className="preview-title">{scene.title}</span>
        <span className="preview-spec">
          {project.outputFormat || "9:16"} · 30 fps
        </span>
      </div>
      <div className="transport">
        <span className="transport-time">
          {timecode(frame)}
          <span> / {timecode(totalFrames(project))}</span>
        </span>
        <div className="playback-buttons">
          <IconButton label="Previous scene" onClick={() => jump(-1)}>
            <SkipBack size={17} />
          </IconButton>
          <Button
            aria-label={playing ? "Pause preview" : "Play preview"}
            onClick={() => clock.toggle()}
            variant="secondary"
            size="studio"
            className="play-button"
          >
            {playing ? (
              <Pause size={18} fill="currentColor" />
            ) : (
              <Play size={18} fill="currentColor" />
            )}
          </Button>
          <IconButton label="Next scene" onClick={() => jump(1)}>
            <SkipForward size={17} />
          </IconButton>
        </div>
        <kbd className="transport-space">Space</kbd>
      </div>
    </div>
  );
}
function MusicPlayback({
  project,
  urls,
}: {
  project: Project;
  urls: Record<string, string>;
}) {
  const frame = useFrame(),
    playing = usePlaying(),
    ref = useRef<HTMLAudioElement>(null);
  const a = project.assets.find((a) => a.id === project.musicId),
    src = a?.src.startsWith("local:") ? urls[a.src.slice(6)] : a?.src;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.volume = project.musicVolume;
    el.muted = project.musicMuted;
    if (!playing) {
      el.pause();
      if (el.readyState >= 1 && Math.abs(el.currentTime - frame / 30) > 0.1)
        el.currentTime = Math.min(
          frame / 30,
          Math.max(0, (a?.duration || 0) - 0.01),
        );
    } else if (frame / 30 < (a?.duration || 0)) {
      if (Math.abs(el.currentTime - frame / 30) > 0.25)
        el.currentTime = frame / 30;
      if (el.paused) el.play().catch(() => {});
    } else el.pause();
  }, [frame, playing, project.musicMuted, project.musicVolume, a]);
  return src ? <audio ref={ref} src={src} preload="metadata" /> : null;
}
function Waveform({ sample = true }: { sample?: boolean }) {
  if (!sample) return <span className="audio-placeholder">Imported audio</span>;
  return (
    <svg
      className="waveform"
      viewBox="0 0 700 38"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {waveformPeaks.map((peak, i) => {
        const h = 3 + peak * 31;
        return (
          <line
            key={i}
            x1={i * 4}
            x2={i * 4}
            y1={19 - h / 2}
            y2={19 + h / 2}
            stroke="currentColor"
            strokeWidth="2"
          />
        );
      })}
    </svg>
  );
}
function Playhead({ pixelsPerFrame }: { pixelsPerFrame: number }) {
  const frame = useFrame();
  return (
    <div
      className="playhead"
      style={{ transform: `translateX(${frame * pixelsPerFrame}px)` }}
    >
      <span />
    </div>
  );
}
function Timeline({
  project,
  selectedId,
  selectedIds,
  onSelect,
  onSplit,
  zoom,
  setZoom,
  onCaption,
  onAudio,
  onReorder,
}: {
  project: Project;
  selectedId: string;
  selectedIds: string[];
  onSelect: (id: string, e?: React.MouseEvent) => void;
  onSplit: () => void;
  onUndo: () => void;
  onRedo: () => void;
  zoom: number;
  setZoom: (n: number) => void;
  onCaption: () => void;
  onAudio: () => void;
  onReorder: (a: string, b: string) => void;
}) {
  const area = useRef<HTMLDivElement>(null),
    [width, setWidth] = useState(1100);
  const scenes = layout(project.scenes),
    total = totalFrames(project);
  const ppf = Math.max((width - 28) / Math.max(total, 300), 0.42) * zoom;
  const contentWidth = Math.max(width - 20, total * ppf + 28);
  const tickSeconds =
    [1, 2, 5, 10, 15, 30, 60].find((n) => n * FPS * ppf >= 48) || 60;
  useEffect(() => {
    if (!area.current) return;
    const o = new ResizeObserver(() => setWidth(area.current!.clientWidth));
    o.observe(area.current);
    return () => o.disconnect();
  }, []);
  const scrub = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    clock.pause();
    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);
    const seek = (clientX: number) => {
      const r = el.getBoundingClientRect();
      clock.seek((clientX - r.left) / ppf);
    };
    seek(e.clientX);
    const move = (ev: PointerEvent) => seek(ev.clientX);
    const end = () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", end);
      el.removeEventListener("pointercancel", end);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
  };
  return (
    <section className="timeline" aria-label="Timeline">
      <div className="timeline-toolbar">
        <div>
          <h2>Timeline</h2>
          <span className="timeline-count">
            {project.scenes.length} scenes <i>·</i> {formatDuration(total)}
          </span>
        </div>
        <div className="timeline-tools">
          <IconButton label="Select tool" active>
            <MousePointer2 size={17} />
          </IconButton>
          <IconButton label="Split at playhead" onClick={onSplit}>
            <Scissors size={18} />
          </IconButton>
          <span className="toolbar-divider" />
          <span className="snap-label">
            <Check size={14} />
            Frame snapping
          </span>
        </div>
        <div className="zoom-tools">
          <IconButton
            label="Zoom out timeline"
            onClick={() => setZoom(Math.max(0.6, zoom - 0.2))}
          >
            <ZoomOut size={18} />
          </IconButton>
          <input
            aria-label="Timeline zoom"
            type="range"
            min="0.6"
            max="3"
            step="0.1"
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
          />
          <IconButton
            label="Zoom in timeline"
            onClick={() => setZoom(Math.min(3, zoom + 0.2))}
          >
            <ZoomIn size={18} />
          </IconButton>
        </div>
      </div>
      <div className="timeline-body">
        <div className="track-labels">
          <div className="ruler-label">30 FPS</div>
          <div>
            <Film size={16} />
            <span>Picture</span>
            <Layers size={14} />
          </div>
          <button onClick={onCaption}>
            <Type size={16} />
            <span>Captions</span>
          </button>
          <button onClick={onAudio}>
            <Music2 size={16} />
            <span>Music</span>
            {project.musicMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
        </div>
        <div className="timeline-scroll" ref={area}>
          <div className="timeline-content" style={{ width: contentWidth }}>
            <div
              className="ruler"
              onPointerDown={scrub}
              aria-label="Scrub timeline"
            >
              {Array.from(
                { length: Math.ceil(total / (tickSeconds * FPS)) + 1 },
                (_, i) => (
                  <span key={i} style={{ left: i * tickSeconds * FPS * ppf }}>
                    {`${String(Math.floor((i * tickSeconds) / 60)).padStart(2, "0")}:${String((i * tickSeconds) % 60).padStart(2, "0")}`}
                    <i />
                  </span>
                ),
              )}
            </div>
            <div className="picture-track">
              {scenes.map((s, i) => {
                const a = project.assets.find((a) => a.id === s.assetId)!;
                return (
                  <button
                    key={s.id}
                    className={`timeline-clip ${s.kind === "product" ? "product" : ""} ${(selectedIds.length ? selectedIds.includes(s.id) : s.id === selectedId) ? "selected" : ""}`}
                    style={{
                      left: s.start * ppf,
                      width: Math.max(1, s.duration * ppf - 3),
                    }}
                    aria-pressed={selectedIds.includes(s.id)}
                    onClick={(e) => onSelect(s.id, e)}
                    draggable={!s.locked}
                    onDragStart={(e) =>
                      e.dataTransfer.setData("text/storyframe-scene", s.id)
                    }
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      onReorder(
                        e.dataTransfer.getData("text/storyframe-scene"),
                        s.id,
                      );
                    }}
                    title={`${s.title} · ${formatDuration(s.duration)}`}
                  >
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <strong>{s.title}</strong>
                    {a.poster?.startsWith("/demo/") && (
                      <img loading="lazy" src={a.poster} alt="" />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="caption-track">
              {scenes
                .filter((s) => s.caption && s.captionVisible)
                .map((s) => (
                  <button
                    style={{ left: s.start * ppf, width: s.duration * ppf - 3 }}
                    key={s.id}
                    title={s.caption}
                    onClick={() => {
                      onSelect(s.id);
                      onCaption();
                    }}
                  >
                    <Type size={11} />
                    {s.caption}
                  </button>
                ))}
            </div>
            <div className="music-track">
              {project.musicId && (
                <button
                  className={project.musicMuted ? "muted" : ""}
                  style={{
                    width:
                      Math.min(
                        total,
                        (project.assets.find((a) => a.id === project.musicId)
                          ?.duration || 0) * 30,
                      ) * ppf,
                  }}
                  onClick={onAudio}
                >
                  <Waveform sample={project.musicId === "music-groove"} />
                  <span>
                    <Music2 size={11} />
                    {project.assets.find((a) => a.id === project.musicId)?.name}
                  </span>
                </button>
              )}
            </div>
            <Playhead pixelsPerFrame={ppf} />
          </div>
        </div>
      </div>
    </section>
  );
}
function GeneratedPreview({
  project,
  urls,
}: {
  project: Project;
  urls: Record<string, string>;
}) {
  const frame = useFrame(),
    playing = usePlaying();
  return (
    <div className="generated-preview-stage">
      <CompositionPreview
        project={project}
        urls={urls}
        time={frame / 30}
        playing={playing}
        fit
      />
    </div>
  );
}
function UnifiedPreview({
  project,
  urls,
  safe,
}: {
  project: Project;
  urls: Record<string, string>;
  safe: boolean;
}) {
  const frame = useFrame();
  const silent = useMemo(() => ({ ...project, musicMuted: true }), [project]);
  return sceneAt(project, frame).layout ? (
    <GeneratedPreview project={silent} urls={urls} />
  ) : (
    <Preview project={project} urls={urls} safe={safe} />
  );
}
