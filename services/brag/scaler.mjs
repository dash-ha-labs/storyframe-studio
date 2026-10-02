// Rank scaler ported from brag skills/brag/scripts/analyze_music_cues.py.
// intensity = 0.45*onset + 0.25*contrast + 0.20*rms + 0.10*bass, clamped [0,1].
// Strong-cue threshold 0.45, dedupe gap 0.18s — same constants upstream.

const WEIGHTS = { onset: 0.45, contrast: 0.25, rms: 0.2, bass: 0.1 };
export const STRONG_CUE_THRESHOLD = 0.45;
export const DEDUPE_GAP_SEC = 0.18;

function scoreFrame(features) {
  const intensity = Math.min(
    1,
    Math.max(
      0,
      WEIGHTS.onset * features.onset +
        WEIGHTS.contrast * features.contrast +
        WEIGHTS.rms * features.rms +
        WEIGHTS.bass * features.bass,
    ),
  );
  return { intensity, ...features };
}

// frames: [{ time, onset, contrast, rms, bass }] already normalized 0..1.
export function scoreTimeline(frames) {
  return frames
    .map((f) => ({ time: f.time, ...scoreFrame(f) }))
    .sort((a, b) => b.intensity - a.intensity);
}

// Upstream _dedupe_cues: keep strongest cues, enforce min time gap.
export function dedupeCues(frames, minGap = DEDUPE_GAP_SEC) {
  const accepted = [];
  for (const cue of scoreTimeline(frames)) {
    if (accepted.every((a) => Math.abs(cue.time - a.time) >= minGap)) {
      accepted.push(cue);
    }
  }
  return accepted.sort((a, b) => a.time - b.time);
}

export function strongCues(frames, threshold = STRONG_CUE_THRESHOLD) {
  return dedupeCues(frames).filter((c) => c.intensity >= threshold);
}

// Deterministic synthetic cue frames for a strip when no real track analysis
// runs server-side. Peaks deliberately land on scene boundaries so cuts sync.
// ponytail: replace with real audio feature extraction when audio lands.
export function synthesizeCues(durationSec, sceneBoundaries = []) {
  const frames = [];
  const fps = 24;
  let seed = 0x2f6e2b1;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  for (let t = 0; t < durationSec; t += 1 / fps) {
    const boundary = sceneBoundaries.some((b) => Math.abs(b - t) < 1 / fps / 2);
    frames.push({
      time: Math.round(t * 1000) / 1000,
      onset: boundary ? 0.9 : rnd() * 0.6,
      contrast: boundary ? 0.7 : rnd() * 0.5,
      rms: 0.3 + rnd() * 0.3,
      bass: boundary ? 0.8 : rnd() * 0.4,
    });
  }
  return frames;
}
