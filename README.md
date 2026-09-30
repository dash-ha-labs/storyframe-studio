# Storyframe — product studio

A lightweight local suite for founders. Folders contain product projects; each project owns its brand, web/mobile apps, original media and creations. The video editor is one tool inside the suite.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:9180. Node 22.12+; TypeScript + React + Vite. `npm run build` checks types/builds production. `npm test` runs the model checks.

## Available

- Workspace folders and multiple projects; move a project in Apps & sources.
- Four-step setup: project → web/mobile apps → brand capture/import/fresh start → review.
- Project-level brand palette, typeface name, voice, shared media library and app/source references.
- Apps switcher: video studio, logo studio, brand builder, marketing studio, landing pages, ASO copy and keywords.
- Existing video editing with optional story/media panels, timeline, caption editing, native playback, trims, locks, undo and standard output formats. No permanent navigation rail inside the editor.
- Other creative tools have saved, editable draft workspaces. Brand Builder opens shared brand controls; keywords support deduplication.
- Manual performance snapshots, rather than fabricated analytics.
- Downloadable dependency-free local identity capture script. JSON/config import extracts candidates without executing source code. Figma files are retained as references.

## Integration boundary

MCP transport, AI generation, Figma extraction, analytics connections, publishing and final video encoding are **not connected**. The UI labels these limits. No NPM package is installed in another codebase, no files are uploaded externally and no generation credits are spent. The local capture script is a working manual bridge for the intended MCP workflow.

Edits save in browser storage. Media is in IndexedDB, separate from metadata and undo. Workspace JSON backups do not bundle media and suite backup restore UI is not yet built. Preserve original files.

See [suite architecture](SUITE-ARCHITECTURE.md), [QA](QA.md), [tasks](TASKS.md), [media provenance](MEDIA-PROVENANCE.md), and [agent instructions](AGENTS.md). Original production blueprint: `../storyframe-studio-blueprint/`.
