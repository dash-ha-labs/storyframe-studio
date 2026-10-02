import {useCatalog} from '@storyframe/catalog/react';
import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import {TEMPLATES,RESOURCES} from './data/catalog';
import {TemplateCard} from './Content';
import {ResourceCard} from './pages/ResourceCenterPage';
import { WorkflowPreview, type PreviewKind } from './WorkflowPreview';

export function SectionIntro({eyebrow,title,link,label}:{eyebrow:string;title:string;link?:string;label?:string}) {
 return <div className="collection-heading"><div><span className="sf-mkt-eyebrow">{eyebrow}</span><h2>{title}</h2></div>{link&&<a href={link}>{label||'Explore'}<ArrowUpRight size={16}/></a>}</div>;
}
export function CoreFeatures() {
 return <div className="feature-collection sf-mkt-grid">{[
  {kind:'brand' as PreviewKind,title:'Keep every video on brand',copy:'Bring your colours, typography and voice into the project.',href:'/features#brand'},
  {kind:'storyboard' as PreviewKind,title:'Plan with storyboards',copy:'Brainstorm the sequence, or go straight to the editor.',href:'/features#storyboards'},
  {kind:'editor' as PreviewKind,title:'Edit every scene',copy:'Trim, split, caption and preview with a visual timeline.',href:'#studio-demo'},
  {kind:'media' as PreviewKind,title:'Start with your own content',copy:'Bring screenshots, recordings and images into your project.',href:'/features#media'},
  {kind:'generate' as PreviewKind,title:'Generate scenes with AI',copy:'Turn a prompt into scene options you can keep editing.',href:'/features#ai'},
  {kind:'mockup' as PreviewKind,title:'Show your app in a phone',copy:'Build phone mockups around your screenshots.',href:'/features#ai'},
 ].map(item=><article className="feature-card" key={item.kind}><WorkflowPreview kind={item.kind}/><a className="card-heading" href={item.href}><h3>{item.title}</h3><ArrowUpRight size={16}/></a><p>{item.copy}</p></article>)}</div>;
}
export function TemplateCards() {const {templates:TEMPLATES}=useCatalog();return <div className="catalog-grid related-grid">{TEMPLATES.filter(t=>t.featured).slice(0,3).map(t=><TemplateCard key={t.slug} item={t}/>)}</div>;}
export function ResourceCards() {const {resources:RESOURCES}=useCatalog();return <div className="resource-library-grid">{RESOURCES.slice(0,3).map(item=><ResourceCard key={item.slug} item={item}/>)}</div>;}
