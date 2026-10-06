# Work: t_20206154 — vega-glm

Initiative: storyframe-website | Packet revision: kanban card t_20206154 body (no separate spec file) | Brief/plan revisions: not opened (ticket carries the anchor; no REQUIRED references)
Base revision: 42486c71ef9f909187aeef16ef00a5ec3907af7d (origin/main) | Submitted revision: 884f03f83ed8a0396620efc127f5110ecae450ba on feat/t_20206154-ecommerce-illustrations
Serving model: glm (route team-glm-vega); exact version unknown

## Before implementation

User outcome: a seller visiting `/ecommerce` should understand the paste-URL /
product-photo → AI ad → publish flow instantly, instead of seeing generic
app-mockup wireframes that read as blank placeholders. This page is a marketing
capture surface for the e-commerce vertical of Storyframe; it must not become a
product feature, a new workflow, or a screen with real app claims.

Position in journey: `/ecommerce` is one of the vertical landing pages (next to
`/real-estate`, `/youtube-creators`). This ticket completes its visuals; the
page already existed with copy, hero, zigzag, format cards and CTAs.

Boundary: all graphics are schematic "fake UI" built from HTML/CSS/Lucide —
the repo rule (AGENTS.md, DESIGN-LANGUAGE.md) is that wireframes are
illustrations, never proof of connected generation; no new pages, nav items,
controls or flows.

Dependencies checked: `WorkflowPreview` (shared, also used by Features/Real
Estate/YouTube pages), `FeatureZigzag`/`Hero` (packages/ui), `website.css`
wireframe layer, existing tests, DESIGN-LANGUAGE.md (light reference, wireframe
personality, motion ≤5s), AGENTS.md (no page-local skins; docs+tests in same
change). Found another seat's in-flight checkout on main checkout (modified
App.tsx/seo.ts + commit 9a6d2f3 mid-run) → worked in an isolated worktree off
origin/main (42486c7) to avoid touching it.

Approach: extend the shared `WorkflowPreview` with four new kinds
(`ecommerce-url`, `ecommerce-photo`, `ecommerce-ai`, `ecommerce-publish`)
rather than a page-local component (AGENTS.md forbids page-local skins;
other verticals can reuse the kinds), switch the `/ecommerce` page to them,
add the CSS in the existing wireframe language, extend the page tests, and
document in `docs/landing-ecommerce.md` (documentation-is-part-of-done rule;
the page had no docs page).

References additionally opened: docs/landing-realtor.md and the youtube-creators
commit (precedent for docs/tests/work-artifact footprint); no other deviations.

## Result

Changed files (all under the worktree branch):

- `apps/website/src/WorkflowPreview.tsx` — added 4 illustration kinds + icons
  (Link2, Search, ShoppingBag, Tag, Check, ImagePlus, Camera, Wand2, Loader2,
  MousePointerClick, Heart, MessageCircle, Share2); toolbar titles extended.
  No changes to the 6 existing kinds (other pages unaffected).
- `apps/website/src/pages/EcommercePage.tsx` — zigzag visuals now
  `ecommerce-url`, `ecommerce-photo`, `ecommerce-ai`, `editor`; format card 1
  now `ecommerce-publish`; copy/CTAs/structure untouched.
- `apps/website/src/website.css` — tint backgrounds for the 4 kinds; ~55 lines
  of new wireframe styles (browser chrome, product card, dropzone variant, AI
  pipeline, spinner, vertical ad + metrics) + 860px/620px scale steps +
  feature-card centering, following the existing patterns.
- `apps/website/tests/ecommerce.test.ts` — new test locking in the four
  illustration kinds, their key contents, and absence of the old generic
  mockup (`Your screenshot`, `preview-mockup`).
- `docs/landing-ecommerce.md` — new page doc: flow, illustration table, code
  map, design notes, verification.
- `work/t_20206154/` — this artifact + 8 proof screenshots.

Intent preserved: only the visuals changed; copy, routes, SEO, CTA constants
and all other pages are untouched. No unapproved scope beyond the docs page
(binding team rule) and the shared-component approach (repo rule); both noted
in Handoff.

## Evidence

| Acceptance criterion | Actual check/artifact | Result |
|---|---|---|
| 1. No literal blank placeholder boxes in zigzag/steps | Test asserts `!includes('Your screenshot')` and `!includes('preview-mockup')` on the rendered page; all 5 image containers render new illustrations | PASS |
| 2. Graphic 1: browser URL input with Shopify link | `ecommerce-url` kind: browser dots + URL bar `my-store.myshopify.com/products/aurora-lamp` + green status dot + "Product found" card (thumbnail, name, $49/4 photos/★4.8 chips, "detected" badge); screenshot `proof1-shopify-url.png`, vision-verified: all elements render, no cut-off/overlap | PASS |
| 3. Graphic 2: AI processing state | `ecommerce-ai` kind: prompt bar "Turn this product into a viral ad" + 4 pipeline steps (2 done checks, 1 running with spinner, 1 queued); screenshot `proof3-ai-processing.png`, vision-verified professional, nothing truncated | PASS |
| 4. Graphic 3: mobile phone frame (TikTok/Reels AR) with play button or generic ad layout | `ecommerce-publish` kind: 9:16 phone, blue-gradient ad (product badge, "50% off today", "Shop now"), "TikTok · 9:16" label, engagement pills 2.4k/318/96; screenshot `proof5-vertical-ad-card.png`, vision-verified (chose generic ad layout option) | PASS |
| 5. Professional, attractive, clearly communicating the step | Vision analysis of each illustration: no cut-off/overlap/misalignment; consistent with the light wireframe design language; +1 found defect ("Shop now" wrapped) fixed and re-verified | PASS |
| 6. Visual proof attached before completion | `work/t_20206154/proof1..proof8*.png` (5 element shots, desktop+mobile full page, mobile card crop), all captured from the production build served locally | PASS |

Checks run: `tsc --noEmit` exit 0 (twice); website test suite 27/27 pass
(includes the new assertions; run twice); `npm run build` twice — tsc + vite +
180 pages prerendered; browser render of the built site with horizontal-
overflow probe at 390/620/900/1440 px (scrollWidth == clientWidth at all four).

Checks not run: real-device rendering; the spinner's rotation confirmed by CSS
rule + rendered glyph, not video; live `storyframe.yamu.app/ecommerce` check
deferred to post-merge (live serves old code until the PR merges).

## Handoff

Deviations from the bare ticket (both rule-driven, flagged for the reviewer):
(1) added `docs/landing-ecommerce.md` per the documentation-is-part-of-done
rule; (2) implemented the kinds inside the shared `WorkflowPreview` instead of
a page-local component per AGENTS.md; (3) illustration copy (product name
"Aurora Desk Lamp", metrics 2.4k/318/96) is invented schematic placeholder
copy, allowed by the ticket's no-screenshots constraint and documented in the
docs page.

Remaining risks / limits: no real app screenshots yet — when approved, swap the
kinds for real captures and update `docs/landing-ecommerce.md`; the `editor`
and `brand` shared wireframes remain intentionally generic (used by 4 pages;
out of scope here). Post-merge: verify live `/ecommerce` after Dokploy
redeploys (next owner: reviewer/planner at merge time).

Environment note: worktree `/home/d/Code/storyframe-studio/.worktrees/t_20206154`
has a `node_modules` symlink to the main checkout (gitignored) — remove the
worktree after merge as usual. Main checkout untouched (other seat's in-flight
work preserved).

Next owner: argus-nv (per card). Decision needed from Astra: none.

## Repair log

- Finding (self, vision review of proof5): "Shop now" pill wrapped to two
  lines in the vertical ad. → Fix: removed the redundant bag icon inside the
  pill, added `white-space: nowrap` + centering. → New revision rebuilt;
  re-capture + vision check: single line, no other regressions; overflow probe
  and 27/27 tests re-run. 1 repair cycle, closed.
