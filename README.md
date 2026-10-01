# Storyframe — product studio

A lightweight local suite for founders. Folders contain product projects; each project owns its brand, web/mobile apps, original media and creations. The video editor is one tool inside the suite.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:9180. Node 22.12+; TypeScript + React + Vite. `npm run build` checks types/builds production. `npm test` runs the model checks.

## Available

- Workspace folders and multiple projects; move a project in Apps & sources.
- Four-step setup: project → web/mobile apps → brand capture/import/fresh start → review.
- Project-level brand palette, typeface name, voice, shared media library and app/source references.
- Apps switcher: video studio, logo studio, brand builder, marketing studio, landing pages, ASO copy and keywords.
- Existing video editing with optional story/media panels, timeline, caption editing, native playback, trims, locks, undo and standard output formats. No permanent navigation rail inside the editor.
- Other creative tools have saved, editable draft workspaces. Brand Builder opens shared brand controls; keywords support deduplication.
- Manual performance snapshots, rather than fabricated analytics.
- Downloadable dependency-free local identity capture script. JSON/config import extracts candidates without executing source code. Figma files are retained as references.

## Integration boundary

MCP transport, AI generation, Figma extraction, analytics connections, publishing and final video encoding are **not connected**. The UI labels these limits. No NPM package is installed in another codebase, no files are uploaded externally and no generation credits are spent. The local capture script is a working manual bridge for the intended MCP workflow.

Edits save in browser storage. Media is in IndexedDB, separate from metadata and undo. Workspace JSON backups do not bundle media and suite backup restore UI is not yet built. Preserve original files.

See [suite architecture](SUITE-ARCHITECTURE.md), [QA](QA.md), [tasks](TASKS.md), [media provenance](MEDIA-PROVENANCE.md), and [agent instructions](AGENTS.md). Original production blueprint: `../storyframe-studio-blueprint/`.

## Shared design language and website

[Design language](DESIGN-LANGUAGE.md) is the implementation contract for all UI. Start every UI change with the [implementation guide](design/IMPLEMENTATION-GUIDE.md), then use the [review checklist](design/REVIEW-CHECKLIST.md). These requirements also apply to new pages and components; they are linked from AGENTS.md for future implementors and reviewers. The shared language gives Studio and the website one light, focused product identity while preserving the app’s compact geometry and features. The current core toolkit is Brand Design, Storyboards and Video Studio; older suite notes describing additional draft tools are historical.

Run the website with `npm run dev --workspace=@storyframe/website -- --port 9182`. The homepage embeds `/demo.html`, built from the real app components with an illustrative sample. Its edits and imports are session-only and separate from the user's saved workspace. The actual app retains its normal local persistence.

The homepage offers free signup with no credit card and an immediate interactive sample. Generation queuing applies to future free AI requests, not account access. The existing studio destination still needs a real signup flow; this work does not implement authentication or connect generation/rendering.


## Website content and community

Website content is separate from Studio: 100 template starters and 12 resources in `apps/website/src/data/catalog.ts`, six courses / 18 lessons and eight documentation sections / 24 articles in `learning.ts`, and six blog articles in `blog-data.ts`. Each content item has its own route. Resource files are generated from the website catalog into the ignored `public/library-downloads/` directory during dev startup/build and linked as ordinary downloads. Supply a lesson’s `videoUrl` to replace its authorized video placeholder; do not publish VideoObject metadata until real video details exist.

Run `npm run dev:community` alongside the website preview. The website proxies `/api` to the local community service on port 9183. The service stores public proposals and votes in `data/community.sqlite`, separately from all Studio data. Signed browser visitors can add/remove one vote per idea. This is anonymous browser voting, not verified one-person/one-account voting. Request validation, same-origin writes, body limits and per-IP write limits are enforced. Before a broad public launch, review moderation, identity/abuse controls and privacy/legal copy for the public board.

Timeline assignments are editorial decisions. To update a reviewed proposal, use `node services/community/manage.mjs <slug> <open|planned|in-progress|shipped|closed> <now|next|later|none>` against the intended database. Votes alone never schedule work. Back up the database and its `.key` together; stop writes or use SQLite backup tooling rather than copying an active WAL file incompletely.

The website build prerenders 178 indexable pages, six course aliases, a 404, sitemap and robots file. New catalog records are included automatically. Production proposal pages are rendered by the community service with escaped user text and page metadata. The client then adds voting controls. Unknown production routes return 404; `/gallery` and `/guides` redirect to `/tutorials` and `/docs`.

`compose.yaml` defines the existing static frontend and a separate website community service built from the `community` target in Dockerfile. Only the frontend has a host port, bound to loopback; the community database has its own volume. Production expects HTTPS at the configured Storyframe origin, with secure visitor cookies. Set `COMMUNITY_ORIGINS` for the actual trusted website origin, and keep `TRUST_PROXY=1` limited to the private proxy setup. `COOKIE_SECURE=0` is for local HTTP tests only. No deployment has been performed.

The original static-only deployment can still serve the site but needs the community service to enable live ideas/votes. Studio keeps its existing private gate and local workspace persistence. Real public signup, AI generation and encoded export remain separate launch dependencies.
