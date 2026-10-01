import test from 'node:test';
import assert from 'node:assert/strict';
import demo from '../src/demo.json';
import {
  FPS, layout, reorder, sceneAt, splitScene, totalFrames, updateScene, validateProject,
  type Project,
} from '../src/model';

const fixture = (): Project => structuredClone(demo) as Project;

test('reorder preserves order when a move crosses a locked scene', () => {
  const project = fixture();
  project.scenes[1].locked = true;
  assert.equal(reorder(project, 'scene-0', 'scene-2'), project);
  assert.equal(reorder(project, 'scene-2', 'scene-0'), project);
});

test('reorder allows moves within an unlocked region and refuses unknown ids', () => {
  const project = fixture();
  const moved = reorder(project, 'scene-0', 'scene-2');
  assert.deepEqual(moved.scenes.slice(0, 3).map(s => s.id), ['scene-1', 'scene-2', 'scene-0']);
  assert.equal(reorder(project, 'missing', 'scene-0'), project);
});

test('video trim clamps source in and duration to available source frames', () => {
  const project = fixture();
  const updated = updateScene(project, 'scene-0', { sourceIn: 999, duration: 18000 });
  const scene = updated.scenes[0];
  const asset = updated.assets.find(a => a.id === scene.assetId)!;
  assert.equal(scene.sourceIn, Math.max(0, asset.duration - 0.5));
  assert.ok(scene.duration <= Math.floor((asset.duration - scene.sourceIn) * FPS));
  assert.ok(scene.sourceIn + scene.duration / FPS <= asset.duration + 1 / FPS);
});

test('locked scene cannot be trimmed unless the lock itself is being changed', () => {
  const project = fixture();
  project.scenes[0].locked = true;
  assert.equal(updateScene(project, 'scene-0', { duration: 90 }), project);
  assert.equal(updateScene(project, 'scene-0', { locked: false }).scenes[0].locked, false);
});

test('split keeps timeline duration and source footage continuous', () => {
  const project = fixture();
  const original = project.scenes[0];
  const split = splitScene(project, original.id, 30, 'new-cut');
  assert.equal(split.scenes.length, project.scenes.length + 1);
  assert.equal(split.scenes[0].duration + split.scenes[1].duration, original.duration);
  assert.equal(split.scenes[0].sourceIn, original.sourceIn);
  assert.equal(split.scenes[1].sourceIn, original.sourceIn + 30 / FPS);
  assert.equal(totalFrames(split), totalFrames(project));
});

test('split rejects either side shorter than 15 frames, locked scenes, and scene limit', () => {
  const project = fixture();
  assert.equal(splitScene(project, 'scene-0', 14, 'x'), project);
  assert.equal(splitScene(project, 'scene-0', project.scenes[0].duration - 14, 'x'), project);
  project.scenes[0].locked = true;
  assert.equal(splitScene(project, 'scene-0', 30, 'x'), project);
  project.scenes[0].locked = false;
  assert.equal(splitScene(project, 'scene-0', 15.5, 'fractional'), project);
  project.scenes = Array.from({ length: 150 }, (_, i) => ({ ...project.scenes[0], id: `s${i}` }));
  assert.equal(splitScene(project, 's0', 30, 'x'), project);
});

test('import validation accepts the shipped demo and rejects malformed project structure', () => {
  const project = fixture();
  assert.equal(validateProject(project), true);
  for (const invalid of [null, {}, { ...project, version: 2 }, { ...project, scenes: [] },
    { ...project, scenes: [{ ...project.scenes[0], assetId: 'missing' }] },
    { ...project, assets: [{ ...project.assets[0], src: 'https://example.test/video.mp4' }] },
    { ...project, musicVolume: 2 },
    { ...project, scenes: [project.scenes[0], { ...project.scenes[0] }] },
    { ...project, scenes: [{ ...project.scenes[0], sourceIn: 999 }] },
    { ...project, scenes: [{ ...project.scenes[0], duration: 18000 }] },
  ]) assert.equal(validateProject(invalid), false);
});

test('layout covers timeline exactly and sceneAt uses half-open scene boundaries', () => {
  const project = fixture();
  const laidOut = layout(project.scenes);
  assert.equal(laidOut[0].start, 0);
  for (let i = 1; i < laidOut.length; i++) assert.equal(laidOut[i].start, laidOut[i - 1].end);
  assert.equal(laidOut.at(-1)!.end, totalFrames(project));
  assert.equal(sceneAt(project, 0)?.id, project.scenes[0].id);
  assert.equal(sceneAt(project, project.scenes[0].duration)?.id, project.scenes[1].id);
  assert.equal(sceneAt(project, totalFrames(project) - 1)?.id, project.scenes.at(-1)!.id);
});
