# Storyframe

An AI-aided, brand-aware video platform: **from your idea to a video in minutes**, with editable timelines and optional storyboards/manual tools. Start with [PRODUCT.md](PRODUCT.md). This repository contains the app, marketing website, shared catalog and creation/community services.

## Read in this order

1. [Product purpose, journeys and relationships](PRODUCT.md)
2. [Current architecture and capability boundary](SUITE-ARCHITECTURE.md)
3. [Ordered next milestones](TASKS.md) and [exact handoff](docs/HANDOFF.md)
4. For UI: [design language](DESIGN-LANGUAGE.md), [implementation guide](design/IMPLEMENTATION-GUIDE.md), [review checklist](design/REVIEW-CHECKLIST.md)
5. For AI: [brag adaptation and update guide](docs/BRAG-INTEGRATION.md), [API contract](docs/CREATION-API.md)
6. [Verification evidence](QA.md), [agent instructions](AGENTS.md)

The sibling blueprint is historical evidence, not a required checkout or the active implementation plan. Archived notes in `docs/archive` are explicitly non-authoritative.

## Run locally

Node 22.12+ (tested on 22.22.3). Install with `npm ci`. Run these in separate terminals:

```sh
npm run dev
npm run dev --workspace=@storyframe/website -- --host 127.0.0.1 --port 9182
npm run dev:brag
npm run dev:community
```

Studio: http://127.0.0.1:9180/ · Template admin: http://127.0.0.1:9180/admin/templates · Website: http://127.0.0.1:9182/.

Creation/catalog service: 9184. Community: 9183. Vite proxies same-origin requests. Restart Vite if adding/changing a proxy does not take effect.

For trusted local template administration, start the creation service with `STORYFRAME_LOCAL_ADMIN=1`; it only elevates loopback requests with a localhost Host. Do not enable this in production. Production admin uses the runtime `STORYFRAME_ADMIN_TOKEN`, entered through the admin page; never put that token in a URL, committed file or chat.

AI stays on **9Router**. Runtime server variables: `N9ROUTER_API_KEY`, `N9ROUTER_BASE_URL`, `GEMINI_MODEL`. A missing key leaves catalog/editing available and generation unavailable. No `.env` file is loaded automatically by the Node entry point; inject variables with the local process supervisor or your existing secure runtime. Never inspect or print an environment file to troubleshoot. [Runtime options](docs/CREATION-API.md#runtime).

## Current core

- Product projects own brand, apps, sources, media and video creations; optional independent storyboards supply context.
- In-editor AI panel sends product/brand/storyboard/timeline/media metadata through the existing 9Router adapter. Whole-video and selected-scene plans are validated; locks and unrelated scenes are protected.
- Checkbox for immediate application or proposal review, ordinary undo/redo, and local durable AI version snapshots. Accepted jobs have stable IDs and are not automatically resubmitted after restart.
- One published template catalog for homepage/marketplace/Studio. Full-page admin supports prompt/scene editing, AI prompt improvement, AI preview, draft/publish, duplicate and archive. Server retains template revisions.
- Shared deterministic composition preview and an experimental Hyperframes render service. **Editor MP4 download and legacy render parity remain unfinished.** JSON project download works; it does not bundle original media.
- Website courses/resources/docs/blog and independent roadmap voting. Actual example publication/reuse API exists; its customer-facing pages and reuse UI remain unfinished.

Live model output and encoded-export parity are not established by offline tests. See [handoff limitations](docs/HANDOFF.md) before extending the UI or preparing a release. The client-side private login is a prototype gate, not authentication; anonymous service sessions are not user accounts.

```sh
npm run build
npm test
# Optional technical render check; no AI request:
node --import tsx work/ai-creation/verify-render.mjs
```

The homepage embeds the real app with isolated sample metadata/media. It cannot submit AI jobs or persist private version history. Keep private originals, job/output files and SQLite volumes backed up; never prune originals automatically. Stop writes or use SQLite backup tooling for a consistent backup.
