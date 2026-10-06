import { test } from 'node:test';
import assert from 'node:assert';
import React from 'react';
import { renderToString } from 'react-dom/server';

import App from '../src/App';
import {
  YouTubeCreatorsPage,
  YOUTUBE_CREATORS_SIGNUP_URL,
  YOUTUBE_CREATORS_CTA_LABEL,
} from '../src/pages/YouTubeCreatorsPage';
import { metadata, staticPaths } from '../src/seo';

test('YouTube creators page renders hero, zig-zag and studio CTA', () => {
  const html = renderToString(React.createElement(YouTubeCreatorsPage));
  assert.ok(html.includes('sf-mkt-hero'), 'hero missing');
  assert.ok(html.includes('sf-mkt-zigzag'), 'feature zig-zag missing');
  assert.ok(html.includes('faceless YouTube videos'), 'value prop missing');
  assert.ok(html.includes('script'), 'script-to-video workflow copy missing');
  assert.ok(html.includes('Consistent visuals'), 'consistency value prop missing');
  assert.ok(html.includes(YOUTUBE_CREATORS_CTA_LABEL), 'CTA label missing');
  assert.ok(html.includes(YOUTUBE_CREATORS_SIGNUP_URL), 'CTA link missing');
  assert.ok(!html.includes('<iframe'), 'marketing page must not mount the live editor');
  assert.ok(html.includes('wire-'), 'visual placeholders missing');
});

test('/youtube-creators route renders the page and is indexed', () => {
  const html = renderToString(React.createElement(App, { initialPath: '/youtube-creators' } as any));
  assert.ok(html.includes('sf-mkt-hero'), 'route not rendering the YouTube creators hero');
  assert.ok(html.includes(YOUTUBE_CREATORS_SIGNUP_URL), 'studio CTA missing on route');
  const meta = metadata('/youtube-creators');
  assert.strictEqual(meta.noindex, undefined);
  assert.ok(staticPaths.includes('/youtube-creators'), '/youtube-creators missing from staticPaths');
});
