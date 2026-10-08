# Work: t_62896b9a — hydra-glm

Initiative: storyframe (website marketing surface, /real-estate)
Packet: card body (no separate spec file). Anchor: realtors/hosts learn how
the product works via animated UI mockups, not static text boxes.
Base revision: origin/main 4162e12. Branch: feat/t_62896b9a-realtor-feature-anims
(worktree .worktrees/t_62896b9a — main checkout is on another card's branch).
Serving model: team-glm-hydra (glm/ pool).

## Before implementation

User outcome: a realtor scrolls /real-estate "how it works" and sees the four
static WorkflowPreview boxes replaced by auto-playing CSS animations that show
(paste Zillow URL -> photos pulled), (storyboard frames popping in), (skeleton
loader resolving into a generated scene), (timeline playhead scrubbing).

Position: marketing surface only, sibling of /ecommerce which already uses
EcommerceFlowDemo as the pattern. Hero stays exactly as-is (requirement 4: no
auto-playing hero video — already true on main; not touched).

Boundary: user-visible = four zig-zag visuals; internal = one new component
file + page import swap + CSS keyframes + tests/docs.

Approach: follow EcommerceFlowDemo conventions — one component, schematic
pure-CSS loop, role="img" + aria-label, reduced-motion static composition,
no backend claims. Then npm test, npm run build, live browser screenshots at
multiple timestamps for visual proof.

## Result

(completed below)
