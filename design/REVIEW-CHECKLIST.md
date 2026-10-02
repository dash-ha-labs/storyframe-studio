# UI implementation and review checklist

Required companion to [DESIGN-LANGUAGE.md](../DESIGN-LANGUAGE.md) and the [implementation guide](IMPLEMENTATION-GUIDE.md). Use for website, suite, editor and new screens. These checks extend the existing project rules; they do not authorise publishing or generation.

## Before implementation

- Identify the current source component and list the controls/actions that must survive.
- Match an existing pattern in shared tokens/UI, website templates or compact app chrome. Record why a new pattern is necessary.
- Distinguish product identity from the project/customer's brand and captured UI.
- State whether visible evidence is live app UI, a fixture, a screenshot or an illustration.
- Use direct launch-facing marketing copy. Track implementation gaps as internal release dependencies; do not put development disclaimers on cards or sections.

## During implementation

- Change shared roles centrally; keep typed token companions aligned. Do not create a parallel palette per page.
- Use the documented readability scale: 50px app bar, 32px toolbar controls and 36px normal buttons; keep optional editor panels and the source-driven feature set. Inspect proportional inspector/timeline sizing.
- Use the real Suite/VideoEditor for website app proof through StudioDemo; one embed on the homepage only; no editor embeds on secondary pages.
- Keep demo metadata and imports separate from personal workspace persistence.
- Keep primary signup copy brief: “Sign up free” and “Free. No credit card required.” Queue language belongs to generation, never account access.
- Give the section a product purpose: specific copy, useful content, a relevant UI wireframe. Do not fill space with generic decorative cards.
- Make the app the first and largest homepage visual. Do not add unrelated images beside the hero CTA. Supply image dimensions and provenance. Retain original takes and versions.
- Use short transform/opacity motion, honour reduced motion, and avoid new heavyweight dependencies.

## Before handing over

- For executable changes, run `npm run build` and `npm test`. For documentation-only changes, check local links, current source ownership, rule consistency and `git diff --check`; no new runtime evidence is implied. Record failures and material pre-existing limitations rather than hiding them.
- Reject stretched full-width badges, unnecessary hard line breaks, thin navigation, faint or dark marketing footers and mobile headings that become centered in a left-aligned layout. Inspect desktop and phone widths. Check no page overflow, readable headings, visible actions and clean stacking. Do not infer mobile editing parity from a responsive homepage.
- Confirm keyboard focus is visible. Check menus, links and relevant dialogs. Decorative elements must not receive focus.
- In the demo: edit a scene/caption, undo, play/pause, switch project pages and reload the disposable sample. Verify export describes JSON and the actual video-render integration status accurately.
- Inspect the actual toolbar height and confirm no feature was removed to make room for branding.
- Check images load and no invented customer proof or synthetic service telemetry is presented as measured evidence.
- Check links point to real destinations. A CTA link alone is not a working signup flow; verify that flow separately before claiming launch readiness.
- Record the tested viewport sizes and observed behaviour in QA.md. Subjective approval belongs to the reviewer/user; do not report it from an automated test.

## Required reviewer note

State: the reused pattern and shared owner, any new pattern and reason, behaviours preserved, website/app data boundaries, verification performed (including viewports for visual changes), known limits, and whether this change updates the design language itself. Any intentional departure must update the corresponding rule and consumers together; undocumented visual drift is a review issue.

## Reference adoption checks

- Use the Arcade-inspired readable Inter hierarchy, aligned gutters, large visual areas, two-column feature grid and white grouped footer. Keep Storyframe identity and app density.
- Check that all marketing button labels retain their intended font size; broad footer anchor rules must not restyle buttons.
- Reject unrelated photos, vague motivational headings, fake generation interactions and extra demo wrapper chrome.
- Keep Features, Templates, Resources, Tutorials, Docs, Blog and Roadmap distinct using their documented page patterns. Gallery redirects to Tutorials; Guides redirects to Docs. Downloads must work and advertised capabilities must be verified before public launch.

- Selected navigation must use the documented neutral treatment: no blue pill, side stripe, inset shadow or stacked indicators. Verify only the current destination is marked selected; keep keyboard focus visible.

- Studio must visibly match the supplied light HTML and website: white panels/dialogs, pale gray canvas, navy text, cobalt actions and pastel tracks. Reject a return to the former dark palette. Compactness concerns geometry and controls, not colour. Inspect forms, modal backdrops, menus, storyboard and media states as well as the default editor.

- Compare readability changes against checkpoint `7702bc2`. Keep Studio and homepage demo identical, and verify actual layout dimensions without browser zoom. Media composition coordinates and project state must remain unchanged.

- Reject gray content cards and nested icon/tag boxes. Check white card bodies and hover surfaces in app references, resources, tool/creation cards, dialogs and secondary pages. Keep the canvas tone separate.
- For styling-only reference adoption, preserve routes, sections, actions and content. Explicitly requested content-center work may extend website routes using the documented patterns. In either case, preserve Studio save/export behavior and project ownership. Check fields and keyboard focus remain clear on white surfaces.


## Content centers, data boundaries and rhythm

- [ ] Major section gaps follow shared spacing tokens; headings and filters remain attached to their content; footer spacing is not doubled.
- [ ] Public catalog records are shared intentionally; private work never appears in them. Editorial articles/lessons and community state remain separate. Template links resolve the same published record used by Studio.
- [ ] Template facets, sorting, page state, empty results and detail links work. Resource downloads use the right format and label.
- [ ] Starter imports create independent videos/boards/projects; prior creations, brands and product media remain intact; invalid imports explain the error.
- [ ] Course navigation has real lesson URLs; missing videos use the authorized placeholder, with no fake playback or video schema.
- [ ] Documentation works on phones, with reachable section navigation and readable articles. Blog artwork does not overflow.
- [ ] Community votes persist on the service, can be removed and remain unique per signed visitor. No fabricated vote counts or automatic phase changes.
- [ ] New content routes have rendered HTML, unique metadata, appropriate canonical/schema entries and a sitemap entry. Unknown routes return a production 404.

## Shared controls and contextual layouts

- [ ] Admin uses the existing design system and task-specific layout; customer flow was not changed merely to imitate admin.
- [ ] Buttons, fields, badges and dialogs reuse shared components; any new variant has a use-case reason and canonical owner. No duplicate local control implementation or feature CSS skin overrides.
- [ ] No unstyled inputs, underlined action labels, unexplained button-height differences, overlapping content or ambiguous selected states.
- [ ] Preview fits its allocated space for landscape, portrait and square; separate zoom, if present, works without stretching/cropping the film.
- [ ] Old superseded UI and its unused styles are removed, while existing edits, project ownership, locks, media, saves and undo still work.
- [ ] AI scope, immediate-apply/review, history and pending/error states are exercised without unauthorized live provider calls.
