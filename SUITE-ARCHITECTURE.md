# Current architecture — 2 October 2026

This describes implementation, not all intended launch behavior. [PRODUCT.md](PRODUCT.md) defines product intent; [TASKS.md](TASKS.md) defines remaining work. Older architecture is preserved as [historical evidence](docs/archive/ARCHITECTURE-before-ai-workspace.md).

## Ownership and source map

| Concern | Canonical source | Current boundary |
| --- | --- | --- |
| Product projects, brands, storyboards | `packages/core/src/suite-model.ts` | `SuiteProject` owns creations; independent boards referenced by `storyboardId`. |
| Video model and manual commands | `packages/core/src/model.ts` | `Project` is the video document; 30 fps; validated edit/import state. |
| AI context and plan application | `packages/core/src/generation.ts` | Full product context, selected IDs, locks, foreign-media rejection, reversible state replacement. |
| App model/storage imports | `apps/web/src/{model,suite-model,clock,storage}.ts` | Re-export core; do not create a second model. |
| Suite navigation and creation persistence | `apps/web/src/Suite.tsx` | Metadata in `storyframe.suite.v1`; project media merged into a creation on opening. |
| Editor and AI workspace | `apps/web/src/VideoEditor.tsx`, `AiPanel.tsx` | Inline panel, shared timeline selection, checkbox, proposals and versions. |
| Version persistence | `apps/web/src/versions.ts` | IndexedDB `storyframe-versions-v1`; metadata snapshots only; no media bytes. Demo uses memory. |
| Public catalog | `packages/catalog/src/{index.ts,seeds.json,react.ts}` | 100 template seeds, 12 resources; service publication is current runtime truth. |
| Catalog persistence/admin | `services/brag/catalog.mjs`, `apps/web/src/TemplateStudio.tsx` | SQLite revisions; draft/published/archived; admin cookies; `/admin/templates`. |
| AI planner/provider | `services/brag/{planner,gemini}.mjs` | Bounded JSON scene plan via 9Router chat completions; not arbitrary generated code. |
| Durable jobs | `services/brag/{server,jobs}.mjs` | Owner-scoped IDs, idempotent request key, single worker, queue/rate bounds. |
| Composition | `packages/composition/src/index.mjs`, `apps/web/src/CompositionPreview.tsx` | Same escaped HTML/GSAP generator for preview and render. Four layouts/four motions. |
| Experimental rendering | `services/brag/render.mjs` | Local media staging, check, MP4, probe, poster and checksum. Not wired to editor download. |
| Editorial website | `apps/website/src/data/{learning,blog-data}.ts`, `seo.ts`, `pages` | Courses/docs/blog remain website-owned. |
| Public ideas/votes | `services/community` | Separate DB/volume; anonymous browser votes; editorial schedule. |
| Shared appearance | `packages/tokens`, `packages/ui`, `design/` | Identity/control standards shared; marketing/editor use distinct density. |

## Creation and editing flow

`Suite` opens the existing creation with the owner palette, font metadata, available media and attached storyboard. `AiPanel` calls `generationContext`, captures the base video and scope, persists a pending request ID, and posts a job. The service stores it before dispatch, calls the planner via 9Router, validates the response, and preserves request/plan/manifest under `data/outputs/<job-id>`.

`applyGeneration` returns a new canonical video document. Selected edits keep IDs and untouched/locked blocks; full edits preserve locked positions and require the same number of unlocked blocks if any are locked. Media IDs must already belong to the video. Existing source offsets, music and other video metadata survive. Scene timing is bounded by actual source duration. This is a practical patch boundary, not a complete generic command/event log.

The UI saves an AI proposal even if not applied. With immediate application enabled it saves before/after snapshots and commits through the editor's ordinary undo history. Otherwise the inline proposal can be applied or dismissed; dismissal keeps the saved proposal. It compares the captured scope to current state before applying to avoid overwriting intervening edits. Pending jobs can be checked again after a panel remount/reload. A service restart marks unfinished work interrupted; it never calls the provider again automatically.

Manual caption/timing/scale edits use the same selected IDs and `updateScene`; duplicate/delete/reorder remain focused-block operations. History currently loads all metadata snapshots and shows only 40; pagination is a required follow-up. Manual changes have bounded session undo, not a complete durable event log.

## Public/private data flow

Template seeds initialize SQLite once. Admin save creates a revision; published templates appear in `/api/catalog`. Website homepage, marketplace/detail pages and Studio picker use `useCatalog`, with seeds for prerender/offline fallback and a live fetch on mount/focus. Browser template links carry `#template=<slug>`; Studio resolves the latest published recipe, validates its starter contract, asks for the destination, and opens a private creation. The canonical template slug is retained for the AI picker. This never copies another product's media or brand into the destination.

Resources share the public package, download by type and enter Studio via validated starter data. Prompt resources can additionally be selected as AI context. Resource CRUD, canonical revisioned resource links and applying a brand kit to an existing project remain follow-ups.

Public examples require a completed render plus explicit reuse consent. The API exposes only opted-in projects/media; unpublished jobs and uploads remain owner-scoped. Example browse/detail/reuse frontend is not implemented. `/gallery` still redirects to tutorials for legacy compatibility; a separate `/examples` collection is the planned home. Never equate that legacy redirect with the intended product relationship.

## Persistence and operational limits

- Private suite metadata: browser localStorage; originals: media IndexedDB; AI snapshots: separate versions IndexedDB. Browser storage deletion loses local state. JSON export contains references, not media files.
- Creation service: `data/studio.sqlite` plus originals in `data/media`, outputs in `data/outputs`. Template/job/media/example tables are logically separated with explicit public serializers. Community uses `data/community.sqlite` separately.
- Service ownership: opaque HttpOnly seven-day session cookie. Clearing/expiring the cookie does not erase originals but currently loses browser access to those jobs. This is not account-based ownership, tenant security or billing.
- Quota: 30 jobs/session/day, one active/session, global queue 30, one worker. Anonymous sessions can be replaced; limits are beta controls, not abuse-proof quotas.
- Model sees supplied project text and media metadata. Image input support exists in the planner signature but extraction/upload/vision context is not connected.
- Brand capture: manual/imported JSON/CSS/Tailwind candidates and browser URL heuristics. CORS may block URLs. No verified Figma/MCP connection. Font names are recorded; composition currently renders bundled Inter, not arbitrary customer font files.
- Legacy UI preview remains for scenes without `layout`; new scenes use shared composition. Render rejects legacy scenes until parity is proven. The actual historical sample film is 44 seconds, not the older 48-second plan.
- MP4 render jobs are API-only. New renderer output must be viewed/listened to completely before quality/parity claims. A build or metadata probe is insufficient.

## Runtime topology

Studio Vite 9180 and website Vite 9182 proxy creation `/api` to 9184; website `/api/ideas` goes to community 9183. Nginx mirrors these routes and sends dynamic template detail HTML/sitemap to the creation service. Static website build prerenders seed content; dynamic pages provide current template title/description/outline before client hydration. Structured data and other list-page SEO must be reconciled with runtime admin edits before launch.

Docker targets are `frontend`, `community`, `brag` (legacy name retained for operations). The creation target includes TS runtime, catalog/model/composition packages, Chromium and FFmpeg. Container execution has not been verified in this milestone. [API/runtime contract](docs/CREATION-API.md).
