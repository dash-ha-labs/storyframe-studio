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

## Website design adoption — 2026-10-01

- Inspected arcade.software in the browser: Inter hierarchy, large UI visual areas, paired feature cards and white grouped footer. Applied those patterns to Storyframe, retaining its name and compact source editor.
- Final build and 51 tests pass (27 app, 16 website, 8 core); diff whitespace check passes. Existing missing legacy demo-font/mask warnings remain; no Kurutu media was copied to hide them.
- Desktop rendered inspection at 1422 CSS pixels: homepage, Features, Templates, Gallery, CTA and footer. No document horizontal overflow; feature columns measure 590px each; footer links 16px; headings use locally bundled Inter.
- Confirmed exactly one live editor on homepage and zero iframe embeds on Features, Templates and Gallery. Regression test enforces this. Removed reset/about/larger-canvas wrapper chrome.
- Edited the sample scene title and used Undo: restored “Introduce the product”. Earlier same-session checks covered caption editing, playback and truthful JSON export state. App top bar remained 44px in the earlier geometry check; compact app styles remain authoritative.
- Demo initialization/privacy and media-store isolation tests pass. Generated unrelated images are archived with checksums and are not referenced in active website content.
- Earlier responsive inspection covered a 433px CSS viewport without overflow. A final mobile override attempt did not change the hidden tab's 1422px viewport, so final mobile visual parity is not claimed; responsive CSS has been retained and revised. Override was reset.
- No encoded film, AI generation, final signup flow, performance benchmark or subjective user approval is claimed. Signup destination remains the existing app; authentication and connected generation/rendering are release dependencies.

Launch-copy follow-up: removed public development disclaimers from features, templates, gallery, guides and articles. Removed synthetic service metrics/incidents rather than presenting them as measured status. Website build and 16 website tests pass. App behavior and completion messaging remain accurate; outstanding capabilities are tracked in TASKS.md for pre-launch implementation.

## Studio UI first pass — 2026-10-01

- Unified compact control, panel, field and selection styling in studio-ui.css, imported by both Studio and the homepage demo. Retained source geometry and all controls. Tightened storyboard empty state and clarified project-overview labels. Missing legacy thumbnail URLs now show an explicit fallback; source references remain unchanged.
- Full build and all 51 tests pass. Observed at 974 CSS pixels: app bar 43.99px, inspector 235px and timeline 191.997px before and after. No horizontal document overflow. Opened project and caption inspector; all 13 original scenes remain, duration 44s. No project content was edited during this pass.
- Existing local Kurutu media is unavailable in this checkout; no playback/export parity claim. Only the project cards’ missing-thumbnail presentation was changed.

Studio selected-state correction: replaced the rejected blue sidebar fill/stripe with a neutral background and 4px corners, removed stacked clip borders/shadows, and kept inspector selection to a single underline. Visually inspected the updated project overview at 974 CSS pixels. Project selection now applies only in the project view. Studio build and diff check pass. No full app functionality or media parity claim is added by this styling check.

## Studio light theme — 2026-10-01 (supersedes dark-theme interpretation)

- Applied shared light tokens to application chrome, project pages, editor, brand fields, setup, menus and dialogs. Website demo imports identical Studio styles. Migrated legacy chrome hex values to semantic roles, retaining source dimensions.
- Visually reviewed project overview, brand page, setup dialog, editor and export dialog at 1422 CSS pixels. White surfaces and navy text; pale gray canvas; pastel picture/caption/audio tracks; cobalt primary actions and one selected-clip border. No document horizontal overflow. App bar 43.99px and timeline 191.997px; inspector 263.993px at this desktop breakpoint.
- Edited and undid a title in the disposable sample, observed the original title restored, played/paused the preview and opened export. Existing personal project content was not edited.
- Full build and all 51 tests pass. Media composition/caption/end-card CSS was compared byte-for-byte against the committed baseline and is unchanged. No source-media or brand-colour modifications. Legacy missing demo font/mask warnings and unavailable local Kurutu media remain.
- Updated AGENTS/design rules: source authority preserves density, feature access and behavior, not the rejected dark palette. No mobile parity, connected generation or encoded export is claimed by this theme pass.
