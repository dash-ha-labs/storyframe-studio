import React from 'react';
import { ArrowRight, BedDouble, Check, Clapperboard, Home, Image, MapPin, Play, Ruler, Sparkles } from 'lucide-react';

/**
 * Schematic auto-playing demos of the realtor workflow for /real-estate
 * "how it works" sections. Pure CSS keyframe illustrations (see `re-demo-*`
 * styles in website.css): they never claim a backend request ran, the same
 * rule as WorkflowPreview/EcommerceFlowDemo. The reduced-motion fallback is
 * the static composition (final stage of each loop).
 *
 * Loop scale matches the existing preview motion: one master loop per demo,
 * every state change within it ≤ 3s.
 */

const ZILLOW_URL = 'zillow.com/homedetails/48-maple-st';

/** Step 1: paste a Zillow link, the listing's photos and facts appear. */
export function RealtorListingDemo() {
  return (
    <div
      className="re-demo re-demo-listing"
      role="img"
      aria-label="Animated demo: a Zillow listing link is pasted, and the listing's photos, price and facts are pulled in automatically."
    >
      <div className="re-demo-browser" aria-hidden="true">
        <span className="re-demo-dots"><i /><i /><i /></span>
        <span className="re-demo-url">
          <span className="re-demo-url-text">{ZILLOW_URL}</span>
          <i className="re-demo-caret" />
        </span>
        <span className="re-demo-go"><ArrowRight size={13} /></span>
      </div>
      <div className="re-demo-stage">
        <div className="re-demo-facts">
          <span className="re-demo-badge"><Check size={11} />Listing found</span>
          <strong>48 Maple St, Addison VT</strong>
          <span className="re-demo-meta">
            <span><BedDouble size={11} />4 bd</span>
            <span><Ruler size={11} />2,640 sqft</span>
            <span><MapPin size={11} />0.9 acres</span>
          </span>
          <span className="re-demo-fact-bars"><i style={{ width: '86%' }} /><i style={{ width: '64%' }} /><i style={{ width: '45%' }} /></span>
        </div>
        <div className="re-demo-photos">
          {['re-demo-photo-1', 're-demo-photo-2', 're-demo-photo-3'].map(c => (
            <div key={c} className={`re-demo-photo ${c}`}><Home size={16} /></div>
          ))}
          <div className="re-demo-photo re-demo-photo-4"><Image size={16} /><span>+14</span></div>
        </div>
      </div>
    </div>
  );
}

/** Step 2: AI-planned storyboard — frames pop in sequentially with durations. */
export function RealtorStoryboardDemo() {
  const frames = [
    { n: '01', label: 'Curb appeal', d: '3s' },
    { n: '02', label: 'Open the door', d: '4s' },
    { n: '03', label: 'Kitchen light', d: '5s' },
    { n: '04', label: 'Primary suite', d: '4s' },
  ];
  return (
    <div
      className="re-demo re-demo-storyboard"
      role="img"
      aria-label="Animated demo: a tour storyboard builds itself as four frames pop in one after another — curb appeal, entry, kitchen, primary suite."
    >
      <div className="re-demo-bar" aria-hidden="true">
        <Clapperboard size={14} />
        <span>Tour storyboard</span>
        <i />
        <span className="re-demo-bar-note"><Sparkles size={11} />AI planned 4 scenes</span>
      </div>
      <div className="re-demo-frames">
        {frames.map(f => (
          <div key={f.n} className={`re-demo-frame re-demo-frame-${f.n}`}>
            <span>{f.n}</span>
            <div className="re-demo-frame-art"><Home size={15} /></div>
            <strong>{f.label}</strong>
            <small>{f.d}</small>
          </div>
        ))}
        <div className="re-demo-frames-note">One clear story, room by room.</div>
      </div>
    </div>
  );
}

/** Step 3: skeleton loader resolving into a generated scene. */
export function RealtorSceneDemo() {
  return (
    <div
      className="re-demo re-demo-scene"
      role="img"
      aria-label="Animated demo: a shimmering skeleton loader resolves into a finished generated scene with caption, brand accent and music track."
    >
      <div className="re-demo-bar" aria-hidden="true">
        <Sparkles size={14} />
        <span>AI scene generation</span>
        <i />
        <span className="re-demo-bar-note">Scene 02 · 4s</span>
      </div>
      <div className="re-demo-scene-stage">
        <div className="re-demo-scene-window">
          <div className="re-demo-skeleton">
            <i /><i /><i />
          </div>
          <div className="re-demo-scene-image">
            <Home size={22} />
          </div>
          <span className="re-demo-scene-caption">Sunlit kitchen · quartz island</span>
          <span className="re-demo-scene-chip">Brand accent</span>
        </div>
        <div className="re-demo-scene-status">
          <i className="re-demo-spinner" />
          <span>Composing scene 2 of 4…</span>
        </div>
      </div>
    </div>
  );
}

/** Step 4: editor timeline with a scrubbing playhead. */
export function RealtorEditorDemo() {
  return (
    <div
      className="re-demo re-demo-editor"
      role="img"
      aria-label="Animated demo: a video editor timeline plays through scene clips while the playhead scrubs across them and the preview updates."
    >
      <div className="re-demo-bar" aria-hidden="true">
        <Clapperboard size={14} />
        <span>Video editor</span>
        <i />
        <span className="re-demo-bar-note">0:16 tour · 4 scenes</span>
      </div>
      <div className="re-demo-editor-stage">
        <div className="re-demo-player">
          <div className="re-demo-player-frame re-demo-player-1"><Home size={18} /></div>
          <div className="re-demo-player-frame re-demo-player-2"><BedDouble size={18} /></div>
          <span className="re-demo-play"><Play size={13} fill="currentColor" /></span>
        </div>
        <div className="re-demo-timeline">
          <div className="re-demo-track re-demo-track-video">
            <i style={{ width: '26%' }} /><i style={{ width: '31%' }} /><i style={{ width: '24%' }} /><i style={{ width: '19%' }} />
          </div>
          <div className="re-demo-track re-demo-track-music">
            <i style={{ width: '100%' }} />
          </div>
          <span className="re-demo-playhead" />
        </div>
      </div>
    </div>
  );
}
