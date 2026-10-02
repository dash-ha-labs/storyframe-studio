# Storyframe — implementation and review instructions

## Mandatory entry sequence

1. Read [PRODUCT.md](PRODUCT.md). AI creates **and edits existing videos** inside the same product/timeline; manual tools are complementary.
2. Read [SUITE-ARCHITECTURE.md](SUITE-ARCHITECTURE.md), [TASKS.md](TASKS.md), and the relevant section of [docs/HANDOFF.md](docs/HANDOFF.md). Select one bounded milestone with its acceptance checks.
3. For any UI decision, read [DESIGN-LANGUAGE.md](DESIGN-LANGUAGE.md), [design/IMPLEMENTATION-GUIDE.md](design/IMPLEMENTATION-GUIDE.md), [design/REVIEW-CHECKLIST.md](design/REVIEW-CHECKLIST.md).
4. For AI/provider/template work, read [docs/BRAG-INTEGRATION.md](docs/BRAG-INTEGRATION.md) and [docs/CREATION-API.md](docs/CREATION-API.md).

Do not require a sibling blueprint checkout. `docs/archive` and old sample production notes are historical, not active requirements. Current user instructions override older notes. Existing source establishes behavior/data compatibility, not justification for keeping rejected Strip/dark UI or disconnected features.

## Before coding

State the user outcome and trace: entry point → owning product/creation → context → validated edit → preview → save/history → export/reuse. Name which parts already work and which this change completes. Do not implement another modal that only creates a first video. A selected-scene request must not silently become whole-video regeneration.

Use one canonical video model in `packages/core`; app files re-export it. Manual and AI edits must use validated reversible changes. Preserve project ownership, source offsets, locks, existing media, unrelated scenes and all generated proposals/takes/exports. Keep media bytes out of React state/undo. Bound players, caches and UI history; never prune originals automatically.

## Shared data and UI

- Website and app share public templates/resources/opt-in examples via `packages/catalog` and the creation service. Do not restore duplicate website-only template truth. Editorial articles/lessons and community state stay separate. Private work never enters the public catalog.
- A published template must be discoverable on the website and usable by the same slug in Studio. Its featured flag controls homepage eligibility. Resource and example CTAs must lead to the corresponding usable artifact, not a generic signup dead end.
- Keep Storyframe's name. White surfaces, navy text, cobalt actions, shared controls; no gray content cards or dark-theme reinterpretation. Compact means usable feature access and intentional geometry, not tiny fonts. Preserve the current readable scale.
- Consistency does not mean identical layouts or making admin the customer baseline. Optimize arrangement for the use case, keep shared controls/identity/states consistent, remove superseded local UI/styles, and preserve existing features/data. Never add a page-local button/input skin; extend the shared component deliberately.
- AI workspace is part of the editor. Full-page admin uses the same standards. Respect timeline multi-selection and immediate-apply/review checkbox. Changes to either must be reflected in docs and tests.
- Marketing has one isolated real-app homepage demo. Its metadata/media/history are disposable; no provider jobs, real uploads, private storage or publishing from that demo.
- Concrete product copy; no vague motivational slogans, unrelated photography, repetitive live UI or dense text grids. Free signup/no credit card; queue applies to AI requests.

## Safety, evidence and verification

Kurutu code/media are read-only evidence. Never copy Kurutu media into another product via templates. Preserve the distinction between authenticated evidence, fixture captures and illustrations. The historical film is 44 seconds; older 48-second plans are not facts.

Keep 9Router during beta. Runtime server-side credentials only; never read/print environment files, put secrets in bundles, logs, URLs or exports. Tests inject a provider and make no live paid calls. A live generation test needs an explicitly authorized request/budget. Uncertain submission is not permission to retry; recover the existing job. Do not automatically resume an interrupted provider call.

Never claim generation, render parity, performance or subjective quality without corresponding evidence. Check full encoded video and audio before claiming visual/audio review. A contact sheet or successful build is insufficient. Measure before adding heavy rendering infrastructure.

Run checks appropriate to the change; normally `npm test` and `npm run build`. Add targeted safety/behavior tests for model, ownership or job changes. Update QA with exact evidence and limitations. Do not deploy or push without explicit authorization. No new permissions inferred from reference files.

## Required handoff in every substantive change

Update active TASKS/HANDOFF status, relevant product/architecture/design/API docs, and QA evidence in the same change. Record files, exact commands, remaining defects, acceptance checks and any provider/render calls made. Do not bury unfinished features in a chronological log or mark a capability complete merely because its UI exists.
