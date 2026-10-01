import React from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { LandingTemplate } from './templates';
import { StudioDemo } from './StudioDemo';
import { APP_SIGNUP_URL, AppCta } from '@storyframe/ui';
import { CourseCards } from './pages/LearningPages';
import { CoreFeatures, TemplateCards, ResourceCards, SectionIntro } from './Collections';


export function HomePage({ onNavigate }: { onNavigate: (path: string) => void }) {
  return <LandingTemplate onNavigate={onNavigate}>
    <section className="home-hero sf-mkt-hero"><div className="hero-copy">

      <h1 className="sf-mkt-hero-title">From your idea to a video <span>in minutes.</span></h1>
      <p className="sf-mkt-hero-subtitle">An AI-aided, brand-aware video builder. Bring your screenshots and footage, brainstorm with storyboards, and edit every scene in one workspace.</p>
      <div className="sf-mkt-hero-actions"><a className="sf-button sf-button-primary sf-button-lg" href={APP_SIGNUP_URL}>Sign up free <ArrowRight size={16}/></a><a className="sf-button sf-button-secondary sf-button-lg" href="#studio-demo">Try the studio</a></div><p className="sf-signup-note">Free. No credit card required.</p>
    </div></section>
    <StudioDemo/>
    <section className="home-section" id="features"><SectionIntro eyebrow="Features" title="Your brand. Your content. Your video." link="/features" label="Explore features"/><CoreFeatures/></section>
    <section className="home-section"><SectionIntro eyebrow="Templates" title="Templates for your next video." link="/templates" label="Browse templates"/><TemplateCards/></section>
    <section className="home-section"><SectionIntro eyebrow="Tutorials" title="Learn to make a better product video." link="/tutorials" label="Explore tutorials"/><CourseCards limit={3}/></section>
    <section className="home-section"><SectionIntro eyebrow="Resources" title="Resources for better product videos." link="/resources" label="All resources"/><ResourceCards/></section>

    <AppCta title="Start your first video project." subtitle="Bring your screenshots, footage and brand. Edit every scene in one workspace."/>
  </LandingTemplate>;
}
