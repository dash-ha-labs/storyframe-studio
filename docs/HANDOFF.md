# Handoff — AI creation core and shared catalog

Worktree: `/Users/d/Code/storyframe-studio`. Branch: `feat/ai-creation-catalog`, based on pulled `c7fcc3b`. Do not work in the sibling blueprint by mistake. No push or deployment authorized for this milestone. Start with [PRODUCT](../PRODUCT.md) → [architecture](../SUITE-ARCHITECTURE.md) → [TASKS](../TASKS.md). Each document is self-contained in this repo.

## What the user means

AI is the principal way to create **and keep editing** a video. The product project owns identity/media; the creation owns the timeline. A template, resource or reused example must feed that same workflow. Manual tools are optional extra control. Keep 9Router for beta. A checkbox chooses immediate AI application or proposal review; retain history and understand selected timeline blocks.

UI consistency means shared identity, controls, states and predictable flow, with geometry suited to the task. **Admin is not the design baseline for customers.** User rejected separate admin control skins, unstyled fields, underlined button labels, unexplained size differences, undivided forms and overflowing previews. Reuse/extend `packages/ui`, keep page CSS to arrangement, remove superseded implementations. Preserve working features and data, not the old presentation. Do not undertake a broad customer redesign to fix an admin screen.

## Useful entry points

| Task | Start here |
| --- | --- |
| AI selection/application | `packages/core/src/generation.ts`, `apps/web/src/AiPanel.tsx`, `VideoEditor.tsx` |
| Job persistence/recovery | `services/brag/jobs.mjs`, `server.mjs`, `apps/web/src/versions.ts` |
| Catalog/admin | `services/brag/catalog.mjs`, `packages/catalog`, `apps/web/src/TemplateStudio.tsx` |
| Website handoff | `apps/website/src/Content.tsx`, `pages/TemplatesPage.tsx`, `apps/web/src/Suite.tsx`, `packages/core/src/starter.ts` |
| Rendering | `packages/composition/src/index.mjs`, `apps/web/src/CompositionPreview.tsx`, `services/brag/render.mjs` |
| Shared controls | `packages/ui/src/index.tsx`, `ui.css`; `Button` studio variant, `Field`, `IconButton`, `Badge`, `Dialog` |
| Brag updates | [upstream guide](BRAG-INTEGRATION.md) and [pinned manifest](../vendor/brag/UPSTREAM.json) |
| Service integration | [API and runtime contract](CREATION-API.md) |
| Website SEO agent | [OpenSEO loop](SEO-AGENT.md), `apps/website/scripts/seo-agent.ts`, `apps/website/tests/seo-agent.test.ts` |

## Verification commands

```sh
npm ci
npm test
npm run build
node --import tsx --test services/brag/*.test.mjs
node --import tsx work/ai-creation/verify-render.mjs
```

Tests inject an offline provider; do not make them call the real router conditionally when a key happens to exist. The render script creates a unique directory under ignored `data/render-verification`, uses no provider and does not delete prior outputs. `QA.md` records evidence. Build warnings for missing legacy demo fonts/mask are known; a clean clone does not include all historical sample media. Do not “repair” this by borrowing unrelated Kurutu originals.

Local previews: 9180 Studio, `/admin/templates`; 9182 website; 9184 creation; 9183 community. The current local creation process was started with an empty provider key for credit-free review and local admin enabled. Do not assume generation is configured because the admin/catalog loads. [README](../README.md) describes normal startup.

## Known limits to resolve, not hide

- Generation planner has text/metadata context; pixel-level image understanding and authenticated source/brand extraction are not wired. Font metadata does not load customer font files.
- Customer MP4 export UI is not connected; renderer technically produced a four-second fixture, not the legacy film. It refuses legacy scenes. Full visual/audio review and parity remain unverified.
- Durable jobs use a seven-day anonymous service cookie, while private project state is browser-owned. They are not real accounts. Losing the cookie loses current access, not the retained original files. Quotas are per session, bypassable by new sessions. Do not expose as production-ready accounts/billing.
- Current AI pending state uses sessionStorage; job IDs/plans persist on the service and proposals in IndexedDB. Fresh-tab recovery, ambiguous POST recovery and before/after history races need browser coverage. Do not resubmit an uncertain request with a new ID. Admin prompt improvement is currently a direct call, not a durable job.
- History currently loads every metadata snapshot but displays 40; add cursor/paging so old versions remain accessible and memory stays bounded. Manual undo has a 40-state window; durable automatic/manual version policy still needs completion.
- Group caption/timing/scale changes use shared selected IDs. Duplicate/delete/reorder are still focused-scene operations; label scope or finish explicit group semantics, never silently broaden edits.
- New compositions support title/product/device/split, limited motions, caption position/size, scale and soundtrack. Faithful legacy phone masks/overlays and arbitrary effects need a measured migration. Mixed timelines choose legacy/new preview per active scene; export still rejects mixed legacy state.
- Template publish changes runtime catalog and dynamic detail HTML; seed-based static SEO/structured data and client metadata need reconciliation. Archived seeds can briefly appear while the live catalog loads or if it is unavailable. Do not claim complete runtime SEO.
- Resource downloads/imports work with shared seeds, but resource CRUD/revisions and rich type-specific application are not finished. Resource imports retain the backing template slug for the AI picker.
- Example API is a foundation only. No public example browse/detail/reuse UI. Before enabling publication UI, whitelist only used/consented media; current project document may include unused assets. Preserve source provenance and create copies for reuse.
- Admin edits save with optimistic revision checks and archive preserves records. Revision restore UI, better sample-project/media selection, recoverable preview jobs, unsaved close protection and an optional separate preview zoom are open.
- Production Docker/nginx wiring updated but not built/run here. Verify browser sandbox, font/media availability, memory limits, proxy cookies/origins, backup/restore and dynamic page routes before deployment.
- The OpenSEO SEO agent is a local read-modify scaffold: it edits description strings in `apps/website/src/seo.ts` only and never commits or opens PRs. Live OpenSEO credentials are not provisioned, and per-query DataForSEO cost is unbudgeted. PR automation and scheduling are future work ([SEO-AGENT.md](SEO-AGENT.md)).

## Do not repeat these mistakes

No Strip modal, generated-caption-only claim of finished video, second timeline model, hardcoded Kurutu template, fake stock/AI media result, duplicated marketing catalog, private workspace in website bundle, unbounded preview players, new control styling in a feature stylesheet, or documentation claiming “not connected” for everything when only specific stages are incomplete.

For each follow-up record: user outcome, canonical owner, explicit scope, validated mutation, version persistence, preview/export effect, public/private boundary, tests and remaining limits. Update TASKS/HANDOFF/QA together. Historical logs must never outrank current product intent.
