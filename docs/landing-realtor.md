# Realtor landing page (`/real-estate`)

A marketing page that turns Zillow links into waitlist signups for cinematic
virtual tours. Audience: realtors, property managers and Airbnb hosts. This is a
marketing capture page only — no backend processing, no studio integration, no
provider calls.

## User flow

1. Visitor lands on `/real-estate`. A hero states the value prop over a muted,
   looping stock property-video background.
2. **Step 1 — URL capture.** The visitor pastes a Zillow listing URL into the
   capture card and clicks **Generate tour**. A light client-side check requires
   a `zillow.com` link; anything else shows an inline error.
3. **Step 2 — Email capture.** The URL form is replaced by an email form
   (with the submitted listing echoed below it). The visitor enters an email and
   clicks **Join waitlist**. Invalid emails show an inline error.
4. **Done.** A confirmation state tells the visitor they are on the list and
   offers "Generate another tour" to reset the flow.

Both steps and the confirmation live in one card; nothing is persisted or sent
anywhere in this slice — the final submit is a client-side state change until a
capture endpoint exists.

## Where the code lives

| Piece | Path |
| --- | --- |
| Page component (two-step state machine) | `apps/website/src/pages/RealEstatePage.tsx` |
| "How it works" animated demos | `apps/website/src/RealtorFlowDemos.tsx` |
| Route registration | `apps/website/src/App.tsx` (`/real-estate`) |
| Page CSS (hero + capture arrangement + demo keyframes) | `apps/website/src/website.css` (`.re-*`, `.re-demo-*`) |
| SEO metadata (prerender + sitemap) | `apps/website/src/seo.ts` (`indexPages`) |
| Placeholder video asset | `apps/website/public/media/realtor-tour-placeholder.webm` |
| Tests | `apps/website/tests/real-estate.test.ts` |

## "How it works" animated demos

The four zig-zag sections use auto-playing CSS illustrations
(`RealtorFlowDemos.tsx`, `.re-demo-*` in `website.css`), replacing the generic
static `WorkflowPreview` placeholders. They are schematic only — they never
claim a backend request ran, the same rule as `EcommerceFlowDemo` on
`/ecommerce`:

1. **Listing demo** (Paste the listing): a Zillow URL types into a browser bar,
   then the listing card (address, beds/sqft/acre, description lines) and a
   photo grid pop in.
2. **Storyboard demo** (A tour that feels like a film): four numbered scene
   frames pop in one after another with durations.
3. **Scene demo** (Ready for every channel): a shimmering skeleton loader
   resolves into a finished branded scene with caption.
4. **Editor demo** (Edit any scene): a playhead scrubs across a 4-clip video
   timeline with an audio track while the preview crossfades per scene.

Each demo is a single CSS loop (8–9 s) with state changes ≤3 s, exposed as
`role="img"` with a descriptive `aria-label`. Under
`prefers-reduced-motion: reduce` (and in prerendered HTML) the same markup
renders as the static final-stage composition — no separate fallback.

## Placeholder video and license

The hero background is a stock placeholder clip, self-hosted at
`apps/website/public/media/realtor-tour-placeholder.webm` (12 s, 854×480,
WebM/VP9, ~304 KB (310,979 bytes) — a trimmed loop cut from the ready
Wikimedia transcode of
"Addison, VT Home (aerial drone footage)"). Source: Wikimedia Commons, author
**Herrick Spencer**, license
[CC BY 3.0](https://creativecommons.org/licenses/by/3.0). The attribution line
is rendered on the page (`.re-hero-credit`) and must be kept with the asset.
Hotlinking stock CDNs (Pexels, Mixkit, Pixabay) was rejected: they return 403
for direct embeds. Replace this clip with licensed brand footage when real
footage is approved; keep attribution in sync.

## Design notes

- Built from the shared marketing templates: `FeatureTemplate`, `FeatureZigzag`
  and the shared `Button`. Page CSS only arranges the video hero and capture
  card; no new button/input skins (the input reuses `.sf-field` label styling
  with page-level geometry via `.re-input`).
- Video is `muted`, `loop`, `playsInline`, `aria-hidden`, with a white
  gradient scrim so navy text stays readable — the marketing surface stays
  white/navy/cobalt per the design language; the video is texture, not a dark
  theme.
- The capture card overlaps the hero (`margin-top: -56px`) to keep the video
  visible behind the form.
- No new nav item: the page is reachable at `/real-estate` and via the sitemap.
  It is a campaign landing page like `/ecommerce`, not a primary feature.

## Connects to

- Sibling campaign landing: `/ecommerce` (`apps/website/src/pages/EcommercePage.tsx`)
- Master templates: `apps/website/src/templates.tsx`, `packages/ui`
- Deployment: `docs/DEPLOYMENT.md` (website ships from `apps/website/dist`)
