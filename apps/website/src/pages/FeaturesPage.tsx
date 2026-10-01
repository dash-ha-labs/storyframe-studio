import React from 'react';
import { FeatureTemplate } from '../templates';
import Suite from '@storyframe/studio/src/Suite.tsx';
import {
  Hero,
  AppCta,
  FeatureZigzag,
  FeatureGrid,
  SectionHeading,
  APP_SIGNUP_URL,
} from '@storyframe/ui';
import { Link2, Palette, Monitor, Smartphone, Wand2, RefreshCw } from 'lucide-react';

export function FeaturesPage({ onNavigate }: { onNavigate?: (path: string) => void }) {
  const embed = (
    <div className="app-embed">
      <Suite />
    </div>
  );

  return (
    <FeatureTemplate onNavigate={onNavigate} embed={embed}>
      <Hero
        eyebrow="Features"
        title="Everything between brand and final cut."
        subtitle="Storyframe covers the full pipeline: capture a brand, storyboard the story, render the video — without leaving your brand system."
        primaryCta={{ label: 'Start creating free', href: APP_SIGNUP_URL }}
        secondaryCta={{ label: 'Browse templates', href: '/templates' }}
      />

      <SectionHeading
        eyebrow="How it works"
        title="From brand to video in three moves"
        subtitle="Each step feeds the next. Change the brand once and every downstream asset follows."
      />
      <FeatureZigzag
        items={[
          {
            title: 'Brand design that sticks',
            description:
              'Point Storyframe at a URL and it extracts a working brand — colors, fonts, identity. Or define one by hand. The brand travels with every project, storyboard and render.',
            visual: (
              <div style={{ padding: 'var(--sf-space-8)', display: 'grid', placeItems: 'center' }}>
                <Palette size={64} color="var(--sf-color-accent)" />
              </div>
            ),
          },
          {
            flip: true,
            title: 'Storyboards mapped to segments',
            description:
              'Plan shots frame by frame with reorderable frames, per-frame durations and notes. The storyboard is the source of truth for the final video, not a side document.',
            visual: (
              <div style={{ padding: 'var(--sf-space-8)', display: 'grid', placeItems: 'center' }}>
                <Monitor size={64} color="var(--sf-color-accent)" />
              </div>
            ),
          },
          {
            title: 'Render for every platform',
            description:
              'Export web and mobile cuts from the same storyboard. Brand assets are composited at render time, so nothing drifts out of date.',
            visual: (
              <div style={{ padding: 'var(--sf-space-8)', display: 'grid', placeItems: 'center' }}>
                <Smartphone size={64} color="var(--sf-color-accent)" />
              </div>
            ),
          },
        ]}
      />

      <SectionHeading
        eyebrow="Under the hood"
        title="Capabilities professionals expect"
      />
      <FeatureGrid
        items={[
          {
            icon: <Link2 size={18} />,
            title: 'Brand import from URL',
            description: 'Extracts palette, typography and identity from any public site in seconds.',
          },
          {
            icon: <RefreshCw size={18} />,
            title: 'Real-time asset sync',
            description: 'Update a brand once; every storyboard, creation and export reflects it.',
          },
          {
            icon: <Wand2 size={18} />,
            title: 'Assisted creation',
            description: 'Draft copy, structure shots and generate storyboards from a short brief.',
          },
        ]}
      />

      <AppCta
        title="See your brand in the flow"
        subtitle="Open Storyframe Studio — import a brand and storyboard your first video today."
      />
    </FeatureTemplate>
  );
}
