import React from 'react';
import { TemplateDetailTemplate } from '../templates';
import Suite from '@storyframe/studio/src/Suite.tsx';
import {
  Hero,
  AppCta,
  FeatureGrid,
  SectionHeading,
  Card,
  Badge,
  Button,
  APP_SIGNUP_URL,
} from '@storyframe/ui';
import { Presentation, Megaphone, LayoutGrid, Clapperboard } from 'lucide-react';

const TEMPLATE_CATEGORIES: Array<{
  category: string;
  items: Array<{ name: string; format: string }>;
}> = [
  {
    category: 'Explainer Video',
    items: [
      { name: 'Product Walkthrough', format: '16:9 · Web' },
      { name: 'How It Works', format: '16:9 · Web' },
    ],
  },
  {
    category: 'Ad Creative',
    items: [
      { name: 'Launch Teaser', format: '9:16 · Mobile' },
      { name: 'Feature Drop', format: '9:16 · Mobile' },
    ],
  },
  {
    category: 'Storyboard',
    items: [
      { name: 'Pitch Narrative', format: '12 frames' },
      { name: 'Scene Sketch', format: '8 frames' },
    ],
  },
];

export function TemplatesPage({ onNavigate }: { onNavigate?: (path: string) => void }) {
  const embed = (
    <div className="app-embed">
      <Suite />
    </div>
  );

  return (
    <TemplateDetailTemplate onNavigate={onNavigate} embed={embed}>
      <Hero
        eyebrow="Templates"
        title="Start from a proven shape."
        subtitle="Pre-built storyboards for explainers, ads and pitches. Pick one, apply your brand, and you are already halfway to a finished cut."
        primaryCta={{ label: 'Open the template library', href: APP_SIGNUP_URL }}
      />

      {TEMPLATE_CATEGORIES.map(cat => (
        <section key={cat.category}>
          <SectionHeading
            eyebrow={cat.items[0].format}
            title={cat.category}
          />
          <FeatureGrid
            items={cat.items.map(item => ({
              icon:
                cat.category === 'Explainer Video' ? (
                  <Presentation size={18} />
                ) : cat.category === 'Ad Creative' ? (
                  <Megaphone size={18} />
                ) : (
                  <LayoutGrid size={18} />
                ),
              title: item.name,
              description: item.format,
            }))}
          />
        </section>
      ))}

      <Card className="sf-mkt-cta" style={{ padding: 'var(--sf-space-6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sf-space-3)' }}>
          <Clapperboard size={20} color="var(--sf-color-accent)" />
          <h2
            style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: 600,
              color: 'var(--sf-color-text-primary)',
            }}
          >
            Every template opens in the real studio
          </h2>
          <Badge variant="accent" style={{ marginLeft: 'auto' }}>
            Live preview below
          </Badge>
        </div>
        <p
          style={{
            margin: 'var(--sf-space-3) 0',
            fontSize: '14px',
            lineHeight: 1.6,
            color: 'var(--sf-color-text-muted)',
          }}
        >
          The embedded app below is the actual create-flow. Pick a format, and a
          storyboard scaffold appears with your brand already applied.
        </p>
        <div>
          <Button variant="primary" size="lg" href={APP_SIGNUP_URL}>
            Use a template
          </Button>
        </div>
      </Card>

      {embed}

      <AppCta
        title="Skip the blank canvas"
        subtitle="Templates plus your brand equals a first draft in minutes, not days."
      />
    </TemplateDetailTemplate>
  );
}
