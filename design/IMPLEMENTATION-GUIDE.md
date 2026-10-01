# Future UI implementation guide

Required for every website, suite and Studio UI change. Start with [AGENTS.md](../AGENTS.md), read the current [design language](../DESIGN-LANGUAGE.md), and finish with the [review checklist](REVIEW-CHECKLIST.md). This guide explains how to apply the rules; DESIGN-LANGUAGE.md owns the visual values and accepted patterns.

## Decision authority

1. The current user request defines the scope. A request to adopt reference styling preserves the existing flow; an explicit request for a new product flow can change it.
2. Storyframe source controls existing features, editing behavior, ownership and media fidelity. A reference screenshot or HTML concept cannot justify removing controls or changing saved data.
3. The documented light design language controls visual treatment. Source authority does not preserve the rejected dark theme or former tiny controls. Use the current shared readability scale.
4. References provide proportions and taste, not Storyframe branding, product claims or backend behavior. Keep the Storyframe name and use original or properly sourced media.
5. An intentional evolution updates the design rule, shared implementation, affected consumers and review checklist together. Routine implementation within these rules does not need a separate approval step.

Dated QA entries and archived explorations are historical evidence, not competing design specifications. Resolve contradictions against the current user direction and current design contract; do not silently create a page-specific exception.

## Find the existing owner

| Concern | Source of truth | Implementation rule |
| --- | --- | --- |
| Identity, semantic colors, shared dimensions | `packages/tokens/tokens.css`, `packages/tokens/src/index.ts` | Keep both representations aligned; reuse roles before adding tokens. |
| Buttons, navigation, footer, layout primitives | `packages/ui/src/index.tsx`, `packages/ui/src/ui.css` | Change the shared component and inspect every affected consumer. |
| Marketing hierarchy and section rhythm | `apps/website/src/website.css` | Use existing type, container and spacing rules; keep mobile alignment intentional. |
| Marketplace, learning, documentation, editorial and community layouts | `apps/website/src/content.css`, `apps/website/src/pages` | Extend the corresponding page pattern rather than giving every collection the same card grid. |
| Studio geometry and responsive structure | `apps/web/src/style.css`, `apps/web/src/suite.css` | Preserve the compact structure, optional panels and feature access at the documented readability scale. |
| Studio surfaces, controls and selected states | `apps/web/src/studio-ui.css` | Reuse the restrained light finish; Studio and the homepage demo consume the same file. |
| Website content and SEO | `apps/website/src/data`, `apps/website/src/seo.ts` | Keep editorial records website-owned; add crawlable routes and appropriate metadata. |
| Public ideas, votes and roadmap decisions | `services/community` | Keep public records in the separate website service/database; votes do not schedule delivery. |
| Website-to-Studio handoff | `apps/website/src/data/handoff.ts`, `packages/core/src/starter.ts`, `apps/web/src/StarterImport.tsx` | Transfer only bounded validated starter data, review the import and create independent artifacts. |
| Editing, project ownership and persistence | `apps/web/src/model.ts`, `apps/web/src/suite-model.ts`, `apps/web/src/storage.ts`, `packages/core` | UI work must preserve behavior and existing data; never merge website storage into Studio. |

Do not import website styles or catalogs into the app. The homepage demo reuses actual Studio source with isolated fixture state and media; it never reads a personal workspace. Project brand colors and captured UI belong to that project, not to interface tokens.

## Implement a change

1. **Inspect the current screen.** Read its source and neighboring patterns. Identify every affected action and meaningful state: selected, hover, focus, disabled, empty, loading, error and success where applicable. Preserve accurate state messaging.
2. **Choose the pattern and owner.** Reuse the corresponding shared control or page layout. Add a token only for a reusable semantic role. Keep website spacing distinct from compact Studio geometry.
3. **Make the content concrete.** Explain video-making tasks directly. Use concise labels and type-specific actions. Personality comes from relevant product content, useful previews, deliberate color and restrained motion. Avoid generic slogans, unrelated photography, repetitive text grids and decorative controls.
4. **Implement all affected states.** Keep readable type, white content cards, visible boundaries and keyboard focus. Do not reintroduce dark blocks, gray card fills, saturated navigation pills, full-width outline tags or arbitrary heading breaks. Keep phone headings aligned with the content below.
5. **Preserve the product.** Do not remove features to fit a design. Keep media coordinates, project-owned content and save/edit behavior unchanged during styling. New template/resource imports must preserve existing brands, creations and media.
6. **Verify the actual result.** Follow the checklist below and record relevant evidence. Update rules in the same change if the shared language deliberately evolves.

## Choose the right page pattern

| Page | Required structure |
| --- | --- |
| Homepage | Direct idea-to-video headline, free signup, one prominent real Studio demo, distinct feature/template/tutorial/resource sections, grouped light footer. |
| Features | Relevant capability visuals and concise explanations; no repeated live editor embeds. |
| Templates | Marketplace with combined filters, search, sorting and pagination; individual template pages with scene structure and a free-start action. |
| Resources | Resource center with type labels, previews, individual pages, working type-specific downloads and reviewed Studio imports. |
| Tutorials | Courses with lesson URLs; contents left, video right, short practice steps below. Use authorized placeholders until recordings are supplied. |
| Documentation | Section indexes, article routes, desktop navigation and reachable phone navigation; preserve the current eight subject areas. |
| Blog | Varied lead/supporting stories and readable article pages about product video and AI workflows. |
| Roadmap | Now / Next / Later timeline plus a distinct searchable voting board, short proposal pages, submission and sharing. Scheduling is an editorial decision. |
| Studio | Existing project flow, one top toolbar, optional panels, readable compact controls and all editing features. |

The canonical dimensions, colors and copy rules live in DESIGN-LANGUAGE.md rather than being duplicated here. Free signup has no credit-card requirement; waiting applies to AI generation requests. Track unfinished launch capabilities internally, while actual app states and completion reports remain truthful.

## Verification and handover

For executable changes, run the repository build and tests. Inspect affected pages at desktop and phone widths, including long content, empty results and open menus/dialogs where relevant. Check visible actions, keyboard focus, reduced motion, overflow and responsive stacking. Shared Studio changes require checking the actual app and isolated homepage demo; a responsive marketing page does not establish mobile editor parity.

For content routes, verify unique metadata, canonical links, rendered HTML, sitemap inclusion and real production 404 behavior. For imports or community changes, exercise the relevant persistence and data-isolation boundaries. Do not substitute an illustration, clickable link or passing layout test for working playback, signup, generation or export.

For documentation-only changes, verify local links, source ownership, rule consistency and whitespace. Repeating runtime checks is unnecessary when executable code has not changed; cite earlier results with their scope rather than presenting them as new tests.

Record observed evidence and limitations in [QA.md](../QA.md); keep missing capabilities in [TASKS.md](../TASKS.md). Use this compact reviewer note in the PR or handover:

- **Pattern and owner:** reused component/layout and files responsible for it.
- **Behavior and data:** preserved actions/states, ownership and website/Studio separation.
- **Verification:** checks actually run, visual viewports and important limitations.
- **Design decision:** existing rule followed, or the deliberate evolution and updated consumers/docs.

Reviewers should request correction for undocumented visual drift, inconsistent controls, lost features or mixed website/app data. Passing tests does not establish subjective approval. Commit/push/deployment authorization follows AGENTS.md and the user's instructions; this guide creates no extra approval requirement.
