import React from 'react';
import { TemplateDetailTemplate } from '../templates';
import Suite from '@storyframe/studio/src/Suite.tsx';

export function TemplatesPage({ onNavigate }: { onNavigate?: (path: string) => void }) {
  const embed = (
    <div style={{ marginTop: 'var(--sf-space-6)', height: '600px', borderRadius: 'var(--sf-radius-lg)', overflow: 'hidden', border: '1px solid var(--sf-color-border)' }}>
      <Suite />
    </div>
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
