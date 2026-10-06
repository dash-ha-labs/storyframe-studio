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

test('E-commerce flow illustrations replace generic app placeholders', () => {
  const html = renderToString(React.createElement(EcommercePage));
  assert.ok(html.includes('preview-ecommerce-url'), 'Shopify URL illustration missing');
  assert.ok(html.includes('preview-ecommerce-photo'), 'product photo illustration missing');
  assert.ok(html.includes('preview-ecommerce-ai'), 'AI pipeline illustration missing');
  assert.ok(html.includes('preview-ecommerce-publish'), 'vertical ad illustration missing');
  assert.ok(html.includes('my-store.myshopify.com/products/'), 'pasted Shopify product URL not illustrated');
  assert.ok(html.includes('Aurora Desk Lamp'), 'recognized product details not illustrated');
  assert.ok(html.includes('wire-browser'), 'browser chrome missing from URL illustration');
  assert.ok(html.includes('wire-drop'), 'photo dropzone missing');
  assert.ok(html.includes('wire-ai-steps'), 'AI processing steps missing');
  assert.ok(html.includes('Shop now'), 'vertical ad CTA missing');
  assert.ok(html.includes('TikTok · 9:16'), 'vertical ad format label missing');
  assert.ok(!html.includes('Your screenshot'), 'generic app-mockup placeholder copy must not remain');
  assert.ok(!html.includes('preview-mockup'), 'generic phone mockup illustration must not remain on /ecommerce');
});

test('/ecommerce route renders the ecommerce page', () => {
  const html = renderToString(React.createElement(App, { initialPath: '/ecommerce' } as any));
  assert.ok(html.includes('sf-mkt-hero'), 'route not rendering ecommerce hero');
  assert.ok(html.includes(ECOMMERCE_SIGNUP_URL), 'studio CTA missing on route');
});
