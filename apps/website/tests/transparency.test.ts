import { test } from 'node:test';
import assert from 'node:assert';
import React from 'react';
import { renderToString } from 'react-dom/server';

import { seedIdeas } from '../../../services/community/seed.mjs';
import { SYSTEM_SERVICES, SYSTEM_OVERALL_STATUS, RECENT_INCIDENTS } from '../src/data/status-data';
import { BLOG_POSTS } from '../src/data/blog-data';

import { RoadmapPage } from '../src/pages/RoadmapPage';
import { StatusPage } from '../src/pages/StatusPage';
import { BlogIndexPage } from '../src/pages/BlogIndexPage';
import { BlogPostPage } from '../src/pages/BlogPostPage';
import {
  RoadmapTemplate,
  StatusTemplate,
  BlogIndexTemplate,
  BlogPostTemplate,
  GlobalNav,
  GlobalFooter,
} from '../src/templates';

test('Roadmap plans describe relevant work without invented shipped claims or votes', () => {
  assert.ok(seedIdeas.length >= 6);
  assert.ok(seedIdeas.every(i => i.status !== 'shipped'));
  assert.ok(seedIdeas.some(i => i.phase === 'now'));
  assert.ok(seedIdeas.some(i => i.phase === 'next'));
  assert.ok(seedIdeas.some(i => i.phase === 'later'));
});

test('Status data defines required service health and uptime metrics', () => {
  assert.strictEqual(SYSTEM_OVERALL_STATUS, 'operational');
  assert.ok(SYSTEM_SERVICES.length >= 4);

  const serviceNames = SYSTEM_SERVICES.map(s => s.name);
  assert.ok(serviceNames.includes('Asset Sync Engine'), 'Asset Sync Engine must be tracked');
  assert.ok(serviceNames.includes('Video Rendering Pipeline'), 'Video Rendering Pipeline must be tracked');

  for (const s of SYSTEM_SERVICES) {
    assert.ok(['operational', 'degraded', 'outage'].includes(s.status));
    assert.ok(s.uptimePercent >= 99.0 && s.uptimePercent <= 100.0);
  }

  assert.ok(RECENT_INCIDENTS.length > 0, 'Incident log should not be empty');
});

test('Blog data contains required SaaS content structure and metadata', () => {
  assert.ok(BLOG_POSTS.length >= 3);

  const categories = new Set(BLOG_POSTS.map(p => p.category));
  assert.ok(categories.has('Video craft'), 'Product Updates category must exist');
  assert.ok(categories.has('Brand design'), 'Engineering category must exist');

  for (const post of BLOG_POSTS) {
    assert.ok(post.id);
    assert.ok(post.slug);
    assert.ok(post.title);
    assert.ok(post.excerpt);
    assert.ok(post.author);
    assert.ok(post.date);
    assert.ok(post.readTime);
    assert.ok(post.content);
  }
});

test('Roadmap does not fabricate community activity before the service responds', () => {
  const html = renderToString(React.createElement(RoadmapPage));
  assert.ok(html.includes('Roadmap &amp; ideas'));
  assert.ok(html.includes('Loading the roadmap'));
  assert.ok(!html.includes('Milanote'));
  assert.ok(!html.includes('Structured Focus Mode'));
});

test('StatusPage renders server-side with master StatusTemplate and services', () => {
  const html = renderToString(React.createElement(StatusPage));
  assert.ok(html.includes('System Status'));
  assert.ok(!html.includes('All Systems Operational'), 'synthetic uptime must not be shown as live telemetry');
  assert.ok(html.includes('Asset Sync Engine'));
  assert.ok(html.includes('Video Rendering Pipeline'));
  assert.ok(html.includes('status-page'));
});

test('BlogIndexPage and BlogPostPage render server-side with master templates', () => {
  const indexHtml = renderToString(React.createElement(BlogIndexPage));
  assert.ok(indexHtml.includes('The Storyframe blog'));
  assert.ok(indexHtml.includes('editorial-grid'));
  assert.ok(indexHtml.includes('Plan a product video in three scenes'));

  const postHtml = renderToString(
    React.createElement(BlogPostPage, { slug: 'introducing-structured-focus-mode' })
  );
  assert.ok(postHtml.includes('post-body'));
  assert.ok(postHtml.includes('Plan a product video in three scenes'));
  assert.ok(postHtml.includes('Start with one product action'));
});
