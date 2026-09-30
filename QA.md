# UI milestone verification — 2026-09-28

## Passed
- TypeScript and Vite production build.
- Eight model tests: locked reorder boundaries, valid reorder, source trim bounds, locked editing, split continuity, rejected invalid split, import structure/source validation, half-open timeline boundaries.
- Browser: logo menu opens, Escape closes, Project settings opens from menu; Export accurately distinguishes JSON project from unconnected video export.
- Caption change appears live; Undo restores original.
- Trim from 6s to 4s ripples total from 44s to 42s; Undo restores 44s.
- Scene lock disables duration and duplication; unlock restores controls.
- Duplicate adds a scene (13→14); Undo restores.
- Playback mounts one ready video, advances source time and pauses through controls.
- No browser warning/error logs during these checks.
- Visual inspection at the normal narrow workspace (~818px wide) and a desktop viewport. Desktop DOM measurements: 44px top bar, 34px preview toolbar, distinct 69px bottom control panel; no page horizontal overflow. Temporary viewport override reset afterwards.
- Adaptive timeline tick interval prevents overlap at narrow sizes.

## Limits

This is representative smoke verification, not comprehensive browser coverage or production profiling. No encoded export, AI generation, mobile editing, upload service or final mix verification is claimed. Current preview does not reproduce all historical final-render motion/click effects. Imported media portability requires original files; JSON alone is not a bundle.

Production bundle: approximately 88KB gzip JavaScript and 7KB gzip CSS (media/fonts excluded). No large rendering/editor framework. RAM/GPU limits have not been benchmarked.

# Suite milestone — 2026-09-28

- 12 automated tests pass: original 8 editor tests plus product-platform/output-format separation, independent video creation, non-executing config import and format validation.
- Production build passes. Entry JS approximately 89 KB gzip; video editor lazy chunk approximately 15.5 KB gzip; combined CSS approximately 13 KB gzip. No new dependencies. These are bundle measurements, not RAM/GPU benchmarks.
- Browser wizard: created an isolated Orbit QA project with both web/mobile, imported the capture fixture report, verified reviewed canvas #fafafa/accent #123456 and Example Sans metadata.
- Created an independent 16:9 video inside Orbit QA. Verified no permanent rail or left library; optional story outline opens/closes. Existing Kurutu video retains its original 13 scenes.
- Project/media isolation: imported a screenshot into Orbit QA; Kurutu did not acquire it. Project pages mount zero video players. Existing video tool mounts one player.
- Folder creation and moving Orbit QA into Client work verified through UI.
- Keyword draft creation, content editing and duplicate removal verified through rendered UI. Project metadata survived reload.
- Apps switcher resumes the existing video instead of forcing a new creation.
- Code capture tested against a synthetic fixture: detected mobile/web dependencies; read selected CSS; excluded .env.local and secrets.ts sentinel values. No live app source or credentials were used for this test.
- Visual review: project overview, brand page, setup steps, video tool. No browser warnings/errors observed during the tested flows.
- QA data resides on port 9181, separate from the user's port 9180 storage.

Not claimed: live MCP connection, Figma design parsing, AI outputs, encoded-export parity, analytics ingestion, mobile-editor coverage, portable backup restore, production performance or full accessibility conformance.

Final location check: port 9180 migrated the existing Kurutu edit (13 scenes, 44 seconds), with no permanent editor rail/library. User-facing screenshots: `qa/suite-20260928/{project-overview,setup-wizard,video-workspace}.png`.
