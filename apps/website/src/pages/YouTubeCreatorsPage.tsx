import React from 'react';
import { FeatureTemplate } from '../templates';
import { WorkflowPreview } from '../WorkflowPreview';
import { Hero, FeatureZigzag, APP_SIGNUP_URL } from '@storyframe/ui';

export const YOUTUBE_CREATORS_SIGNUP_URL = APP_SIGNUP_URL;
export const YOUTUBE_CREATORS_CTA_LABEL = 'Sign up for free';

export function YouTubeCreatorsPage({ onNavigate }: { onNavigate?: (path: string) => void }) {
  return <FeatureTemplate onNavigate={onNavigate}>
    <Hero
      title="Turn your writing into faceless YouTube videos."
      subtitle="Paste a script, blog post or outline, and Storyframe plans it into a multi-scene video with consistent visuals, on-brand voice, captions and music. Built for storytellers, historians and educators — no camera, no editing experience, no face on screen."
      primaryCta={{ label: YOUTUBE_CREATORS_CTA_LABEL, href: YOUTUBE_CREATORS_SIGNUP_URL }}
    />
    <p className="sf-signup-note">Free. No credit card required.</p>

    <div id="how"><FeatureZigzag items={[
      {title:'Paste your script',description:'Drop in a script, blog post or lesson outline. AI plans it into scenes with a hook, clear beats and pacing built for YouTube watch time.',visual:<WorkflowPreview kind="generate"/>},
      {flip:true,title:'Consistent visuals, scene after scene',description:'Every scene follows one visual identity — your colours, typeface, caption style and voice — so your channel looks like one studio, not a stock-footage patchwork.',visual:<WorkflowPreview kind="brand"/>},
      {title:'Captions and music carry the story',description:'Faceless does not mean silent. Captions keep viewers reading, and a soundtrack that fits the mood runs under every scene.',visual:<WorkflowPreview kind="media"/>},
      {flip:true,title:'Edit any scene, stay in control',description:'Every scene stays editable. Rewrite a caption, reorder scenes, swap music or refresh a visual without starting over.',visual:<WorkflowPreview kind="editor"/>},
    ]} /></div>

    <section className="home-section" id="formats"><div className="collection-heading"><h2>One script. Every YouTube format.</h2></div><div className="feature-collection sf-mkt-grid">
      <article className="feature-card"><WorkflowPreview kind="storyboard"/><div className="card-heading"><h3>Videos for your channel</h3></div><p>Landscape 16:9 videos with scene-by-scene pacing, captions and consistent branding from first frame to last.</p></article>
      <article className="feature-card"><WorkflowPreview kind="editor"/><div className="card-heading"><h3>Shorts that pull viewers in</h3></div><p>Vertical 9:16 cuts with a hook in the first second, made for YouTube Shorts, Reels and TikTok.</p></article>
    </div></section>

    <section className="sf-mkt-cta">
      <h2 className="sf-mkt-cta-title">Your next video is one script away.</h2>
      <p className="sf-mkt-cta-subtitle">Paste a script or blog post and watch it become a scene-by-scene video.</p>
      <a className="sf-button sf-button-primary sf-button-lg" href={YOUTUBE_CREATORS_SIGNUP_URL}>{YOUTUBE_CREATORS_CTA_LABEL}</a>
      <p className="sf-signup-note">Free. No credit card required.</p>
    </section>
  </FeatureTemplate>;
}
