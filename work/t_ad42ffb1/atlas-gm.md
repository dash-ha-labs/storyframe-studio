# Task t_ad42ffb1

**Initiative**: storyframe-website (M3)
**Revision**: 2 (Retry)

## Approach
- Removed duplicate `@storyframe/studio` dependency in `apps/website/package.json`.
- Updated `FeaturesPage`, `GalleryPage`, and `TemplatesPage` to natively embed the actual product app prototype via `<Suite />` component from `@storyframe/studio/src/Suite.tsx`.
- Replaced the static `<Card>` mocks that violated the product constraint.
- Wrapped `<Suite />` in an unscrollable bounding container for presentation on marketing pages.

## Evidence
- `npm run build` succeeds cleanly, confirming TS extension imports resolve correctly under ESNext settings.
- Real UI component `<Suite />` imported and verified structurally.

## Hand-off
Next owner: Reviewers (`Argus-nv`, `Nemesis-nv`).