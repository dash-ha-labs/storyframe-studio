import React from 'react';
import { FeatureTemplate } from '../templates';
import { Card, Button, Badge, ToolIcon } from '@storyframe/ui';

export function FeaturesPage({ onNavigate }: { onNavigate?: (path: string) => void }) {
  const embed = (
    <Card interactive style={{ marginTop: 'var(--sf-space-6)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sf-space-4)', marginBottom: 'var(--sf-space-4)' }}>
        <ToolIcon tool="video" size={32} />
        <div>
          <h3 style={{ margin: '0 0 var(--sf-space-1) 0' }}>Video Studio</h3>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--sf-color-text-muted)' }}>Professional video timeline rendering.</p>
        </div>
        <Badge variant="shipped" style={{ marginLeft: 'auto' }}>Active</Badge>
      </div>
      <Button onClick={() => onNavigate?.('/')}>Try Video Studio</Button>
    </Card>
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
