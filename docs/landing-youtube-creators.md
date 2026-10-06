# Faceless YouTube creators landing page (`/youtube-creators`)

A marketing page that converts writers — storytellers, historians, educators
running faceless YouTube channels — into Storyframe signups. This is a campaign
landing page like `/ecommerce`: pure marketing surface, no backend, no provider
calls, no studio integration. It must not become a nav item or primary feature.

## User flow

1. Visitor lands on `/youtube-creators`. The hero states the value prop: paste a
   script, blog post or outline and get a multi-scene video with consistent
   visuals, on-brand voice, captions and music — no camera, no face on screen.
2. Visitor clicks **Sign up for free** (hero CTA) and is taken to
   `https://studio.storyframe.yamu.app/`. The closing CTA section repeats it.
3. Zig-zag sections explain the workflow (paste script → consistent visuals →
   captions/music → scene-level editing); a two-card grid covers 16:9 channel
   videos and 9:16 Shorts.

## Copy honesty

"Voice" here means **brand voice** (tone of copy, part of the Brand model in
`packages/core`), not text-to-speech narration. The product has no TTS/voiceover
feature, so the page never promises spoken narration — captions and music carry
the story. Do not add voiceover claims without a shipped TTS capability.

## Where the code lives

| Piece | Path |
| --- | --- |
| Page component | `apps/website/src/pages/YouTubeCreatorsPage.tsx` |
| Route registration | `apps/website/src/App.tsx` (`/youtube-creators`) |
| SEO metadata (prerender + sitemap) | `apps/website/src/seo.ts` (`indexPages`) |
| Tests | `apps/website/tests/youtube-creators.test.ts` |

## Design notes

- Zero new CSS: built entirely from shared marketing pieces — `FeatureTemplate`,
  `Hero`, `FeatureZigzag`, `WorkflowPreview` placeholders, `feature-card` grid,
  `sf-mkt-cta` closing section. The signup URL is the canonical
  `APP_SIGNUP_URL` from `@storyframe/ui` (`https://studio.storyframe.yamu.app/`),
  not a page-local constant.
- White surface, navy text, cobalt actions per the design language; same visual
  placeholders as sibling landing pages (`generate`, `brand`, `media`, `editor`,
  `storyboard`).

## Connects to

- Sibling campaign landing: `/ecommerce` (`apps/website/src/pages/EcommercePage.tsx`)
- Sibling campaign landing: `/real-estate` (`apps/website/src/pages/RealEstatePage.tsx`)
- Master templates: `apps/website/src/templates.tsx`, `packages/ui`
