# UI implementation and review checklist

Required companion to [DESIGN-LANGUAGE.md](../DESIGN-LANGUAGE.md). Use for website, suite, editor and new screens. These checks extend the existing project rules; they do not authorise publishing or generation.

## Before implementation

- Identify the current source component and list the controls/actions that must survive.
- Match an existing pattern in shared tokens/UI, website templates or compact app chrome. Record why a new pattern is necessary.
- Distinguish product identity from the project/customer's brand and captured UI.
- State whether visible evidence is live app UI, a fixture, a screenshot or an illustration.
- Use direct launch-facing marketing copy. Track implementation gaps as internal release dependencies; do not put development disclaimers on cards or sections.

## During implementation

- Change shared roles centrally; keep typed token companions aligned. Do not create a parallel palette per page.
- Preserve the 44px app bar, optional editor panels, existing inspector/timeline geometry and source-driven feature set.
- Use the real Suite/VideoEditor for website app proof through StudioDemo; one embed on the homepage only; no editor embeds on secondary pages.
- Keep demo metadata and imports separate from personal workspace persistence.
- Keep primary signup copy brief: “Sign up free” and “Free. No credit card required.” Queue language belongs to generation, never account access.
- Give the section a product purpose: specific copy, useful content, a relevant UI wireframe. Do not fill space with generic decorative cards.
- Make the app the first and largest homepage visual. Do not add unrelated images beside the hero CTA. Supply image dimensions and provenance. Retain original takes and versions.
- Use short transform/opacity motion, honour reduced motion, and avoid new heavyweight dependencies.

## Before handing over

- Run `npm run build` and `npm test`. Record failures and material pre-existing limitations rather than hiding them.
- Reject stretched full-width badges, unnecessary hard line breaks, thin navigation, faint or dark marketing footers and mobile headings that become centered in a left-aligned layout. Inspect desktop and phone widths. Check no page overflow, readable headings, visible actions and clean stacking. Do not infer mobile editing parity from a responsive homepage.
- Confirm keyboard focus is visible. Check menus, links and relevant dialogs. Decorative elements must not receive focus.
- In the demo: edit a scene/caption, undo, play/pause, switch project pages and reload the disposable sample. Verify export describes JSON and unconnected video rendering accurately.
- Inspect the actual toolbar height and confirm no feature was removed to make room for branding.
- Check images load and no invented customer proof or synthetic service telemetry is presented as measured evidence.
- Check links point to real destinations. A CTA link alone is not a working signup flow; verify that flow separately before claiming launch readiness.
- Record the tested viewport sizes and observed behaviour in QA.md. Subjective approval belongs to the reviewer/user; do not report it from an automated test.

## Required reviewer note

State: the reused pattern, any new pattern and reason, behaviours preserved, verification performed, known limits, and whether this change updates the design language itself. Any intentional departure must update the corresponding rule and consumers together; undocumented visual drift is a review issue.

## Reference adoption checks

- Use the Arcade-inspired readable Inter hierarchy, aligned gutters, large visual areas, two-column feature grid and white grouped footer. Keep Storyframe identity and app density.
- Check that all marketing button labels retain their intended font size; broad footer anchor rules must not restyle buttons.
- Reject unrelated photos, vague motivational headings, fake generation interactions and extra demo wrapper chrome.
- Keep Features, Templates, Gallery and Resources distinct; downloads must work and advertised capabilities must be verified before public launch.
