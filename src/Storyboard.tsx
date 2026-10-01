import React from 'react';
import {ArrowLeft, ArrowRight, Clapperboard, Clock, Plus, Sparkles, Trash2} from 'lucide-react';
import {Frame, Storyboard, blankFrame} from './suite-model';

interface StoryboardWorkspaceProps {
  storyboard: Storyboard;
  onChange: (storyboard: Storyboard) => void;
  onBack: () => void;
  onDelete?: () => void;
  projects?: {id:string;name:string;storyboardId?:string}[];
  onAttach?: (projectId:string) => void;
  onDetach?: (projectId:string) => void;
  onOpenProject?: (projectId:string) => void;
}

export default function StoryboardWorkspace({
  storyboard,
  onChange,
  onBack,
  onDelete,
}: StoryboardWorkspaceProps) {
  const sortedFrames = [...storyboard.frames].sort((a, b) => a.order - b.order);
  const totalDuration = sortedFrames.reduce((acc, f) => acc + (Number(f.durationSeconds) || 0), 0);

  function addFrame() {
    const nextOrder = sortedFrames.length;
    const newF = blankFrame(nextOrder);
    onChange({
      ...storyboard,
      frames: [...sortedFrames, newF],
    });
  }

  function updateFrame(id: string, patch: Partial<Frame>) {
    onChange({
      ...storyboard,
      frames: sortedFrames.map(f => {
        if (f.id !== id) return f;
        const updated = {...f, ...patch};
        if (patch.durationSeconds !== undefined) {
          const val = Number(patch.durationSeconds);
          updated.durationSeconds = Number.isFinite(val) && val > 0 ? val : 0.5;
        }
        return updated;
      }),
    });
  }

  function deleteFrame(id: string) {
    const remaining = sortedFrames.filter(f => f.id !== id);
    const reindexed = remaining.map((f, idx) => ({...f, order: idx}));
    onChange({
      ...storyboard,
      frames: reindexed,
    });
  }

  function moveFrame(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= sortedFrames.length) return;
    const next = [...sortedFrames];
    const current = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = current;
    const reindexed = next.map((f, idx) => ({...f, order: idx}));
    onChange({
      ...storyboard,
      frames: reindexed,
    });
  }

  return (
    <div className="page-content storyboard-workspace">
      <div className="storyboard-nav-bar">
        <button className="text-link" onClick={onBack} aria-label="Back to storyboards">
          <ArrowLeft size={14} /> Back to storyboards
        </button>
        {onDelete && (
          <button className="button text-danger" onClick={onDelete} aria-label="Delete storyboard">
            <Trash2 size={13} /> Delete storyboard
          </button>
        )}
      </div>

      <div className="page-heading storyboard-heading">
        <div className="storyboard-heading-info">
          <span className="page-eyebrow">STORYBOARD CANVAS</span>
          <input
            className="storyboard-title-input"
            aria-label="Storyboard title"
            value={storyboard.title}
            placeholder="Storyboard title…"
            maxLength={100}
            onChange={e => onChange({...storyboard, title: e.target.value})}
          />
          <div className="storyboard-meta-row">
            <span className="storyboard-meta-badge">
              <Clapperboard size={13} /> {`${sortedFrames.length} ${sortedFrames.length === 1 ? 'frame' : 'frames'}`}
            </span>
            <span className="storyboard-meta-badge">
              <Clock size={13} /> {`${totalDuration.toFixed(1)}s total duration`}
            </span>
            <span className="storyboard-meta-tag">M2 Visual Canvas</span>
          </div>
        </div>
        <div className="storyboard-actions">
          <button className="button primary" onClick={addFrame}>
            <Plus size={15} /> Add frame
          </button>
        </div>
      </div>

      {sortedFrames.length === 0 ? (
        <div className="empty-frames">
          <Clapperboard size={32} />
          <h3>No frames in this storyboard</h3>
          <p>Add frames to establish script beats, timing, and visual sequence.</p>
          <button className="button primary" onClick={addFrame}>
            <Plus size={14} /> Add first frame
          </button>
        </div>
      ) : (
        <div className="frame-canvas-grid" role="list" aria-label="Storyboard frames sequence">
          {sortedFrames.map((frame, index) => (
            <div key={frame.id} className="frame-card" role="listitem">
              <div className="frame-card-header">
                <div className="frame-sequence-badge">
                  <span className="frame-number">{`Frame ${index + 1}`}</span>
                  <span className="frame-order-meta">{`Order #${frame.order}`}</span>
                </div>
                <div className="frame-reorder-group" role="group" aria-label={`Reorder frame ${index + 1}`}>
                  <button
                    className="icon-button"
                    disabled={index === 0}
                    onClick={() => moveFrame(index, -1)}
                    aria-label={`Move frame ${index + 1} earlier`}
                    title="Move earlier"
                  >
                    <ArrowLeft size={14} />
                  </button>
                  <button
                    className="icon-button"
                    disabled={index === sortedFrames.length - 1}
                    onClick={() => moveFrame(index, 1)}
                    aria-label={`Move frame ${index + 1} later`}
                    title="Move later"
                  >
                    <ArrowRight size={14} />
                  </button>
                  <button
                    className="icon-button frame-delete-btn"
                    onClick={() => deleteFrame(frame.id)}
                    aria-label={`Delete frame ${index + 1}`}
                    title="Delete frame"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="frame-visual-preview">
                {frame.imageUrl ? (
                  <img
                    src={frame.imageUrl}
                    alt={`Visual for frame ${index + 1}`}
                    className="frame-preview-image"
                  />
                ) : (
                  <div className="frame-visual-placeholder">
                    <Sparkles size={24} />
                    <strong>Low-fi visual placeholder</strong>
                    <small>AI image generation available in M3</small>
                  </div>
                )}
              </div>

              <label className="suite-field frame-field">
                Image URL / mock
                <input
                  type="text"
                  placeholder="https://... or mock image URL"
                  value={frame.imageUrl}
                  aria-label={`Frame ${index + 1} image URL`}
                  onChange={e => updateFrame(frame.id, {imageUrl: e.target.value})}
                />
              </label>

              <label className="suite-field frame-field">
                Script & scene description
                <textarea
                  rows={3}
                  placeholder="Scene action, dialogue or voiceover…"
                  value={frame.text}
                  aria-label={`Frame ${index + 1} script`}
                  onChange={e => updateFrame(frame.id, {text: e.target.value})}
                />
              </label>

              <label className="suite-field frame-field">
                Duration (seconds)
                <div className="frame-duration-input-wrapper">
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    aria-label={`Frame ${index + 1} duration in seconds`}
                    value={frame.durationSeconds}
                    onChange={e => {
                      const val = parseFloat(e.target.value);
                      updateFrame(frame.id, {durationSeconds: Number.isFinite(val) && val > 0 ? val : 0.5});
                    }}
                  />
                  <span className="frame-unit-label">seconds</span>
                </div>
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
