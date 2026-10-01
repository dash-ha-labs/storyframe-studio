import { test } from 'node:test';
import assert from 'node:assert';
import React from 'react';
import { renderToString } from 'react-dom/server';

import { ROADMAP_ITEMS, ROADMAP_EVIDENCE } from '../src/data/roadmap-data';
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

test('Roadmap data strictly reflects research complaint findings', () => {
  const expectedIds = [
    'rm-focus-mode',
    'rm-ai-consistency',
    'rm-undo-history',
    'rm-manual-override',
    'rm-canvas-nav',
  ];

  assert.strictEqual(ROADMAP_ITEMS.length, 5);
  for (const id of expectedIds) {
    const item = ROADMAP_ITEMS.find(i => i.id === id);
    assert.ok(item, `Missing expected roadmap item ${id}`);
    if (!item) continue;
    assert.ok(['planned', 'in-progress', 'shipped'].includes(item.status));
    assert.ok(item.evidence && item.evidence.length > 0, `Item ${id} must contain complaint evidence`);

    // Verify all cited evidence IDs exist in ROADMAP_EVIDENCE
    for (const refId of item.evidence) {
      assert.ok(ROADMAP_EVIDENCE[refId], `Evidence reference #${refId} must exist`);
      assert.ok(ROADMAP_EVIDENCE[refId].quote.length > 0, `Evidence #${refId} has quote`);
      assert.ok(ROADMAP_EVIDENCE[refId].platform.length > 0, `Evidence #${refId} has platform`);
    }
  }
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
  assert.ok(categories.has('Product Updates'), 'Product Updates category must exist');
  assert.ok(categories.has('Engineering'), 'Engineering category must exist');

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

test('RoadmapPage renders server-side with master RoadmapTemplate and evidence', () => {
  const html = renderToString(React.createElement(RoadmapPage));
  assert.ok(html.includes('Public Product Roadmap'));
  assert.ok(html.includes('Structured Focus Mode'));
  assert.ok(html.includes('Character-Consistent AI Generation'));
  assert.ok(html.includes('Universal Undo &amp; Version History'));
  assert.ok(html.includes('Milanote'));
  assert.ok(html.includes('sf-roadmap-card'));
  assert.ok(html.includes('roadmap-page'));
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
  assert.ok(indexHtml.includes('Storyframe Blog'));
  assert.ok(indexHtml.includes('blog-index-page'));
  assert.ok(indexHtml.includes('Plan a product video in three scenes'));

  const postHtml = renderToString(
    React.createElement(BlogPostPage, { slug: 'introducing-structured-focus-mode' })
  );
  assert.ok(postHtml.includes('blog-post-page'));
  assert.ok(postHtml.includes('Plan a product video in three scenes'));
  assert.ok(postHtml.includes('Start with one product action'));
});
