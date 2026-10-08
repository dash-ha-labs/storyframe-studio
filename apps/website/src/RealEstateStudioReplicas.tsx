import React from 'react';
import {
  ArrowLeft, ArrowRight, Check, Clapperboard, Clock, Globe, Plus,
  Trash2, Wand2, Code2, Upload, Palette,
} from 'lucide-react';

/**
 * High-fidelity DOM replicas of the real Storyframe Studio surfaces
 * (apps/web) for the /real-estate marketing page. Rendered inside a scaled
 * mini-viewport so proportions stay true to the shipped app. Marketing page
 * only: no backend, no provider calls, no live editor iframe. Every control
 * below mirrors markup the app really renders — visual illustration, not an
 * interactive workflow.
 */

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

export type ReplicaKind = 'paste' | 'storyboard';

export function RealEstateStudioReplicas({ kind }: { kind: ReplicaKind }) {
  if (kind === 'paste') return <ReplicaPasteListing />;
  return <ReplicaStoryboard />;
}
