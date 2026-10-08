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
});

test('/real-estate route renders the page and is indexed', () => {
  const html = renderToString(React.createElement(App, { initialPath: '/real-estate' } as any));
  assert.ok(html.includes('re-hero'), 'route not rendering the real estate hero');
  assert.ok(html.includes('Zillow'), 'Zillow value prop missing on route');
  const meta = metadata('/real-estate');
  assert.strictEqual(meta.noindex, undefined);
  assert.ok(staticPaths.includes('/real-estate'), '/real-estate missing from staticPaths');
});
