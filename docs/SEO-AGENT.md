# SEO agent — OpenSEO MCP → seo.ts read-modify loop

Entry point: [seo-agent.ts](../apps/website/scripts/seo-agent.ts). Research basis: [research/openseo-storyframe.md](../research/openseo-storyframe.md).

The agent queries a self-hosted or hosted OpenSEO MCP server for Search Console
performance data, picks pages with high impressions but weak CTR, asks the
routed completion model for improved meta descriptions, and rewrites **only the
description strings** of existing entries in `indexPages` inside
`apps/website/src/seo.ts`. The script itself never commits, pushes or opens a
PR. Unattended operation (weekly schedule, tests, branch, PR) is wired in CI:
see [seo.md](seo.md).

## What it deliberately does not do

- No structural edits to `seo.ts`: `metadata()`, entry paths, titles, entries
  and the rest of the file are verified unchanged after every mutation.
- No writes outside `apps/website/src/seo.ts` (and only when not in dry-run).
- No direct commits to main and no automatic merges. The CI workflow
  ([seo.md](seo.md)) commits to a dedicated branch and opens a PR; a human
  reviews and merges. The script itself never commits or pushes.
- No retries of provider calls; a failed or unclear run leaves the file alone.

## Usage

```sh
cd apps/website
node --import tsx scripts/seo-agent.ts --parse-only   # inspect current entries
node --import tsx scripts/seo-agent.ts --dry-run      # full loop, no write
node --import tsx scripts/seo-agent.ts                # write the local file
```

After a run: review the printed diff, `npm test`, `npm run build`, then open a PR.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `OPENSEO_MCP_URL` | MCP endpoint. Default `https://app.openseo.so/mcp`; point at your self-hosted instance otherwise. |
| `OPENSEO_API_KEY` | OpenSEO API key (`oseo_…`, Settings → API keys). Required unless a self-hosted URL needs no auth. |
| `OPENSEO_QUERY_TOOL` | Optional pin of the Search Console tool name. Unset, the agent picks the first tool whose name/description matches search-console/GSC/performance and errors with the full tool list if none matches. |
| `OPENSEO_QUERY_ARGS` | JSON arguments for the tool (e.g. `{"project_id":"…"}`). Required properties are validated against the tool's input schema. |
| `N9ROUTER_API_KEY` | 9Router credential for the completion step. Same runtime-only rule as the creation service: never in bundles, logs or exports. |
| `N9ROUTER_BASE_URL` | Optional router base; `/v1` normalized as in `services/brag/gemini.mjs`. |
| `SEO_AGENT_MODEL` | Routed model for the completion step (default `ag/gemini-3.8-flash-high`). |
| `SEO_SITE_ORIGIN` | Site origin shown to the model. Default `https://storyframe.yamu.app`. |
| `SEO_AGENT_MIN_IMPRESSIONS` / `SEO_AGENT_MAX_CTR` / `SEO_AGENT_MAX_POSITION` / `SEO_AGENT_MAX_EDITS` | Candidate heuristics (defaults 200 impressions, CTR ≤ 2%, position ≤ 20, at most 3 edits per run). |
| `SEO_AGENT_DRY_RUN` | `1` forces dry-run mode regardless of flags. |

## Safety behavior

- Suggestions are validated against the parsed entries: unknown paths,
  duplicates, lengths outside 50–160, newlines/angle brackets and text
  identical to the current description are rejected and reported.
- `verifyMutations` re-parses the mutated file and fails unless exactly the
  accepted description literals changed (paths, titles, entry count and line
  count must be identical).
- Descriptions are re-escaped for the single-quoted TS literals (`'` and `\`).
- Tests (`apps/website/tests/seo-agent.test.ts`) run the whole loop against a
  stub MCP HTTP server and a stub chat function; no live OpenSEO or 9Router
  traffic, and env is snapshotted/restored so a machine-level router key can
  never leak into a test call.

## Known limits

- OpenSEO does not document stable MCP tool names; the first live run may need
  `OPENSEO_QUERY_TOOL`/`OPENSEO_QUERY_ARGS` set from the server's tool list.
- Each MCP query costs DataForSEO credits (research file, "Unknown"): budgets
  are not defined; the weekly CI schedule is opt-in via `SEO_AGENT_ENABLED`
  ([seo.md](seo.md)).
- The GSC-style parser understands page/metric rows keyed by `url`/`page`/…
  with `impressions`/`clicks`/`ctr`/`position` (absolute or percent strings);
  if OpenSEO's real payload shape differs, extend `extractPageRows` with a
  fixture from a real response rather than loosening validation.
