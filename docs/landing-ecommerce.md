# E-commerce landing page (`/ecommerce`)

A marketing page that turns Shopify product links and product photos into
waitlist signups for viral video ads. Audience: e-commerce sellers, Shopify
store owners and dropshippers. Marketing capture page only — no backend
processing, no store integration, no studio calls.

## User flow

1. Visitor lands on `/ecommerce`. The hero states the value prop: paste a
   Shopify URL or upload a product photo and AI builds a viral TikTok or
   Facebook ad. Primary CTA points at the studio signup URL.
2. The zigzag (`#how`) walks the product flow with conceptual illustrations
   (see below): paste a URL → or upload a photo → AI writes the ad → edit
   every scene on brand.
3. "One product. Every ad format." shows the output formats with two more
   illustrations: vertical 9:16 TikTok/Reels ads and square/landscape
   Facebook/Instagram ads carrying the brand.
4. The closing CTA band repeats the signup action. Nothing is submitted or
   stored on this page.

## Conceptual illustrations (no real screenshots exist yet)

The page must never ship blank image placeholders. Until real app captures are
approved, every image container carries a schematic "fake UI" illustration
built from HTML/CSS and Lucide icons, in the shared wireframe language (white
panels, pale tints, cobalt accents, schematic text bars). They demonstrate the
product operation; they are not screenshots and never claim a backend request
ran (same rule as the shared `WorkflowPreview` wireframes).

| Step | Kind | Illustration |
| --- | --- | --- |
| Paste a Shopify URL | `ecommerce-url` | Browser window with `my-store.myshopify.com/products/aurora-lamp` in the URL bar, and a "Product found" card (thumbnail, name, price/rating chips, "detected" badge). |
| Upload a product photo | `ecommerce-photo` | Dashed dropzone ("Drop product photo", PNG · JPG) → arrow → phone frame with a product thumbnail and caption bars ("Your ad"). |
| AI writes the viral ad | `ecommerce-ai` | Prompt bar ("Turn this product into a viral ad") above a four-step pipeline with done/running/queued states and a spinner. |
| Edit every scene | `editor` | Shared storyboard editor wireframe (player + timeline + playhead). |
| TikTok and Reels ads | `ecommerce-publish` | Phone frame with a 9:16 blue-gradient ad (product badge, "50% off today", "Shop now" CTA) labelled "TikTok · 9:16", beside engagement pills (likes/comments/shares). |
| Facebook and Instagram ads | `brand` | Shared brand-design wireframe (palette/typeface/voice picker). |

The kinds live in `WorkflowPreview` next to the shared ones so other landing
pages can reuse them. Copy in the illustrations (product name, metrics) is
generic and invented on purpose — swap for real captures when approved, and
keep this table in sync.

## Where the code lives

| Piece | Path |
| --- | --- |
| Page component (hero, zigzag, format cards, CTA) | `apps/website/src/pages/EcommercePage.tsx` |
| Illustration kinds (`ecommerce-url/photo/ai/publish`) | `apps/website/src/WorkflowPreview.tsx` |
| Illustration CSS (`.wire-eshop-*`, `.wire-browser`, `.wire-ai-steps`, `.wire-ad-*`) | `apps/website/src/website.css` |
| Route registration | `apps/website/src/App.tsx` (`/ecommerce`) |
| Signup CTA constants | `ECOMMERCE_SIGNUP_URL`, `ECOMMERCE_CTA_LABEL` in the page file |
| Tests | `apps/website/tests/ecommerce.test.ts` |

## Design notes

- Built from the shared marketing templates: `FeatureTemplate`, `Hero` and
  `FeatureZigzag`; no page-local button/input skins.
- Tint backgrounds per kind stay in the established palette family
  (`.preview-ecommerce-url` pale blue, `-photo` warm cream, `-ai` pale indigo,
  `-publish` pale violet).
- The spinner (`wire-spin`) is the only looping animation and is disabled by
  the global `prefers-reduced-motion` kill switch, per the design language
  (motion ≤5s or accessibility-disabled).
- Illustration scale steps at 860px and 620px keep the browser bar, dropzone
  and phone legible down to 390px; no horizontal overflow.

## Verification

`npm test` (27 website tests, including the `/ecommerce` illustration
assertions), `npm run build` (tsc + vite + 180 prerendered pages), plus
desktop/mobile screenshots of every illustration under `work/t_20206154/` in
the branch that introduced them.
