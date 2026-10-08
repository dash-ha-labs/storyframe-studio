# Work: t_62896b9a — hydra-glm

Initiative: storyframe (website marketing surface, /real-estate)
Packet: card body (no separate spec file). Anchor: realtors/hosts learn how
the product works via animated UI mockups, not static text boxes.
Base revision: origin/main 4162e12. Branch: feat/t_62896b9a-realtor-feature-anims
(worktree .worktrees/t_62896b9a — main checkout was on another card's branch;
it still is, untouched).
Serving model: team-glm-hydra (glm/ pool).

## Before implementation

User outcome: a realtor scrolls /real-estate "how it works" and sees the four
static WorkflowPreview boxes replaced by auto-playing CSS animations: paste
Zillow URL (typing -> listing card + photos pop in), storyboard frames popping
in sequentially, skeleton loader resolving into a generated scene, editor
playhead scrubbing a timeline.

Position: marketing surface only, sibling of /ecommerce which already uses
EcommerceFlowDemo as the pattern. Hero untouched (requirement 4 — the
auto-playing hero video from the blocked task was NOT added; main's existing
video hero stays as-is).

Boundary: user-visible = four zig-zag visuals; internal = one new component
file + page import swap + CSS keyframes + tests/docs.

Approach: follow EcommerceFlowDemo conventions — one component file, schematic
pure-CSS loops, role="img" + aria-label, reduced-motion static composition,
no backend claims. Then npm test, npm run build, live browser screenshots at
multiple animation timestamps, vision-reviewed.

## Result

Submitted revision: 469d177 on branch feat/t_62896b9a-realtor-feature-anims
(PR #24, not merged — awaiting review).

| File | Change |
| --- | --- |
| `apps/website/src/RealtorFlowDemos.tsx` | NEW. Four demos: RealtorListingDemo, RealtorStoryboardDemo, RealtorSceneDemo, RealtorEditorDemo. |
| `apps/website/src/pages/RealEstatePage.tsx` | Zig-zag visuals swap WorkflowPreview -> the four demos. Hero/capture untouched. |
| `apps/website/src/website.css` | `.re-demo-*` layout + keyframes appended after the `.re-*` block (lines ~404-533). Responsive at <=900px; animations gated on `prefers-reduced-motion: no-preference`. |
| `apps/website/tests/real-estate.test.ts` | Zig-zag test now asserts the four demos + role="img" + no leftover `wire-` placeholders. |
| `docs/landing-realtor.md` | New "How it works animated demos" section + code map row. |

Intent preserved: marketing surface only; WorkflowPreview untouched for other
pages (still used by /ecommerce, /youtube-creators, /features); no nav change;
no backend or provider calls.

## Evidence

| Criterion | Check | Result |
| --- | --- | --- |
| Four placeholders replaced with animated mockups | Live browser: 4 `.re-demo` elements, 0 `wire-` on /real-estate | pass |
| Phone: URL paste simulation | demo1-listing-typing.png (URL mid-type + caret, empty stage) -> demo1-listing-found.png (Listing found badge, address, facts, photo grid) — vision-verified | pass |
| Storyboard: sequential frame pop-in | demo2-storyboard-popping.png: 01 visible, 02 fading in, 03/04 absent (ordered) -> demo2-storyboard-full.png all four — vision-verified. Found+fixed flash bug via `animation-fill-mode: backwards` (delayed frames were visible before their animation started) | pass (after 1 repair) |
| AI scene: skeleton -> scene | demo3-scene-skeleton.png (shimmer bars + "Composing scene 2 of 4…") -> demo3-scene-generated.png (blue gradient scene, caption, Brand accent chip) — vision-verified | pass |
| Editor: playhead scrubbing | demo4-editor-scrub-start.png (playhead left, light preview) -> demo4-editor-scrub-mid.png (playhead ~2/3, dark-blue preview crossfade) — vision-verified | pass |
| Hero unchanged | Hero video + capture card identical to main (same commit content); no new hero video | pass |
| Visual proof attached | 11 PNGs in work/t_62896b9a/ (phases + mobile 390px + reduced-motion) | pass |
| Reduced motion | CDP emulated `prefers-reduced-motion: reduce`: computed animationName = none on frames/playhead; reduced-motion-static.png shows final-stage composition | pass |
| Mobile | mobile-demo1.png: card fits 390px, no overflow | pass |
| Tests | `npm test` (apps/website): 28/28 pass | pass |
| Build | `npm run build`: tsc + vite + 181 pages prerendered | pass |

Commands: `npm test` and `npm run build` in apps/website of the worktree;
visual checks via `npm run preview` (127.0.0.1:9180) + browser CDP +
vision review of each screenshot.

## Remaining limits / next owner

- Not deployed: PR #24 awaits argus-nv review; merge auto-deploys
  (storyframe.yamu.app serves apps/website/dist).
- Storyboard demo labels are illustrative ("Curb appeal" etc.); real listing
  data would come from the future capture endpoint (out of scope).
- One stale vite-preview server from a previous card was killed to free port
  9180; it belonged to the old main-checkout build, not to a running card.
