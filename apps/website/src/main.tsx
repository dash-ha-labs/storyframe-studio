import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '@storyframe/tokens/tokens.css';
import '@storyframe/ui/ui.css';
import './website.css';
import './content.css';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
