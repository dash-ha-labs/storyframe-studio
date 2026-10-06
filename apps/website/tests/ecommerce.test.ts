import { test } from 'node:test';
import assert from 'node:assert';
import React from 'react';
import { renderToString } from 'react-dom/server';

import App from '../src/App';
import { EcommercePage, ECOMMERCE_SIGNUP_URL, ECOMMERCE_CTA_LABEL } from '../src/pages/EcommercePage';

test('Ecommerce page renders hero, zig-zag and signup CTA', () => {
  const html = renderToString(React.createElement(EcommercePage));
  assert.ok(html.includes('sf-mkt-hero'), 'hero missing');
  assert.ok(html.includes('sf-mkt-zigzag'), 'feature zig-zag missing');
  assert.ok(html.includes('Shopify URL'), 'Shopify URL value prop missing');
  assert.ok(html.includes(ECOMMERCE_CTA_LABEL), 'CTA label missing');
  assert.ok(html.includes(ECOMMERCE_SIGNUP_URL), 'CTA link missing');
  assert.ok(!html.includes('<iframe'), 'marketing page must not mount the live editor');
  assert.ok(html.includes('wire-'), 'visual placeholders missing');
});

test('Ecommerce page shows How-it-works steps', () => {
  const html = renderToString(React.createElement(EcommercePage));
  assert.ok(html.includes('How it works'), 'how-it-works heading missing');
  assert.match(html, /Step (<!-- -->)?1/, 'step 1 missing');
  assert.match(html, /Step (<!-- -->)?2/, 'step 2 missing');
  assert.match(html, /Step (<!-- -->)?3/, 'step 3 missing');
  assert.ok(html.includes('Paste your product URL'), 'paste URL step missing');
  assert.ok(html.includes('AI builds your ad'), 'AI step missing');
  assert.ok(html.includes('Edit, brand and publish'), 'publish step missing');
});

test('Ecommerce page shows customer reviews with roles and CTA preserved', () => {
  const html = renderToString(React.createElement(EcommercePage));
  assert.ok(html.includes('Customer reviews'), 'reviews heading missing');
  assert.ok(html.includes('sf-review-stars'), 'review stars missing');
  assert.ok(html.includes('Shopify store owner'), 'reviewer role missing');
  assert.ok(html.includes('Dropshipper'), 'reviewer role missing');
  assert.ok(html.includes('E-commerce marketing manager'), 'reviewer role missing');
  const ctaCount = html.split(ECOMMERCE_SIGNUP_URL).length - 1;
  assert.ok(ctaCount >= 2, 'hero and final CTA links must be preserved');
});

test('/ecommerce route renders the ecommerce page', () => {
  const html = renderToString(React.createElement(App, { initialPath: '/ecommerce' } as any));
  assert.ok(html.includes('sf-mkt-hero'), 'route not rendering ecommerce hero');
  assert.ok(html.includes(ECOMMERCE_SIGNUP_URL), 'studio CTA missing on route');
});
