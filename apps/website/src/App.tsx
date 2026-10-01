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
import { HomePage } from './HomePage';
import { LegalPage } from './pages/LegalPage';

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
    window.scrollTo(0, 0);
  };

  if (currentPath === '/legal') return <LegalPage onNavigate={navigate} />;

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

  return <HomePage onNavigate={navigate} />;
}

export default App;
