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
import Suite from '@storyframe/studio/src/Suite.tsx';
import {
  Hero,
  AppCta,
  FeatureGrid,
  SectionHeading,
  APP_SIGNUP_URL,
} from '@storyframe/ui';
import { Clapperboard, Palette, LayoutGrid } from 'lucide-react';

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

  // Home / Landing: value prop, proof, conversion.
  return (
    <LandingTemplate onNavigate={navigate}>
      <Hero
        eyebrow="Storyframe Studio"
        title="Brand-consistent video, every frame."
        subtitle="Storyframe keeps your brand assets inside the editing flow — storyboards, brand design, and video studio working from one source of truth."
        primaryCta={{ label: 'Start creating free', href: APP_SIGNUP_URL }}
        secondaryCta={{ label: 'See it in action', href: '/features' }}
      />

      <SectionHeading
        eyebrow="Why Storyframe"
        title="Everything your brand needs to ship video"
        subtitle="One workspace for the whole pipeline — no more copy-pasting hex codes or hunting for the latest logo."
      />
      <FeatureGrid
        items={[
          {
            icon: <Palette size={18} />,
            title: 'Brand Design',
            description:
              'Import a brand from a URL or define one by hand. Colors, fonts and identity stay attached to every project.',
          },
          {
            icon: <LayoutGrid size={18} />,
            title: 'Storyboards',
            description:
              'Plan shots frame by frame with reorderable frames, durations and notes — all mapped to final video segments.',
          },
          {
            icon: <Clapperboard size={18} />,
            title: 'Video Studio',
            description:
              'Turn storyboards into finished cuts for web and mobile formats, rendered from your storyboard state.',
          },
        ]}
      />

      <SectionHeading
        eyebrow="Live product"
        title="The real studio, right here"
        subtitle="This is the actual Storyframe app — not a screenshot. Every button below works."
      />
      <div className="app-embed">
        <Suite />
      </div>

      <AppCta
        title="Ready to make your first branded video?"
        subtitle="Open Storyframe Studio and go from brand to storyboard to finished video in one sitting."
      />
    </LandingTemplate>
  );
}

export default App;
