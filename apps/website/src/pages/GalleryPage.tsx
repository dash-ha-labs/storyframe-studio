import React from 'react';
import { GalleryItemTemplate } from '../templates';
import Suite from '@storyframe/studio/src/Suite.tsx';

export function GalleryPage({ onNavigate }: { onNavigate?: (path: string) => void }) {
  const embed = (
    <div style={{ marginTop: 'var(--sf-space-6)', height: '600px', borderRadius: 'var(--sf-radius-lg)', overflow: 'hidden', border: '1px solid var(--sf-color-border)' }}>
      <Suite />
    </div>
  );

  return (
    <GalleryItemTemplate onNavigate={onNavigate} embed={embed}>
      <header className="sf-page-header">
        <h1 className="sf-page-title">Gallery</h1>
        <p className="sf-page-subtitle">See what creators are building.</p>
      </header>
    </GalleryItemTemplate>
  );
}
