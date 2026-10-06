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
  assert.ok(html.includes('wire-'), 'visual placeholders missing');
});

test('/real-estate route renders the page and is indexed', () => {
  const html = renderToString(React.createElement(App, { initialPath: '/real-estate' } as any));
  assert.ok(html.includes('re-hero'), 'route not rendering the real estate hero');
  assert.ok(html.includes('Zillow'), 'Zillow value prop missing on route');
  const meta = metadata('/real-estate');
  assert.strictEqual(meta.noindex, undefined);
  assert.ok(staticPaths.includes('/real-estate'), '/real-estate missing from staticPaths');
});
