import { test } from 'node:test';
import assert from 'node:assert';
import React from 'react';
import { renderToString } from 'react-dom/server';

import App from '../src/App';
import {
  RealEstatePage,
  REAL_ESTATE_VIDEO_SRC,
  REAL_ESTATE_VIDEO_CREDIT,
} from '../src/pages/RealEstatePage';
import { metadata, staticPaths } from '../src/seo';

test('Real estate page renders video hero and step 1 (URL capture)', () => {
  const html = renderToString(React.createElement(RealEstatePage));
  assert.ok(html.includes('re-hero'), 'video hero missing');
  assert.ok(html.includes(REAL_ESTATE_VIDEO_SRC), 'placeholder video source missing');
  assert.ok(html.includes('re-listing-url'), 'Zillow URL input missing');
  assert.ok(html.includes('Generate tour'), 'step 1 CTA missing');
  assert.ok(!html.includes('re-email'), 'email input must be hidden until step 2');
  assert.ok(html.includes(REAL_ESTATE_VIDEO_CREDIT.split(' · ')[0]), 'stock footage credit missing');
  assert.ok(!html.includes('<iframe'), 'marketing page must not mount the live editor');
});

test('Real estate page renders zig-zag sections', () => {
  const html = renderToString(React.createElement(RealEstatePage));
  assert.ok(html.includes('sf-mkt-zigzag'), 'feature zig-zag missing');
  // Part 1: paste-listing + storyboard show exact Studio UI replicas.
  assert.ok(html.includes('re-replica-paste'), 'paste-listing replica missing');
  assert.ok(html.includes('re-replica-storyboard'), 'storyboard replica missing');
  assert.ok(html.includes('Give your product a home.'), 'paste replica must mirror the real SetupWizard dialog');
  assert.ok(html.includes('Generate'), 'paste replica must show the real Generate button');
  assert.ok(html.includes('Listing captured'), 'paste replica must show the real listing captured confirmation');
  assert.ok(html.includes('STORYBOARD CANVAS'), 'storyboard replica must mirror the real storyboard heading');
  assert.ok(html.includes('frame-canvas-grid'), 'storyboard replica must show the real frame canvas grid');

  // Part 2: AI Scene Gen + Video Editor replicas.
  assert.ok(html.includes('re-replica-generate'), 'AI scene gen replica missing');
  assert.ok(html.includes('re-replica-editor'), 'video editor replica missing');
  assert.ok(html.includes('Create and edit with AI'), 'AI replica must mirror the real AiPanel heading');
  assert.ok(html.includes('Planning your edit...'), 'AI replica must show the real generation loading state');
  assert.ok(html.includes('Applied 4 scenes to timeline'), 'AI replica must show applied status');
  assert.ok(html.includes('AI Generation complete'), 'AI replica must show the completed output badge');
  assert.ok(html.includes('Timeline'), 'video editor replica must show timeline heading');
  assert.ok(html.includes('30 FPS'), 'video editor replica must show FPS ruler label');
  assert.ok(html.includes('replica-playhead'), 'video editor replica must show playhead element');
  assert.ok(!html.includes('wire-'), 'real estate page must not contain abstract wireframe shapes');
});

test('/real-estate route renders the page and is indexed', () => {
  const html = renderToString(React.createElement(App, { initialPath: '/real-estate' } as any));
  assert.ok(html.includes('re-hero'), 'route not rendering the real estate hero');
  assert.ok(html.includes('Zillow'), 'Zillow value prop missing on route');
  const meta = metadata('/real-estate');
  assert.strictEqual(meta.noindex, undefined);
  assert.ok(staticPaths.includes('/real-estate'), '/real-estate missing from staticPaths');
});
