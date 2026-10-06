import React from 'react';
import { FeatureTemplate } from '../templates';
import { WorkflowPreview } from '../WorkflowPreview';
import { Hero, FeatureZigzag, SectionHeading, Card } from '@storyframe/ui';

export const ECOMMERCE_SIGNUP_URL = 'https://storyframe-studio.yamu.app/';
export const ECOMMERCE_CTA_LABEL = 'Sign up for free';

export const ECOMMERCE_STEPS = [
 {title:'Paste your product URL',description:'Drop in any Shopify product link and Storyframe pulls the photos, title and price automatically. No link handy? Upload a product photo instead.'},
 {title:'AI builds your ad',description:'Get a TikTok or Facebook ad draft in seconds: hook, scenes, captions and music tuned for what performs on social.'},
 {title:'Edit, brand and publish',description:'Fine-tune any scene, apply your brand colours and fonts in one click, then export in every format your channels need.'},
];

export const ECOMMERCE_REVIEWS = [
 {quote:'I pasted my product URL and had a TikTok ad draft before my coffee went cold. Tweaked two scenes and published the same afternoon.',name:'Maya T.',role:'Shopify store owner'},
 {quote:'The hooks Storyframe writes beat what I paid an editor for. Cost per click dropped in the first week of running them.',name:'Derrick O.',role:'Dropshipper'},
 {quote:'Every ad finally looks like our brand — colours, fonts, voice. We ship five creative variants a week now instead of one.',name:'Lena K.',role:'E-commerce marketing manager'},
];

export function EcommercePage({ onNavigate }: { onNavigate?: (path: string) => void }) {
 return <FeatureTemplate onNavigate={onNavigate}>
  <Hero
    title="From Shopify URL or product photo to a viral ad."
    subtitle="Paste a Shopify URL or upload a product photo, and AI instantly creates a viral TikTok or Facebook ad. Built for e-commerce sellers, Shopify store owners and dropshippers."
    primaryCta={{ label: ECOMMERCE_CTA_LABEL, href: ECOMMERCE_SIGNUP_URL }}
  />
  <p className="sf-signup-note">Free. No credit card required.</p>

  <div id="how"><FeatureZigzag items={[
   {title:'Paste a Shopify URL',description:'Drop in any product page link. Storyframe pulls the product details and builds a ready-to-edit video ad around them.',visual:<WorkflowPreview kind="mockup"/>},
   {flip:true,title:'Or upload a product photo',description:'No store link handy? Upload a product photo and let AI turn it into scroll-stopping ad scenes with hooks, captions and music.',visual:<WorkflowPreview kind="media"/>},
   {title:'AI writes the viral ad',description:'Get a TikTok or Facebook ad draft in seconds: hook, scenes and captions tuned for what performs on social.',visual:<WorkflowPreview kind="generate"/>},
   {flip:true,title:'Edit every scene, stay on brand',description:'Keep full control. Refine each scene, apply your brand colours and typeface, then export in every format your channels need.',visual:<WorkflowPreview kind="editor"/>},
  ]} /></div>

  <section className="home-section" id="steps">
   <SectionHeading eyebrow="How it works" title="Three steps to your next viral ad." subtitle="No editing skills, no agency, no timeline. From product link to published ad in minutes." />
   <div className="sf-mkt-grid">
    {ECOMMERCE_STEPS.map((step, i) => (
     <Card key={step.title} className="sf-mkt-grid-card">
      <span className="sf-mkt-eyebrow">Step {i + 1}</span>
      <h3 className="sf-mkt-grid-title">{step.title}</h3>
      <p className="sf-mkt-grid-desc">{step.description}</p>
     </Card>
    ))}
   </div>
  </section>

  <section className="home-section" id="formats"><div className="collection-heading"><h2>One product. Every ad format.</h2></div><div className="feature-collection sf-mkt-grid">
   <article className="feature-card"><WorkflowPreview kind="storyboard"/><div className="card-heading"><h3>TikTok and Reels ads</h3></div><p>Vertical 9:16 ads with hooks in the first second, captions and trend-aware pacing.</p></article>
   <article className="feature-card"><WorkflowPreview kind="brand"/><div className="card-heading"><h3>Facebook and Instagram ads</h3></div><p>Square and landscape variants that carry your brand colours, typeface and voice.</p></article>
  </div></section>

  <section className="home-section" id="reviews">
   <SectionHeading eyebrow="Customer reviews" title="Sellers are shipping ads faster." subtitle="Store owners and dropshippers use Storyframe to turn products into ads that actually convert." />
   <div className="sf-mkt-grid">
    {ECOMMERCE_REVIEWS.map(review => (
     <Card key={review.name} className="sf-mkt-grid-card">
      <span className="sf-review-stars" role="img" aria-label="Rated 5 out of 5 stars">★★★★★</span>
      <p className="sf-mkt-grid-desc">“{review.quote}”</p>
      <div>
       <div className="sf-mkt-grid-title">{review.name}</div>
       <span className="sf-mkt-grid-desc">{review.role}</span>
      </div>
     </Card>
    ))}
   </div>
  </section>

  <section className="sf-mkt-cta">
    <h2 className="sf-mkt-cta-title">Your next viral ad is one URL away.</h2>
    <p className="sf-mkt-cta-subtitle">Paste a Shopify URL or upload a product photo and see the ad in minutes.</p>
    <a className="sf-button sf-button-primary sf-button-lg" href={ECOMMERCE_SIGNUP_URL}>{ECOMMERCE_CTA_LABEL}</a>
    <p className="sf-signup-note">Free. No credit card required.</p>
  </section>
 </FeatureTemplate>;
}
