# Work: t_d3b81be8 — vega-glm
Initiative: storyframe | Packet revision: t_d3b81be8 | Brief/plan revisions: f3ea22e
Base revision: f3ea22e (origin/main) | Submitted revision/diff: fix/t_95c8b8b5-foundation-visibility
Serving model: team-spare-gemini

## Before implementation
User outcome: Project overview button visibility fixes integrated cleanly on top of the main light token design without merge conflicts.
Position in journey: Project Overview page (entry point to Brand, Apps, Media and Storyboard).
Boundary: Visual styling and button class tokens only. No model/schema/data changes.
Compact approach: Rebase PR #9 onto main f3ea22e; re-apply visibility fixes using the light design token system (--sf-color-accent, --sf-color-action, .button.primary CTA); preserve existing token constraints (zero invented hex colors); verify clean build and test suite.
References opened: DESIGN-LANGUAGE.md, reviews/t_95c8b8b5-argus-nv.md, reviews/t_c0eabcca-nemesis-nv.md.
Contribution kept within assigned surface (no new features, screens or workflows).

## Result
Changed files:
- `apps/web/src/Suite.tsx`: Swapped empty-state storyboard CTA button from `.button` to `.button.primary` (`<button className="button primary" onClick={onOpenStoryboards}>`).
- `apps/web/src/suite.css`: Added 3px accent left edge (`border-left: 3px solid var(--sf-color-accent)`) and hover styling (`var(--sf-color-bg-surface-hover)`) to `.project-storyboard-card`.
- `apps/web/src/studio-ui.css`: Ensured `.project-storyboard-card` retains 3px accent left border (`border-left: 3px solid var(--sf-color-accent)`), added card hover styling, and gave hover color affordance to foundation button chevrons (`var(--sf-color-action)`).

Intent preserved: Higher visibility on storyboard CTA and card, clear interactive affordance on foundation buttons, full alignment with the light token design language.

## Evidence
| Acceptance criterion | Actual check/artifact | Result |
|---|---|---|
| Clean merge / rebase against main f3ea22e | `git status` clean on top of `f3ea22e` with zero conflict markers | PASS |
| Re-apply visibility fixes (brand, apps, storyboard) | Storyboard empty CTA is `.button.primary`; storyboard card has 3px accent left edge + hover | PASS |
| Preserve existing token constraints | Uses `--sf-color-accent`, `--sf-color-action`, `--sf-color-card`, `#b8c5eb` (all pre-existing tokens); 0 new hex values | PASS |
| Build passes | `npm run build` succeeds across all workspaces (@storyframe/tokens, @storyframe/core, @storyframe/ui, @storyframe/studio, @storyframe/website) | PASS |
| Tests pass | `npm run test` 62/62 tests pass across workspaces (studio 27/27, website 21/21, core 10/10, community 4/4) | PASS |
| Visual render proof | Captured headless Chrome screenshot at 1280x900: `work/t_d3b81be8/overview-1280.png`; pixel probe confirms `#2142e7` (cobalt action/accent) renders | PASS |

## Handoff
Deviations: None.
Remaining risks: None.
Next owner: nemesis-nv (behavior & regression reviewer) and argus-nv (visual & UX reviewer).
Decision needed from Astra: None.

## Repair log
- Round 1 (t_c0eabcca-nemesis-nv): PR #9 failed integration due to conflict with main f3ea22e (light token redesign). Rebased branch onto f3ea22e, replaced retired dark hex swaps with light token declarations (`var(--sf-color-accent)`, `var(--sf-color-action)`, `.button.primary`), verified build + 62 tests and captured fresh 1280px render proof.
