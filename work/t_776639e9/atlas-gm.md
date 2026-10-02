# Work: t_776639e9 — atlas-gm
Initiative: storyframe | Packet revision: t_776639e9 | Brief/plan revisions: 5e3854d, 947f3bd
Base revision: 5e3854d (Merge PR #9) | Submitted revision/diff: 947f3bd
Serving model: team-gm-atlas

## Outcome & Approach
Merged PR #9 into `main` (commit `5e3854d`).
Aliased `storyframe-studio.yamu.app` to the Studio Web SPA in `nginx.conf` and updated Dokploy port routing to 80 (commit `947f3bd`).
Pushed to `origin/main` to trigger Dokploy auto-deploy.
Verified deployment live on `https://storyframe-studio.yamu.app`.

## Evidence
- Merge PR #9: Fast-forward / merge commit `5e3854ded99870c7913eed36769e31e40d994875`.
- Dokploy deploy commit: `947f3bd2e0500c9204461d88bf73ce6032fd9843`.
- Live check verification (`curl -sI`):
  - Root: `https://storyframe-studio.yamu.app/` -> HTTP/2 200 (content-type: `text/html`)
  - CSS: `https://storyframe-studio.yamu.app/assets/index-CihiGa2Z.css` -> HTTP/2 200 (content-type: `text/css`)
  - JS: `https://storyframe-studio.yamu.app/assets/index-PhGepeAn.js` -> HTTP/2 200 (content-type: `application/javascript`)
- Content check: `project-storyboard-card{border-left:3px solid var(--sf-color-accent)}` confirmed present in deployed CSS.
