import React from 'react';
import { GalleryItemTemplate } from '../templates';
import { Card, Button, Badge, ToolIcon } from '@storyframe/ui';

export function GalleryPage({ onNavigate }: { onNavigate?: (path: string) => void }) {
  const embed = (
    <Card interactive style={{ marginTop: 'var(--sf-space-6)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sf-space-4)', marginBottom: 'var(--sf-space-4)' }}>
        <ToolIcon tool="brand" size={32} />
        <div>
          <h3 style={{ margin: '0 0 var(--sf-space-1) 0' }}>Brand Design Showcase</h3>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--sf-color-text-muted)' }}>Created with Storyframe</p>
        </div>
        <Badge variant="accent" style={{ marginLeft: 'auto' }}>Featured</Badge>
      </div>
      <Button variant="secondary" onClick={() => onNavigate?.('/')}>View Project</Button>
    </Card>
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
