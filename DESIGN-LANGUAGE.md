# Storyframe design language

Adopted 1 October 2026. Required for implementors and reviewers alongside [AGENTS.md](AGENTS.md), [suite architecture](SUITE-ARCHITECTURE.md) and the [review checklist](design/REVIEW-CHECKLIST.md).

## Product and authority

Storyframe is an AI-aided, brand-aware video builder for creators and entrepreneurs. Explain actual jobs: bring screenshots and footage, plan optional storyboards, edit scenes, generate variations and build phone mockups. Marketing copy describes the intended launch product. Keep implementation gaps and release dependencies in project documentation, not in public-facing development disclaimers.

The current name and source app win over reference explorations. Never remove a feature, enlarge editor chrome or change project ownership to fit a marketing concept. Reference HTML is inspiration, not a feature contract. The source toolkit is Brand Design, independent Storyboards and Video Studio.

The homepage headline is **From your idea to a video in minutes.** This is the requested marketing direction, not a measured completion benchmark. Do not strengthen it into a two-minute guarantee without evidence. Avoid vague motivational copy such as “find your signature,” “give it shape,” “make it a thing” or “make it seamless.”

## References and adopted patterns

The supplied HTML explorations establish white, navy and cobalt. [Arcade’s website](https://www.arcade.software/) was visually inspected on 1 October 2026 for typography, spacing, cards, grids and footer. Adopt its clear hierarchy, large UI visual areas, restrained card surfaces and evenly spaced footer columns. Do not copy its brand, proprietary artwork, social proof, backend claims or conversion numbers.

Website and Studio both use the light reference: white panels, a pale gray canvas, navy text, light borders and cobalt primary actions. Studio remains compact. No dark marketing blocks, unrelated product photos, lifestyle imagery, speakers, wires or decorative hero images. Personality comes from relevant app UI wireframes, short motion, distinct useful content and deliberate colour.

## Foundations and ownership

- Shared identity: `packages/tokens/tokens.css` and its typed companion. Cobalt action `#2142e7`, hover `#1935c4`, white label; marketing ink `#182b4e`, body `#626d80`.
- Typography: locally bundled Inter Variable. One family for website headings, body and actions. Existing compact app sizes remain unchanged; mono remains available for time and technical values.
- Website type: hero 43px phone / up to 68px desktop; section headings 31–36px; card headings 23–24px; body 16–18px; navigation/footer 15–16px. Small metadata may use 12–14px. Never use metadata sizing for core copy.
- Website grid: 1280px outer container; 40px desktop / 20px phone gutters. Align navigation and content. Feature cards use two columns, other collections three; phone uses one column. Sections use 64px desktop / 43px phone separation, not empty viewport-sized spacers.
- Shared components: `packages/ui/src/index.tsx` and `ui.css` own navigation, footer, buttons and layout primitives. `apps/website/src/website.css` owns website composition and responsive refinements. App styles stay in `apps/web/src` and never import website CSS. `studio-ui.css` owns the compact Studio control/surface finish and is imported after base geometry in both the app and website demo.
- Buttons share cobalt/white or white/outlined variants, consistent typography and 44px normal / 48px large marketing heights. App buttons retain existing compact dimensions.
- Use Lucide icons, content-sized status badges, visible keyboard focus and natural wrapping. No full-width outline tags, arbitrary line breaks or centered phone headings in left-aligned layouts.

## Page composition

Homepage: direct headline and signup → real editor → features → templates → gallery examples → useful resources → final CTA → white grouped footer. Keep copy short. Each card must explain a distinct video task through a relevant UI visual. Do not add a blog feed to the homepage.

Footer: brand column plus Product, Resources and Storyframe link groups. Links have comfortable vertical spacing and the same readable scale across groups. A separate light CTA panel sits above; avoid duplicate overlapping signup blocks or fictitious newsletter forms.

Features describe product capabilities directly. Templates present useful scene structures. Gallery cards describe the example’s format or use case without development labels. Resources provide working downloads; guides describe actual steps; the blog covers product video techniques and AI workflows. Roadmap states remain meaningful product information. Do not publish invented customer proof, uptime metrics or incident history; omit synthetic telemetry from the status page.

## Motion and interaction

Use brief CSS transform/opacity motion for app UI wireframes and restrained hover feedback. Decorative motion ends within five seconds; reduced-motion disables it. Do not add a runtime solely for marketing animation. Interactions must visibly do what their labels promise. Brand swatches change preview colour; storyboard selectors change selected frames. Wireframes are illustrations, not proof of connected generation.

## Real editor on the website

The live editor appears on the homepage only. Features, Templates and Gallery must not repeat it. `StudioDemo` embeds `demo.html`, which mounts actual Suite/VideoEditor source, styles and validated model. Do not scale it or recreate a simplified fake editor. Preserve one 44px top bar, optional panels, timeline, inspectors, features and source breakpoints.

Provide an ordinary validated fixture using `initialState`, `persist={false}` and a separate in-memory media store. Never read personal workspace data in marketing. Reload discards demo edits/imports; the real app retains its existing storage. Show session-only status accurately inside the app. Do not surround the preview with “live studio,” reset/about-sample panels or larger-canvas marketing chrome.

The trusted app iframe isolates CSS and keyboard listeners. Its sandbox and CSP restrict capabilities; it is not a security boundary for arbitrary third-party code. Export must still identify JSON downloads and unconnected rendering honestly. Responsive marketing does not prove full mobile editor parity.

## Conversion and evidence

Primary CTA: **Sign up free**. Supporting copy: **Free. No credit card required.** Any wait applies to free AI generation requests, not signup. Explain queues where generation is relevant, not beside every signup CTA.

Use the existing `APP_SIGNUP_URL`; this change does not create authentication. The deployed entry has a coming-soon/private gate, so signup remains a release dependency. Do not claim an end-to-end conversion flow, generation or encoded video export passed from a working link or preview alone.

Preserve generated originals, provenance and checksums. Rejected image explorations stay in `design/explorations`, never in active public media. App UI SVG sample provenance is recorded internally. Do not pass invented examples off as customer films.

## Compatibility gate

Before changing UI, identify the existing pattern, shared owner and behaviour to preserve. Update the pattern and its consumers together. Review desktop and phone layouts, interaction, focus and reduced motion. Record observed evidence and limitations in QA.md; automated checks are not subjective approval. A deliberate design-language change updates this document and the checklist in the same change.

## Launch-copy policy — 1 October 2026

At the user’s direction, remove “illustrative,” “in development,” “planned workflow,” “coming soon,” and similar implementation disclaimers from marketing. Required features will be implemented before public launch. This is approval to write the launch-facing website, not evidence that features already work. Track gaps in TASKS.md and verify them before deployment. Keep the actual editor’s session/save/export messages truthful; do not simulate successful generation or rendering.

## Studio controls — first pass

Keep the established editor dimensions and use one light surface/border scale, 6px control corners, cobalt filled primary actions and restrained neutral navigation selection. Style inspector labels through hierarchy and contrast instead of increasing panel widths. Project-overview empty states should provide a short description and a direct action. Missing source thumbnails must have an honest fallback without rewriting media records. Brand-coloured artwork remains the project’s own; do not apply interface colours over captured content.

## Selected states — reference correction

Follow the supplied HTML’s restrained state treatment. Navigation uses a subtle neutral surface and stronger text, 4px corners, no coloured side stripe, inset shadow or saturated pill. Inspector tabs use one underline with an otherwise unchanged surface. Timeline selection uses a single clear border, not stacked border/shadow decoration. Keep keyboard focus separate and visible. Only the actual current navigation destination is selected. Never add multiple decorative state signals to make a control look styled.

## Light Studio correction

The user explicitly rejected the dark app interpretation. Source authority preserves geometry, feature access, media fidelity and behaviour; it does not preserve the old colour theme. Use the supplied app HTML for visual direction at the source app’s dimensions: 44px toolbar, existing inspector/timeline sizes, no added permanent editor rail. Central light tokens serve both website and Studio. White dialogs, fields and chrome surround a pale gray canvas; pastel tracks distinguish picture/captions/audio, with one cobalt selection border. Media compositions and project-owned brand colours remain exact.
