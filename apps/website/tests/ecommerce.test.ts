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

test('Paste-URL step shows the auto-playing flow demo', () => {
  const html = renderToString(React.createElement(EcommercePage));
  assert.ok(html.includes('sf-eco-flow'), 'flow demo missing');
  assert.match(html, /my-store\.myshopify\.com/, 'Shopify URL demo value missing');
  assert.match(html, /Product found/, 'product-detected stage missing');
  assert.match(html, /Creating your ad/, 'generating stage missing');
  assert.match(html, /Shop now/, 'finished-ad CTA missing');
  assert.match(html, /aria-label="Animated demo: /, 'accessible description missing');
});

test('/ecommerce route renders the ecommerce page', () => {
  const html = renderToString(React.createElement(App, { initialPath: '/ecommerce' } as any));
  assert.ok(html.includes('sf-mkt-hero'), 'route not rendering ecommerce hero');
  assert.ok(html.includes(ECOMMERCE_SIGNUP_URL), 'studio CTA missing on route');
});
