# Research: Video Template Degradation in Storyframe Studio

## Background
The current implementation of video templates in Storyframe Studio (`services/brag/planner.mjs` and `packages/catalog/src/seeds.json`) degrades the quality of generated video storyboards compared to the original Brag source in `dash-ha-labs/free-video-strips`.

## Findings: Why the Output Degrades

1. **Loss of Strict Creative Structure (`STRIP_SHAPE`)**
   - **Original:** `brag.js` strictly enforced a proven 4-part scene structure: `hook`, `reveal`, `highlight` (repeat 1-3 times), and `punchline`. The LLM was explicitly instructed to format the storyboard according to these sequence rules, ensuring high-impact storytelling pacing.
   - **Current:** The new `planner.mjs` abandons this proven structure. Instead, it relies on generic scene instructions injected from `seeds.json` (e.g., "The opening: Introduce a new workspace"). This is too vague and results in generic, unopinionated outputs rather than punchy launch videos.

2. **Omission of Tone & Creative Directives**
   - **Original:** `scenePrompt()` passed highly specific stylistic directives for each template:
     - `Energy` (e.g., "Punchy, UI-focused, direct.")
     - `Voice` (e.g., "Direct, feature-focused...")
     - `Typography`
     - `Pacing`
     - Detailed styles for `hook`, `highlight`, `outro`, and `transitions`.
   - **Current:** `planner.mjs` replaces all of this rich creative context with a bland default prompt: `"Respect the user's freeform creative direction instead of forcing humor or launch copy."` The LLM is given no clear creative guardrails for pacing, voice, or energy, leading to flat and corporate copy.

3. **Loss of Template Intent and Context**
   - **Original:** Templates had a clear `intent` and `category` passed to Gemini (e.g., `Template Intent: Step-by-step education and storyboard progression. (Guides / Resource Hub)`).
   - **Current:** The LLM only receives a brief `description` from the database seed (e.g., `"Introduce a new workspace. Show the first useful result in your dashboard."`), completely missing the broader thematic context of *why* the video is being made.

4. **Rigid Scene Planning vs. Dynamic Generation**
   - **Original:** The LLM was free to compose the timeline (decide how many highlights to include within the 15-25s budget based on the project summary).
   - **Current:** The LLM is forced to follow a rigidly mapped sequence of 1 to 12 instructions from the JSON seed, which restricts its ability to organically adapt the storyboard pacing to the product's actual features.

## Recommendations for Fixes
1. **Reintroduce `STRIP_SHAPE` logic:** Update `planner.mjs` to incorporate the "hook -> reveal -> highlight -> punchline" mental model into the `SYSTEM` prompt, even if mapping to the JSON seeds.
2. **Enrich Template Seeds with Creative Directives:** Extend the schema in `seeds.json` and the template interface to include `energy`, `voice`, `pacing`, and `intent`. 
3. **Pass Creative Variables to Gemini:** Update `planVideo` in `planner.mjs` to inject these creative variables into the system or user prompt, mirroring the original `scenePrompt()` from `brag.js`.
4. **Do Not Delete Existing Templates:** Modify the prompt generation logic to augment the existing `seeds.json` data rather than removing the new template architecture entirely.
