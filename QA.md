# Current verification — 2 October 2026

This section supersedes older capability statements below. Product intent: [PRODUCT](PRODUCT.md). Remaining acceptance work: [HANDOFF](docs/HANDOFF.md), [TASKS](TASKS.md).

- `npm test`: **69 passed**, zero failed (27 Studio, 21 website, 14 canonical core, 7 service/community). Includes scoped edits, locked/unrelated scene preservation, foreign/duplicate target rejection, typography duration, server ownership/idempotency, restart without retry, admin revisions/publication/archive and existing manual model/import tests.
- `npm run build`: passed, including type checks and 178 prerendered website pages. Legacy demo font/mask warnings remain; source media is not bundled in a clean clone.
- `git diff --check`: passed. Active local Markdown documentation links checked and resolved.
- Browser: admin at 974×1042. Shared action buttons measured **36px**, **0 underlined action labels**, **no horizontal overflow**, composition frame entirely contained in its allocated preview. Verified after replacing the initial duplicated admin skin with shared controls and focused editing sections. This is observed layout evidence, not user acceptance of visual quality.
- Browser: existing customer project/editor opened; AI panel, template selection, timeline, inspector and transport remain reachable. Selecting “A very long list” changed AI scope to **1 selected scene** and preserved the 44-second/13-scene timeline. No AI request or timeline content mutation performed in this browser check. Historical source media is missing locally and is reported as unavailable, not replaced with fabricated imagery.
- Offline render: `node --import tsx work/ai-creation/verify-render.mjs` produced a four-second two-scene fixture through Hyperframes check → render → FFprobe → poster. Output `data/render-verification/fd6a989c-fb9d-4248-98e3-5a950b793fa8/video.mp4`, 175673 bytes, SHA-256 `f4ad3dd02f744c784e4475640b4acc809aef8ce883a0cb1ca62e50935f449f8b`. Originals/manifests retained locally. **Technical smoke evidence only**: no full subjective watch/listen, audio mix review, legacy parity or performance claim.
- No live model/provider calls or paid generation tests. Service tests inject an offline provider. Local review service uses an empty provider key and loopback-only local admin.

Not verified: full browser auto-apply/review/restore/reload recovery scenarios; actual model quality; MP4 download from editor; imported-video/audio encoded parity; real signup/accounts; example reuse UI; Docker deployment. Phone viewport override did not apply to the existing tab, so mobile visual verification remains pending. See the ordered checks in TASKS rather than treating a working admin page as complete product delivery.

## Earlier QA history (historical evidence)

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

## Studio readability scale — 2026-10-01

- Saved the complete compact light UI in commit `7702bc2` before the trial. Enlarged small UI text by 2px and layout/icon dimensions by approximately 12.5%; no browser zoom or app transform. Updated shared rules and both token representations.
- Before/after at 1422 × 800 CSS pixels: top bar 44 → 50px, sidebar 202 → 227px, core navigation/button text 12 → 14px. Editor inspector 264 → 297px, timeline 192 → 216px. Project overview and editor have no horizontal document overflow.
- Inspected the real editor, optional story outline and export dialog. Controls remain visible and the inspector scrolls. Existing Kurutu project still shows 13 scenes / 44 seconds. The user's existing 974 × 1042 preview also reports a 50px toolbar and no horizontal document overflow.
- Full build and all 51 existing tests pass (27 app, 16 website, 8 core). Breakpoints and media composition CSS are unchanged; film preview/model logic is unchanged. No new dependencies.
- Existing missing demo fonts/mask and unavailable Kurutu source media remain. No phone editor parity, backend generation, encoded export or subjective approval is claimed.

- Isolated homepage demo reports the same 50px bar, 297px inspector and 216px timeline. Edited a scene title, used Undo and observed the original title restored; playback switched to Pause and paused again. No personal project data was edited.

## White surface / reference styling — 2026-10-01

- Read-only visual inspection in native Chrome: requested authenticated Arcade workspace and editor, plus public arcade.software homepage. Observed preview-led library cards, white editor panels, restrained boundaries and distinct content/metadata hierarchy. No reference project edits, uploads or copied reference media.
- Preserved Storyframe's routes, website copy, section sequence, CTA/download destinations and app actions. Changes are shared surface tokens/CSS plus presentation markup for source-app identity rows. Existing readability scale remains.
- At 1422 × 800: visually inspected project overview, Apps & sources and Resources. Source cards are white; outlined nested platform/icon boxes and internal status dividers are removed. Existing reference/connection status remains. Resource card computed backgrounds are all RGB 255/255/255, with no horizontal page overflow.
- Responsive Resources and Features were inspected in temporary 390px-wide same-origin frames: both document widths are exactly 390px, with no horizontal overflow. Headings remain left aligned; card content wraps and actions remain visible. Temporary review page removed. The in-app browser viewport override did not resize the hidden tab and was reset; phone evidence comes from the explicitly sized frames.
- Full build and all 51 existing tests pass (27 app, 16 website, 8 core). Existing missing demo media/font/mask limitations remain. No connected generation, authentication completion, encoded export or full phone-editor parity claim.

- Shared demo editor: observed white toolbar/transport and unchanged 50px top bar; edited a sample scene title and Undo restored it, played/paused, and opened export. Export option backgrounds both compute to white, with the existing JSON/session-only and unconnected renderer messages intact. No horizontal overflow.

## Content centers, spacing and data separation — 1 October 2026

Implemented a website-owned template/resource catalog, tutorial courses, documentation, editorial blog, roadmap timeline and persistent community board. Website data stays separate from Studio; only a bounded validated starter contract is shared.

Verification:
- Full production build passed; 62 tests passed (27 Studio, 21 website, 10 core, four community service). After the final native-download and copy refinements, the website build and all 21 website checks passed again.
- All 100 template starters create valid independent videos. All 12 resources produce valid downloads and the intended artifact type. Existing creations, brands and media are preserved. Malformed/oversized starter links are rejected.
- 178 sitemap routes were checked in the built output for rendered headings, descriptions and canonical links. Six course aliases render their first lesson with its canonical URL. Production proposal HTML, metadata and a real 404 were verified through the community HTTP server using isolated temporary data.
- Community service checks cover cross-visitor voting, idempotence, removal, persistence after restart, public proposal retrieval, input/origin validation, write limits, bounded pagination and escaped HTML. Voting does not assign a timeline phase.
- Browser review at the normal 1422px viewport covered marketplace spacing, filtering, timeline layout, reversible voting, the proposal dialog, lesson navigation and resource detail presentation. The mobile harness checked templates, resources, documentation, tutorials, roadmap and blog at 390px; every measured document had `scrollWidth === clientWidth === 390`. Long blog-cover titles were corrected after visual review. Temporary harness removed from source and output.
- A resource download event was not observable through the in-app browser. Downloads now use ordinary static file links, and the brand-kit URL was verified with HTTP 200 and the expected JSON contents. This is not a claim that the browser’s download UI was observed.
- Docker Compose configuration validated. The local Docker daemon was not running, so container startup/nginx serving was not exercised. The separate service was tested directly; no deployment or push occurred.

Limits: tutorial recordings remain authorized placeholders. Template covers are website illustrations; starter canvases and scene instructions are editable structures, not reviewed finished films. The existing Studio private gate remains in place; real public signup, AI generation and encoded export remain release dependencies. Existing build warnings for legacy demo fonts/phone-mask assets remain; no Kurutu media was copied to resolve them. Core import tests establish state integrity; they do not establish encoded-output parity or completed signup.

## Future design guidance — 1 October 2026

Documentation-only follow-up: added the required implementation workflow, source ownership map, page-pattern guide and reviewer note. AGENTS.md and README link the guide; design-language and review rules now distinguish styling-only reference adoption from the later authorized content-center expansion. Corrected the remaining Gallery terminology in current review rules. All 24 relative links in the five changed guidance documents resolve, source owners were checked against the repository, and the whitespace check passes. No runtime code changed; the build and 62-test evidence above remains the applicable verification.

## Raw brag "Auto" planning mode — 2 October 2026

Templates stopped being forced on every generation. `templateSlug` is optional; the default "Auto" mode sends the planner the project context plus brag's creative discipline (hook → reveal → highlights → close, energy/voice/pacing directives) instead of a rigid template scene map, and the rank scaler (ported from upstream brag constants: intensity 0.45·onset + 0.25·contrast + 0.20·rms + 0.10·bass, threshold 0.45, dedupe gap 0.18 s) attaches beat cues aligned to the composed scene cuts. Templates remain selectable as optional creative direction (research rec: augment, not delete).

Verification:
- Offline stub-provider tests: 4 new tests in `services/brag/auto.test.mjs` (scaler constants/dedupe, boundary beats, Auto payload carries raw direction with no template map, end-to-end HTTP generation without templateSlug → ready job with cues; unknown slug still 404). Full suites: 27 Studio, 23 website, 14 core, 11 service — all pass. No live provider call was made; generation quality claims about the routed model are not asserted from fixtures.
- Payload evidence: `work/t_19d3aa5d/auto-vs-template-payload.json` and `work/t_19d3aa5d/verify-auto.mjs` show the Auto request body carries `{"direction":{...brag tone...}}` while a template request retains the template block.
- Visual proof: `work/t_19d3aa5d/ai-panel-auto-default.png` — Studio AI panel at 1280×577, "Creative direction" select defaults to "Auto · plan from your project"; white surfaces, navy text, no overlap. Live dev servers (creation 9184, Vite 9181) used for the capture.
- Full production build passes (tsc + Vite + 179 prerendered website pages).

Limits: cues are computed from synthesized boundaries (no real audio feature extraction yet — placeholder noted in scaler for when audio analysis lands); no live Gemini generation was run in this change, so improved end-to-end output quality is expected from the restored brag discipline but not yet measured against the provider; existing stored jobs from before this change still carry their template payloads and replay unchanged.
