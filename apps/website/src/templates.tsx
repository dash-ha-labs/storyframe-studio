import React from 'react';
import '@storyframe/tokens/tokens.css';
import {
  GlobalNav,
  GlobalFooter,
  type StatusLevel,
} from '@storyframe/ui';

export { GlobalNav, GlobalFooter };

// Master Templates

export function LandingTemplate({
  children,
  onNavigate,
}: {
  children: React.ReactNode;
  onNavigate?: (path: string) => void;
}) {
  return (
    <div className="sf-page landing-page">
      <GlobalNav onNavigate={onNavigate} />
      <main className="sf-main">{children}</main>
      <GlobalFooter onNavigate={onNavigate} />
    </div>
  );
}

export function FeatureTemplate({
  children,
  embed,
  onNavigate,
}: {
  children: React.ReactNode;
  embed?: React.ReactNode;
  onNavigate?: (path: string) => void;
}) {
  return (
    <div className="sf-page feature-page">
      <GlobalNav activeSection="features" onNavigate={onNavigate} />
      <main className="sf-main">
        {children}
        {embed && <div className="app-embed">{embed}</div>}
      </main>
      <GlobalFooter onNavigate={onNavigate} />
    </div>
  );
}

export function GalleryItemTemplate({
  children,
  embed,
  onNavigate,
}: {
  children: React.ReactNode;
  embed?: React.ReactNode;
  onNavigate?: (path: string) => void;
}) {
  return (
    <div className="sf-page gallery-item-page">
      <GlobalNav activeSection="gallery" onNavigate={onNavigate} />
      <main className="sf-main">
        {children}
        {embed && <div className="app-embed">{embed}</div>}
      </main>
      <GlobalFooter onNavigate={onNavigate} />
    </div>
  );
}

export function ResourceHubTemplate({
  children,
  onNavigate,
}: {
  children: React.ReactNode;
  onNavigate?: (path: string) => void;
}) {
  return (
    <div className="sf-page resource-hub-page">
      <GlobalNav activeSection="resources" onNavigate={onNavigate} />
      <main className="sf-main">{children}</main>
      <GlobalFooter onNavigate={onNavigate} />
    </div>
  );
}

export function GuidePageTemplate({
  children,
  onNavigate,
}: {
  children: React.ReactNode;
  onNavigate?: (path: string) => void;
}) {
  return (
    <div className="sf-page guide-page">
      <GlobalNav activeSection="guides" onNavigate={onNavigate} />
      <main className="sf-main">{children}</main>
      <GlobalFooter onNavigate={onNavigate} />
    </div>
  );
}

export function GuideIndexTemplate({
  children,
  onNavigate,
}: {
  children: React.ReactNode;
  onNavigate?: (path: string) => void;
}) {
  return (
    <div className="sf-page guide-index-page">
      <GlobalNav activeSection="guides" onNavigate={onNavigate} />
      <main className="sf-main">{children}</main>
      <GlobalFooter onNavigate={onNavigate} />
    </div>
  );
}

export function BlogIndexTemplate({
  children,
  header,
  onNavigate,
}: {
  children: React.ReactNode;
  header?: React.ReactNode;
  onNavigate?: (path: string) => void;
}) {
  return (
    <div className="sf-page blog-index-page">
      <GlobalNav activeSection="blog" onNavigate={onNavigate} />
      <main className="sf-main">
        {header && <header className="sf-page-header">{header}</header>}
        <div className="sf-page-content">{children}</div>
      </main>
      <GlobalFooter onNavigate={onNavigate} />
    </div>
  );
}

export function BlogPostTemplate({
  children,
  header,
  onNavigate,
}: {
  children: React.ReactNode;
  header?: React.ReactNode;
  onNavigate?: (path: string) => void;
}) {
  return (
    <div className="sf-page blog-post-page">
      <GlobalNav activeSection="blog" onNavigate={onNavigate} />
      <main className="sf-main">
        {header && <header className="sf-page-header">{header}</header>}
        <article className="sf-page-content">{children}</article>
      </main>
      <GlobalFooter onNavigate={onNavigate} />
    </div>
  );
}

export function RoadmapTemplate({
  children,
  header,
  onNavigate,
}: {
  children: React.ReactNode;
  header?: React.ReactNode;
  onNavigate?: (path: string) => void;
}) {
  return (
    <div className="sf-page roadmap-page">
      <GlobalNav activeSection="roadmap" onNavigate={onNavigate} />
      <main className="sf-main">
        {header && <header className="sf-page-header">{header}</header>}
        <div className="sf-page-content">{children}</div>
      </main>
      <GlobalFooter onNavigate={onNavigate} />
    </div>
  );
}

export function StatusTemplate({
  children,
  header,
  systemStatus,
  systemStatusText,
  onNavigate,
}: {
  children: React.ReactNode;
  header?: React.ReactNode;
  systemStatus?: StatusLevel;
  systemStatusText?: string;
  onNavigate?: (path: string) => void;
}) {
  return (
    <div className="sf-page status-page">
      <GlobalNav activeSection="status" onNavigate={onNavigate} />
      <main className="sf-main">
        {header && <header className="sf-page-header">{header}</header>}
        <div className="sf-page-content">{children}</div>
      </main>
      <GlobalFooter
        systemStatus={systemStatus}
        systemStatusText={systemStatusText}
        onNavigate={onNavigate}
      />
    </div>
  );
}

export function TemplateDetailTemplate({
  children,
  embed,
  onNavigate,
}: {
  children: React.ReactNode;
  embed?: React.ReactNode;
  onNavigate?: (path: string) => void;
}) {
  return (
    <div className="sf-page template-detail-page">
      <GlobalNav activeSection="templates" onNavigate={onNavigate} />
      <main className="sf-main">
        {children}
        {embed && <div className="app-embed">{embed}</div>}
      </main>
      <GlobalFooter onNavigate={onNavigate} />
    </div>
  );
}
