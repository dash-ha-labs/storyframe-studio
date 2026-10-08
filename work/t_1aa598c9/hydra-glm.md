# Work: t_1aa598c9 — hydra-glm

Initiative: landing-realtor (Part 1/2: Paste Listing & Storyboard UI DOM)
Base revision: origin/main 4162e12 | Branch: feat/t_1aa598c9-landing-realtor
Serving model: team-glm-hydra (glm pool)

## Before implementation

User outcome: Realtors, property managers, and Airbnb hosts visiting `/real-estate` see realistic, high-fidelity demonstrations of the actual Storyframe platform UI in action (SetupWizard URL capture and Storyboard canvas), replacing abstract placeholder shapes.

Position: Marketing feature sections 1 & 2 on `/real-estate` in `apps/website`. User-facing boundary: marketing illustration only — no backend, no provider calls, no live editor iframe (conforms strictly to AGENTS.md rule confining the live editor to the homepage demo).

Approach:
1. Recreate exact DOM replicas of `apps/web` components in `apps/website/src/RealEstateStudioReplicas.tsx`:
   - **Paste Listing:** Replicates the SetupWizard "From URL" dialog (`apps/web/src/Suite.tsx` lines 96–103) featuring the 4-step wizard stepper (`Project`, `Your apps`, `Brand design` [active], `Review`), method tabs (`From URL` selected, `From codebase`, `Import files`, `Start fresh`), `Zillow listing URL` input field, typed URL with blinking caret, primary `Generate` button (`.button.primary` with wand icon), secondary `Skip — start fresh`, micro-note, and green `Listing captured · 118 Meadow Rd` confirmation card (`.brand-found`).
   - **Storyboard:** Replicates `StoryboardWorkspace` M2 canvas (`apps/web/src/Storyboard.tsx`) featuring header with `STORYBOARD CANVAS`, editable title, metadata badges (`4 frames`, `13.0s total duration`, `M2 Visual Canvas`), `+ Add frame` button, and a 4-column grid of frame cards with sequence numbers, reorder/delete controls, 16:9 visual stills (`apps/website/public/media/realtor/`), script descriptions, and duration inputs (`3.5s`, `3.0s`, `2.5s`, `4.0s`).
2. Sizing & container query architecture:
   - Fixed 960px desktop stage inside browser chrome (`studio.storyframe.yamu.app`).
   - Outer card `.re-replica` declares `container-type: inline-size`.
   - Responsive `@container` steps pair proportional scales (`transform: scale(...)`) with exact matching screen heights (`height: calc(var(--re-stage-h) * scale)`), adapting cleanly from desktop down to 390px mobile with zero horizontal overflow or vertical clipping.
3. Animation:
   - URL typing effect via CSS keyframes with blinking cobalt caret overlay.
   - Smooth entrance fade for the listing captured confirmation card.
   - Staggered sequence populating frames 1 through 4 (`re-frame-0` through `re-frame-3`).
   - Accessible `@media (prefers-reduced-motion: reduce)` fallbacks disabling animations.

## Result

| File | Why |
| --- | --- |
| `apps/website/src/RealEstateStudioReplicas.tsx` | High-fidelity DOM replicas for Paste Listing and Storyboard canvas using real `apps/web` structure. |
| `apps/website/src/pages/RealEstatePage.tsx` | Replaced abstract `WorkflowPreview` with `RealEstateStudioReplicas` for first 2 zig-zag sections. |
| `apps/website/src/website.css` | Scoped `.re-replica` styles, container query scaling, controls, and typing/entrance animations. |
| `apps/website/tests/real-estate.test.ts` | Tests asserting exact replica DOM markers (`re-replica-paste`, `re-replica-storyboard`, `Generate`, `Listing captured`, `STORYBOARD CANVAS`, `frame-canvas-grid`). |
| `apps/website/public/media/realtor/*` | Real property stills for the 4 storyboard preview frames. |
| `docs/landing-realtor.md` | Feature documentation updated with replica architecture and assets. |

## Evidence

| Acceptance criterion | Check / artifact | Result |
| --- | --- | --- |
| Exact platform UI replicas | DOM inspection & visual comparison against `apps/web` Suite & Storyboard components | pass |
| Paste Listing: real input & "Generate" button, typed URL | `tests/real-estate.test.ts` asserts `re-replica-paste`, `Give your product a home.`, `Generate`, `Listing captured`; browser verified | pass |
| Storyboard: exact canvas layout with frames populating | `tests/real-estate.test.ts` asserts `re-replica-storyboard`, `STORYBOARD CANVAS`, `frame-canvas-grid`; browser verified | pass |
| Test suite | `npm test` root (86/86 pass), `apps/website` (28/28 pass) | pass |
| Production build | `npm run build` succeeds across all workspaces; 181 pages prerendered | pass |
| Responsive scaling | Tested in browser at 1280px desktop and 390px mobile; `bodyScrollWidth === windowWidth === 390px` (zero horizontal overflow) | pass |
| Visual proof gate | Screenshots captured and verified via vision analysis in `work/t_1aa598c9/`: `desktop-1280px-paste.png`, `desktop-1280px-storyboard.png`, `mobile-390px-paste.png`, `mobile-390px-storyboard.png` | pass |

## Handoff

Reviewer: argus-nv (UI/UX fidelity and visual review).
Downstream dependency: releases child card `t_1326b684` (Part 2/2: AI Scene Gen & Video Editor UI DOM).
Decision needed from Astra: none.
