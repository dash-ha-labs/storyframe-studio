# Creation/catalog API — current contract

Entry point: [server.mjs](../services/brag/server.mjs). Run with Node 22.12+ and `--import tsx`. Requests are same-origin JSON unless uploading media. All writes require an allowed Origin. Errors are `{error:string}` with a non-2xx status. Never treat a rendered button or accepted 202 response as completed generation.

## Runtime

| Variable | Purpose |
| --- | --- |
| `BRAG_PORT` / `HOST` | Defaults 9184 / 127.0.0.1. Legacy service name retained. |
| `STUDIO_DB` | Defaults `data/studio.sqlite`; `BRAG_DB` is accepted as fallback. Parent directory also owns `media/` and `outputs/`. |
| `BRAG_ORIGINS` | Comma-separated exact origins allowed to write; defaults local Studio. |
| `N9ROUTER_API_KEY` | Runtime server credential, loaded when making a request. Never expose to client. |
| `N9ROUTER_BASE_URL` | Existing beta router URL; `/v1` normalized by the adapter. |
| `GEMINI_MODEL` | Existing routed model, default `ag/gemini-3.8-flash-high`; verify availability before authorized live QA. |
| `STORYFRAME_ADMIN_TOKEN` | Runtime admin login key. Empty disables token login. |
| `STORYFRAME_LOCAL_ADMIN` | `1` permits admin on loopback with localhost Host, development only. |
| `COOKIE_SECURE` | `1` for HTTPS production. Session cookie is HttpOnly, SameSite=Lax, seven days. |
| `WEBSITE_DIST` | Built site path for dynamic template HTML and sitemap. |
| `HYPERFRAMES_BROWSER_PATH` | Optional explicit Chromium executable; FFmpeg/ffprobe must also be available. |

## Catalog and admin

- `GET /api/health`: service, provider configuration and renderer version; not generation/render proof.
- `GET /api/session`: establishes a private anonymous session; returns `admin`, `localAdmin`, `provider`.
- `GET /api/catalog`: only published templates, shared resources, explicitly published example summaries. No private workspace/jobs/media.
- `POST /api/admin/session` `{token}`; `DELETE` signs out admin role.
- `GET /api/admin/templates`: includes drafts and archives.
- `POST /api/admin/templates`: create unique slug; returns `{template}` revision 1.
- `PUT /api/admin/templates/:slug`: whole validated record plus current `revision`. URL slug immutable; conflict returns 409.
- `DELETE /api/admin/templates/:slug` `{revision}`: archives; preserves template history and existing creations.
- `GET /api/admin/templates/:slug/versions`: latest 50 immutable revisions.
- `POST /api/admin/templates/improve` `{template,instruction}`: explicit 9Router call; returns revised `prompt` and model, does not save/publish. This endpoint is not yet a durable job; never retry a timeout automatically.

Template schema: [validateTemplate](../services/brag/catalog.mjs). Required title, slug, description, category, platform, format, style, color, prompt, sampleBrief (can be empty), layout, motion, status, scenes. Each scene has title/instruction and 1–30 seconds; 1–12 scenes, total ≤120 seconds. Published+featured controls homepage eligibility. Seeds are initial data; editing seed JSON does not update an existing database automatically.

## Generation and job recovery

`POST /api/generations`:

```json
{
  "requestId": "client-generated-unique-id",
  "creationId": "existing-private-creation-id",
  "templateSlug": "saas-product-launch",
  "prompt": "Shorten the selected opening",
  "scope": "selected",
  "selectedIds": ["scene-id"],
  "resourceIds": [],
  "context": "Object produced by generationContext(owner, video, storyboard)"
}
```

The string above documents the `context` producer; send its actual object, not the literal string. `scope` is `new`, `all` or `selected`. `parentJobId` is optional. Admin may supply a fully validated `templateDraft` for preview without publishing. Normal users cannot preview private drafts.

Returns 202 with a durable job. Reusing the same requestId **within the same owner session** returns the original job, even if the supplied payload differs. Do not generate a fresh ID for a retry. `GET /api/jobs` lists the latest 50 owner jobs; optional `creationId` currently filters that window. `GET /api/jobs/:id` returns stage, result/error and client requestId. Foreign sessions get 404. Stages: queued → planning → ready, or failed/interrupted/canceled. Render stages: queued → validating → rendering → complete. Only `ready` plans can be applied; only `complete` render jobs have encoded output.

`POST /api/jobs/:id/cancel` cancels queued work only. Work accepted by a provider is not automatically canceled/retried. On service restart, unfinished jobs become interrupted. The current integration cannot query a provider task to recover a completion after a timeout; preserve uncertainty rather than invent success.

## Media, render and explicit public examples

- `POST /api/media`: raw bytes with supported MIME type, max 50 MB/file and 300 MB/session. Returns `{asset:{id,type,sha256}}`. Files are owner-scoped and immutable. MIME sniffing/antivirus/account storage controls are not complete.
- `POST /api/renders` `{requestId,creationId,project,media}`. `project` must pass canonical validation. `media` maps project asset IDs to owner upload IDs. The renderer does not fetch arbitrary remote URLs. Legacy scenes without `layout` are rejected pending parity work. Editor upload/export UI is not yet wired to this endpoint.
- `GET /api/jobs/:id/{project,video,poster}`: owner-only; MP4/poster require completion. Saved artifacts live under unique output directories with checksums.
- `POST /api/examples` `{jobId,title,description,allowReuse:true}`: requires an owned completed render and explicit consent to public reuse. Returns public summary/slug. Never call from implicit saving.
- `GET /api/examples/:slug`, `/project`, `/video`, `/poster`, `/media/:mediaId`: public only after publication. Project response includes public media references for future copy/import UI.
- `DELETE /api/examples/:slug`: owner/admin unpublishes; retained originals and render are not deleted.
- `GET /api/resources/:slug/download`: shared resource content by type.

The full example project currently includes all assets in that rendered video document, potentially unused ones. Before customer publication UI, scope public assets to used/reuse-authorized media and add an explicit review. API existence is not release approval.

## Production page routes

`GET /templates/:slug` renders current published title/description/outline in the website shell; missing/draft templates return 404. `/sitemap.xml` combines static routes with current template records. Nginx must proxy these routes and `/api/` to this service, with `/api/ideas` retained on the separate community service. Catalog uses no-store responses; UI refreshes on mount/focus. Runtime metadata/structured data need final reconciliation with client seed SEO before launch.
