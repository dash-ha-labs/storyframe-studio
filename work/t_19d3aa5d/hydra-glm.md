# Work: t_19d3aa5d — hydra-glm
Initiative: storyframe | Packet: card body (t_19d3aa5d) | Brief/plan: board products/storyframe (as cited by card)
Base revision: 0d32e12 (origin/main) | Submitted: branch feat/t_19d3aa5d-raw-brag-mode, diff vs origin/main
Serving model: team-glm-hydra (glm)

## Before implementation
User outcome: free-tier creators get higher-quality strips because the planner
composes from their actual project evidence with brag's creative discipline,
instead of a rigid changelog/tutorial-style scene map that flattened Gemini's
output. Position: generation request → brag planner (raw or templated) →
validated plan + cues → existing apply/preview/render. Boundary: internal
planning logic + one AI-panel label/option; no new screens, no removed
features; templates remain as optional direction (research rec #4: augment,
not delete).

Research followed: research/template-degradation.md (repo). Original brag
adapter read at ~/Code/free-video-strips (src/brag.js, scaler.js, tones.js)
with its tests. BRAG-INTEGRATION.md + CREATION-API.md contracts honored: no
9Router change, no auto-retry, offline stub tests only (no authorized live
generation in this card).

## Result
- services/brag/scaler.mjs (new): rank scaler ported from upstream brag —
  scoreTimeline/dedupeCues/strongCues/synthesizeCues with upstream constants;
  deterministic boundary-synced cue frames.
- services/brag/planner.mjs: AUTO_TEMPLATE_SLUG + RAW_BRAG_DIRECTION (default
  tone directives); normalizeRequest accepts template=null (templateSlug
  "auto"); SYSTEM prompt replaced the forced-template tail ("plan 3–8 scenes
  at the template's intended duration") with strip-shape composition guidance;
  planVideo sends template block only when one is selected, otherwise
  {"mode":"raw","direction":{...}}; result now includes scaler `cues` aligned
  to composed scene cuts.
- services/brag/server.mjs: /api/generations treats missing/"auto"
  templateSlug as raw mode (no 404); unknown real slugs still 404; job records
  use the normalized slug/revision.
- services/brag/jobs.mjs: persist `cues` on ready jobs.
- services/brag/auto.test.mjs (new): 4 offline tests.
- apps/web/src/AiPanel.tsx: "Template" → "Creative direction" with default
  "Auto · plan from your project" option; prior project templateSlug still
  preselected for continuity.
- docs/CREATION-API.md, docs/BRAG-INTEGRATION.md, QA.md updated.

## Evidence
| Criterion | Check | Result |
|---|---|---|
| Auto mode bypasses templates | auto.test.mjs payload assertions + HTTP 202→ready | pass |
| Brag discipline natively on project context | payload JSON work/t_19d3aa5d/auto-vs-template-payload.json | pass |
| Rank scaler ported | constants/dedupe/boundary tests vs upstream values | pass |
| Existing behavior preserved | full npm test (27+23+14+11) | pass |
| Build | npm run build (tsc, Vite, 179 pages) | pass |
| UI proof | work/t_19d3aa5d/ai-panel-auto-default.png (live dev servers) | pass |
Not run: live Gemini generation (no authorization in card; quality delta is
expected from restored discipline but not measured against the provider);
encoded render of an Auto plan (composition path unchanged by this work).

## Handoff
Deviations: none to interfaces — /api/generations is backward compatible
(templateSlug optional; old clients sending a real slug behave identically).
Remaining risks: cues are synthesized from scene boundaries (real audio
feature extraction still pending, noted in code); Auto-plan quality vs the
routed model needs one authorized live generation to measure. Next owner:
argus-nv (review), then Astra if a live QA generation is authorized.
Decision needed from Astra: none.
