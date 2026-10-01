import React from 'react';
import { GuideIndexTemplate } from '../templates';
import { AppCta } from '@storyframe/ui';
export function GuidesPage({onNavigate}:{onNavigate?:(path:string)=>void}) {
 return <GuideIndexTemplate onNavigate={onNavigate}>
  <header className="sf-page-header"><span className="sf-mkt-eyebrow">Guides</span><h1 className="sf-page-title">Create your first product video.</h1><p className="sf-page-subtitle">Set up your brand, plan the scenes and edit your video. Practical steps from your first scene to the final edit.</p></header>
  <div className="guide-list">
   <details id="brand" open><summary><span>01</span>Set up your project and brand</summary><ol><li>Open the application menu and choose New project.</li><li>Add a name and choose web, mobile, or both. These describe your product, not the video format.</li><li>Start a fresh brand, import a local reference, or review candidates from a supported public URL.</li><li>Review the details and create the project. Refine colours and voice in Brand whenever you need.</li></ol></details>
   <details id="storyboard"><summary><span>02</span>Plan a three-scene storyboard</summary><p>Open Storyboard from the workspace. Add a frame for the opening, one for the detail, and one for the payoff. Add notes, image references and durations. Attach the plan to a project.</p></details>
   <details id="first-video"><summary><span>03</span>Import, trim and caption your scenes</summary><p>Import original media on the project’s Media page, then create a video. Select a scene in the timeline. Adjust duration, add a caption, or split at the playhead. Use Space to play or pause and Cmd/Ctrl + Z to undo while focused in the editor. Arrow keys step through frames.</p><a className="text-cta" href="/demo.html" target="_blank" rel="noreferrer">Try it with the sample ↗</a></details>
   <details><summary><span>04</span>Keep your work for another day</summary><p>Save your editable project and keep the original media alongside it. Name each version so you can return to a previous cut.</p></details>
   <details><summary><span>05</span>A note on free AI requests</summary><p>Free signup needs no credit card. Free AI requests queue when busy.</p></details>
  </div>
  <AppCta title="Start editing your first video." subtitle="Bring your screenshots and recordings into Storyframe."/>
 </GuideIndexTemplate>;
}
