import { test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { sampleVideo, sampleWorkspace } from '../src/demo/fixture';
import { validateProject, splitScene, totalFrames } from '@storyframe/studio/src/model.ts';
import { validSuite } from '@storyframe/studio/src/suite-model.ts';
import Suite from '@storyframe/studio/src/Suite.tsx';
import { useSessionMedia, storeMedia, readMedia } from '@storyframe/studio/src/storage.ts';
import { HomePage } from '../src/HomePage';
import { FeaturesPage } from '../src/pages/FeaturesPage';
import { GalleryPage } from '../src/pages/GalleryPage';
import { TemplatesPage } from '../src/pages/TemplatesPage';

test('sample is a valid ordinary project and uses the actual reversible model', () => {
 assert.ok(validSuite(sampleWorkspace));
 assert.ok(validateProject(sampleVideo));
 const split = splitScene(sampleVideo, sampleVideo.scenes[0].id, 60, 'sample-cut');
 assert.equal(split.scenes.length, 4);
 assert.equal(totalFrames(split), totalFrames(sampleVideo));
 assert.equal(sampleVideo.scenes.length, 3);
});

test('sample initialization never reads an existing personal workspace', () => {
 let reads = 0;
 Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
  getItem() { reads++; throw new Error('Private workspace must not be read'); },
 }});
 try {
  const html = renderToString(React.createElement(Suite, {initialState:sampleWorkspace,persist:false}));
  assert.equal(reads, 0);
  assert.ok(html.includes('Your product'));
  assert.ok(!html.includes('Kurutu'));
 } finally { Reflect.deleteProperty(globalThis, 'localStorage'); }
});

test('session media can be imported and read without opening the real IndexedDB store', async () => {
 useSessionMedia();
 const original = new Blob(['sample-only'], {type:'text/plain'});
 await storeMedia('sample', original);
 assert.equal(await readMedia('sample'), original);
 useSessionMedia(); // reload/reset semantics discard only this disposable sample session
 assert.equal(await readMedia('sample'), undefined);
});

test('only the homepage mounts the isolated app; secondary pages contain no live editor', () => {
 for (const Component of [HomePage, FeaturesPage, GalleryPage, TemplatesPage]) {
  const html = renderToString(React.createElement(Component, {onNavigate:()=>{}}));
  assert.equal((html.match(/<iframe/g)||[]).length, Component===HomePage ? 1 : 0);
  if (Component===HomePage) assert.ok(html.includes('/demo.html'));
  assert.ok(!html.includes('class="suite-shell"'));
  assert.ok(!html.includes('Every button below works'));
 }
});
