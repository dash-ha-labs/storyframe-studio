import React, { useState } from 'react';
import { GalleryItemTemplate } from '../templates';
import Suite from '@storyframe/studio/src/Suite.tsx';
import { Hero, AppCta, SectionHeading, FilterTags, Card, Badge, APP_SIGNUP_URL } from '@storyframe/ui';
import { Clapperboard, LayoutGrid, Megaphone } from 'lucide-react';

const USE_CASES = ['All', 'Marketing Video', 'Storyboard', 'Social Reel'];

const SHOWCASE: Array<{
  title: string;
  creator: string;
  useCase: string;
  tags: string[];
}> = [
  {
    title: 'Q3 Launch Teaser',
    creator: 'Northlight Studio',
    useCase: 'Marketing Video',
    tags: ['16:9 · Web', 'Brand: Northlight'],
  },
  {
    title: 'Onboarding Flow Walkthrough',
    creator: 'Kite Product Team',
    useCase: 'Storyboard',
    tags: ['12 frames', 'Brand: Kite'],
  },
  {
    title: 'Feature Drop Reel',
    creator: 'Marrow Social',
    useCase: 'Social Reel',
    tags: ['9:16 · Mobile', 'Brand: Marrow'],
  },
  {
    title: 'Explainer: Asset Sync',
    creator: 'Northlight Studio',
    useCase: 'Marketing Video',
    tags: ['16:9 · Web', 'Brand: Northlight'],
  },
  {
    title: 'Pitch Storyboard v2',
    creator: 'Fielder Design',
    useCase: 'Storyboard',
    tags: ['8 frames', 'Brand: Fielder'],
  },
  {
    title: 'Launch Countdown Reel',
    creator: 'Kite Product Team',
    useCase: 'Social Reel',
    tags: ['9:16 · Mobile', 'Brand: Kite'],
  },
];

export function GalleryPage({ onNavigate }: { onNavigate?: (path: string) => void }) {
  const [filter, setFilter] = useState('All');
  const visible =
    filter === 'All' ? SHOWCASE : SHOWCASE.filter(item => item.useCase === filter);

  const embed = (
    <div className="app-embed">
      <Suite />
    </div>
  );

  return (
    <GalleryItemTemplate onNavigate={onNavigate} embed={embed}>
      <Hero
        eyebrow="Gallery"
        title="Built with Storyframe, end to end."
        subtitle="Real creations from real teams — every frame rendered from a storyboard with brand assets applied."
      />

      <FilterTags tags={USE_CASES} active={filter} onSelect={setFilter} />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 'var(--sf-space-4)',
          margin: 'var(--sf-space-6) 0',
        }}
      >
        {visible.map(item => (
          <Card key={item.title} className="sf-gallery-card">
            <div className="sf-gallery-art">
              {item.useCase === 'Social Reel' ? (
                <Megaphone size={40} color="var(--sf-color-accent)" />
              ) : item.useCase === 'Storyboard' ? (
                <LayoutGrid size={40} color="var(--sf-color-accent)" />
              ) : (
                <Clapperboard size={40} color="var(--sf-color-accent)" />
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sf-space-2)' }}>
              <Badge variant="accent">{item.useCase}</Badge>
              <h3
                style={{
                  margin: 0,
                  fontSize: '16px',
                  fontWeight: 600,
                  color: 'var(--sf-color-text-primary)',
                }}
              >
                {item.title}
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--sf-color-text-muted)' }}>
                by {item.creator}
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sf-space-2)' }}>
                {item.tags.map(tag => (
                  <span key={tag} className="sf-evidence-chip">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <SectionHeading
        eyebrow="Live product"
        title="Explore the studio behind these creations"
        subtitle="This is the actual Storyframe app. Open the creations and storyboards that produce work like this."
      />
      {embed}

      <AppCta
        title="Your work could be next"
        subtitle="Start from a brand and a blank storyboard — ship your first video today."
      />
    </GalleryItemTemplate>
  );
}
