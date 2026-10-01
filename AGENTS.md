# Storyframe Studio — implementation rules

- This is a separate application. Kurutu source and media are read-only evidence; never edit Kurutu app code here.
- Read README.md, TASKS.md and ../storyframe-studio-blueprint before expanding scope.
- Preserve the compact application chrome: one 44px top bar, small logo application menu, light reference palette with white surfaces, navy text and cobalt primary actions, clearly bounded preview controls. Do not restore oversized branding, duplicate title rows or pale low-contrast UI. Keep actual editing controls comfortable.
- Manual editing and future AI must share one validated reversible project model. Clearly distinguish implemented UI from connected AI/render capabilities.
- Keep media bytes out of React state and undo history; one active preview video; bounded caches/history. Measure performance before adding heavy UI/render dependencies.
- Keep product captures faithful and label fixture data honestly. Never invent authenticated backend behavior.
- Preserve every generated take/export, including rejected versions. Before generation, establish unique local output paths, provenance and checksum manifests. Never overwrite or prune originals automatically. Current sample media is copied, not regenerated.
- Credentials must remain runtime-loaded server-side, ignored by Git, absent from logs and exports. Never read or print a user's environment file.
- Paid generation requires an authorized request/budget. Do not retry uncertain submissions blindly.
- Never claim successful video export or AI generation without executing and verifying it. Browser preview is not encoded-export parity.
- Track work in Kanban when available; TASKS.md is the local fallback when no Kanban tool is connected.
- No deployment or git push without explicit authorization.

## Suite ownership and UX

- Folder → product project → creations. Product apps are web/mobile; video aspect ratios are independent output settings.
- Brand, media management, app references and performance live on the project page, not as persistent video-editor tabs.
- Keep the editor rail absent. Story outline and project-media selection are optional; templates stay in a menu. Import/manage media at project level.
- Keep the suite tool launcher simple. Resume existing tool work when switching; Create intentionally starts a new creation.
- Never claim MCP is connected, a Figma file is parsed, or another generator is working because a UI exists. Retain clear integration status.
- No installed package in a founder's codebase. Future MCP requests should run the bounded local capture and require review of candidates before adopting a brand.
- Never copy Kurutu sample assets into another product's creation via a template. Keep projects isolated.

## Shared design language and UI reviews

- Read [DESIGN-LANGUAGE.md](DESIGN-LANGUAGE.md) and [design/REVIEW-CHECKLIST.md](design/REVIEW-CHECKLIST.md) before any UI decision or review. Future UI must be compatible with these rules; update the shared pattern and affected consumers together when deliberately evolving it.
- Keep the Storyframe name. Reference explorations guide taste, never overwrite the source app's density, ownership or feature contract.
- Website and app share the supplied HTML’s light visual language. The app preserves its compact geometry, not its former dark theme. Share identity tokens and control styling; use context-appropriate spacing.
- Website product demos must reuse the actual app through StudioDemo with isolated sample state/media. Never mount personal workspace storage directly in a marketing page.
- Signup is free with no credit card. Any wait applies to free AI generation requests, not signup. Marketing describes the intended launch product; track missing AI/rendering as internal release dependencies. Actual app actions and completion reports must remain accurate.
- Give every page personality with concrete product content, app UI wireframes and restrained motion. Preserve reduced-motion behaviour, feature access and exact captured product UI.
- Record visual/interaction evidence in QA.md, including known limitations; an app embed or CTA alone does not prove export or signup end-to-end.

- Preserve the revised product-first hierarchy: concise hero, prominent real app, short visual stories, substantial grouped footer. Do not reintroduce a decorative hero image, repeated text grids, thin navigation, full-width border tags, forced heading breaks or centered mobile headings inside left-aligned layouts.

- Use Inter for website typography, a light grouped footer and visual feature cards. Reference Arcade for proportions, not product claims or branding. Never introduce unrelated lifestyle/product photography or vague motivational slogans.

- The dark Studio interpretation was explicitly rejected. Never restore it as a compactness requirement: compactness means retaining dimensions, working controls and feature access. Use the supplied HTML as the visual model.
