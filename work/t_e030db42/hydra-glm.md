# Work: t_e030db42 — hydra-glm

Initiative: storyframe (website marketing surface) | Packet: card body (no separate spec file)
Base revision: origin/main 9b31f49 | Serving model: team-glm-hydra (glm/ pool)

## Before implementation

User outcome: a realtor visits `/real-estate`, sees a value prop over a stock
property-video background, pastes a Zillow URL (step 1), clicks Generate, then
reveals an email capture (step 2) with a final submit. No backend; capture is
client-side only for this slice.

Position: marketing surface of Storyframe (`apps/website`), sibling of
`/ecommerce`. It must NOT grow into a studio feature, nav item or backend
pipeline — the ticket asks for docs + route + two-step skeleton + proof.
Boundary: user-visible marketing page; internal pieces are only route
registration, SEO entry and page CSS.

Approach:
- `docs/landing-realtor.md` — feature doc (flow, copy intent, license, route).
- `apps/website/src/pages/RealEstatePage.tsx` — FeatureTemplate + video hero,
  two-step capture card (URL -> email) with light client-side validation and a
  confirmation state. Reuses shared Button; page-arrangement CSS only.
- Route `/real-estate` in App.tsx; metadata in seo.ts indexPages (prerender +
  sitemap pick it up automatically).
- Placeholder stock video: self-hosted `public/media/realtor-tour-placeholder.webm`
  (Wikimedia Commons "Interior de apartamento no Funchal", Imojoy Real Estate,
  CC BY 3.0) — hotlinking stock CDNs is 403-walled and unstable; attribution
  ships on-page. Root `public/demo/*.mp4` are untracked Kurutu evidence and were
  not touched.
- Test mirrors `tests/ecommerce.test.ts` (SSR markup + route).
- Visual proof: dev-server screenshots of step 1 and step 2 (browser_exec).

Dependencies checked: none (no backend, no new packages, no provider calls).
Capability gap: none.

## Result
(files listed with rationale — filled at handoff)

## Evidence
(filled at handoff)

## Handoff
Reviewer: argus-nv.
