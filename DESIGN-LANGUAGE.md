# Storyframe design language

Adopted 1 October 2026. Required for implementors and reviewers alongside [AGENTS.md](AGENTS.md), [suite architecture](SUITE-ARCHITECTURE.md), the [implementation guide](design/IMPLEMENTATION-GUIDE.md) and the [review checklist](design/REVIEW-CHECKLIST.md).

## Product and authority

Storyframe is an AI-aided, brand-aware video builder for creators and entrepreneurs. Explain actual jobs: bring screenshots and footage, plan optional storyboards, edit scenes, generate variations and build phone mockups. Marketing copy describes the intended launch product. Keep implementation gaps and release dependencies in project documentation, not in public-facing development disclaimers.

The current name and source app win over reference explorations. Never remove a feature or change project ownership to fit a marketing concept. Density changes require a documented shared rule; the user-authorized readability trial below supersedes the original fixed dimensions. Reference HTML is inspiration, not a feature contract. The source toolkit is Brand Design, independent Storyboards and Video Studio.

The homepage headline is **From your idea to a video in minutes.** This is the requested marketing direction, not a measured completion benchmark. Do not strengthen it into a two-minute guarantee without evidence. Avoid vague motivational copy such as “find your signature,” “give it shape,” “make it a thing” or “make it seamless.”

## References and adopted patterns

The supplied HTML explorations establish white, navy and cobalt. [Arcade’s website](https://www.arcade.software/) was visually inspected on 1 October 2026 for typography, spacing, cards, grids and footer. Adopt its clear hierarchy, large UI visual areas, restrained card surfaces and evenly spaced footer columns. Do not copy its brand, proprietary artwork, social proof, backend claims or conversion numbers.

Website and Studio both use the light reference: white panels, a pale gray canvas, navy text, light borders and cobalt primary actions. Studio remains compact. No dark marketing blocks, unrelated product photos, lifestyle imagery, speakers, wires or decorative hero images. Personality comes from relevant app UI wireframes, short motion, distinct useful content and deliberate colour.

## Foundations and ownership

- Shared identity: `packages/tokens/tokens.css` and its typed companion. Cobalt action `#2142e7`, hover `#1935c4`, white label; marketing ink `#182b4e`, body `#626d80`.
- Typography: locally bundled Inter Variable. One family for website headings, body and actions. Studio uses 14px core controls/navigation, 13–15px body/labels and 11–12px metadata; mono remains available for time and technical values.
- Website type: hero 43px phone / up to 68px desktop; section headings 31–36px; card headings 23–24px; body 16–18px; navigation/footer 15–16px. Small metadata may use 12–14px. Never use metadata sizing for core copy.
- Website grid: 1280px outer container; 40px desktop / 20px phone gutters. Align navigation and content. Feature cards use two columns, other collections three; phone uses one column. Major sections use `--sf-section-gap`: fluid 56–88px desktop and 52px phone. Headings sit 28px above their content (24px phone); related controls and cards stay closer. Do not stack main bottom padding with footer top padding.
- Shared components: `packages/ui/src/index.tsx` and `ui.css` own navigation, footer, buttons and layout primitives. `apps/website/src/website.css` owns marketing composition and responsive refinements; `apps/website/src/content.css` owns marketplace, resource, course, documentation, editorial and community layouts. App styles stay in `apps/web/src` and never import website CSS. `studio-ui.css` owns the compact Studio control/surface finish and is imported after base geometry in both the app and website demo.
- Buttons share cobalt/white or white/outlined variants, consistent typography and 44px normal / 48px large marketing heights. App controls use 32px toolbar/icon and 36px normal button heights.
- Use Lucide icons, content-sized status badges, visible keyboard focus and natural wrapping. No full-width outline tags, arbitrary line breaks or centered phone headings in left-aligned layouts.

## Page composition

Homepage: direct headline and signup → real editor → features → templates → tutorials → useful resources → final CTA → white grouped footer. Keep copy short. Each card must explain a distinct video task through a relevant UI visual. Do not add a blog feed to the homepage.

Footer: brand column plus Product, Resources and Storyframe link groups. Links have comfortable vertical spacing and the same readable scale across groups. A separate light CTA panel sits above; avoid duplicate overlapping signup blocks or fictitious newsletter forms.

Features describe product capabilities directly. Templates use a searchable marketplace and individual scene-structure pages. Tutorials replace Gallery with course and lesson routes. Resources provide working downloads and reviewed Studio imports; product documentation describes actual steps; the blog uses varied editorial layouts for product video techniques and AI workflows. Roadmap states remain meaningful product information. Do not publish invented customer proof, uptime metrics or incident history; omit synthetic telemetry from the status page.

## Motion and interaction

Use brief CSS transform/opacity motion for app UI wireframes and restrained hover feedback. Decorative motion ends within five seconds; reduced-motion disables it. Do not add a runtime solely for marketing animation. Interactions must visibly do what their labels promise. Brand swatches change preview colour; storyboard selectors change selected frames. Wireframes are illustrations, not proof of connected generation.

## Real editor on the website

The live editor appears on the homepage only. Features, Templates, Tutorials and other secondary pages must not repeat it. `StudioDemo` embeds `demo.html`, which mounts actual Suite/VideoEditor source, styles and validated model. Do not scale it or recreate a simplified fake editor. Preserve one 50px top bar, optional panels, timeline, inspectors, features and source breakpoints. The demo follows the same Studio scale.

Provide an ordinary validated fixture using `initialState`, `persist={false}` and a separate in-memory media store. Never read personal workspace data in marketing. Reload discards demo edits/imports; the real app retains its existing storage. Show session-only status accurately inside the app. Do not surround the preview with “live studio,” reset/about-sample panels or larger-canvas marketing chrome.

The trusted app iframe isolates CSS and keyboard listeners. Its sandbox and CSP restrict capabilities; it is not a security boundary for arbitrary third-party code. Export must still identify JSON downloads and unconnected rendering honestly. Responsive marketing does not prove full mobile editor parity.

## Conversion and evidence

Primary CTA: **Sign up free**. Supporting copy: **Free. No credit card required.** Any wait applies to free AI generation requests, not signup. Explain queues where generation is relevant, not beside every signup CTA.

Use the existing `APP_SIGNUP_URL`; this change does not create authentication. The deployed entry has a coming-soon/private gate, so signup remains a release dependency. Do not claim an end-to-end conversion flow, generation or encoded video export passed from a working link or preview alone.

Preserve generated originals, provenance and checksums. Rejected image explorations stay in `design/explorations`, never in active public media. App UI SVG sample provenance is recorded internally. Do not pass invented examples off as customer films.

## Compatibility gate

This document defines the current visual contract. Dated corrections explain decisions; superseded dimensions or rejected explorations are not alternative themes. Follow the [implementation guide](design/IMPLEMENTATION-GUIDE.md) for every future change and the [review checklist](design/REVIEW-CHECKLIST.md) before handover.

Before changing UI, identify the existing pattern, shared owner and behaviour to preserve. Update the pattern and its consumers together. Review desktop and phone layouts, interaction, focus and reduced motion. Record observed evidence and limitations in QA.md; automated checks are not subjective approval. A deliberate design-language change updates this document and the checklist in the same change.

## Launch-copy policy — 1 October 2026

At the user’s direction, remove “illustrative,” “in development,” “planned workflow,” “coming soon,” and similar implementation disclaimers from marketing. Required features will be implemented before public launch. This is approval to write the launch-facing website, not evidence that features already work. Track gaps in TASKS.md and verify them before deployment. Keep the actual editor’s session/save/export messages truthful; do not simulate successful generation or rendering.

## Studio controls — first pass

Use the documented Studio readability dimensions and one light surface/border scale, 6px control corners, cobalt filled primary actions and restrained neutral navigation selection. Keep inspector typography, control height and panel width proportional. Project-overview empty states should provide a short description and a direct action. Missing source thumbnails must have an honest fallback without rewriting media records. Brand-coloured artwork remains the project’s own; do not apply interface colours over captured content.

## Selected states — reference correction

Follow the supplied HTML’s restrained state treatment. Navigation uses a subtle neutral surface and stronger text, 4px corners, no coloured side stripe, inset shadow or saturated pill. Inspector tabs use one underline with an otherwise unchanged surface. Timeline selection uses a single clear border, not stacked border/shadow decoration. Keep keyboard focus separate and visible. Only the actual current navigation destination is selected. Never add multiple decorative state signals to make a control look styled.

## Light Studio correction

The user explicitly rejected the dark app interpretation. Source authority preserves compact structure, feature access, media fidelity and behaviour; it does not preserve the old colour theme. Use the supplied app HTML for visual direction at the documented readability scale: 50px toolbar, proportionate inspector/timeline sizes, no added permanent editor rail. Central light tokens serve both website and Studio. White dialogs, fields and chrome surround a pale gray canvas; pastel tracks distinguish picture/captions/audio, with one cobalt selection border. Media compositions and project-owned brand colours remain exact.

## Studio readability trial — 1 October 2026

The user requested a modest increase across the Studio because the light version was too small. The previous compact state is saved in commit `7702bc2` for comparison or rollback. This trial supersedes the earlier fixed 44px toolbar requirement.

- Increase UI geometry and icon artwork by approximately 12.5%; increase small text by 2px. Core navigation/actions are 14px, ordinary app buttons 36px, toolbar/icon controls 32px, and the single top bar 50px. Desktop sidebar is 227px, inspector 297px and timeline 216px; existing responsive breakpoints still apply.
- Scale actual CSS layout and UI icons, never browser zoom or a transform on the app. Keep borders, focus strokes and radii restrained. Keep viewport minimum heights and responsive breakpoints stable.
- Both Studio and the homepage demo consume the same source CSS and shared dimension tokens. Website marketing typography is independent.
- Preserve media composition coordinates, caption sizes, preview fitting, timeline time calculations, project data and every feature. Inspect the editor, optional panels, forms and dialogs for clipping after a density change.

## White content surfaces — Arcade reference refinement, 1 October 2026

Inspected the user-provided [Arcade workspace](https://app.arcade.software/workspaces/tender-app/teams/tender-app/arcades), [editor](https://app.arcade.software/flows/N7rcZqOUSda6Pi1EcN0k/edit) and [public website](https://www.arcade.software/) in authenticated Chrome. These are visual references, not evidence of Storyframe capabilities. No reference content or branding is imported into the product.

For reference-only styling requests, preserve Storyframe's existing flow, navigation, actions and information. Adopt the reference's hierarchy and visual restraint without transplanting its workflow, centered hero, claims or gray filled sections. The later user-requested content centers below deliberately expand website routes and layouts; that expansion does not change Studio's feature or project-ownership contract.

- **No gray content cards.** Cards and raised content surfaces are white, including hover. Use shared `--sf-color-card` / `--sf-color-card-border`; a subtle border or small hover shadow provides separation. `bg-surface-elevated` is white. Never use a broad gray fill as a shortcut for hierarchy.
- Pale neutral surfaces are reserved for the editor canvas and transient compact control/navigation states. Use `--sf-color-bg-canvas` explicitly for the editing workspace. A canvas is not a card.
- Color belongs to relevant product visuals, project-owned content, semantic timeline tracks and small functional accents. Marketing card text sits on white; the existing UI visual may use a restrained peach, lilac, mint or blue background. Do not replace gray cards with arbitrary colored text boxes.
- Avoid boxes within boxes: app references use one white card, a small platform icon, name/type hierarchy and concise location/status metadata. No outlined platform tag or divider inside each source card. Keep actual connection status visible. Reference files use compact rows; overview shortcuts do not need card containers.
- Preserve the enlarged 14px core controls, 50px toolbar and established responsive structure. White surfaces must not mean faint text, disappearing input boundaries or invisible focus. Tabs use one underline and no filled hover block.
- Scope follows the request: a styling-only change preserves copy, route order, links, downloads and CTA destinations. Authorized product/content work can evolve them using the established page patterns below. Every change preserves Studio state, creation actions, inspector/editor features, media coordinates and storage isolation unless a change to that behavior is explicitly requested.


## Content centers and spacing — 1 October 2026

- Keep website content and community data separate from Studio. Catalogs, articles and lessons live in `apps/website/src/data`; community proposals/votes live in the website-only service and its own database. Core contains an interchange contract, never website editorial records. Studio must not import a website catalog or query the community database.
- Marketplace: search plus combinable use-case, product, format, style and duration filters; URL-backed state, sort and bounded pagination. A template links to its own page with a scene outline and one primary **Use template free** action. Do not invent popularity or usage counts.
- Resource center: white cards with compact type labels, distinct type-specific download actions, concise explanations and individual pages. Brand kits show their palette; scripts, briefs, checklists and storyboards show relevant contents. **Use in Studio** opens a review step before creating anything.
- A website starter carries bounded data in a URL fragment. Studio validates it, lets the user choose a new/existing owner, then creates an independent artifact. No website storage is merged into app storage. Existing work and product media stay intact.
- Tutorials: course overview plus individual lesson URLs; contents on the left, a 16:9 video area on the right and short practice steps underneath. On phones, lesson navigation precedes the player. Videos are explicitly authorized placeholders until supplied; placeholders are not playable controls and must not emit VideoObject schema or fabricated duration.
- Documentation: section indexes and individual articles, a persistent desktop section navigation, in-page outline, and a mobile section disclosure. Use at least eight current sections, including account/billing. State actual save/import behavior precisely. Avoid repeating the same introductory paragraph under another heading.
- Blog: a lead story, compact supporting stories and readable article pages. Avoid identical long horizontal cards. Long artwork titles must stay inside the cover; the complete title remains visible below it.
- Roadmap: ordered **Now / Next / Later** stages, tied to short proposal pages. Keep the timeline visually distinct from the searchable voting board. Votes rank proposals for review; they never assign delivery dates or move an idea onto the timeline automatically. No invented votes, customers or completion claims.
- SEO: ship rendered HTML for content routes, unique titles/descriptions, canonical links, appropriate structured data, sitemap and real production 404 responses. Redirect Gallery to Tutorials and Guides to Docs. Use ordinary links for navigation; preserve modified-click behavior.
