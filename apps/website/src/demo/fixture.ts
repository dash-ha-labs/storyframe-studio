import type { Project } from '@storyframe/studio/src/model.ts';
import type { SuiteState } from '@storyframe/studio/src/suite-model.ts';

// Illustrative app wireframes, not authenticated product captures or customer films.
export const sampleVideo: Project = {
  version: 1, title: 'Your app · Launch video', mode: 'Manual', outputFormat: '9:16',
  background: '#f8e7dc', accent: '#2142e7', brandInk: '#182b4e', productName: 'Your product',
  headline: 'Make something worth sharing.', website: '', brief: 'An illustrative launch story. Try captions, timing and undo.',
  musicId: null, musicVolume: .4, musicMuted: false,
  assets: ['opening', 'details', 'debut'].map((name) => ({
    id: name, name: `${name} · illustrative artwork`, type: 'image',
    src: `/demo/${name}.svg`, poster: `/demo/${name}.svg`, duration: 4,
    width: 1080, height: 1920, origin: 'brand',
  })),
  scenes: [
    ['opening', 'Introduce the product', 'Meet your product.'],
    ['details', 'Show the feature', 'Show the useful part.'],
    ['debut', 'Invite people to try', 'Make the next step clear.'],
  ].map(([id, title, caption]) => ({
    id, title, caption, duration: 120, sourceIn: 0, assetId: id, kind: 'footage',
    captionPosition: 'bottom', captionSize: 66, captionVisible: true, scale: 1, locked: false,
  })),
};
export const sampleWorkspace: SuiteState = {
  version: 1, folders: [{ id: 'sample', name: 'A place to start' }],
  storyboards: [{ id: 'launch-story', title: 'The little launch', createdAt: '2026-10-01',
    frames: sampleVideo.scenes.map((scene, order) => ({ id: scene.id, order, text: scene.title,
      imageUrl: sampleVideo.assets[order].src, durationSeconds: 4 })) }],
  projects: [{
    id: 'sample-project', folderId: 'sample', name: 'Your product',
    description: 'An example product launch built from editable scenes and app wireframes.',
    apps: [], sources: [{ name: 'Illustrative app wireframes', kind: 'Illustrative sample · not captured UI' }],
    metrics: [], storyboardId: 'launch-story', media: sampleVideo.assets,
    brand: { background: '#f8e7dc', accent: '#2142e7', ink: '#182b4e', font: 'System sans-serif',
      voice: 'Curious, warm, and ready to make something.', source: 'Illustrative sample' },
    creations: [{ id: 'sample-video', tool: 'video', name: sampleVideo.title, format: '9:16',
      brief: sampleVideo.brief, content: '', updated: '2026-10-01', video: sampleVideo }],
  }],
};
