# t_2a904301 — Auto-playing workflow animation on /ecommerce

- **Seat:** vega-glm (glm/glm-5.3-flash serving; reasoning enabled)
- **Branch:** `feat/t_2a904301-ecommerce-flow-anim` off `origin/main` @ `4162e12` (merge of PR #21)
- **Contract:** ticket body card packet (no separate spec file on board). Reviewer: argus-nv.
- **Status:** implemented, self-checked with vision-verified captures — ready for review round 1.

## Product anchor (from the packet)

E-commerce sellers / Shopify store owners / dropshippers visit `/ecommerce` and
should grasp "Paste Shopify URL → Get Video Ad" instantly from an auto-playing,
looping, muted animation in the hero or main Step 1 section — without clicking.
Constraints: keep the existing design techniques, branding and layout; do not
change the overall page structure; prefer an HTML5 video, else CSS keyframes.

## Base-state decision (important for the reviewer)

`main` has the /ecommerce page from merged PR #13 (t_02ff53a9). Two sibling PRs
touching the same file are still OPEN and unmerged: #15 (t_e7564b55, steps +
reviews rewrite) and #22 (t_20206154, conceptual illustrations). This ticket
describes the page as merged on main (static `WorkflowPreview` wireframes in a
4-step zig-zag), so I branched from `origin/main` and did NOT rebase over or
resolve either open PR. Whichever of those merges first owns the resulting
conflict in `EcommercePage.tsx`; the animation pieces here are additive and
portable. Flagged in the card comment; not a blocker for review of this diff.

## Approach

No video file exists from the team, so per criterion 3 I built a CSS-keyframe
demo that runs inside the existing "Paste a Shopify URL" zig-zag visual slot
(page structure unchanged — same `FeatureZigzag`, same section order):

1. **New component `EcommerceFlowDemo`** in
   `apps/website/src/EcommerceFlowDemo.tsx` (page-local illustration like
   `RealEstatePage`'s schematic markup; not added to shared `WorkflowPreview`,
   whose six kinds and other consumers stay untouched). One 10.5s master loop,
   all elements phase-locked to it, staging the exact funnel: browser bar
   types `my-store.myshopify.com/products/aurora-lamp` (caret blinks during
   typing only) → submit pulse → "Product found" card (name, price, photo
   count, rating) → "Creating your ad…" spinner → 9:16 phone with the ad
   (AD chip, hook, product, "Shop now", progress bar, engagement pills) →
   fade out → repeat. Loop holds mid-only: 0% and 100% keyframes match the
   hidden state, so prerendered HTML is never mid-animation on first paint.
2. **Placement:** replaces only the first zig-zag item's `visual:` prop
   (`WorkflowPreview kind="mockup"` → `<EcommerceFlowDemo/>`). Steps 2–4,
   formats grid and CTAs untouched.
3. **Motion contract** (DESIGN-LANGUAGE.md "Motion and interaction"):
   - All animation defined inside
     `@media (prefers-reduced-motion: no-preference)`; the base stylesheet
     state is the static composition (all three stages visible), so reduced
     motion, print and prerender fall back to it with no separate markup.
     The global reduce kill-switch (website.css) is a second net below it.
   - Loop duration: the full paste→ad narrative is a repeating product demo
     (criterion 2 demands "looping"); within a cycle every state change is
     ≤2.6s, matching the existing site preview singles
     (`timeline-preview` 3s, `phone-preview` 2.6s) and the ≤5s single-motion
     bound. No runtime added — pure CSS, per the design language.
   - Schematic fixture copy ("Aurora Desk Lamp", ★ 4.8) per the
     no-screenshots rule and sibling convention; `role="img"` +
     `aria-label` narrative on the container, `aria-hidden` inner markup;
     zig-zag title/description carry the same story for assistive tech.
4. **Styles:** one appended `sf-eco-*` / `eco-*` block in
   `apps/website/src/website.css` (marketing composition owner), reusing
   existing palette/borders/fonts (cobalt `#2142e7`, `#dce3ef`,
   `--sf-font-mono/sans`).

## Self-review loop (defects found and fixed before handoff)

Vision analysis of my own captures caught four defects, all fixed and
re-verified against the rebuilt dist:
1. "AD · 0:09" chip absolutely positioned collided with the hook text →
   chip moved into flow, first child of the ad.
2. URL typed only 21ch so the `/products/aurora-lamp` half never appeared
   mid-loop → full 43ch URL typed (fits at 1280px; on small screens the
   pill clips the tail without overflow).
3. Caret kept blinking next to the complete URL after submit → caret is now
   phase-locked to the typing window (visible 0–24% with blink pattern).
4. "Shop now" overflowed the ad edge by 2px at 390px → tightened CTA
   padding + ad padding in the ≤900px block (measured +4px clearance).

Capture-methodology defects also found and corrected: close-up clips must use
page coordinates (viewport coords shifted frames ~30px), timestamps passed in
seconds were modded into the wrong loop phase, and one crop clipped 1–2px of
the next section (outside the panel — not a defect). Superseded captures are
kept under `work/t_2a904301/archive/` rather than deleted.

## Changed files

| File | Change |
| --- | --- |
| `apps/website/src/EcommerceFlowDemo.tsx` | new `EcommerceFlowDemo` component (markup only; all motion in CSS) |
| `apps/website/src/pages/EcommercePage.tsx` | import + swap the step-1 zig-zag visual (2 lines) |
| `apps/website/src/website.css` | appended `sf-eco-*` demo styles + `eco-*` keyframes behind no-preference query |
| `apps/website/tests/ecommerce.test.ts` | new assertions: demo present, Shopify URL, all four narrative stages, accessible label |
| `docs/landing-ecommerce.md` | new feature doc (page had none on main): flow, animation contract, honesty/a11y, code map |
| `work/t_2a904301/*` | this artifact + visual proof pngs |

## Checks (all on the final revision)

- `npx tsc --noEmit` — clean.
- `npm test` (website) — 29/29, including 6 new flow-demo assertions.
- `npm run build` — 181 pages prerendered; `dist/ecommerce/index.html`
  contains the static composition (full URL, all stages).
- Rendered proof via `vite preview` + CDP screenshots, vision-verified:
  - `proof-eco-final-t1.8s-typing.png` — partial URL + caret + go button,
    empty stage (PASS, all elements confirmed).
  - `proof-eco-final-t3.3s-found.png` — full URL, Product found card
    (badge/name/price/photos/rating), PASS.
  - `proof-eco-final-t6.4s-generating.png` — spinner + "Creating your ad…",
    card still visible, phone hidden, PASS.
  - `proof-eco-final-t8.0s-ad-complete.png` — full URL, chip above hook with
    clear gap, hook/product/Shop now legible, engagement pills 2.4k/318/96,
    product card visible — 5/5 PASS.
  - `proof-eco-mobile-390-typing.png` — mobile typing frame, no clipping,
    no horizontal overflow (scrollWidth == 390 measured).
  - `proof-eco-mobile-390-full.png` / `proof-eco-desktop-1280.png` — full
    page context: demo in the first zig-zag panel, page structure unchanged.
  - `proof-eco-reduced-motion.png` — reduced-motion fallback: animation
    `none`, all three stages visible simultaneously (verified in DOM:
    found/loader/phone opacity 1; spinner+label confirmed in tight crop).
- IntersectionObserver laziness was considered and intentionally not added:
  the demo is pure CSS compositor work (transform/opacity/width steps),
  `content-visibility` risks glitches in the zig-zag, and the loop is a
  10.5s CSS animation with no JS cost.

## Acceptance mapping

| # | Criterion | Evidence |
| --- | --- | --- |
| 1 | Existing design/layout unchanged | page structure untouched; only step-1 visual slot swapped; tokens reused; desktop + mobile full-page renders |
| 2 | Looping muted auto-play animation in main Step 1 section | CSS master loop in the first zig-zag panel; no audio anywhere on the page |
| 3 | No video file provided → CSS keyframes simulating URL→submit→spinner→video | `EcommerceFlowDemo` stages exactly that funnel |
| 4 | Explains "Paste Shopify URL → Get Video Ad" without interaction | typed Shopify URL → Product found → Creating your ad… → phone ad with hook + product + CTA; four timestamped captures prove the sequence plays |
| 5 | Visual proof attached | pngs above, attached to the kanban card |

## Deviations / risks / handoff

- Steps 2–4 zig-zag panels keep their static `WorkflowPreview`s by design —
  the ticket scopes the animation to the primary URL/Photo-to-video step.
- 10.5s loop vs "motion ends within five seconds": documented reading is
  per-state-change bound (≤2.6s) with the loop as a repeating product demo
  the ticket itself requires; argus may rule otherwise, fallback would be
  pausing on the final frame — flagged as the one open design reading.
- Conflict note: open sibling PRs #15/#22 rewrite `EcommercePage.tsx`; this
  diff is based on main and needs a trivial rebase after either merges.
- Not deployed: no deploy authorization in the ticket; verification ran
  against the production build served locally.

## Next owner

argus-nv (review round 1) — visual fidelity + the motion-rule reading above.
