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
| Route registration | `apps/website/src/App.tsx` (`/real-estate`) |
| Page CSS (hero + capture arrangement) | `apps/website/src/website.css` (`.re-*`) |
| SEO metadata (prerender + sitemap) | `apps/website/src/seo.ts` (`indexPages`) |
| Placeholder video asset | `apps/website/public/media/realtor-tour-placeholder.webm` |
| Tests | `apps/website/tests/real-estate.test.ts` |

## Placeholder video and license

The hero background is a stock placeholder clip, self-hosted at
`apps/website/public/media/realtor-tour-placeholder.webm` (12 s, 854×480,
WebM/VP9, ~255 KB — a trimmed loop cut from the ready Wikimedia transcode of
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
- The capture card overlaps the hero (`margin-top: -64px`) to keep the video
  visible behind the form.
- No new nav item: the page is reachable at `/real-estate` and via the sitemap.
  It is a campaign landing page like `/ecommerce`, not a primary feature.

## Connects to

- Sibling campaign landing: `/ecommerce` (`apps/website/src/pages/EcommercePage.tsx`)
- Master templates: `apps/website/src/templates.tsx`, `packages/ui`
- Deployment: `docs/DEPLOYMENT.md` (website ships from `apps/website/dist`)
