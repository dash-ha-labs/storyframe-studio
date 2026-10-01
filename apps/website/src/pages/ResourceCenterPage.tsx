import React from 'react';
import { ResourceHubTemplate } from '../templates';
import { Hero,AppCta } from '@storyframe/ui';
import { ResourceCards,SectionIntro } from '../Collections';
export function ResourceCenterPage({onNavigate}:{onNavigate?:(path:string)=>void}) {
 return <ResourceHubTemplate onNavigate={onNavigate}><Hero eyebrow="Resources" title="Less figuring it out. More making it." subtitle="Free briefs, brand kits and shot lists. Useful tools to get your next product story moving."/><ResourceCards/><section className="home-section"><SectionIntro eyebrow="Guides & tips" title="Make your first demo a better one."/><div className="guide-links"><a href="/guides#first-video"><span>01 / VIDEO</span><h3>From raw recording to first cut</h3><p>Trim, caption, preview and save your project.</p></a><a href="/guides#brand"><span>02 / BRAND</span><h3>Bring your product’s identity with you</h3><p>Review imported colours, fonts and voice.</p></a><a href="/guides#storyboard"><span>03 / STORY</span><h3>Plan the reveal in three moments</h3><p>Give each frame a reason to be there.</p></a></div></section><AppCta title="Put those ideas to work." subtitle="Open your studio and start with a first draft."/></ResourceHubTemplate>;
}
