# E-commerce landing page (`/ecommerce`)

A campaign landing page that converts e-commerce sellers, Shopify store owners
and dropshippers into Storyframe signups. Pure marketing surface: no backend,
no provider calls, no studio integration. It must not become a nav item or
primary feature.

## User flow

1. Visitor lands on `/ecommerce`. The hero states the value prop: paste a
   Shopify URL or upload a product photo and get a viral TikTok or Facebook ad.
2. The first zig-zag panel plays an **auto-running flow demo**
   (`EcommerceFlowDemo`): a browser bar types
   `my-store.myshopify.com/products/aurora-lamp`, the submit button pulses, a
   "Product found" card appears (name, price, photo count, rating), a
   "Creating your ad…" spinner runs, then a 9:16 phone slides in with the
   finished ad (hook, product name, "Shop now" CTA, progress bar and
   engagement pills). One 10.5s master CSS loop; no click or hover needed.
   Within the loop each state change is ≤2.6s, matching the site's existing
   preview-motion scale (`timeline-preview`, `phone-preview`).
3. Remaining zig-zag panels (photo upload, AI ad writing, scene editing) and
   the format cards keep the shared static `WorkflowPreview` wireframes.
4. Visitor clicks **Sign up for free** (hero and closing CTA) and lands on
   `https://storyframe-studio.yamu.app/`.

## Animation honesty and accessibility

- The demo is a schematic illustration. It never claims a backend request ran
  (same rule as `WorkflowPreview`, AGENTS.md evidence section); fixture values
  ("Aurora Desk Lamp", ★ 4.8) are intentional under the no-screenshots rule.
- All motion is CSS keyframes in `apps/website/src/website.css` (`sf-eco-*`,
  `eco-*`), gated behind `@media (prefers-reduced-motion: no-preference)`.
  With reduced motion — or in the prerendered HTML before CSS loads — the same
  markup renders as the static composition (all three stages visible).
- The container is `role="img"` with an `aria-label` describing the sequence;
  inner elements are `aria-hidden`, and the zig-zag title/description carry
  the same story for screen readers.

## Where the code lives

| Piece | Path |
| --- | --- |
| Page component | `apps/website/src/pages/EcommercePage.tsx` |
| Flow demo component | `apps/website/src/EcommerceFlowDemo.tsx` |
| Demo styles + keyframes | `apps/website/src/website.css` (`sf-eco-*`, `eco-*` block) |
| Route registration | `apps/website/src/App.tsx` (`/ecommerce`) |
| Tests | `apps/website/tests/ecommerce.test.ts` |

## Connects to

- Sibling campaign landings: `/real-estate` (`docs/landing-realtor.md`),
  `/youtube-creators` (`docs/landing-youtube-creators.md`)
- Shared marketing pieces: `apps/website/src/templates.tsx`, `packages/ui`
  (`Hero`, `FeatureZigzag`), `WorkflowPreview`
- Design language: `DESIGN-LANGUAGE.md` (motion ≤ single-state 5s scale,
  reduced-motion kill-switch, wireframes-are-illustrations)
