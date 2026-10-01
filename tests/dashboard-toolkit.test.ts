import assert from 'node:assert/strict';
import React from 'react';
import rds from 'react-dom/server';

const store = new Map<string, string>();
(globalThis as any).localStorage = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => store.set(k, v),
  removeItem: (k: string) => store.delete(k),
};

import Suite from '../src/Suite.tsx';

const html = rds.renderToString(React.createElement(Suite));

assert.ok(html.includes('Your creative toolkit'), 'Has creative toolkit section');
assert.ok(html.includes('Video studio'), 'Has Video studio card');
assert.ok(html.includes('Brand assets'), 'Has Brand assets card');
assert.ok(!html.includes('Logo studio'), 'No Logo studio card');
assert.ok(!html.includes('Marketing studio'), 'No Marketing studio card');
assert.ok(!html.includes('Landing pages'), 'No Landing pages card');
assert.ok(!html.includes('ASO copy'), 'No ASO copy card');
assert.ok(!html.includes('Keywords'), 'No Keywords card');
assert.ok(html.includes('Storyboard'), 'Sidebar has Storyboard toggle');
console.log('ALL DASHBOARD TOOLKIT CHECKS PASSED');
