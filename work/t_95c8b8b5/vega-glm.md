# t_95c8b8b5 — Foundation buttons visibility (brand / apps / storyboard)

Ticket: buttons under "project overview" not visible enough. Scope: visual
contrast only, existing design language, no new CSS system.

## Product anchor (compact)
Storyframe Studio: folder → product project → creations. Project page holds
brand, app references, media; video aspect ratios are independent output
settings. This fix keeps the compact neutral-dark chrome (one 44px top bar,
restrained palette) and only raises the contrast of three existing entry
points so users can find Brand / Apps / Media / Storyboard entries. No new
screens, no editor rail, no new workflows.

## Diagnosis
- `.project-foundation` grid = the "project overview" strip on Suite.tsx
  project page. Three whole-cell buttons: Your brand, N product apps,
  N media assets. Each ends with chevron — the task's "storyboard button" is
  the storyboard entry in the panel right below the strip (its primary CTA is
  a low-contrast `.text-link`).
- Why low visibility: cell bg `#222731` vs page `#181a1f` (≈1.3:1), labels
  `#e6e8ee` on `#222731` ≈ 8:1 (ok) but secondary `#92a2c0` ≈ 4.4:1 and
  icon-tile glyph `#98afd8` on `#323c51` ≈ 3.2:1 (weak), and — main cause —
  zero hover/focus affordance anywhere (global rule is only
  `background-color:var(--hover)`), so nothing reads as clickable until hover.

## Change (existing tokens/variants only)
suite.css:
- Cell bg `#222731` → `#282f3e` (border `#47526a`) — same surfaces already
  used elsewhere in suite.css, so no new color invented.
- Secondary text `#92a2c0` → `#a9b6d4`; icon tile `#323c51`/`#98afd8` →
  `#39466b`/`#b9c8ff`; chevron `#7385a5` → `#9fb2d8`.
- Add `.project-foundation>button:hover{background:var(--hover)}` plus
  `:focus-visible` outline — first hover affordance these entries ever had.
- Storyboard panel: filled card gets accent left bar (3px solid var(--accent))
  + same hover; empty-state CTA switched `.button` → `.button.primary`
  (existing variant, no new CSS).

## Checks
- `npm run build` pass; `npm run test` 8/8 pass.
- Headless Chrome 1280x900/1400 screenshots: work/t_95c8b8b5/overview-1280.png,
  full-page.png (committed). Strip renders 3 distinct cells (#282f3e) on
  #181a1f; icon tiles #39466b with #b9c8ff glyphs; empty-state CTA renders as
  .button.primary fill #a6b5ff.
- Pixel-contrast probe (tools in ~/.hermes profile scratch, not committed):
  label text 7.8:1, CTA 8.9:1 vs page bg.
- Environment note: box has no system Chromium libs or fonts; verification ran
  on the bundled Chrome-for-Testing with locally extracted .deb libs and
  DejaVu/Liberation fonts. App copy rendered with fallback fonts in the proof
  screenshots — glyph shapes differ from user machines, colors/geometry exact.

## Revision
Branch fix/t_95c8b8b5-foundation-visibility, commit 1ee5983, PR #9.


## Boundary
User-facing visual change only. No model/render/AI behavior touched. No
deploy — merge to main auto-deploys, needs reviewer sign-off first.
