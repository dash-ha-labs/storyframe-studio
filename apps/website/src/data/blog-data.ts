import type { BlogPostData } from '@storyframe/ui';

export const BLOG_POSTS: BlogPostData[] = [
  {
    id: 'post-structured-focus-mode',
    slug: 'introducing-structured-focus-mode',
    title: 'Introducing Structured Focus Mode: Beyond the Infinite Canvas Chaos',
    category: 'Product Updates',
    author: 'Storyframe Team',
    date: '2026-09-28',
    readTime: '4 min read',
    excerpt: 'Infinite whiteboards are great for freeform doodles, but terrible for structured video production. Here is how Structured Focus Mode brings sequential clarity to storyboarding.',
    content: `
# Introducing Structured Focus Mode: Beyond the Infinite Canvas Chaos

For years, creative teams have turned to digital whiteboard tools like Miro and Figjam for early concept planning. But as teams move from ideation to video production, infinite whiteboards quickly become an endless swamp of untracked frames, accidental deletions, and messy zoom interactions.

### The Pain of Infinite Canvas
When surveyed, creators consistently highlighted two major friction points:
1. **Whiteboard Clutter:** Without clear frame bounds or sequential structure, stakeholders get lost during pitch reviews.
2. **Accidental Deletions:** In freeform canvas tools, a single misclick or backspace press can delete crucial scenes with no clear recovery history.

### The Solution: Sequential Frame Ordering
Storyframe's **Structured Focus Mode** locks the canvas into an explicit timeline of scenes. Each frame has a defined duration, position, and linked brand assets:
- **Locked Boundaries:** Work frame-by-frame with auto-snapping.
- **Linear Storytelling:** Export directly to preview playback without rearranging boards.
- **Deep Token Integration:** Colors and fonts flow directly from your brand kit into every title and caption.

Try Structured Focus Mode in Storyframe Studio today!
    `.trim(),
  },
  {
    id: 'post-monorepo-tokens',
    slug: 'unified-design-tokens-monorepo',
    title: 'Unified Design Tokens: How We Keep Studio and Website in Lockstep',
    category: 'Engineering',
    author: 'Storyframe Engineering',
    date: '2026-09-15',
    readTime: '6 min read',
    excerpt: 'A deep dive into our npm workspaces monorepo architecture, syncing design tokens across the Storyframe Studio web application and marketing website with zero CSS drift.',
    content: `
# Unified Design Tokens: How We Keep Studio and Website in Lockstep

Design drift is the silent killer of SaaS brand consistency. Marketing sites show beautiful mockups in refreshed color palettes, while the actual web application lags months behind.

### Monorepo Architecture
To eliminate drift completely, Storyframe moved to an npm workspaces monorepo:
- **@storyframe/tokens:** Houses all semantic CSS variables—colors, spacing, typography, and radiuses.
- **@storyframe/ui:** Shared component library providing identical buttons, badges, and layout primitives.
- **@storyframe/studio:** The full video creation workspace.
- **@storyframe/website:** The public marketing and transparency portal.

### Zero Hardcoded Overrides
By enforcing a strict zero-override policy, any update to base tokens automatically cascades to both the web application and all public website modules. Live prototypes embedded on the website render with identical CSS properties as the production studio.
    `.trim(),
  },
  {
    id: 'post-ai-consistency',
    slug: 'character-consistent-ai-storyboarding',
    title: 'Character Consistency in AI Storyboarding: What is Next',
    category: 'Announcements',
    author: 'Storyframe Research',
    date: '2026-10-01',
    readTime: '5 min read',
    excerpt: 'AI image generators are notorious for changing characters faces from frame to frame. Heres our research into deterministic character seeds and persistent storyboard personas.',
    content: `
# Character Consistency in AI Storyboarding: What is Next

One of the top complaints in visual storyboarding tools (like Boords and Storyboarder.ai) is AI hallucination between scenes. A protagonist wearing a yellow jacket in frame one suddenly has brown hair and a blue coat in frame two.

### The Roadmap Commitment
We are actively building **Character-Consistent AI Generation** (Roadmap Item \`rm-ai-consistency\`). Rather than generating isolated images from stateless text prompts, Storyframe ties character embeddings to your storyboard's cast manifest.

Stay tuned for our upcoming private beta release!
    `.trim(),
  },
];
