# Storyframe product suite — UI architecture

## Ownership

Workspace → folders → projects → creations.

A project represents a product or brand. It owns:

- One shared brand (palette, typeface name, voice, provenance).
- Product apps: any number of web and/or mobile surfaces, each with a name and optional source URL/label.
- Source references and original media.
- Creations made using suite tools.
- Manually entered performance snapshots.

A creation represents an output: a video edit, logo brief, marketing graphic plan, landing-page draft, ASO copy, or keyword list. A video is not a product platform. Standard video canvases are 9:16, 16:9, 1:1 and 4:5. Existing portrait footage is fitted uniformly into other canvas ratios; automatic reframing is not implemented.

## Navigation

The compact application menu opens workspace actions. Folders and project switching live in the suite shell. Project pages contain Overview, Brand, Media, Apps & sources and Performance. Create starts new work; Apps resumes the most recent creation for a tool, or starts a draft if none exists.

The video tool mounts outside the suite sidebar. It retains a single 44px top bar and contextual inspector. There is no permanent Story/Media/Brand/Templates/Project rail. Story outline and asset selection are optional panels. Media import/management routes to the project library; the editor selects existing project assets. Templates remain an explicit menu action. The original Kurutu templates are limited to the Kurutu sample; they never introduce Kurutu media into a new product's video.

## Founder setup

1. Name the project, choose a folder and explain its purpose.
2. Select web, mobile or both. This is separate from video dimensions.
3. Choose codebase capture, reference files, or a fresh identity.
4. Review token candidates and project context, then create the project.

The intended connected workflow is: connect the coding agent to Storyframe MCP → ask it to run the local capture script → review a bounded report → import approved identity evidence. No NPM dependency is installed in the founder's app.

The MCP server/transport is **not implemented**. The UI explicitly shows this status. A working manual bridge is shipped as `public/tools/capture-identity.mjs`; download and run it with Node, inspect the JSON, and import it. It performs no network requests and does not change the source codebase. It scans selected style/theme files with limits, excludes dotfiles, sensitive filenames, build output and dependency directories, ignores symlinks and never executes Tailwind/JavaScript configs. Output uses exclusive creation (`wx`) to avoid overwriting existing reports.

Colour extraction is heuristic: explicit semantic JSON fields take precedence, otherwise light/dark candidates are separated and shown for review. This does not prove the app's full design system or behavior. JSON, Tailwind and CSS originals are retained in IndexedDB. `.fig` files can be attached (up to 50 MB), but native Figma extraction is not connected. No file is sent to a cloud service.

## Working interfaces vs integrations

Working: folders, project creation/movement/switching, shared brand controls, media import/filter/preview, app references, wizard and local capture import, video editing, independent video formats, manual drafts, keyword deduplication, workspace JSON backup, manual performance snapshots.

Not connected: MCP transport, AI/image/logo/video generation services, native Figma extraction, screenshot automation, landing-page publishing, ASO/keyword search-volume services, analytics providers and encoded video export. No credentials or credits are consumed by this UI.

## Data and resource use

Suite metadata uses `storyframe.suite.v1`; the original `storyframe.project.v1` edit is imported into Kurutu on first use and left untouched. Media bytes remain in the existing IndexedDB store. The two origins used during development have independent browser storage, so QA projects on port 9181 do not pollute the user's workspace on 9180.

The video editor is a lazy chunk and unmounts when leaving the tool. Project pages mount no video decoders; the media detail dialog mounts one only when requested. Thumbnails are lazy-loaded static images. Undo history remains metadata-only. No new UI or animation dependencies were added.

Brand colours are read from the project when opening a video. Original screenshot pixels remain unchanged. This is not versioned brand inheritance yet; before adding team use, add brand revisions and explicit update/diff choices for existing creations.

Workspace JSON is a metadata backup, not a portable media package. It currently has no suite restore UI; the per-video JSON open/save remains available. A proper portable package and restore workflow belong to the persistence milestone.

## Shared website and app identity — 1 October 2026

[DESIGN-LANGUAGE.md](DESIGN-LANGUAGE.md) and the [review checklist](design/REVIEW-CHECKLIST.md) govern future UI. Shared token/UI packages own identity and semantic controls. Website-specific composition stays in `apps/website/src/website.css`; compact app geometry stays in `apps/web/src/{style,suite}.css`.

The homepage uses `StudioDemo`, an iframe of the dedicated Vite entry `demo.html`. It imports the real Suite and VideoEditor, the same styles and validated model, with `initialState` plus `persist=false`. Its sample metadata and media remain in memory; normal app localStorage/IndexedDB behaviour is unchanged. This also scopes keyboard listeners and app styles to the iframe document. Reloading discards the disposable demo only. Only the homepage mounts an instance. Secondary pages use focused visuals.

The sample consists of original SVG app UI wireframes, not Kurutu captures. Generated images have separate provenance in `design/media-provenance.json`; all rejected generated images are retained in `design/explorations` and not shipped. No original Kurutu media was changed or copied by this design task.

Current source toolkit: video and brand, plus independent Storyboards. Legacy descriptions above of logo/marketing/ASO/keyword draft tools are historical and are not advertised as current functionality.

Studio and website now use the shared light token palette. The app’s compact geometry remains in style.css and suite.css; studio-ui.css refines light controls and surfaces. The demo imports the same three source styles. UI colour migration excludes the media composition/caption/end-card CSS, preserving captured content.
