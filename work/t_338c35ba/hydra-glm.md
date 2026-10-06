# Work: t_338c35ba — hydra-glm

Initiative: storyframe (website marketing surface) | Packet: card body (no separate spec file)
Base revision: origin/main 42486c7 | Submitted revision: 1cfc874 (PR #21, branch feat/t_338c35ba-landing-youtube)
Serving model: team-glm-hydra (glm/ pool)

## Before implementation

User outcome: a writer running a faceless YouTube channel lands on
`/youtube-creators`, sees the value prop (script/blog post → multi-scene video
with consistent visuals, on-brand voice, captions, music), clicks **Sign up for
free** and lands on `https://studio.storyframe.yamu.app/`.

Position: third campaign landing page in `apps/website`, sibling of `/ecommerce`
and `/real-estate`. Marketing surface only — no nav item, no backend, no studio
integration, no provider calls. Internal pieces: route registration, SEO entry,
feature doc, tests.

Approach: mirror the `/ecommerce` pattern exactly (Hero + FeatureZigzag +
format grid + closing CTA, zero new CSS), with copy drafted for the
text-to-video workflow. Dependencies checked: `FeatureTemplate`, `Hero`,
`FeatureZigzag` from shared packages; `WorkflowPreview` placeholders.

Copy-honesty decision: the product has no TTS/voiceover (grep for voice/TTS in
core/studio finds only brand-voice fields), so the page claims "on-brand voice"
(brand voice = tone, a real Brand model field), captions and music — never
spoken narration. Documented in the feature doc so future editors don't "fix"
it into an overclaim.

## Result

| File | Why |
| --- | --- |
| `apps/website/src/pages/YouTubeCreatorsPage.tsx` | Page: hero, 4 zig-zag workflow sections, 2-card format grid (16:9 channel + 9:16 Shorts), closing CTA. CTA href = canonical `APP_SIGNUP_URL` re-exported as `YOUTUBE_CREATORS_SIGNUP_URL`. |
| `apps/website/src/App.tsx` | `/youtube-creators` route. |
| `apps/website/src/seo.ts` | indexPages entry (title/description) → prerender + sitemap + og tags. |
| `apps/website/tests/youtube-creators.test.ts` | SSR markup, studio CTA, route + sitemap inclusion (mirrors sibling tests). |
| `docs/landing-youtube-creators.md` | Feature doc: flow, code map, copy-honesty note, design notes, connections. |

Zero new CSS (ticket constraint). No changes to existing pages, components or
nav. Not promoted to a primary feature: campaign route reachable by URL and
sitemap only, like its siblings.

## Evidence

| Acceptance criterion | Check / artifact | Result |
| --- | --- | --- |
| Route `/youtube-creators` accessible | `npm run build`: 181 pages prerendered, `dist/youtube-creators/index.html` present, listed in `dist/sitemap.xml`; served via local static server, browser loaded it | pass |
| CTA links to studio | Browser DOM check: all 3 CTAs (nav, hero, closing) → `https://studio.storyframe.yamu.app/`; tests pin the URL | pass |
| Renders without errors, existing brand tokens | `npm test` apps/website 28/28 (incl. 2 new); root `npm test` 86/86 across workspaces; no iframe mounted; shared components only | pass |
| Visual proof before review | `work/t_338c35ba/youtube-desktop-1280.png`, `youtube-mobile-390.png`, `youtube-900px.png` — vision-reviewed: headline readable, cobalt-on-white CTAs, no layout breaks/overflow (scrollWidth == clientWidth at 390/900/1280), mobile stacks single-column, no cut-off text | pass |

Checks not run: live deployment (deploy gate belongs to merge, per team flow);
reduced-motion pass (page has no animations beyond shared component defaults).

## Handoff

Reviewers: argus-nv (UX/copy), nemesis-nv (integration/build). Next owner after
review: Astra for merge → deploy → live-URL check (`https://storyframe.yamu.app/youtube-creators/`).

Known notes for reviewers:
- Mobile vision pass flagged tight internal columns in the shared
  `WorkflowPreview` brand card and a thin gap where the Shorts card's visual
  sits — both are shared-component internals used identically on `/ecommerce`
  and `/features`; out of scope under this ticket's "no new custom CSS / no
  component changes" constraint.
- `/ecommerce` still pins its own stale signup URL constant
  (`storyframe-studio.yamu.app`); this page deliberately uses the canonical
  `APP_SIGNUP_URL`. Fixing `/ecommerce` is a separate card, not snuck in here.

Decision needed from Astra: none.
