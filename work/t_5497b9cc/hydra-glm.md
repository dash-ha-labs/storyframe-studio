# Work: t_5497b9cc — hydra-glm

Initiative: storyframe-seo | Packet revision: kanban task body t_5497b9cc | Brief/plan revisions: n/a (ops ticket)
Base revision: feat/t_b669bd2d-openseo-seo-agent @ 1147aca (script PR #18 still open; this branch stacks on it)
Submitted revision/diff: feat/t_5497b9cc-seo-agent-ci @ d0f96af (commits 8492742 + d0f96af); PR #19
Serving model: glm/glm-5.3 (team-glm-hydra route)

## Before implementation

User outcome: Storyframe admins stop running the SEO loop by hand. Every week
(toggleable) CI queries OpenSEO, and when weak-CTR pages are found it proposes
meta-description edits as a PR; nothing reaches production without human
review. This ticket is only the CI layer around the existing
`apps/website/scripts/seo-agent.ts` (PR #18); the script itself is untouched.

Journey position: OpenSEO MCP → agent script (exists) → **CI: guard + tests +
build + branch + PR (this ticket)** → human review → merge → Dokploy deploy.

Internal boundary: no UI, no app runtime changes, no new product surface. The
one content-visible change is the `/legal` meta description (49→104 chars) —
disclosed below, made so the file satisfies the agent's own documented 50-160
contract before automation starts asserting it.

Approach: one workflow file with explicit least privilege
(contents/pull-requests write only), a schedule gated on the
`SEO_AGENT_ENABLED` repo variable so unprovisioned weeks are silent and spend
no DataForSEO credits, a worktree guard (`git status --porcelain` must show
exactly ` M apps/website/src/seo.ts`), tests+build on the proposal before any
commit, a deterministic `seo-agent/<run>-<attempt>` branch, and `gh pr create`
with diff + reviewer checklist. Manual dispatch supports dry-run.

Dependency discovered while implementing (root cause of first rehearsal
failure): PR #18's tests pinned the current description literals, but CI runs
`npm test` on the agent's own proposal — the loop would always fail on its
first edit. Fixed by unpinning descriptions (titles stay pinned; the agent
contract never touches titles) and asserting the shared 50-160/single-line
contract instead. The e2e stub-chat assertion also pinned the prompt's
`currentDescription` literal; now compared to the parsed current value.

## Result

Changed files (branch feat/t_5497b9cc-seo-agent-ci):
- `.github/workflows/seo-agent.yml` (new) — weekly cron Mon 06:17 UTC +
  workflow_dispatch (dry_run input); job steps: checkout, node 22 + npm cache,
  npm ci, agent (secrets/vars env), guard, npm test, website build, commit to
  dedicated branch, gh pr create. `if:` skips schedule unless
  `vars.SEO_AGENT_ENABLED == 'true'`; dispatch always runs.
- `docs/seo.md` (new) — required repository secrets (OPENSEO_MCP_URL,
  OPENSEO_API_KEY, OPENSEO_QUERY_TOOL, OPENSEO_QUERY_ARGS, N9ROUTER_API_KEY,
  N9ROUTER_BASE_URL), optional variables (SEO_AGENT_ENABLED, model, origin,
  heuristics), activation steps, dry-run, costs/monitoring, review
  expectations.
- `apps/website/tests/seo-agent.test.ts` — descriptions unpinned → contract
  assertions (length 50-160, single line, no markup) over all 11 entries;
  e2e currentDescription compared to parsed value; /legal mutation text made
  distinct from the committed one.
- `apps/website/src/seo.ts` — `/legal` description raised into the 50-160
  contract (text already used by the test file).
- `docs/SEO-AGENT.md`, `docs/HANDOFF.md`, `TASKS.md` — CI wiring documented;
  stale "no automatic PRs / scheduling undefined" statements updated.

Not done (by design): no live OpenSEO/9Router credentials exist, so no live
run; secrets/variable provisioning is a human action documented in seo.md.
No changes to the agent script, no UI, no Dokploy changes.

## Evidence

| Acceptance criterion | Actual check/artifact | Result |
|---|---|---|
| Workflow exists, weekly cron + manual dispatch | YAML parsed: triggers [schedule (17 6 * * 1), workflow_dispatch(dry_run)] | pass |
| Runs seo-agent.ts on schedule | Step "Run SEO agent" → `node --import tsx scripts/seo-agent.ts` in apps/website | pass |
| Only-seo.ts guard blocks strays | Guard lab, 3 scenarios: only-seo.ts→changed=true; seo.ts+stray(untracked AND tracked)→nonzero exit; clean→changed=false | pass |
| Tests+build gate the proposal before commit | Rehearsal: agent(stub MCP+chat) mutated seo.ts → guard → `npm test` 92 pass on mutated file → website build (179 pages) → commit | pass |
| Commit → new branch → PR vs main | Commit step produced `seo-agent/rehearsal-1` @ 78f577f touching only seo.ts (13-line diff); `gh pr create --base main` (push/PR need GitHub, syntax `bash -n` + structure-checked; gh 2.102 preinstalled on ubuntu runners per runner-images) | pass (push/PR simulated locally) |
| Secrets documented in docs/seo.md | Table of 6 secrets + 6 variables + activation + dry-run + costs | pass |
| First rehearsal exposed real defect | Run with PR #18 tests: agent edit → `npm test` FAILED (2 pinned-description tests) — proving the loop needed the unpin; fixed, then full rehearsal green | pass (defect→fix→re-run) |
| Repo checks after changes | `npm test` (all workspaces + services) and `npm run build` pass at 8492742/d0f96af | pass |

Checks not run and why: a real GitHub Actions execution (needs the workflow on
a branch with Actions enabled + secrets; reviewer/human can dispatch a dry-run
after merge), live OpenSEO query (no credentials provisioned), actual push/PR
from the workflow step.

## Handoff

- PR #19 stacks on PR #18 (still open). Merge #18 first; #19 retargets to
  main automatically. Reviewer: nemesis-nv.
- After merge, a human must add the secrets and set `SEO_AGENT_ENABLED=true`
  (docs/seo.md lists them); until then scheduled runs skip silently and manual
  dispatches serve as setup diagnostics. First live dispatch may need
  OPENSEO_QUERY_TOOL/OPENSEO_QUERY_ARGS tuned to the real tool list.
- Remaining risks: DataForSEO cost per weekly query remains unbudgeted
  (research "Unknown"); `actions/checkout@v7`/`setup-node@v7` are current
  majors today but unpinned to minor; the workflow PR body embeds the diff, so
  very large proposals make long (but harmless) bodies.
- Next owner: nemesis-nv (behavior/integration review), then Astra for
  credential provisioning. Decision needed from Astra: none.

## Repair log

1. Guard hole (found by guard lab scenario 2): first guard version diffed
   tracked files only, so an untracked stray file passed silently → rewritten
   to `git status --porcelain` whitelist of exactly ` M apps/website/src/seo.ts`.
   Re-ran lab: 3/3 scenarios correct.
2. CI-loop test failure (found by rehearsal 1, pre-fix tests): pinned
   description literals fail on the agent's own proposal → unpinned to contract
   assertions; e2e prompt literal compared to parsed value.
3. Self-inflicted test no-op (found by rehearsal 2): my /legal text matched the
   test's mutation string → verifyMutations rejected 0 changed lines; test now
   uses distinct text. Rehearsal 3: 11/11 green.
