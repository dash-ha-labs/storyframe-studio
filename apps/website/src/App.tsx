import React, { useState, useEffect } from 'react';
import { RoadmapPage } from './pages/RoadmapPage';
import { StatusPage } from './pages/StatusPage';
import { BlogIndexPage } from './pages/BlogIndexPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { LandingTemplate } from './templates';
import { Card, Button, Badge } from '@storyframe/ui';

export function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return typeof window !== 'undefined' ? window.location.pathname : '/';
  });

  useEffect(() => {
    const onPopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
  };

  // Route matching
  if (currentPath === '/roadmap') {
    return <RoadmapPage onNavigate={navigate} />;
  }

  if (currentPath === '/status') {
    return <StatusPage onNavigate={navigate} />;
  }

  if (currentPath === '/blog' || currentPath === '/blog/') {
    return (
      <BlogIndexPage
        onSelectPost={slug => navigate(`/blog/${slug}`)}
        onNavigate={navigate}
      />
    );
  }

  if (currentPath.startsWith('/blog/')) {
    const slug = currentPath.replace('/blog/', '').replace(/\/$/, '');
    return <BlogPostPage slug={slug} onNavigate={navigate} />;
  }

  // Home / Overview landing
  return (
    <LandingTemplate onNavigate={navigate}>
      <div style={{ textAlign: 'center', margin: 'var(--sf-space-8) 0 var(--sf-space-8) 0' }}>
        <Badge variant="accent" style={{ marginBottom: 'var(--sf-space-3)' }}>
          Storyframe Transparency
        </Badge>
        <h1 className="sf-page-title" style={{ fontSize: '42px', marginBottom: 'var(--sf-space-3)' }}>
          Public Modules & Product Truth
        </h1>
        <p className="sf-page-subtitle" style={{ maxWidth: '600px', margin: '0 auto var(--sf-space-6) auto' }}>
          Explore our public product updates, user-backed roadmap, and real-time service operations.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--sf-space-4)' }}>
        <Card interactive onClick={() => navigate('/blog')}>
          <Badge variant="accent" style={{ marginBottom: 'var(--sf-space-2)' }}>Blog</Badge>
          <h2 style={{ fontSize: '18px', margin: 'var(--sf-space-2) 0', color: 'var(--sf-color-text-primary)' }}>
            Product Updates & Engineering
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--sf-color-text-muted)', margin: '0 0 var(--sf-space-4) 0' }}>
            Latest feature drops, technical deep-dives into our monorepo token architecture, and announcements.
          </p>
          <Button variant="secondary" size="sm" onClick={() => navigate('/blog')}>
            Read the Blog →
          </Button>
        </Card>

        <Card interactive onClick={() => navigate('/roadmap')}>
          <Badge variant="warning" style={{ marginBottom: 'var(--sf-space-2)' }}>Roadmap</Badge>
          <h2 style={{ fontSize: '18px', margin: 'var(--sf-space-2) 0', color: 'var(--sf-color-text-primary)' }}>
            Public Product Roadmap
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--sf-color-text-muted)', margin: '0 0 var(--sf-space-4) 0' }}>
            Evidence-backed priorities driven directly by creator feedback and competitive analysis.
          </p>
          <Button variant="secondary" size="sm" onClick={() => navigate('/roadmap')}>
            View Roadmap →
          </Button>
        </Card>

        <Card interactive onClick={() => navigate('/status')}>
          <Badge variant="shipped" style={{ marginBottom: 'var(--sf-space-2)' }}>Status</Badge>
          <h2 style={{ fontSize: '18px', margin: 'var(--sf-space-2) 0', color: 'var(--sf-color-text-primary)' }}>
            Live System Health
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--sf-color-text-muted)', margin: '0 0 var(--sf-space-4) 0' }}>
            Real-time status of Asset Sync Engine, Video Rendering Pipeline, and Studio infrastructure.
          </p>
          <Button variant="secondary" size="sm" onClick={() => navigate('/status')}>
            Check Status →
          </Button>
        </Card>
      </div>
    </LandingTemplate>
  );
}

export default App;
