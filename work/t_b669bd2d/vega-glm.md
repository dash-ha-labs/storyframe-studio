# Work: t_b669bd2d — vega-glm

Initiative: storyframe-seo | Packet revision: task body (kanban t_b669bd2d) | Brief/plan revisions: n/a (ops scaffold)
Base revision: origin/main 9b31f49 | Submitted revision/diff: commits 02eed5a + ec6e3fb on branch feat/t_b669bd2d-openseo-seo-agent; PR https://github.com/dash-ha-labs/storyframe-studio/pull/18 (merge blocked on review by design)
Serving model: glm/glm-5.3-flash (team-glm-vega route)

## Before implementation

User outcome: Storyframe admins get a runnable read→suggest→mutate loop that turns
OpenSEO MCP analytics into concrete meta-description improvements in
`apps/website/src/seo.ts`, written locally for human PR review. This ticket is the
local read-modify loop only; PR automation is a future ticket. It does not touch
the client UI, the prerender pipeline, or any product milestone queue.

Research read (REQUIRED): `research/openseo-storyframe.md`. Boundaries taken from it:
agent must not modify `seo.ts` structurally (`metadata(path)` lookup logic); only
strings inside `indexPages` / data dictionaries. Constraints from the packet: no
direct commits to main; human PR review; OpenSEO MCP as the data source.

References opened beyond the packet, and why:
- `apps/website/src/seo.ts` — mutation target; single-quote string entries.
- `services/brag/gemini.mjs` — repo's AI-completion pattern (9Router env vars,
  chat/completions) reused for the "basic AI completion setup".
- `docs/CREATION-API.md`, `docs/BRAG-INTEGRATION.md` — runtime-credential rules
  (no secrets in bundles/logs; provider injected in tests, no live calls).
- OpenSEO upstream docs (`every-app/open-seo`, fetched 2026-10-04) — MCP is
  streamable HTTP at `/mcp`, `Authorization: Bearer oseo_…` API keys for CI;
  tool catalog includes GSC performance reads. Exact tool names are not
  documented as stable, so the client discovers tools via `tools/list` and
  lets env vars pin the tool/args.

Approach: one script `apps/website/scripts/seo-agent.ts` with injectable
dependencies (`runLoop` takes fetch-level MCP + chat fns and file paths), so the
whole loop is provable offline by a stub MCP HTTP server, matching the
`chatFn`-injection pattern used by `services/brag`. Mutations are constrained to
replacing the description string literal of an existing `indexPages` entry;
structural verification re-parses the result and requires entry paths,
non-target entries and lookup logic to be unchanged, plus a clean re-import.

Capability check: no browser/UI work in this ticket; no capability gap.

## Result

Changed files (see git diff on the branch):
- `apps/website/scripts/seo-agent.ts` — new agent script (MCP client, GSC heuristics,
  9Router completion, bounded mutation + verification, CLI flags).
- `apps/website/tests/seo-agent.test.ts` — offline tests: parser vs real seo.ts,
  escaping round-trip, bounded mutation, heuristics, proposal parsing, and an
  end-to-end loop against a stub MCP server + stub chat provider on a temp copy.
- `docs/SEO-AGENT.md` — env vars, usage, safety boundaries, non-goals.
- `TASKS.md`, `docs/HANDOFF.md`, `QA.md` — status/entry-point/evidence updates.
- `research/openseo-storyframe.md` — committed (was untracked) so the citation
  resolves for reviewers.

No unapproved scope: no PR automation, no scheduled CI, no OpenSEO server
provisioning, no UI changes, no dependency additions.

## Evidence

| Acceptance criterion | Actual check/artifact | Result |
|---|---|---|
| Connects to OpenSEO MCP via env vars | Stub streamable-HTTP MCP server test: initialize handshake, session header echo, tools/list, tools/call | pass (offline) |
| Parses local seo.ts config | Parser test against the real file: all 11 indexPages entries with exact title/description | pass |
| AI completion suggests improvements from MCP data | Stub chat provider returns fenced JSON; invalid rows (unknown path, overlength) filtered | pass |
| Modifies seo.ts locally, bounded | Temp-copy end-to-end: only target description byte-changed; structure verify passes; re-import clean | pass |
| No live paid calls in tests | All provider/MCP traffic is stubbed in-repo | pass |

Manual: `--parse-only` run against the real file (see QA.md). Not run: live
OpenSEO (no OPENSEO_API_KEY provisioned yet) and live 9Router generation —
both need human-provisioned credentials; the script fails with a clear
configuration error rather than inventing data.

## Handoff

Deviations: none from the packet. Tool-name discovery is env-pinnable
(`OPENSEO_QUERY_TOOL` / `OPENSEO_QUERY_ARGS`) because upstream does not
document stable tool names; first live run may need those two env values set.
Remaining risks: DataForSEO cost per MCP query is unbudgeted (research
"Unknown"); the mutation guard is string-level, so a future seo.ts refactor to
a different shape will require parser updates (verified by the parser test).
Next owner: nemesis-nv (behavior/integration review), then a future ticket for
PR automation + scheduled run. Decision needed from Astra: none.

## Repair log

1. Lazy env read (real defect found by tests): the first draft captured
   `N9ROUTER_API_KEY`/`OPENSEO_MCP_URL` at module load; this machine's shell
   carries a real router key, so the "refuses without key" test would have made
   a live paid call. Fix: all credentials/URLs read lazily; tests snapshot and
   restore env around every test. Check: `defaultChat` refusal test passes with
   the real key present in the shell.
2. Test-expectation fixes (not script defects): candidate order follows
   impressions sort (`/templates` before `/docs`); `selectTool` fallback needs
   required args to succeed; cross-test tool-call counter made relative.
3. Type fix: `bad` helper returned `Array.push` (number) as `void`.

All fixed states re-verified by the full suites listed above; no open findings.
