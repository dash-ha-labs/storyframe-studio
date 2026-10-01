import React from 'react';
import { GuideIndexTemplate } from '../templates';

export function GuidesPage({ onNavigate }: { onNavigate?: (path: string) => void }) {
  return (
    <GuideIndexTemplate onNavigate={onNavigate}>
      <header className="sf-page-header">
        <h1 className="sf-page-title">Guides</h1>
        <p className="sf-page-subtitle">Step-by-step tutorials and best practices.</p>
      </header>
    </GuideIndexTemplate>
  );
}