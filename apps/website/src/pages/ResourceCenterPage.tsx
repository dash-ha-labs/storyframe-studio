import React from 'react';
import { ResourceHubTemplate } from '../templates';

export function ResourceCenterPage({ onNavigate }: { onNavigate?: (path: string) => void }) {
  return (
    <ResourceHubTemplate onNavigate={onNavigate}>
      <header className="sf-page-header">
        <h1 className="sf-page-title">Resource Center</h1>
        <p className="sf-page-subtitle">Learn how to make the most of Storyframe.</p>
      </header>
    </ResourceHubTemplate>
  );
}