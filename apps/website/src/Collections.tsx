import React from 'react';
import { ArrowDownToLine, ArrowUpRight } from 'lucide-react';
import { WorkflowPreview, type PreviewKind } from './WorkflowPreview';

export const templateRecipes = [
 {name:'App launch video',type:'Ad Creative',kind:'editor' as PreviewKind,format:'9:16 · Product launch',description:'Introduce your app. Show the value. Invite people in.',steps:['Open with the problem your app solves.','Show one real product action.','Close with a clear next step.']},
 {name:'Feature walkthrough',type:'Explainer Video',kind:'mockup' as PreviewKind,format:'16:9 · Feature demo',description:'Turn screenshots and recordings into a clear demo.',steps:['Show the starting state.','Record the real action.','Hold on the result.']},
 {name:'Problem → solution',type:'Storyboard',kind:'storyboard' as PreviewKind,format:'3 scenes · Any format',description:'Start with a storyboard. Make each scene count.',steps:['Name the problem.','Show the product solving it.','Let the result land.']},
];
export const galleryExamples = [
 {name:'A product launch in three scenes',type:'Marketing Video',kind:'editor' as PreviewKind,label:'Product launch · 3 scenes'},
 {name:'From screenshot to phone mockup',type:'Social Reel',kind:'mockup' as PreviewKind,label:'App showcase · Phone mockup'},
 {name:'A storyboard you can keep editing',type:'Storyboard',kind:'storyboard' as PreviewKind,label:'Storyboard · 3 scenes'},
];
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
export function TemplateCards({expandable=false}:{expandable?:boolean}) {
 return <div id="recipes" className="template-collection sf-mkt-grid">{templateRecipes.map(r=><article className="template-card" key={r.name}><WorkflowPreview kind={r.kind}/><a className="card-heading" href={expandable?'#recipes':'/templates'}><h3>{r.name}</h3><ArrowUpRight size={16}/></a><span className="card-meta">{r.format}</span><p>{r.description}</p>{expandable&&<details><summary>{r.type} · See the structure</summary><ol>{r.steps.map(s=><li key={s}>{s}</li>)}</ol></details>}</article>)}</div>;
}
export function GalleryCards({filter='All',limit=3}:{filter?:string;limit?:number}) {
 return <div className="gallery-collection">{galleryExamples.filter(e=>filter==='All'||e.type===filter).slice(0,limit).map(e=><article className="gallery-example sf-gallery-card" key={e.name}><WorkflowPreview kind={e.kind}/><a className="card-heading" href="/gallery"><h3>{e.name}</h3><ArrowUpRight size={16}/></a><p>{e.label}</p></article>)}</div>;
}
export function ResourceCards() {
 return <div className="resource-collection"><a href="/downloads/launch-brief.txt" download className="resource-card"><span className="resource-type">BRIEF / TXT</span><h3>Plan a better product video</h3><p>Five questions to turn an idea into a focused launch story.</p><span className="resource-action">Download launch brief<ArrowDownToLine size={16}/></span></a><a href="/downloads/starter-brand.json" download className="resource-card"><span className="resource-type">BRAND KIT / JSON</span><h3>Give your project a brand</h3><p>Customise the palette and typeface. Import into Storyframe.</p><span className="resource-action">Download starter kit<ArrowDownToLine size={16}/></span></a><a href="/downloads/product-shot-list.txt" download className="resource-card"><span className="resource-type">CHECKLIST / TXT</span><h3>Record the right screens</h3><p>A shot list for clear, readable app demos and feature videos.</p><span className="resource-action">Download shot list<ArrowDownToLine size={16}/></span></a></div>;
}
