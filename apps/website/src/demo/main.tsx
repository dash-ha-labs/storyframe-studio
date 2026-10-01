import React from 'react';
import { createRoot } from 'react-dom/client';
import Suite from '@storyframe/studio/src/Suite.tsx';
import { useSessionMedia } from '@storyframe/studio/src/storage.ts';
import '@storyframe/studio/src/style.css';
import '@storyframe/studio/src/suite.css';
import '@storyframe/ui/ui.css';
import { sampleWorkspace } from './fixture';

useSessionMedia();
createRoot(document.getElementById('root')!).render(
  <React.StrictMode><Suite initialState={sampleWorkspace} persist={false} startInEditor /></React.StrictMode>,
);
