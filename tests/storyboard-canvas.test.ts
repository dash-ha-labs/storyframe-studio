import {test} from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import rds from 'react-dom/server';
import StoryboardWorkspace from '../src/Storyboard';
import {Storyboard, Frame, newStoryboard, blankFrame, validSuite, seedSuite} from '../src/suite-model';

test('StoryboardWorkspace renders empty state when no frames exist', () => {
  const sb = newStoryboard('Intro video concept');
  let current = sb;
  const html = rds.renderToString(
    React.createElement(StoryboardWorkspace, {
      storyboard: current,
      onChange: next => { current = next; },
      onBack: () => {},
    })
  );

  assert.ok(html.includes('Intro video concept'), 'Renders storyboard title');
  assert.ok(html.includes('0 frames'), 'Shows 0 frames count');
  assert.ok(html.includes('0.0s total duration'), 'Shows 0s duration');
  assert.ok(html.includes('No frames in this storyboard'), 'Shows empty frame prompt');
  assert.ok(html.includes('Add first frame'), 'Has add first frame button');
});

test('StoryboardWorkspace renders sequential frames with placeholders, text, and duration in seconds', () => {
  const sb: Storyboard = {
    id: 'sb-1',
    title: 'Product Walkthrough',
    createdAt: new Date().toISOString(),
    frames: [
      {id: 'f-1', order: 0, text: 'Opening logo and value prop', imageUrl: '', durationSeconds: 3.5},
      {id: 'f-2', order: 1, text: 'Demo of core dashboard', imageUrl: 'https://example.com/demo.png', durationSeconds: 5},
    ],
  };

  const html = rds.renderToString(
    React.createElement(StoryboardWorkspace, {
      storyboard: sb,
      onChange: () => {},
      onBack: () => {},
    })
  );

  assert.ok(html.includes('Product Walkthrough'), 'Renders title');
  assert.ok(html.includes('2 frames'), 'Shows frame count');
  assert.ok(html.includes('8.5s total duration'), 'Calculates and shows 8.5s total duration');
  assert.ok(html.includes('Frame 1'), 'Shows Frame 1 badge');
  assert.ok(html.includes('Frame 2'), 'Shows Frame 2 badge');
  assert.ok(html.includes('Low-fi visual placeholder'), 'Shows visual placeholder for frame 1');
  assert.ok(html.includes('https://example.com/demo.png'), 'Shows image for frame 2');
  assert.ok(html.includes('Opening logo and value prop'), 'Shows frame 1 script text');
  assert.ok(html.includes('Demo of core dashboard'), 'Shows frame 2 script text');
  assert.ok(html.includes('Duration (seconds)'), 'Explicitly indicates duration in seconds');
  assert.ok(html.includes('value="3.5"'), 'Shows frame 1 duration value 3.5');
  assert.ok(html.includes('value="5"'), 'Shows frame 2 duration value 5');
});

test('Frame CRUD operations: add, edit text/duration, and delete with validSuite integrity', () => {
  const suite = seedSuite();
  let sb = newStoryboard('Feature Explainer');
  let currentSuite = {...suite, storyboards: [sb, ...suite.storyboards]};
  assert.ok(validSuite(currentSuite), 'Initial suite with empty storyboard is valid');

  // 1. ADD FRAME
  const f0 = blankFrame(sb.frames.length);
  sb = {...sb, frames: [...sb.frames, f0]};
  currentSuite = {...currentSuite, storyboards: [sb]};
  assert.equal(sb.frames.length, 1);
  assert.equal(sb.frames[0].order, 0);
  assert.equal(sb.frames[0].durationSeconds, 4);
  assert.ok(validSuite(currentSuite), 'Suite valid after adding frame');

  // Add second frame
  const f1 = blankFrame(sb.frames.length);
  sb = {...sb, frames: [...sb.frames, f1]};
  currentSuite = {...currentSuite, storyboards: [sb]};
  assert.equal(sb.frames.length, 2);
  assert.equal(sb.frames[1].order, 1);
  assert.ok(validSuite(currentSuite), 'Suite valid after adding second frame');

  // 2. EDIT FRAME TEXT AND DURATION
  sb = {
    ...sb,
    frames: sb.frames.map(f =>
      f.id === f0.id
        ? {...f, text: 'Updated intro script', durationSeconds: 2.5, imageUrl: 'https://example.com/frame0.jpg'}
        : f
    ),
  };
  currentSuite = {...currentSuite, storyboards: [sb]};
  assert.equal(sb.frames[0].text, 'Updated intro script');
  assert.equal(sb.frames[0].durationSeconds, 2.5);
  assert.equal(sb.frames[0].imageUrl, 'https://example.com/frame0.jpg');
  assert.ok(validSuite(currentSuite), 'Suite valid after updating frame text and duration');

  // 3. DELETE FRAME and verify order re-indexing
  const remaining = sb.frames.filter(f => f.id !== f0.id);
  const reindexed = remaining.map((f, idx) => ({...f, order: idx}));
  sb = {...sb, frames: reindexed};
  currentSuite = {...currentSuite, storyboards: [sb]};
  assert.equal(sb.frames.length, 1);
  assert.equal(sb.frames[0].id, f1.id);
  assert.equal(sb.frames[0].order, 0, 'Remaining frame order normalized to 0');
  assert.ok(validSuite(currentSuite), 'Suite valid after deleting frame');
});

test('Frame reorder operations update order indices sequentially', () => {
  const f0: Frame = {id: 'f-0', order: 0, text: 'First frame', imageUrl: '', durationSeconds: 2};
  const f1: Frame = {id: 'f-1', order: 1, text: 'Second frame', imageUrl: '', durationSeconds: 3};
  const f2: Frame = {id: 'f-2', order: 2, text: 'Third frame', imageUrl: '', durationSeconds: 4};

  let sb: Storyboard = {
    id: 'sb-reorder',
    title: 'Reorder Test',
    createdAt: new Date().toISOString(),
    frames: [f0, f1, f2],
  };

  // Move frame at index 0 later (swap index 0 and 1)
  function moveFrame(frames: Frame[], index: number, direction: -1 | 1): Frame[] {
    const target = index + direction;
    if (target < 0 || target >= frames.length) return frames;
    const next = [...frames];
    const temp = next[index];
    next[index] = next[target];
    next[target] = temp;
    return next.map((f, idx) => ({...f, order: idx}));
  }

  // Move f0 later: new sequence should be [f1, f0, f2]
  sb = {...sb, frames: moveFrame(sb.frames, 0, 1)};
  assert.equal(sb.frames[0].id, 'f-1');
  assert.equal(sb.frames[0].order, 0);
  assert.equal(sb.frames[1].id, 'f-0');
  assert.equal(sb.frames[1].order, 1);
  assert.equal(sb.frames[2].id, 'f-2');
  assert.equal(sb.frames[2].order, 2);

  // Move f2 earlier: new sequence should be [f1, f2, f0]
  sb = {...sb, frames: moveFrame(sb.frames, 2, -1)};
  assert.equal(sb.frames[0].id, 'f-1');
  assert.equal(sb.frames[0].order, 0);
  assert.equal(sb.frames[1].id, 'f-2');
  assert.equal(sb.frames[1].order, 1);
  assert.equal(sb.frames[2].id, 'f-0');
  assert.equal(sb.frames[2].order, 2);

  // Verify suite validator passes on reordered storyboard
  const suite = seedSuite();
  assert.ok(validSuite({...suite, storyboards: [sb]}), 'Suite valid after reorder');
});

test('Interactive simulated UI workflow: add -> edit -> reorder -> delete with full render verification', () => {
  let sb = newStoryboard('Interactive Demo Storyboard');

  // Step 1: Render initially empty canvas
  let html = rds.renderToString(
    React.createElement(StoryboardWorkspace, {
      storyboard: sb,
      onChange: next => { sb = next; },
      onBack: () => {},
    })
  );
  assert.ok(html.includes('No frames in this storyboard'));
  assert.ok(html.includes('0 frames'));
  assert.ok(html.includes('0.0s total duration'));

  // Step 2: Add Frame 1
  const f1 = blankFrame(sb.frames.length);
  sb = {...sb, frames: [...sb.frames, f1]};
  html = rds.renderToString(
    React.createElement(StoryboardWorkspace, {
      storyboard: sb,
      onChange: next => { sb = next; },
      onBack: () => {},
    })
  );
  assert.ok(html.includes('1 frame'));
  assert.ok(html.includes('4.0s total duration'));
  assert.ok(html.includes('Frame 1'));
  assert.ok(html.includes('Order #0'));
  assert.ok(html.includes('Low-fi visual placeholder'));

  // Step 3: Add Frame 2
  const f2 = blankFrame(sb.frames.length);
  sb = {...sb, frames: [...sb.frames, f2]};
  html = rds.renderToString(
    React.createElement(StoryboardWorkspace, {
      storyboard: sb,
      onChange: next => { sb = next; },
      onBack: () => {},
    })
  );
  assert.ok(html.includes('2 frames'));
  assert.ok(html.includes('8.0s total duration'));
  assert.ok(html.includes('Frame 2'));
  assert.ok(html.includes('Order #1'));

  // Step 4: Edit Frame 1 (text = "Scene 1: Hook the viewer", duration = 3.0, mock image)
  sb = {
    ...sb,
    frames: sb.frames.map(f =>
      f.id === f1.id
        ? {...f, text: 'Scene 1: Hook the viewer', durationSeconds: 3, imageUrl: 'https://example.com/hook.png'}
        : f
    ),
  };
  html = rds.renderToString(
    React.createElement(StoryboardWorkspace, {
      storyboard: sb,
      onChange: next => { sb = next; },
      onBack: () => {},
    })
  );
  assert.ok(html.includes('Scene 1: Hook the viewer'));
  assert.ok(html.includes('7.0s total duration'));
  assert.ok(html.includes('https://example.com/hook.png'));

  // Step 5: Reorder: Move Frame 2 earlier (index 1 -> index 0)
  const swapped = [sb.frames[1], sb.frames[0]].map((f, i) => ({...f, order: i}));
  sb = {...sb, frames: swapped};
  html = rds.renderToString(
    React.createElement(StoryboardWorkspace, {
      storyboard: sb,
      onChange: next => { sb = next; },
      onBack: () => {},
    })
  );
  // Now Frame 1 has order 0 and id f2 (unnamed text), Frame 2 has order 1 and text "Scene 1: Hook the viewer"
  assert.equal(sb.frames[0].id, f2.id);
  assert.equal(sb.frames[0].order, 0);
  assert.equal(sb.frames[1].id, f1.id);
  assert.equal(sb.frames[1].order, 1);

  // Step 6: Delete Frame 2 (the hooked frame now at index 1)
  sb = {
    ...sb,
    frames: sb.frames.filter(f => f.id !== f1.id).map((f, i) => ({...f, order: i})),
  };
  html = rds.renderToString(
    React.createElement(StoryboardWorkspace, {
      storyboard: sb,
      onChange: next => { sb = next; },
      onBack: () => {},
    })
  );
  assert.ok(html.includes('1 frame'));
  assert.ok(!html.includes('Scene 1: Hook the viewer'));
  assert.equal(sb.frames.length, 1);
  assert.equal(sb.frames[0].id, f2.id);
  assert.equal(sb.frames[0].order, 0);

  // Step 7: Verify final suite validity
  const suite = seedSuite();
  assert.ok(validSuite({...suite, storyboards: [sb]}));
});


test('StoryboardWorkspace shows linked projects and attach/detach actions', () => {
  const sb = newStoryboard('Launch plan');
  const projects = [
    {id: 'p1', name: 'Kurutu', storyboardId: sb.id},
    {id: 'p2', name: 'Acme'},
  ];
  let attachedId = '';
  let detachedId = '';
  const html = rds.renderToString(
    React.createElement(StoryboardWorkspace, {
      storyboard: sb,
      onChange: () => {},
      onBack: () => {},
      projects,
      onAttach: (id: string) => { attachedId = id; },
      onDetach: (id: string) => { detachedId = id; },
      onOpenProject: () => {},
    })
  );
  assert.ok(html.includes('Linked projects'));
  assert.ok(html.replace(/<!-- -->/g, '').includes('1 of 2 projects use this storyboard'));
  assert.ok(html.includes('Kurutu'));
  assert.ok(html.includes('Attached'));
  assert.ok(html.includes('Acme'));
  // props flow is wired; buttons render per project row
  assert.ok(html.includes('Open project'));
  assert.ok(html.includes('Detach'));
  assert.ok(html.includes('Attach'));
});

test('StoryboardWorkspace without projects hides the links section', () => {
  const sb = newStoryboard('Solo');
  const html = rds.renderToString(
    React.createElement(StoryboardWorkspace, {
      storyboard: sb,
      onChange: () => {},
      onBack: () => {},
    })
  );
  assert.ok(!html.includes('Linked projects'));
});
