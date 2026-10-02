# Storyframe product contract

**Storyframe helps creators and entrepreneurs turn an idea into a custom, brand-aware video in seconds or minutes. AI drives creation and ongoing editing; the timeline and manual tools provide control.** This is the intended product contract, not a claim that every launch capability is complete. See [current implementation](SUITE-ARCHITECTURE.md) and [remaining milestones](TASKS.md).

## The main journey

1. Choose or create a product project. Its identity, app references, media and optional storyboard become context for creation. Do not require a storyboard or a long wizard before every video.
2. Describe a video, use a template, or reuse a public example. These are entrances into the same editor, not separate disconnected generators.
3. AI reads the project context, chooses a grounded story, and produces editable scenes in a video creation owned by that project. Product screenshots remain exact; brand colors style the surrounding composition.
4. Continue in the same timeline. Select one or several blocks and ask AI to edit those blocks, regenerate the whole video, or use manual tools. Respect scene locks and all unrelated edits.
5. A simple **Apply AI changes immediately** checkbox chooses between applying validated changes and reviewing a proposed version. Preserve the previous video, every proposal and every applied version. Users can restore either direction. Undo is useful but does not replace durable version history.
6. Preview, export and optionally publish an example that others can reuse. Publishing is explicit and must cover rights to the included media. Never publish a private project merely because it used a public template.

“First video” is an onboarding milestone, not the boundary of AI functionality. AI must understand an existing video, its selected blocks, brand, assets and optional storyboard. Do not recreate the old Strip modal, put another editor inside a modal, or silently replace the entire timeline for a scoped request.

## The objects and their relationships

| Object | Meaning and ownership |
| --- | --- |
| Folder | Optional organization for product projects. |
| Product project (`SuiteProject`) | The user's product/client/venture. Owns brand, web/mobile app references, source references, media and creations. |
| Brand | Product palette, typeface, voice and evidence/candidates. App design tokens are separate from a customer's product brand. |
| Storyboard | Optional independent planning document. Current model allows multiple projects to reference a board; a project has one board reference. It supplies context, not an automatic overwrite of a video's scenes. |
| Video creation (`Creation.video`, type `Project`) | One editable video timeline, format, scenes, captions and soundtrack inside a product project. The type name `Project` here means a video document, not the owning product. |
| Template | Public reusable creative recipe: prompt, scene structure, format and presentation defaults. A published record is shared by website and app. Applying it creates private work; changing the recipe never mutates existing videos. |
| Resource | A typed reusable asset/recipe: brief, script, checklist, storyboard, brand kit or prompt pack. Downloads and **Use in Studio** have type-specific behavior. A resource skill is data/prompt guidance, not executable third-party code. |
| Example/gallery video | An actual explicitly published video made with Storyframe, with provenance and reusable project/media references. Reuse creates a new private creation. Never fill this collection with unrelated products or pretend template artwork is a customer result. |
| Tutorial | A course with lessons, left-side contents and a video area. Distinct from public examples. Authorized video placeholders are acceptable until recordings are supplied. |
| Docs / blog / roadmap | Product instructions; useful editorial articles; proposals and editorially scheduled delivery respectively. Votes inform prioritization, not automatic delivery dates. |

## Shared public data, separate private work

The earlier instruction to keep website data separate protects **private workspace data**, not duplicate public template databases. Reusable templates/resources/published examples have one public catalog. Articles, lessons and marketing copy remain website-owned; roadmap votes have their own community database. Private projects, originals, unpublished takes, prompts and job records do not enter public catalog responses.

Publishing a template makes it available in the marketplace and Studio picker. A `featured` published template can appear on the homepage. **Use template free** resolves that same record, preserves its identity, chooses a destination project if necessary and opens an editable creation. Do not add manual copying or a separate “marketing-only” template implementation. Public examples and applicable resources need equally direct reuse paths.

## Product capabilities and direction

Support user screenshots, recordings, uploaded images/audio, royalty-free media, generated images/video, phone mockups, animation/effects, optional brainstorming/storyboards and precise manual edits. These are parts of one video workflow. More automation can be added without changing the ownership model. Current generation is a bounded scene planner through 9Router plus a deterministic composition; it is **not yet** a video/image generation provider, stock-media search, reliable brand crawler or arbitrary autonomous code author.

Brand capture must distinguish manual values, heuristic candidates and verified source evidence. A URL or Figma reference is not a connected source. Imported UI must remain faithful. Never fabricate project facts, features, usage counts, screenshots or backend actions to make a video feel complete.

## Presentation and copy

Follow [design language](DESIGN-LANGUAGE.md), [implementation guide](design/IMPLEMENTATION-GUIDE.md) and [review checklist](design/REVIEW-CHECKLIST.md). Website, Studio and admin share a light, meticulous visual identity; Studio keeps compact, readable controls. No gray content cards, dark theme reinterpretation, decorative unrelated objects, vague motivational copy, or live editor repeated throughout the website.

Use concrete copy such as **From your idea to a video in minutes.** Signup is free, no credit card required. Queuing applies to free AI requests, not signup. Marketing can describe the agreed launch product without development disclaimers everywhere; actual app actions and completion reports must remain truthful. Never say a file was rendered or a source was connected without evidence.

## Authority when instructions conflict

Current user decisions → this product contract → current implementation/acceptance evidence → design rules for presentation → historical notes. Code is evidence of behavior and data compatibility, not justification for rejected product decisions. Preserve working features and user data while replacing incoherent UI. Historical blueprint constraints and old task logs are references, not a second active specification.
