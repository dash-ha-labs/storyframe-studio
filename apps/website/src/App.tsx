import React, { useState, useEffect } from 'react';
import { RoadmapPage } from './pages/RoadmapPage';
import { StatusPage } from './pages/StatusPage';
import { BlogIndexPage } from './pages/BlogIndexPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { GalleryPage } from './pages/GalleryPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { ResourceCenterPage } from './pages/ResourceCenterPage';
import { GuidesPage } from './pages/GuidesPage';
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

  if (currentPath === '/features') {
    return <FeaturesPage onNavigate={navigate} />;
  }

  if (currentPath === '/gallery') {
    return <GalleryPage onNavigate={navigate} />;
  }

  if (currentPath === '/templates') {
    return <TemplatesPage onNavigate={navigate} />;
  }

  if (currentPath === '/resources') {
    return <ResourceCenterPage onNavigate={navigate} />;
  }

  if (currentPath === '/guides') {
    return <GuidesPage onNavigate={navigate} />;
  }

  // Home / Overview landing
  return (
    <LandingTemplate onNavigate={navigate}>
      <div style={{ textAlign: 'center', margin: 'var(--sf-space-8) 0 var(--sf-space-8) 0' }}>
        <Badge variant="accent" style={{ marginBottom: 'var(--sf-space-3)' }}>
          Storyframe
        </Badge>
        <h1 className="sf-page-title" style={{ fontSize: '42px', marginBottom: 'var(--sf-space-3)' }}>
          Your Product, Everywhere
        </h1>
        <p className="sf-page-subtitle" style={{ maxWidth: '600px', margin: '0 auto var(--sf-space-6) auto' }}>
          Explore our features, see real creations, and start with templates.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--sf-space-4)' }}>
        <Card interactive onClick={() => navigate('/features')}>
          <h2 style={{ fontSize: '18px', margin: 'var(--sf-space-2) 0', color: 'var(--sf-color-text-primary)' }}>
            Features
          </h2>
          <Button variant="secondary" size="sm" onClick={() => navigate('/features')}>Explore →</Button>
        </Card>

        <Card interactive onClick={() => navigate('/gallery')}>
          <h2 style={{ fontSize: '18px', margin: 'var(--sf-space-2) 0', color: 'var(--sf-color-text-primary)' }}>
            Gallery
          </h2>
          <Button variant="secondary" size="sm" onClick={() => navigate('/gallery')}>View Gallery →</Button>
        </Card>

        <Card interactive onClick={() => navigate('/templates')}>
          <h2 style={{ fontSize: '18px', margin: 'var(--sf-space-2) 0', color: 'var(--sf-color-text-primary)' }}>
            Templates
          </h2>
          <Button variant="secondary" size="sm" onClick={() => navigate('/templates')}>Browse Templates →</Button>
        </Card>
      </div>
    </LandingTemplate>
  );
}

export default App;
