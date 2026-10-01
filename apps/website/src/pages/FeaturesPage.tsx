import React from 'react';
import { FeatureTemplate } from '../templates';
import { WorkflowPreview } from '../WorkflowPreview';
import { Hero, AppCta, FeatureZigzag, APP_SIGNUP_URL } from '@storyframe/ui';
export function FeaturesPage({onNavigate}:{onNavigate?:(path:string)=>void}) {
 return <FeatureTemplate onNavigate={onNavigate}>
  <Hero title="Your idea. A video you can keep editing." subtitle="Start with your brand and content. Plan with storyboards when you need them. Build and refine every scene in the visual editor." primaryCta={{label:'Sign up free',href:APP_SIGNUP_URL}} secondaryCta={{label:'Try the studio',href:'/#studio-demo'}}/>
  <p className="sf-signup-note">Free. No credit card required.</p>
  <div id="brand"><FeatureZigzag items={[{title:'Keep your videos on brand',description:'Save your colours, typeface and voice with the project. Import a brand reference, review it, and reuse it across your creations.',visual:<WorkflowPreview kind="brand"/>}]} /></div>
  <div id="storyboards"><FeatureZigzag items={[{flip:true,title:'Plan the story before the edit',description:'Arrange scenes, add references and set durations. Start with a storyboard or go straight to the timeline. Storyboards and videos remain independently editable.',visual:<WorkflowPreview kind="storyboard"/>}]} /></div>
  <div id="media"><FeatureZigzag items={[{title:'Use the content you already have',description:'Upload screenshots, images and recordings. Trim clips, split scenes, add captions and change your video format. Undo an edit whenever you need.',visual:<WorkflowPreview kind="media"/>}]} /></div>

  <section className="home-section" id="ai"><div className="collection-heading"><h2>AI creation, with creative control.</h2></div><div className="feature-collection sf-mkt-grid">
   <article className="feature-card"><WorkflowPreview kind="generate"/><div className="card-heading"><h3>Generate and refine scenes</h3></div><p>Brainstorm with AI, generate scene variations and keep every take. Find royalty-free images and audio in the same workflow.</p></article>
   <article className="feature-card"><WorkflowPreview kind="mockup"/><div className="card-heading"><h3>Turn screenshots into phone mockups</h3></div><p>Frame your real app screens in editable phone scenes, then combine them with your recordings and generated content.</p></article>
  </div></section>
  <AppCta title="Start your first video project." subtitle="Your brand, screenshots and recordings. One place to build the video."/>
 </FeatureTemplate>;
}
