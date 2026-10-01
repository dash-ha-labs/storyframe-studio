import type { RoadmapItemData, RoadmapEvidence } from '@storyframe/ui';

export const ROADMAP_EVIDENCE: Record<number, RoadmapEvidence> = {
  1: {
    id: 1,
    product: 'Milanote',
    platform: 'Reddit (r/Milanote)',
    quote: 'Does the team plan at $49 a month include accounts for up to 10 people? ... Everyones pricing [sucks].',
    url: 'https://www.reddit.com/r/Milanote/comments/12juhxc/love_the_app_but_the_pricingplans_kinda_suck/',
  },
  2: {
    id: 2,
    product: 'Milanote',
    platform: 'Reddit (r/Milanote)',
    quote: 'Basic zooming and panning is an endless source of frustration... When I zoom in it follows the cursor, but when I zoom out, it [does not].',
    url: 'https://www.reddit.com/r/Milanote/comments/184j9a7/basic_zooming_and_panning_is_an_endless_source_of/',
  },
  3: {
    id: 3,
    product: 'Milanote',
    platform: 'Reddit (r/Milanote)',
    quote: 'troubles about missing documents. I was taking detailed notes from class [and they disappeared].',
    url: 'https://www.reddit.com/r/Milanote/comments/1jtlnho/missing_documents/',
  },
  4: {
    id: 4,
    product: 'Figjam',
    platform: 'Reddit (r/gsuite)',
    quote: 'I just accidentally deleted an entire page of work and there isn’t an undo button to be found.',
    url: 'https://reddit.com/r/gsuite/comments/16w074d/end_of_jamboard_what_is_the_best_alternative',
  },
  5: {
    id: 5,
    product: 'Figjam / Miro',
    platform: 'Reddit (r/agile)',
    quote: 'tools like Miro/Mural/Figjam... the biggest issue was that they are too broad and allows too much of random play - making team lose focus quickly.',
    url: 'https://reddit.com/r/agile/comments/1p2qn1j/what_is_the_best_retrospective_tool_for_remote',
  },
  6: {
    id: 6,
    product: 'StudioBinder',
    platform: 'Reddit (r/Filmmakers)',
    quote: "It's not bad, but lots of glitches... fine for short films. But not for features.",
    url: 'https://www.reddit.com/r/Filmmakers/comments/vtikrk/studiobinder_is_a_great_software_change_my_mind/',
  },
  7: {
    id: 7,
    product: 'Boords / Storyboarder',
    platform: 'Reddit (r/Filmmakers)',
    quote: "I ran into consistency problems and the outputs weren't always usable in an actual production context.",
    url: 'https://www.reddit.com/r/Filmmakers/comments/1jwyu95/which_ai_image_gen_works_best_for_storyboarding/',
  },
  8: {
    id: 8,
    product: 'Google Flow',
    platform: 'Reddit (r/labsdotgoogle)',
    quote: "Every time I try to use the Agent, I get: 'Something went wrong. Please try again.'",
    url: 'https://www.reddit.com/r/labsdotgoogle/comments/1tm9exu/bug_agent_feature_in_flow_something_went_wrong_on/',
  },
  9: {
    id: 9,
    product: 'Framer',
    platform: 'Reddit (r/framer)',
    quote: 'It has been replaced by Wireframer, a clunky lame AI tool where you have to guess at prompts to produce poor output. The Sections feature was quick and easy... Suddenly... disappeared.',
    url: 'https://www.reddit.com/r/framer/comments/1kv2avk/disastrous_introduction_of_wireframer_feature',
  },
  10: {
    id: 10,
    product: 'Wireframe CC',
    platform: 'Reddit (r/web_design)',
    quote: 'Often when I added text boxes, it would then forget they were there and I could no longer select, edit or delete them.',
    url: 'https://www.reddit.com/r/web_design/comments/1kds95t/am_i_the_only_one_that_dislikes_wireframe_cc',
  },
  11: {
    id: 11,
    product: 'Framer',
    platform: 'Reddit (r/framer)',
    quote: "Having to click 'Fill' then scroll to find the color, then clicking the tiny edit icon for each color is a pain in the ass.",
    url: 'https://www.reddit.com/r/framer/comments/1rw6y6q/is_framer_still_missing_some_basic_features',
  },
};

export const ROADMAP_ITEMS: RoadmapItemData[] = [
  {
    id: 'rm-focus-mode',
    title: 'Structured Focus Mode',
    description: 'Lock down the infinite canvas. Present frames sequentially without the distraction of a messy whiteboard.',
    status: 'shipped',
    evidence: [2, 5],
  },
  {
    id: 'rm-ai-consistency',
    title: 'Character-Consistent AI Generation',
    description: 'AI that remembers your characters across frames, instead of generating random people each time.',
    status: 'in-progress',
    evidence: [7],
  },
  {
    id: 'rm-undo-history',
    title: 'Universal Undo & Version History',
    description: 'Never lose a frame again. Instant undo for board deletions and full document sync history.',
    status: 'planned',
    evidence: [3, 4],
  },
  {
    id: 'rm-manual-override',
    title: 'Drag-and-Drop Manual Override',
    description: "AI shouldn't lock you out. Toggle instantly between prompt generation and classic manual layout.",
    status: 'planned',
    evidence: [8, 9],
  },
  {
    id: 'rm-canvas-nav',
    title: 'Precision Zoom & Select',
    description: 'Predictable canvas navigation with bulletproof element selection—no more lost text boxes.',
    status: 'planned',
    evidence: [10, 11],
  },
];
