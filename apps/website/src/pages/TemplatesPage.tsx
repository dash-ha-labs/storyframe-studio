import React from 'react';
import { TemplateDetailTemplate } from '../templates';
import { Hero, APP_SIGNUP_URL } from '@storyframe/ui';
import { TemplateCards } from '../Collections';
export function TemplatesPage({onNavigate}:{onNavigate?:(path:string)=>void}) {
 return <TemplateDetailTemplate onNavigate={onNavigate}><Hero eyebrow="Templates" title="Start with the video you want to make." subtitle="App launches, feature walkthroughs and problem-to-solution stories. Choose a structure and bring your own screens." primaryCta={{label:'Start building free',href:APP_SIGNUP_URL}}/><TemplateCards expandable/></TemplateDetailTemplate>;
}
