# t_9d64afe0 — brag strip generator ported into Storyframe Studio

SEAT: hydra-glm · STATUS: ready-for-review
REVISION: commit 628b214 (branch feat/t_9d64afe0-brag-video, PR #11)
CONTRACT: brief/plan per parent t_a65880a3 packet; research artifact storyframe-studio-architecture.md

## Approach
Port brag (source ~/Code/free-video-strips) into studio as standalone service following services/community pattern (node:http + node:sqlite, zero new deps). Browser sees only POST /api/strips via nginx; provider keys/URLs never leave the service.

User-facing: "Strip" button in VideoEditor appbar (between Assistant and Export) → modal "Generate a free video strip" (badge: brag · 15–25s launch strips), optional summary textarea, 6 templates, Generate button. On success scenes replace project scenes as normal editable scenes (title from kind: Hook/Reveal/Highlight/Punchline, caption = lines, duration = durationSec*30 frames), modal closes, toast "Strip generated (N scenes · model)". Errors → toast with server error message.

## Changed files
- services/brag/{tones,scaler,gemini,brag,server,server.test}.mjs (new) — full port; server: POST /api/strips, GET /api/strips/:id, GET /api/brag/templates; origin allowlist, sqlite persistence
- apps/web/src/VideoEditor.tsx — interfaces, BRAG_TEMPLATES, modal 'brag', generateBrag(), appbar button (WandSparkles, aria-label "Generate free video strip")
- apps/web/vite.config.ts (new) — dev/preview proxy /api/strips → 127.0.0.1:9184
- nginx.conf — /api/ideas narrowed; /api/strips → $brag http://studio-brag:9184 (resolver 127.0.0.11, read timeout 120s, body 24k)
- Dockerfile — brag stage (node:22-alpine, ENV BRAG_*, /data volume, USER node, EXPOSE 9184)
- compose.yaml — studio-brag service + studio-brag-data volume; website depends_on studio-brag
- package.json — test += brag tests; dev:brag script

## Evidence
- npm test: 66/66 pass (8 brag, one live 9Router round-trip ~9s)
- npm run build: tsc --noEmit + vite clean
- Full browser E2E (agent-browser headless): login → Kurutu → open video studio → Strip modal → Hero template + summary → generated in ~12s → 6 scenes (Hook, Reveal, Highlight×3, Punchline), timeline "6 scenes · 17s", captions from model. Screenshots in work/t_9d64afe0/: strip-modal.png, strip-result.png
- sqlite: strips persisted (data/brag.sqlite), 2 rows at check time

## Deviations / limits
- Docker build not run locally (no docker binary on this box, no ssh to VPS). brag stage mirrors community stage; risk low but unverifiable until Dokploy builds.
- Live URL not yet serving /api/strips — needs PR merge + Dokploy deploy of BOTH apps (frontend + new studio-brag app, shared docker network, N9ROUTER_API_KEY env). Deployment follow-up noted in PR.
- Vite proxy config added for dev parity with apps/website pattern (repo had none for apps/web).
- Tooling note: local chromium needed LD_LIBRARY_PATH wrapper (scratch/chrome-wrap.sh) — browser tool broken without it; agent-browser CLI used instead.

## Next owner
Reviewer: nemesis-nv (behavior/integration; UI surfaces visible to user → argus-nv for visual check against strip-modal.png / strip-result.png). Deploy owner after merge: create Dokploy app for studio-brag (target: brag) + wire env, then live-verify https://studio.storyframe.yamu.app/api/strips.
