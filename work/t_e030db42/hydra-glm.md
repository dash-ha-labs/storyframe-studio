# Work: t_e030db42 — hydra-glm

Initiative: storyframe (website marketing surface) | Packet: card body (no separate spec file)
Base revision: origin/main 9b31f49 | Submitted revision: 1254fc8 (PR #20)
Serving model: team-glm-hydra (glm/ pool)

## Before implementation

User outcome: a realtor visits `/real-estate`, sees a value prop over a stock
property-video background, pastes a Zillow URL (step 1), clicks Generate, then
reveals an email capture (step 2) with a final submit. No backend; capture is
client-side only for this slice.

Position: marketing surface of Storyframe (`apps/website`), sibling of
`/ecommerce`. It must NOT grow into a studio feature, nav item or backend
pipeline. Boundary: user-visible marketing page; internal pieces are route
registration, SEO entry and page CSS.

Approach: doc first (`docs/landing-realtor.md`), then page + route + SEO + CSS
+ test mirroring the `/ecommerce` pattern, then live visual proof of both steps.

## Result

| File | Why |
| --- | --- |
| `docs/landing-realtor.md` | Feature doc: flow, code map, footage license, design notes, connections. |
| `apps/website/src/pages/RealEstatePage.tsx` | Page: video hero, two-step capture (URL → email → confirmation), inline validation, step indicator. Reuses FeatureTemplate/FeatureZigzag/Button; exports video src + credit constants. |
| `apps/website/src/App.tsx` | `/real-estate` route. |
| `apps/website/src/seo.ts` | Index metadata (title/description) → prerender + sitemap. |
| `apps/website/src/website.css` | `.re-*` classes: hero scrim, overlapping capture card, stacking at ≤620px. Arrangement only; no new control skins. |
| `apps/website/public/media/realtor-tour-placeholder.webm` | Self-hosted 12 s / 854×480 / VP9 / 311 KB loop, cut from a clean segment (no burned-in titles). |
| `apps/website/tests/real-estate.test.ts` | SSR markup, hidden email until step 2, route + sitemap inclusion. |

Intent preserved: marketing surface only; no nav/footer change; no backend; no
provider calls; untracked Kurutu evidence in root `public/demo/` untouched.

## Evidence

| Acceptance criterion | Check / artifact | Result |
| --- | --- | --- |
| Docs outlining multi-step page | `docs/landing-realtor.md` | written |
| `/real-estate` route with layout skeleton + placeholder stock video | `npm run build` (tsc + vite + prerender, 180 pages); `dist/real-estate/index.html`, `dist/media/realtor-tour-placeholder.webm`, in `dist/sitemap.xml` | pass |
| Flow: URL input → button → email reveal → final submit | Browser-driven run against `vite preview` (127.0.0.1:9180): video `readyState 4`, autoplaying; invalid URL → inline error + stays on step 1; valid Zillow URL → email step with listing echoed; invalid email → inline error; valid email → "You're on the list." + reset works | pass |
| Visual proof of both steps | `work/t_e030db42/realestate-step1.png`, `realestate-step2.png`, `realestate-done.png`, `realestate-mobile.png` (390 px) — vision-reviewed: headline readable, no burned-in text in footage, card + input + button fully in frame at 1280×800+ (`inputBottom 664 < 800`), mobile stacks full-width without overflow | pass |
| Tests | `npm test` (apps/website): 26 pass / 0 fail, incl. 3 new | pass |

License: footage = "Addison, VT Home (aerial drone footage)", Herrick Spencer,
CC BY 3.0 (Wikimedia Commons); attribution rendered on-page (`.re-hero-credit`)
and documented. Hotlinking stock CDNs rejected (403 for direct embeds).

Not run / limits: no live deployment in this card (deploy gate belongs to
merge); no reduced-motion browser pass (CSS keeps autoplay muted/looped, which
is unaffected by the global reduced-motion rule that only kills animations).
Submitted email is client-state only — a capture endpoint is future work and
must not be inferred from this page.

## Handoff

Reviewer: argus-nv (UI/UX fidelity + scope). PR #20, revision 1254fc8.
Next owner after review: Astra for merge/deploy; then the live-URL check per
the delivery gates. Risks: none known beyond the placeholder footage being
swap-aware (keep attribution in sync when replaced).
Decision needed from Astra: none.

## Repair log

(none — first submission)
