import React from 'react';

export function StudioDemo() {
  return <section id="studio-demo" className="studio-demo" aria-label="Storyframe video editor">
    <div className="app-embed"><iframe src="/demo.html" title="Storyframe interactive video editor"
      sandbox="allow-scripts allow-same-origin allow-downloads" loading="lazy" /></div>
  </section>;
}
