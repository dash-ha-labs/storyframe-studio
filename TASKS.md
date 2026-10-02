# Active implementation queue — 2 October 2026

Purpose: [PRODUCT.md](PRODUCT.md). Exact owners, limits and commands: [HANDOFF](docs/HANDOFF.md). Earlier chronological tasks are [archived](docs/archive/TASKS-before-ai-workspace.md); do not revive rejected dark UI, Strip modal or retired tools.

## Completed core in this branch

- [x] Canonical core models; app model/storage/clock re-exports.
- [x] Shared public template/resource catalog with runtime published data, private-data boundary and stable template handoff.
- [x] Durable owner-scoped generation jobs, request idempotency, restart without automatic retry; 9Router retained.
- [x] Context-aware in-editor AI panel; selected/whole scope, locked scenes, immediate-apply checkbox, proposal preservation and version restoration.
- [x] Admin template create/read/update/archive, immutable revisions, draft/publish/featured controls, prompt improvement and generated preview controls.
- [x] Shared composition; offline four-second technical render through Hyperframes/FFmpeg.
- [x] Replaced duplicate new controls with shared UI variants; removed retired Strip adapter/modal and redundant inspector assistant card. Admin uses task-specific layout, not a new customer design baseline.

## Next milestones, in order

1. **Close the creation/edit loop.** Deterministic browser fixture for auto-apply, review, reload recovery, stale selection, undo, history restore and manual group edits. Fix history pagination and ambiguous-submission recovery. Give Generate a clear recover/check state. Acceptance: selected blocks change once, locked/unselected stay byte-equivalent, no request is submitted twice, all proposals remain reachable after reload.
2. **Complete trustworthy project evidence.** Server-owned uploaded asset references and bounded image/frame analysis; reviewed source/brand capture and actual font assets. Acceptance: AI can distinguish two real assets from pixels, cites candidate origin, respects chosen project brand, and cannot use another owner's media or execute uploaded code.
3. **Finish export before wider autonomous generation.** Connect existing upload/render jobs to editor, progress/download/recovery UI; preserve originals. Bring legacy scene renderer to parity or provide an explicit reversible conversion. Acceptance: full encoded film viewed/listened, exact source UI, trim/caption/scale/audio/format parity, measured memory/time, imported media round-trip. Current API rejects legacy export.
4. **Finish the public reuse loop.** Examples index/detail/share/reuse using actual published platform videos and allowed media only. Revisioned resource handoff/type-aware application. Runtime catalog SEO and archived template behavior. Acceptance: publish template → homepage/marketplace/app; use in an existing product → independent creation; render → opt-in example → another user's copy with no private-data leak; tutorial courses remain distinct.
5. **Admin reliability and polish.** Job recovery for prompt-improve/preview, revision browser/restore, rich sample product/media, preview zoom separate from fit, unsaved-navigation guard and accessible small-screen checks. Acceptance: no job silently retried, conflicts visible, archived template recoverable, coherent shared controls, contained preview, no customer-flow changes just to suit admin.
6. **Launch foundations.** Real accounts/server ownership, signup, quotas/abuse, storage/backups and retention, content rights review, production container/runtime tests and measurements. Acceptance: session loss is recoverable by account, no client-side password gate treated as security, verified deployment/rollback, honest operational status.

Do not add placeholder controls for later milestones or market a fixture as a completed integration. Take the first uncompleted milestone and finish its acceptance checks before widening scope. New video/image providers, stock/audio discovery and further automation come after the import/edit/save/export foundation is proven.
