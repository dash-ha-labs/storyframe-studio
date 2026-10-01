import { test } from 'node:test';
import assert from 'node:assert';
import React from 'react';
import { renderToString } from 'react-dom/server';

import App from '../src/App';
import { FeaturesPage } from '../src/pages/FeaturesPage';
import { TutorialsPage } from '../src/pages/LearningPages';
import { TemplatesPage } from '../src/pages/TemplatesPage';
import { APP_SIGNUP_URL, GlobalNav } from '@storyframe/ui';

const STUDIO_URL = 'https://studio.storyframe.yamu.app/';

test('APP_SIGNUP_URL points at the real deployed studio', () => {
  assert.strictEqual(APP_SIGNUP_URL, STUDIO_URL);
});

test('Landing renders hero, feature grid and app embed — no nav-card dashboard', () => {
  const html = renderToString(React.createElement(App));
  assert.ok(html.includes('sf-mkt-hero'), 'hero section missing');
  assert.ok(html.includes('sf-mkt-grid'), 'feature grid missing');
  assert.ok(html.includes('app-embed'), 'app embed missing');
  assert.ok(html.includes(STUDIO_URL), 'studio CTA missing');
  assert.ok(!html.includes('Your Product, Everywhere'), 'old dashboard copy still present');
});

test('Features page renders zig-zag layout with alternating rows', () => {
  const html = renderToString(React.createElement(FeaturesPage));
  assert.ok(html.includes('sf-mkt-hero'), 'hero missing');
  assert.ok(html.includes('sf-mkt-zigzag-flip'), 'alternating zig-zag row missing');
  assert.ok(html.includes('sf-mkt-grid'), 'capability grid missing');
  assert.ok(!html.includes('<iframe'), 'secondary pages must not mount the live editor');
  assert.ok(html.includes(STUDIO_URL), 'studio CTA missing');
});

test('Tutorial center links to real course lesson routes', () => {
  const html = renderToString(React.createElement(TutorialsPage));
  assert.ok(html.includes('course-grid'), 'filter tags missing');
  assert.ok(html.includes('/tutorials/your-first-product-video/choose-the-story'), 'showcase cards missing');
  assert.ok(!html.includes('<iframe'), 'secondary pages must not mount the live editor');
  assert.ok(html.includes(STUDIO_URL), 'studio CTA missing');
});

test('Templates page renders categorized grid with CTAs to studio', () => {
  const html = renderToString(React.createElement(TemplatesPage));
  assert.ok(html.includes('content-intro'), 'hero missing');
  assert.ok(html.includes('Product updates'), 'category missing');
  assert.ok(html.includes('catalog-grid'), 'template grid missing');
  assert.ok(!html.includes('<iframe'), 'secondary pages must not mount the live editor');
  assert.ok(html.includes(STUDIO_URL), 'studio CTA missing');
});

test('GlobalNav CTA href is the real studio URL', () => {
  const html = renderToString(React.createElement(GlobalNav, {}));
  assert.ok(html.includes(STUDIO_URL), 'nav CTA must point at studio.storyframe.yamu.app');
  assert.ok(!html.includes('app.storyframe.com'), 'invented domain still present');
});
