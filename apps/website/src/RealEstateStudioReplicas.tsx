import React from 'react';
import {
  ArrowLeft, ArrowRight, Check, Clapperboard, Clock, Globe, Plus,
  Trash2, Wand2, Code2, Upload, Palette, Sparkles, History, Loader2,
  Maximize2, Expand, Layers, Film, Type, Music2, Volume2, MousePointer2,
  Scissors, ZoomIn, ZoomOut, SkipBack, SkipForward, Pause, Play,
} from 'lucide-react';

/**
 * High-fidelity DOM replicas of the real Storyframe Studio surfaces
 * (apps/web) for the /real-estate marketing page. Rendered inside a scaled
 * mini-viewport so proportions stay true to the shipped app. Marketing page
 * only: no backend, no provider calls, no live editor iframe. Every control
 * below mirrors markup the app really renders — visual illustration, not an
 * interactive workflow.
 */

const RE_TOUR_VIDEO_SRC = '/media/realtor-tour-placeholder.webm';

const FRAMES = [
  { title: 'Drone arrival', text: 'Aerial push-in over the treeline, golden hour. Establish the property from above.', dur: 3.5, img: 0 },
  { title: 'The meadow',    text: 'Slow pan across the meadow. Caption the acreage and light.',                     dur: 3.0, img: 1 },
  { title: 'Pasture walk',  text: 'Ground-level walk along the fence line, steady speed.',                          dur: 2.5, img: 2 },
  { title: 'The farmhouse', text: 'Rise to the farmhouse facade. Facts overlay: beds, baths, sq ft.',                dur: 4.0, img: 3 },
];

function ReplicaFrame({ kind, children }: { kind: string; children: React.ReactNode }) {
  return (
    <div className={`re-replica re-replica-${kind}`} aria-hidden="true">
      <div className="re-replica-chrome">
        <span className="re-replica-dot" />
        <span className="re-replica-dot" />
        <span className="re-replica-dot" />
        <span className="re-replica-url">studio.storyframe.yamu.app</span>
      </div>
      <div className="re-replica-screen">
        <div className="re-replica-stage">{children}</div>
      </div>
    </div>
  );
}

/* 1 — Paste listing: Suite SetupWizard step 3 "From URL" surface
   (source-methods → suite-field → url-actions → micro-note → brand-found),
   with the listing URL typing itself and the found-brand confirmation. */
function ReplicaPasteListing() {
  return (
    <ReplicaFrame kind="paste">
      <div className="suite-dialog replica-paste-card">
        <div className="dialog-title"><h2>Give your product a home.</h2></div>
        <div className="wizard-steps">
          {['Project', 'Your apps', 'Brand design', 'Review'].map((s, i) => (
            <div key={s} className={i === 2 ? 'active' : i < 2 ? 'complete' : ''}>
              <span>{i < 2 ? <Check size={14} /> : i + 1}</span>{s}
            </div>
          ))}
        </div>
        <div className="wizard-body">
          <h3 className="replica-wizard-h3">Bring your identity with you.</h3>
          <p>Capture what exists, import a reference, or build something new.</p>
          <div className="source-methods">
            {[
              { icon: <Globe size={20} />, name: 'From URL', sel: true },
              { icon: <Code2 size={20} />, name: 'From codebase' },
              { icon: <Upload size={20} />, name: 'Import files' },
              { icon: <Palette size={20} />, name: 'Start fresh' },
            ].map((m) => (
              <button key={m.name} type="button" className={m.sel ? 'selected' : ''}>
                {m.icon}{m.name}
              </button>
            ))}
          </div>
          <label className="suite-field">Zillow listing URL
            <span className="replica-url-typed">
              <input type="url" defaultValue="https://www.zillow.com/homedetails/118-Meadow-Rd" readOnly />
              <i className="replica-caret" />
            </span>
          </label>
          <div className="url-actions">
            <button className="button primary" type="button"><Wand2 size={16} />Generate</button>
            <button className="button" type="button">Skip — start fresh</button>
          </div>
          <p className="micro-note">Reads listing photos, facts, floor plan and description for your tour.</p>
          <div className="brand-found" role="status">
            <div className="found-swatches">
              <i style={{ background: '#fdfcf8' }} />
              <i style={{ background: '#1f4d3a' }} />
              <i style={{ background: '#182b4e' }} />
            </div>
            <div>
              <strong>Listing captured · 118 Meadow Rd</strong>
              <small>Imported from zillow.com/homedetails/118-Meadow-Rd · 18 photos</small>
            </div>
            <Check size={17} />
          </div>
        </div>
      </div>
    </ReplicaFrame>
  );
}

/* 2 — Storyboard: StoryboardWorkspace (page-eyebrow, title input, meta badges,
   frame-canvas-grid of frame-cards) with frames populating one by one. */
function ReplicaStoryboard() {
  const total = FRAMES.reduce((a, f) => a + f.dur, 0);
  return (
    <ReplicaFrame kind="storyboard">
      <div className="replica-storyboard">
        <div className="storyboard-heading">
          <div className="storyboard-heading-info">
            <span className="page-eyebrow">STORYBOARD CANVAS</span>
            <input className="storyboard-title-input" defaultValue="118 Meadow Rd — virtual tour" readOnly aria-label="Storyboard title" />
            <div className="storyboard-meta-row">
              <span className="storyboard-meta-badge"><Clapperboard size={15} /> 4 frames</span>
              <span className="storyboard-meta-badge"><Clock size={15} /> {total.toFixed(1)}s total duration</span>
              <span className="storyboard-meta-tag">M2 Visual Canvas</span>
            </div>
          </div>
          <div className="storyboard-actions">
            <button className="button primary" type="button"><Plus size={17} /> Add frame</button>
          </div>
        </div>
        <div className="frame-canvas-grid">
          {FRAMES.map((f, i) => (
            <div key={f.title} className={`frame-card re-frame-${i}`} role="listitem">
              <div className="frame-card-header">
                <div className="frame-sequence-badge">
                  <span className="frame-number">Frame {i + 1}</span>
                  <span className="frame-order-meta">Order #{i}</span>
                </div>
                <div className="frame-reorder-group">
                  <button className="icon-button" type="button" disabled aria-label="Move earlier"><ArrowLeft size={16} /></button>
                  <button className="icon-button" type="button" disabled aria-label="Move later"><ArrowRight size={16} /></button>
                  <button className="icon-button frame-delete-btn" type="button" disabled aria-label="Delete frame"><Trash2 size={16} /></button>
                </div>
              </div>
              <div className="frame-visual-preview">
                <img src={`/media/realtor/realtor-still-${f.img}.jpg`} alt="" className="frame-preview-image" loading="lazy" />
              </div>
              <label className="suite-field frame-field">
                Script &amp; scene description
                <textarea rows={2} defaultValue={f.text} readOnly />
              </label>
              <label className="suite-field frame-field">
                Duration (seconds)
                <div className="frame-duration-input-wrapper">
                  <input type="number" defaultValue={f.dur} readOnly />
                  <span className="frame-unit-label">seconds</span>
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </ReplicaFrame>
  );
}

/* 3 — AI Scene Gen: Studio AI Panel (apps/web/src/AiPanel.tsx) with project context,
   creative direction, prompt, loading state animation (scanning, progress bar,
   step tracker) transitioning into realistic tour scene proposal and applied confirmation. */
function ReplicaAiSceneGen() {
  return (
    <ReplicaFrame kind="generate">
      <div className="replica-ai-studio">
        <aside className="editor-library replica-ai-sidebar">
          <div className="ai-panel">
            <div className="ai-panel-intro">
              <Sparkles size={19} />
              <h2>Create and edit with AI</h2>
              <p>Describe the result. Keep control of every scene.</p>
            </div>
            <div className="ai-context">
              <span className="brand-dots">
                <i style={{ background: '#fdfcf8' }} />
                <i style={{ background: '#1f4d3a' }} />
                <i style={{ background: '#182b4e' }} />
              </span>
              <div>
                <strong>118 Meadow Rd</strong>
                <small>18 assets · 4 storyboard frames</small>
              </div>
              <button className="icon-button" type="button" disabled aria-label="Version history">
                <History size={16} />
              </button>
            </div>
            <label className="suite-field re-ai-field">
              Creative direction
              <select disabled defaultValue="auto">
                <option value="auto">Auto · plan from your project</option>
              </select>
            </label>
            <label className="suite-field re-ai-field">
              Edit scope
              <select disabled defaultValue="all">
                <option value="all">Whole video · preserve locked scenes</option>
              </select>
            </label>
            <label className="suite-field re-ai-field">
              Video or edit request
              <textarea
                rows={3}
                readOnly
                defaultValue="Generate a 4-scene cinematic tour: aerial reveal, meadow walk, farmhouse facade, and branded agency endcard."
              />
            </label>
            <label className="ai-apply-option">
              <input type="checkbox" defaultChecked disabled />
              <span>
                Apply AI changes immediately
                <small>Every version stays in your history.</small>
              </span>
            </label>
            <div className="re-ai-btn-stack">
              <button className="button primary studio full re-ai-btn-busy" type="button" disabled>
                <Loader2 size={16} className="spin" /> Planning your edit...
              </button>
              <button className="button primary studio full re-ai-btn-done" type="button" disabled>
                <Check size={16} /> Applied 4 scenes to timeline
              </button>
            </div>
            <div className="re-ai-proposal-pill">
              <span className="re-ai-pill-tag">AI Proposal</span>
              <span>4 scenes · 13.0s · 1080p</span>
            </div>
          </div>
        </aside>

        <section className="canvas-panel replica-ai-canvas">
          <div className="canvas-toolbar">
            <span>
              <button className="icon-button" type="button" disabled aria-label="Toggle story outline"><Layers size={15} /></button>
              <button className="icon-button" type="button" disabled aria-label="Add project media"><Plus size={15} /></button>
              <span className="toolbar-divider" />
              Preview
            </span>
            <div>
              <button className="canvas-btn active" type="button" disabled><Maximize2 size={14} /> Safe area</button>
              <span className="toolbar-divider" />
              <span className="quality-label">Fit</span>
              <button className="icon-button" type="button" disabled aria-label="Fullscreen preview"><Expand size={16} /></button>
            </div>
          </div>

          <div className="preview-stage replica-ai-stage">
            {/* Loading state overlay: pulsing scanner, progress bar, pipeline steps */}
            <div className="re-ai-loading-overlay" aria-hidden="true">
              <div className="re-ai-loading-card">
                <div className="re-ai-loading-header">
                  <Sparkles size={18} className="re-ai-sparkle-pulse" />
                  <strong>Planning your tour with AI...</strong>
                </div>
                <p>Analyzing 18 property photos &amp; listing metadata</p>
                <div className="re-ai-progress-track">
                  <div className="re-ai-progress-fill" />
                </div>
                <div className="re-ai-steps-list">
                  <div className="re-ai-step re-step-1">
                    <Check size={13} className="re-check" />
                    <span>Listing facts parsed (4 beds, 3.5 baths, 3,420 sq ft)</span>
                  </div>
                  <div className="re-ai-step re-step-2">
                    <Check size={13} className="re-check" />
                    <span>Shot sequence generated (Aerial → Meadow → Facade)</span>
                  </div>
                  <div className="re-ai-step re-step-3">
                    <Loader2 size={13} className="spin re-spinner" />
                    <span>Synthesizing camera motion &amp; captions...</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Realistic generated output */}
            <div className="re-ai-output-layer">
              <div className="re-ai-output-frame">
                <img
                  src="/media/realtor/realtor-still-0.jpg"
                  alt=""
                  className="re-ai-output-img"
                  loading="lazy"
                />
                <div className="re-ai-output-hud">
                  <div className="re-ai-hud-top">
                    <span className="re-ai-hud-badge">PROPOSAL · SCENE 1 OF 4</span>
                    <span className="re-ai-output-banner">
                      <Check size={13} /> AI Generation complete · 4 scenes synced
                    </span>
                    <span className="re-ai-hud-time">00:03.5 / 00:13.0</span>
                  </div>
                  <div className="re-ai-hud-bottom">
                    <div className="re-ai-lower-third">
                      <div className="re-ai-lt-title">118 MEADOW ROAD</div>
                      <div className="re-ai-lt-sub">AERIAL ARRIVAL · 3,420 SQ FT</div>
                    </div>
                    <div className="re-ai-hud-specs">
                      <span>4 BEDS</span>
                      <i>•</i>
                      <span>3.5 BATHS</span>
                      <i>•</i>
                      <span>2.4 ACRES</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="preview-controls replica-ai-controls">
            <div className="preview-context">
              <span className="scene-badge">01</span>
              <span className="preview-title">Aerial arrival</span>
              <span className="preview-spec">16:9 · 30 fps</span>
            </div>
            <div className="transport">
              <span className="transport-time">00:03:15 <span>/ 00:13:00</span></span>
              <div className="playback-buttons">
                <button className="icon-button" type="button" disabled aria-label="Previous scene"><SkipBack size={15} /></button>
                <button className="button secondary studio play-button" type="button" disabled aria-label="Play preview"><Play size={16} fill="currentColor" /></button>
                <button className="icon-button" type="button" disabled aria-label="Next scene"><SkipForward size={15} /></button>
              </div>
              <kbd className="transport-space">Space</kbd>
            </div>
          </div>
        </section>
      </div>
    </ReplicaFrame>
  );
}

function ReplicaWaveform() {
  const bars = [10, 16, 7, 20, 14, 24, 12, 18, 9, 22, 16, 26, 14, 20, 8, 18, 23, 13, 19, 10, 21, 15, 25, 12, 18, 7, 16, 22, 14, 20];
  return (
    <div className="re-waveform-bars" aria-hidden="true">
      {bars.map((h, i) => (
        <span key={i} style={{ height: `${h}px` }} />
      ))}
    </div>
  );
}

/* 4 — Video Editor: Studio Video Canvas & Timeline (apps/web/src/VideoEditor.tsx)
   with preview player, safe area guides, transport bar (timecode, play/pause, scrub),
   and multi-track timeline (ruler, picture clips with thumbnails, captions, music waveform,
   and moving cobalt playhead). */
function ReplicaVideoEditor() {
  const CLIPS = [
    { num: '01', title: 'Aerial arrival', dur: '3.5s', width: 235, img: 0, caption: 'Aerial push-in over the treeline', sel: true },
    { num: '02', title: 'The meadow',    dur: '3.0s', width: 205, img: 1, caption: 'Slow pan across the meadow',     sel: false },
    { num: '03', title: 'Pasture walk',  dur: '2.5s', width: 175, img: 2, caption: 'Ground-level fence line walk',   sel: false },
    { num: '04', title: 'The farmhouse', dur: '4.0s', width: 275, img: 3, caption: 'Rise to the farmhouse facade',    sel: false },
  ];
  const RULER_TICKS = ['00:00', '00:03', '00:06', '00:09', '00:12'];

  return (
    <ReplicaFrame kind="editor">
      <div className="replica-video-editor">
        {/* Top: Video preview player */}
        <section className="canvas-panel replica-editor-canvas">
          <div className="canvas-toolbar">
            <span>
              <button className="icon-button" type="button" disabled aria-label="Toggle story outline"><Layers size={15} /></button>
              <button className="icon-button" type="button" disabled aria-label="Add project media"><Plus size={15} /></button>
              <span className="toolbar-divider" />
              Preview
            </span>
            <div>
              <button className="canvas-btn active" type="button" disabled><Maximize2 size={14} /> Safe area</button>
              <span className="toolbar-divider" />
              <span className="quality-label">Fit 100%</span>
              <button className="icon-button" type="button" disabled aria-label="Fullscreen preview"><Expand size={16} /></button>
            </div>
          </div>

          <div className="preview-stage replica-editor-stage">
            <div className="preview-frame replica-editor-frame">
              <video
                className="replica-editor-video"
                src={RE_TOUR_VIDEO_SRC}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-hidden="true"
              />
              {/* Safe area guides */}
              <div className="replica-safe-guides" aria-hidden="true">
                <div className="replica-safe-action" />
                <div className="replica-safe-title" />
              </div>
              {/* On-screen caption */}
              <div className="replica-preview-caption">
                118 Meadow Rd · Modern Farmhouse · 4 Bed 3.5 Bath
              </div>
            </div>
          </div>

          <div className="preview-controls replica-editor-controls">
            <div className="preview-context">
              <span className="scene-badge">01</span>
              <span className="preview-title">Aerial arrival</span>
              <span className="preview-spec">16:9 · 30 fps</span>
            </div>
            <div className="transport">
              <span className="transport-time">00:02:14 <span>/ 00:13:00</span></span>
              <div className="playback-buttons">
                <button className="icon-button" type="button" disabled aria-label="Previous scene"><SkipBack size={15} /></button>
                <button className="button secondary studio play-button" type="button" disabled aria-label="Pause preview"><Pause size={16} fill="currentColor" /></button>
                <button className="icon-button" type="button" disabled aria-label="Next scene"><SkipForward size={15} /></button>
              </div>
              <kbd className="transport-space">Space</kbd>
            </div>
          </div>
        </section>

        {/* Bottom: Timeline with moving playhead */}
        <section className="timeline replica-timeline" aria-label="Timeline">
          <div className="timeline-toolbar">
            <div className="timeline-heading-group">
              <h2>Timeline</h2>
              <span className="timeline-count">4 scenes <i>·</i> 13.0s</span>
            </div>
            <div className="timeline-tools">
              <button className="icon-button is-active" type="button" disabled aria-label="Select tool"><MousePointer2 size={16} /></button>
              <button className="icon-button" type="button" disabled aria-label="Split at playhead"><Scissors size={16} /></button>
              <span className="toolbar-divider" />
              <span className="snap-label"><Check size={13} /> Frame snapping</span>
            </div>
            <div className="zoom-tools">
              <button className="icon-button" type="button" disabled aria-label="Zoom out timeline"><ZoomOut size={16} /></button>
              <input aria-label="Timeline zoom" type="range" min="0.6" max="3" step="0.1" defaultValue="1" readOnly disabled />
              <button className="icon-button" type="button" disabled aria-label="Zoom in timeline"><ZoomIn size={16} /></button>
            </div>
          </div>

          <div className="timeline-body">
            <div className="track-labels">
              <div className="ruler-label">30 FPS</div>
              <div><Film size={15} /><span>Picture</span><Layers size={13} /></div>
              <div><Type size={15} /><span>Captions</span></div>
              <div><Music2 size={15} /><span>Music</span><Volume2 size={13} /></div>
            </div>

            <div className="timeline-scroll">
              <div className="timeline-content replica-timeline-tracks">
                {/* Ruler with tick marks */}
                <div className="ruler">
                  {RULER_TICKS.map((t, i) => (
                    <span key={t} style={{ left: `${i * 220}px` }}>
                      {t}<i />
                    </span>
                  ))}
                </div>

                {/* Picture Track with 4 clips */}
                <div className="picture-track">
                  {CLIPS.map((c) => (
                    <div
                      key={c.num}
                      className={`timeline-clip ${c.sel ? 'selected' : ''}`}
                      style={{ width: `${c.width}px` }}
                    >
                      <span>{c.num}</span>
                      <strong>{c.title}</strong>
                      <img src={`/media/realtor/realtor-still-${c.img}.jpg`} alt="" />
                    </div>
                  ))}
                </div>

                {/* Caption Track */}
                <div className="caption-track">
                  {CLIPS.map((c) => (
                    <div
                      key={c.num}
                      className="caption-clip"
                      style={{ width: `${c.width}px` }}
                    >
                      <Type size={11} />
                      <span>{c.caption}</span>
                    </div>
                  ))}
                </div>

                {/* Music Track */}
                <div className="music-track">
                  <div className="music-clip" style={{ width: '890px' }}>
                    <ReplicaWaveform />
                    <span className="music-title">
                      <Music2 size={11} /> Acoustic Warmth — Cinematic Tour (13.0s)
                    </span>
                  </div>
                </div>

                {/* The Moving Playhead */}
                <div className="playhead replica-playhead" aria-hidden="true">
                  <span />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </ReplicaFrame>
  );
}

export type ReplicaKind =
  | 'paste'
  | 'storyboard'
  | 'ai-scene-gen'
  | 'generate'
  | 'video-editor'
  | 'editor';

export function RealEstateStudioReplicas({ kind }: { kind: ReplicaKind }) {
  if (kind === 'paste') return <ReplicaPasteListing />;
  if (kind === 'storyboard') return <ReplicaStoryboard />;
  if (kind === 'ai-scene-gen' || kind === 'generate') return <ReplicaAiSceneGen />;
  return <ReplicaVideoEditor />;
}
