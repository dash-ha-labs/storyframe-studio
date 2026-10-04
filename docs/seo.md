# Scheduled SEO automation (CI → PR)

How the weekly, unattended SEO loop runs. The agent script itself, its safety
guards and its environment variables are documented in
[SEO-AGENT.md](SEO-AGENT.md); this page covers the CI layer on top:
[`.github/workflows/seo-agent.yml`](../.github/workflows/seo-agent.yml).

## What the workflow does

1. Runs Mondays at 06:17 UTC (`schedule`) and on demand (`workflow_dispatch`).
2. Runs `apps/website/scripts/seo-agent.ts`: queries the OpenSEO MCP server,
   picks weak-CTR pages and rewrites only `indexPages` description strings in
   `apps/website/src/seo.ts` (never titles, paths or structure).
3. **Guard**: fails the job unless the only modified file is
   `apps/website/src/seo.ts`.
4. Runs `npm test` and the website build on the proposed edit; any failure
   stops the run — no PR is opened, no half-checked change is proposed.
5. Commits the edit to a new branch `seo-agent/<run_id>-<attempt>` and opens a
   PR against `main` with the diff and a reviewer checklist.
6. Nothing merges automatically: a human reviews and merges (merge deploys).

If the analytics query produces no improvable page, or all suggestions are
rejected by the script's validation, the run ends green with "nothing to
propose" and no PR.

## Activation

Scheduled runs are **opt-in**. The job is skipped by the `if:` condition until
the repository variable `SEO_AGENT_ENABLED` is set to `true`
(Repository → Settings → Secrets and variables → Actions → Variables). This
keeps the weekly cron silent and free of DataForSEO credit spend until the
credentials below actually exist. Manual dispatches always run, which makes the
workflow usable for setup and diagnostics before flipping the switch.

## Required repository secrets

Repository → Settings → Secrets and variables → Actions → Secrets.

| Secret | Required? | Purpose |
| --- | --- | --- |
| `OPENSEO_MCP_URL` | optional | OpenSEO MCP endpoint. Unset = hosted default `https://app.openseo.so/mcp`; set it if you run the self-hosted OpenSEO instance (Dokploy Docker image `ghcr.io/every-app/open-seo`, per [research](../research/openseo-storyframe.md)). |
| `OPENSEO_API_KEY` | required | OpenSEO API key (`oseo_…`, OpenSEO → Settings → API keys). Needed for the hosted endpoint; a self-hosted instance may not need auth. |
| `OPENSEO_QUERY_TOOL` | situational | Pins the Search Console tool by name. Only needed if automatic discovery (search-console/GSC/performance heuristic) picks the wrong tool or none. |
| `OPENSEO_QUERY_ARGS` | situational | JSON arguments for that tool (e.g. `{"project_id":"…"}`). Required when the tool's schema demands arguments; the script errors with the schema if something is missing. |
| `N9ROUTER_API_KEY` | required | 9Router credential for the completion step (improved descriptions). Same runtime-only rule as everywhere in this repo: secrets live in GitHub Actions, never in code, bundles, logs or the PR body. |
| `N9ROUTER_BASE_URL` | optional | Router base URL override; `/v1` is normalized automatically. |

The first live run may need `OPENSEO_QUERY_TOOL`/`OPENSEO_QUERY_ARGS` tuned
against the tool list your OpenSEO instance actually exposes (upstream does not
document stable tool names).

## Optional repository variables (non-secret tuning)

Repository → Settings → Secrets and variables → Actions → Variables.

| Variable | Purpose | Default |
| --- | --- | --- |
| `SEO_AGENT_ENABLED` | `true` activates the weekly schedule (the switch described above). | unset = schedule skipped |
| `SEO_AGENT_MODEL` | Routed completion model. | `ag/gemini-3.8-flash-high` |
| `SEO_SITE_ORIGIN` | Site origin shown to the model. | `https://storyframe.yamu.app` |
| `SEO_AGENT_MIN_IMPRESSIONS` / `SEO_AGENT_MAX_CTR` / `SEO_AGENT_MAX_POSITION` / `SEO_AGENT_MAX_EDITS` | Candidate heuristics: impressions floor, CTR ceiling, position ceiling, max edits per run. | 200 / 0.02 / 20 / 3 |

## Dry run

"Run workflow" in the Actions UI accepts a `dry_run` input: the agent queries
OpenSEO and prints its proposal to the run log, but nothing is committed and no
PR is opened. Use it to verify credentials and tool discovery before enabling
the schedule (note: it still spends DataForSEO credits for the query).

## Costs and monitoring

Each run makes one OpenSEO MCP query (DataForSEO credits — unbudgeted per the
[research](../research/openseo-storyframe.md)) plus one completion call. At one
scheduled run per week this is 52 queries/year; tune the schedule in the
workflow file if that needs to change. Check the "SEO agent" workflow history
for run outcomes; a failed run never leaves a partial edit behind (the script
writes `seo.ts` only after all in-memory validation passes, and the guard
step re-checks the worktree before anything is committed).

## Review expectations

The PR exists so a human reads the proposed descriptions before they ship.
Merge only copy you would have written: concrete product claims, no invented
features or hype. The workflow has already run `npm test` and the website build
on the exact commit under review; merging deploys to production via Dokploy.
