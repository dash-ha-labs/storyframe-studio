# Work: t_1326b684 — hydra-glm

Initiative: landing-realtor (Part 2/2: AI Scene Gen & Video Editor UI DOM)
Base revision: origin/main 60a994e | Branch: feat/t_1326b684-landing-realtor
Serving model: hydra-glm (pinned GLM route / team-spare-gemini active runner)

## Before implementation

User outcome: Realtors, property managers, and Airbnb hosts visiting `/real-estate` see realistic, high-fidelity demonstrations of the actual Storyframe platform UI in action (AI Scene Generation workflow and Video Editor timeline/preview), replacing abstract placeholder wireframes with exact DOM replicas of `apps/web`.

Position in journey: Marketing feature sections 3 & 4 on `/real-estate` in `apps/website`. User-visible / internal boundary: marketing illustration only — pure DOM replicas inside browser frames (`studio.storyframe.yamu.app`), no backend, no provider jobs, no live editor iframe (strictly adhering to AGENTS.md rule confining the live editor to the homepage demo). Confirmed this contribution has not been promoted to a new primary feature or expanded user workflow.

Compact approach:
1. Recreate exact DOM replicas of `apps/web` components in `apps/website/src/RealEstateStudioReplicas.tsx`:
   - **AI Scene Gen (`re-replica-generate`):** Replicates the Studio AI Panel (`apps/web/src/AiPanel.tsx`) with project context (`118 Meadow Rd`, 18 assets, 4 storyboard frames, brand color swatches), creative direction and edit scope dropdowns, prompt textarea, and instant-apply option. Demonstrates the real generation loading state (pulsing scanner, progress track, pipeline step checklist) smoothly transitioning into realistic cinematic video proposal output (aerial still, HUD top badges, lower-third titles, property specs tag, `AI Generation complete · 4 scenes synced` banner, and `Applied 4 scenes to timeline` status).
   - **Video Editor (`re-replica-editor`):** Replicates the Studio Video Canvas & Timeline (`apps/web/src/VideoEditor.tsx`) featuring the top preview player (toolbar, real property drone footage playback via `realtor-tour-placeholder.webm`, broadcast safe area guides, lower-third caption badge, and transport controls with timecode `00:02:14 / 00:13:00` and playback buttons) and bottom multi-track timeline (`30 FPS` ruler, picture track with 4 clips & thumbnails, caption track with sync cues, music track with audio waveform, and cobalt playhead moving across the timeline tracks).
2. Sizing & container query architecture:
   - Built inside `.re-replica` with `container-type: inline-size` and desktop 960px stage.
   - Stage heights: `--re-stage-h: 490px;` for both `generate` and `editor`.
   - Proportional container query scaling adapting from desktop down to 390px mobile with zero horizontal overflow or clipping.
3. Animation & accessibility:
   - AI generation loading-to-output loop with smooth cross-fade.
   - Continuous playhead movement across timeline tracks.
   - `@media (prefers-reduced-motion: reduce)` fallbacks disabling all animations and displaying complete static states.
   - `aria-hidden="true"` on decorative chrome, inputs `readOnly`, buttons `disabled` to eliminate form focus traps.

## Result

| File | Why |
| --- | --- |
| `apps/website/src/RealEstateStudioReplicas.tsx` | Added `ReplicaAiSceneGen` and `ReplicaVideoEditor` (with `ReplicaWaveform`) mirroring exact `apps/web` markup, controls, and states. |
| `apps/website/src/pages/RealEstatePage.tsx` | Replaced abstract `WorkflowPreview` items 3 & 4 with `RealEstateStudioReplicas` (`ai-scene-gen` and `video-editor`); removed unused `WorkflowPreview` import. |
| `apps/website/src/website.css` | Scoped `.re-replica-generate` and `.re-replica-editor` styles, stage heights, HUD layouts, timeline tracks, and keyframe animations. |
| `apps/website/tests/real-estate.test.ts` | Added unit tests verifying all 4 replica DOM markers, AI generation status, and timeline tracks, while verifying wireframes are absent. |
| `docs/landing-realtor.md` | Updated architecture table and feature notes for Part 2/2 replicas. |
| `work/t_1326b684/*` | Captured visual proofs at 1280px desktop and 390px mobile viewports verified via vision analysis. |

## Evidence

| Acceptance criterion | Actual check / artifact | Result |
| --- | --- | --- |
| Exact platform UI replicas | Compared DOM against `apps/web/src/AiPanel.tsx` & `VideoEditor.tsx`; inspected live DOM | pass |
| AI Scene Gen loading state & output | Tests assert `Create and edit with AI`, `Planning your edit...`, `AI Generation complete`, `Applied 4 scenes to timeline`; visual inspection verifies clean HUD | pass |
| Video Editor timeline & moving playhead | Tests assert `Timeline`, `30 FPS`, `replica-playhead`; real drone video playback and moving playhead verified | pass |
| Zero wireframe placeholders | `assert.ok(!html.includes('wire-'))` passes; no abstract shapes remain on `/real-estate` | pass |
| Test suite | `npm test` runs 86/86 passing tests across studio, website, core, brag services | pass |
| Production build & prerender | `npm run build` succeeds prerendering 181 pages cleanly | pass |
| Responsive scaling | Browser CDP override at 1280px (`bodyWidth: 1265px <= 1280px`) and 390px mobile (`bodyWidth === 390px`); 0 horizontal overflow | pass |
| Visual proof gate | Screenshots captured and inspected with `vision_analyze`: `desktop-1280px-ai-scene-gen.png`, `desktop-1280px-video-editor.png`, `mobile-390px-ai-scene-gen.png`, `mobile-390px-video-editor.png` | pass |

## Handoff

Reviewer: argus-nv (UI/UX fidelity and visual review).
Downstream dependency: none (completes Part 2/2 of landing-realtor UI replicas).
Decision needed from Astra: none.
