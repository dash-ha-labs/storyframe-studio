# Task t_ad42ffb1

**Initiative**: storyframe-website (M3)
**Revision**: 3 (Retry & Review Fixes)

## Approach
- Removed duplicate `@storyframe/studio` dependency in `apps/website/package.json`.
- Updated `FeaturesPage`, `GalleryPage`, and `TemplatesPage` to natively embed the actual product app prototype via `<Suite />` component from `@storyframe/studio/src/Suite.tsx`.
- Replaced the static `<Card>` mocks that violated the product constraint.
- Wrapped `<Suite />` in an unscrollable bounding container for presentation on marketing pages.
- **Review Repairs**: Added missing `ResourceCenterPage.tsx` and `GuidesPage.tsx` to `apps/website/src/pages` and integrated routing into `App.tsx`.
- **Review Repairs**: Fixed `Dockerfile` to serve `/app/apps/website/dist` instead of `/app/apps/web/dist` for website deployment.

## Evidence
- `npm run build` succeeds cleanly, confirming TS extension imports resolve correctly under ESNext settings.
- Real UI component `<Suite />` imported and verified structurally.
- Verified missing pages resolve in routing and tests continue to pass.

## Hand-off
Next owner: Reviewers (`Argus-nv`, `Nemesis-nv`).