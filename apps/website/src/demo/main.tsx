import React from 'react';
import { createRoot } from 'react-dom/client';
import {useSessionVersions} from '@storyframe/studio/src/versions.ts';
import Suite from '@storyframe/studio/src/Suite.tsx';
import { useSessionMedia } from '@storyframe/studio/src/storage.ts';
import '@storyframe/studio/src/style.css';
import '@storyframe/studio/src/suite.css';
import '@storyframe/ui/ui.css';
import '@storyframe/studio/src/studio-ui.css';
import { sampleWorkspace } from './fixture';

useSessionMedia();
useSessionVersions();
createRoot(document.getElementById('root')!).render(
  <React.StrictMode><Suite initialState={sampleWorkspace} persist={false} startInEditor /></React.StrictMode>,
);
