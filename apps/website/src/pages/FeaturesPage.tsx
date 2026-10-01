import React from 'react';
import { FeatureTemplate } from '../templates';
import Suite from '@storyframe/studio/src/Suite.tsx';

export function FeaturesPage({ onNavigate }: { onNavigate?: (path: string) => void }) {
  const embed = (
    <div style={{ marginTop: 'var(--sf-space-6)', height: '600px', borderRadius: 'var(--sf-radius-lg)', overflow: 'hidden', border: '1px solid var(--sf-color-border)' }}>
      <Suite />
    </div>
  );

  return (
    <FeatureTemplate onNavigate={onNavigate} embed={embed}>
      <header className="sf-page-header">
        <h1 className="sf-page-title">Features</h1>
        <p className="sf-page-subtitle">Built for professionals.</p>
      </header>
    </FeatureTemplate>
  );
}
