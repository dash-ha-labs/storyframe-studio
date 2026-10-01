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
- `npm run build` + `npm run test` (existing suites) must pass.
- Serve build; screenshot project overview at 1280px and 900px widths;
  save under work/t_95c8b8b5/.
- Not verified by me: assistive-tech run; contrast numbers above are computed,
  visual judgment goes to Argus review.

## Boundary
User-facing visual change only. No model/render/AI behavior touched. No
deploy — merge to main auto-deploys, needs reviewer sign-off first.
