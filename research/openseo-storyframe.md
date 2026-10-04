# OpenSEO Integration for Storyframe

**Date:** 2026-10-04
**Target:** `apps/website`

## Direct Answer
OpenSEO provides an open-source SEO data hub powered by DataForSEO APIs and Google Search Console (GSC), exposing its data via the Model Context Protocol (MCP). A "self-improving" SEO loop for Storyframe is feasible by scheduling an MCP-compatible AI agent to query OpenSEO for keyword gaps and underperforming pages, automatically mutate static SEO data files in the Vite app, and submit Pull Requests.

## Verified Facts & Sources
- **OpenSEO Architecture:** OpenSEO is a self-hosted tool functioning as an MCP server. It connects to GSC and DataForSEO for analytics, rank tracking, and backlink data (Source: OpenSEO documentation / `every-app/open-seo`).
- **Storyframe SEO Implementation:** SEO is statically managed in `apps/website/src/seo.ts` (mapping paths to titles, descriptions, and JSON-LD schema). Pages are built to static HTML by `apps/website/scripts/prerender.tsx`.
- **Data Mutability:** Content lives in TypeScript arrays and dictionaries (`apps/website/src/data/catalog.ts`, `blog-data.ts`, `seo.ts`), making it amenable to automated manipulation by an AI coding agent.

## Implications for the User Journey
The automated loop runs out-of-band as a CI/CD or chron process. Visitors to the marketing site (`storyframe.yamu.app`) will see more relevant landing pages and search snippets. No changes are required to the client-side UI, and zero dynamic rendering overhead is added.

## Data Flow for Automated SEO Loop
1. **Analytics Ingestion:** OpenSEO pulls live GSC data (Clicks, Impressions, CTR, Position) and DataForSEO Keyword Data (Search Volume, Difficulty).
2. **Agent Query:** A scheduled CI agent connects to OpenSEO's MCP to identify pages with high impressions but low CTR, or content gaps based on competitor analysis.
3. **Code Mutation:** The AI agent edits `apps/website/src/seo.ts` (modifying `indexPages` descriptions) or generates new typescript entries in `src/data/*.ts`.
4. **Prerender:** The agent commits and opens a Pull Request. Once approved and merged, `npm run build` executes `prerender.tsx`, baking the updated `<meta>` tags into `dist/*.html`.
5. **Deploy:** Dokploy automatically deploys the merged changes to the live domain.

## Existing Patterns to Reuse
- **SSG Prerendering:** The existing `prerender.tsx` handles structured data and canonical links natively; the AI only needs to modify the raw text inputs in `seo.ts` and `data/`.
- **VPS Deployment:** Storyframe already uses Dokploy on a VPS; OpenSEO provides a standard Docker image (`ghcr.io/every-app/open-seo`) that can be easily deployed alongside current applications as a new Dokploy app.

## Required Infrastructure & Webhook Setups
- **Self-Hosted OpenSEO:** Deploy via Dokploy Docker on the VPS with a `DATAFORSEO_API_KEY` and authenticate with Storyframe's GSC account.
- **CI/CD Automation:** A GitHub Action cron job (or Hermes scheduled worker) running an MCP-capable AI CLI (e.g., Claude Code, Codex, or Hermes) on a weekly schedule.
- **Agent Scopes:** The agent requires a `GITHUB_TOKEN` scoped for creating branches and PRs, preventing direct pushes to production without human review.

## Traps & Unknowns
- **Trap:** Allowing the agent to push directly to `main`. Automated SEO agents can sometimes hallucinate product features or write "spammy" copy violating `DESIGN-LANGUAGE.md`. Mandatory human PR review acts as a safeguard.
- **Trap:** Modifying `seo.ts` structurally. The file contains strict lookup logic (`function metadata(path)`); the agent must be bound to mutate only strings inside `indexPages` or data dictionaries.
- **Unknown:** The cost rate of DataForSEO API queries when heavily polled by an automated agent. Rate limits/budgets need to be strictly defined.

## Recommended Next Step
Provision OpenSEO on the Dokploy VPS as a new application, authenticate it to Storyframe's Google Search Console, and construct a bounded GitHub Action to test an agent modifying a single underperforming meta description via PR.