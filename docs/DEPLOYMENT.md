# Deployment (Dokploy)

Storyframe ships two public surfaces from one Dokploy application
(`storyframe-studio`, project "labs" on flow.darshgun.com):

- `https://studio.storyframe.yamu.app` — Studio SPA (storyboard/editor). This is
  the domain marketing CTAs link to; it is the operator-mandated studio domain.
- `https://storyframe.yamu.app` — marketing website.

`yamu.app` is a separate Dokploy application (`yamu-app`) and is never touched
by this app.

## How it is deployed

Dokploy builds **`Dockerfile.dokploy`** (set via the application's build type
`dockerfile`). The repo's multi-stage `Dockerfile` is for local Compose only —
Dokploy builds from the git checkout and cannot resolve cross-file
`COPY --from=<stage>` references, which is why the build stage is inlined.

The image is a **single container** running three processes:

| process | why | port |
| --- | --- | --- |
| nginx (foreground, PID namespace lead via `sh -c`) | serves both domains, proxies APIs | 80 |
| `services/community/server.mjs` | community API (roadmap ideas) | 9183 |
| `services/brag/server.mjs` | creation API + template pages | 9184 |

Dokploy applications are single containers: Compose upstreams
(`studio-brag:9184`, `website-community:9183`) do not resolve there, so nginx
proxies `/api/` to `127.0.0.1` upstreams instead. `/init` s6 supervision was
attempted first and replaced by the plain `sh -c` background process form —
s6 user services never started under Dokploy's runtime, and the sh form gives
identical behaviour with visible logs.

Process start command (in `Dockerfile.dokploy`):

```
CMD ["sh", "-c", "node services/community/server.mjs & node --import tsx services/brag/server.mjs & exec nginx -g 'daemon off;'"]
```

## Nginx config

`dokploy-nginx.conf` is installed as
`/etc/nginx/http.d/default.conf` — the nginx alpine image includes that file
**inside the `http` context**, so it must contain only `server` blocks (a
`worker_processes`/`http {}` wrapper makes nginx exit with
`"worker_processes" directive is not allowed here`, which surfaces as 502).

Server blocks:

- `storyframe.yamu.app` → static `/app/srv/website`, `/api/ideas` +
  `/roadmap/ideas/` proxied to community (9183), other `/api/` +
  `/templates/<slug>` + `/sitemap.xml` proxied to brag (9184), SPA-less site
  (`try_files $uri $uri/index.html`), strict `/assets/` handling.
- `studio.storyframe.yamu.app` → static `/app/srv/web`, `/api/` proxied to
  brag (9184), SPA fallback to `/index.html`.

## State and environment

- Persistent volume: Dokploy mount `storyframe-studio-data` → `/data`
  (SQLite DBs: `COMMUNITY_DB=/data/community.sqlite`,
  `STUDIO_DB=/data/studio.sqlite`).
- Environment on the Dokploy application (set via API, not in git):
  `N9ROUTER_API_KEY`, `N9ROUTER_BASE_URL` (AI provider; copied server-side
  from the `free-video-strips` app).
- Baked into the image: `HOST`, `BRAG_PORT=9184`, `COOKIE_SECURE=1`,
  `TRUST_PROXY=1`, `HYPERFRAMES_BROWSER_PATH=/usr/bin/chromium`,
  `WEBSITE_DIST=/app/srv/website` (lets brag serve `/templates/<slug>` shells),
  `COMMUNITY_ORIGINS` / `BRAG_ORIGINS` (CORS allow-list for both domains).

## Deploy and verify

Deployments trigger on push to the tracked branch
(`fix/dokploy-unified-container`) or manually from the Dokploy UI/API. After a
deploy, verify (gate 6 of the delivery checklist):

```sh
curl -s -o /dev/null -w '%{http_code} %{content_type}\n' https://studio.storyframe.yamu.app/
curl -s https://studio.storyframe.yamu.app/api/health     # {"ok":true,...}
curl -s -o /dev/null -w '%{http_code} %{content_type}\n' https://storyframe.yamu.app/
# plus one CSS and one JS asset per domain — expect 200 text/css / 200 application/javascript
```

Container runtime logs: Dokploy UI → application → logs (nginx access log is
symlinked to stdout, both node services log to stdout).

## Known limits

- `apps/website` demo page assets (`/demo/*.ttf|mp4|jpg`) 404 in production:
  `**/public/demo/` is deliberately gitignored (13 MB of production media,
  "source not production media", per `.gitignore`), so git-based Dokploy builds
  never contain it. Pages degrade to fallback fonts. Pre-existing, not a
  deployment regression.
- `http://` requests are redirected to HTTPS by Dokploy's Traefik, not nginx.
