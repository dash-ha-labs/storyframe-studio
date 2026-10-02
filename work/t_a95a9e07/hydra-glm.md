# Work: t_a95a9e07 — hydra-glm
Initiative: storyframe | Packet: card body (t_a95a9e07) | Brief/plan: board products/storyframe (brief v5, plan v5)
Base revision: 6e0c147 (feat/t_19d3aa5d-raw-brag-mode) | Submitted: branch feat/t_a95a9e07-strip-shape-tones
Serving model: team-glm-hydra (glm) / team-spare-gemini

## Before implementation
User outcome: free-tier video creators get punchy, high-impact video strips when choosing any of Storyframe's 100 catalog templates, restoring the original Brag launch-video quality that was lost when templates flattened into rigid generic scene maps. Position in journey: User selects a template or direction → backend planner composes strip using brag STRIP_SHAPE law (hook → reveal → highlight x1-3 → punchline) and category/template tone directives → high-quality strip applied to project timeline. User-visible / internal boundary: purely internal planner prompt engineering, template metadata schema enrichment (optional `tone` and scene `beat`), and seed tagging; no UI redesign, no new navigation, no settings screens, existing design tokens strictly preserved.

References opened:
- `research/template-degradation.md` (root causes: loss of STRIP_SHAPE, omission of tone/creative directives, loss of template intent/category, rigid scene planning).
- upstream brag source (`free-video-strips/src/tones.js` and `brag.js`).

Contribution boundary: strictly scoped to restoring template creative structure and tone directives; has not been promoted to a new primary feature or expanded user workflow.

## Result
- `services/brag/tones.mjs` (new):
  - Upstream `STRIP_SHAPE` (`["hook", "reveal", "highlight", "punchline"]`) and `STRIP_SHAPE_LAW` constant.
  - `TONE_DIRECTIVE_FIELDS` (`energy`, `voice`, `typography`, `pacing`, `hook`, `highlight`, `outro`, `transitions`).
  - `BASE_TONES`: 12 upstream tones (`default`, `polished`, `app-store`, `yc-parody`, `chaotic`, `deadpan`, `cinematic`, `changelog`, `tutorial`, `social-hype`, `hero-anthem`, `case-study`, `deadpan-log`) ported with original creative directives and intent descriptions.
  - `CATEGORY_TONES`: maps Storyframe's 10 categories to vetted tones (`Launches` -> default, `Product updates` -> changelog, `Feature demos` -> polished, `Free trials` -> app-store, `YouTube` -> tutorial, `Social ads` -> social-hype, `Websites` -> hero-anthem, `Mobile apps` -> app-store, `Education` -> tutorial, `Customer stories` -> case-study).
  - `toneForTemplate()`: resolves template-specific tone override, falls back to category tone, then default.
  - `toneDirectiveBlock()`: formats labeled directives matching upstream `scenePrompt()`.
- `services/brag/planner.mjs`:
  - Enforces `STRIP_SHAPE_LAW` in the `SYSTEM` prompt for both raw and template-guided plans.
  - Template payload now injects `intent`, `category`, and labeled `tone` directives (`energy`, `voice`, `typography`, `pacing`, `hook`, `highlight`, `outro`, `transitions`), while demoting seed scenes to beat guidance (`hook`, `reveal`, `highlight`, `punchline`) rather than rigid scene counts or locked captions.
- `services/brag/catalog.mjs`:
  - `validateTemplate`: round-trips optional `tone` and `scenes[].beat` attributes; rejects invalid values with friendly validation errors; maintains backwards compatibility with existing DB templates lacking tone/beat.
- `packages/catalog/src/index.ts`:
  - Added optional `tone?: string` to `CatalogTemplate` interface and `beat?: string` to scene definitions.
- `packages/catalog/src/seeds.json`:
  - All 100 templates tagged with their category `tone`; all seed scenes tagged with their structural `beat`.
- `services/brag/tones.test.mjs` (new):
  - 6 offline unit and integration tests verifying STRIP_SHAPE constants, seed completeness, tone resolution, Gemini prompt payload parity, and template schema validation.
- `work/t_a95a9e07/`:
  - Verification scripts (`verify-strip.mjs`, `tag-seeds.mjs`), dumped prompt/model payload (`template-path-payload.json`), HTML render document (`strip-proof.html`), individual scene captures (`scene-1-hook.png`, `scene-2-reveal.png`, `scene-3-highlight.png`, `scene-4-punchline.png`), and composite 2x2 storyboard proof (`strip-proof-grid.png`).
- `docs/BRAG-INTEGRATION.md` & `docs/CREATION-API.md`:
  - Updated documentation to reflect template tone resolution, scene beats, and creative prompt payload parity.

## Evidence
| Acceptance criterion | Actual check/artifact | Result |
|---|---|---|
| Read research findings | `research/template-degradation.md` read and all 4 degradation causes addressed | PASS |
| Update template definitions with STRIP_SHAPE | `packages/catalog/src/index.ts`, `seeds.json`, `services/brag/catalog.mjs` | PASS |
| Restore explicit tone directives | `services/brag/tones.mjs` (12 tones, 10 category mappings, labeled directives block) | PASS |
| Pass creative variables to Gemini | `services/brag/planner.mjs` injects `category`, `tone`, and scene beats into model payload | PASS |
| Automated test suite | `node --import tsx --test services/brag/*.test.mjs` (13/13 pass) | PASS |
| Full workspace tests | `npm test` across workspaces (27 studio, 23 website, 14 core, 17 service tests: 81/81 pass) | PASS |
| TypeScript & build | `npm run build` (tsc, Vite client/demo build, 179 prerendered pages) | PASS |
| Visual / rendered proof | Inspected `work/t_a95a9e07/strip-proof-grid.png` via `vision_analyze` verifying 4 sequential beats (Hook, Reveal, Highlight, Punchline) | PASS |

Not run: live paid Gemini generation API call (card constraints specify offline test/stub provider; boundary respected).

## Handoff
Deviations: None. All changes backwards-compatible with existing databases and legacy templates lacking tone/beat.
Remaining risks: None for template data or prompt formatting. Real-world LLM creative variance is governed by Gemini model quality.
Next owner: `argus-nv` (review).
Decision needed from Astra: None.

## Repair log
No previous review findings (first submission of t_a95a9e07).
