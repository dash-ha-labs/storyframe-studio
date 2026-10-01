import React from 'react';
import { TemplateDetailTemplate } from '../templates';
import { Card, Button, Badge, ToolIcon } from '@storyframe/ui';

export function TemplatesPage({ onNavigate }: { onNavigate?: (path: string) => void }) {
  const embed = (
    <Card interactive style={{ marginTop: 'var(--sf-space-6)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sf-space-4)', marginBottom: 'var(--sf-space-4)' }}>
        <ToolIcon tool="video" size={32} />
        <div>
          <h3 style={{ margin: '0 0 var(--sf-space-1) 0' }}>Storyboard Template</h3>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--sf-color-text-muted)' }}>Quick start your visual planning.</p>
        </div>
        <Badge variant="shipped" style={{ marginLeft: 'auto' }}>Ready</Badge>
      </div>
      <Button variant="primary" onClick={() => onNavigate?.('/')}>Use Template</Button>
    </Card>
  );

  return (
    <TemplateDetailTemplate onNavigate={onNavigate} embed={embed}>
      <header className="sf-page-header">
        <h1 className="sf-page-title">Templates</h1>
        <p className="sf-page-subtitle">Start faster with pre-built templates.</p>
      </header>
    </TemplateDetailTemplate>
  );
}
