import React, { useState } from 'react';
import { Clapperboard, Layers, Palette, Play, Plus, Sparkles, Smartphone, Wand2, Music2, Check, Type } from 'lucide-react';
export type PreviewKind = 'storyboard'|'brand'|'editor'|'generate'|'mockup'|'media';

/** Intentionally schematic workflow illustration. It never claims a backend request ran. */
export function WorkflowPreview({kind,compact=false}:{kind:PreviewKind;compact?:boolean}) {
 const [selected,setSelected]=useState(0);
 const titles={storyboard:'Storyboard',brand:'Brand design',editor:'Video editor',generate:'AI scene generation',mockup:'Phone mockup',media:'Media & sound'};
 const Icon={storyboard:Layers,brand:Palette,editor:Clapperboard,generate:Sparkles,mockup:Smartphone,media:Music2}[kind];
 return <div className={`workflow-preview preview-${kind} ${compact?'compact':''}`}>
  <div className="wire-toolbar"><Icon size={14}/><span>{titles[kind]}</span><i/><span className="wire-menu">•••</span></div>
  {kind==='storyboard'&&<div className="wire-storyboard">{['The problem','Your product','The result'].map((text,i)=><button key={text} type="button" className={`wire-frame ${selected===i?'selected':''}`} onClick={()=>setSelected(i)} aria-label={`Preview storyboard frame ${i+1}`}><span>0{i+1}</span><div className="wire-screen"><i/><i/><i/></div><strong>{text}</strong><small>{[3,6,3][i]}s</small></button>)}<div className="wire-caption"><Layers size={12}/>Three frames. One clear story.</div></div>}
  {kind==='brand'&&<div className="wire-brand"><div className="wire-brand-preview" style={{'--preview-accent':['#2142e7','#9a5bd5','#20816c'][selected]} as React.CSSProperties}><span>Your brand</span><strong>Aa</strong><div/><i/></div><div className="wire-brand-fields"><small>PALETTE</small><div>{['#2142e7','#9a5bd5','#20816c'].map((color,i)=><button key={color} style={{background:color}} aria-label={`Try ${['blue','purple','green'][i]} palette`} aria-pressed={selected===i} onClick={()=>setSelected(i)}>{selected===i&&<Check size={12}/>}</button>)}</div><small>TYPEFACE</small><span>Inter <Type size={12}/></span><small>VOICE</small><span>Clear. Confident. Yours.</span></div></div>}
  {kind==='editor'&&<div className="wire-editor"><div className="wire-player"><div className="wire-app-window"><div/><i/><i/><span/></div><span className="wire-play"><Play size={14} fill="currentColor"/></span></div><div className="wire-timeline"><div><i/><i/><i/></div><div/><span className="wire-playhead"/></div></div>}
  {kind==='generate'&&<div className="wire-generation"><div className="wire-prompt"><Sparkles size={15}/><span>A launch scene, in my brand’s style</span></div><div className="wire-variants"><div><span>01</span><div className="wire-app-window"><div/><i/><i/></div></div><div><span>02</span><div className="wire-app-window"><div/><i/><i/></div></div></div><span className="wire-caption"><Wand2 size={12}/>Choose a take. Keep every version.</span></div>}
  {kind==='mockup'&&<div className="wire-mockup"><div className="wire-upload"><Plus size={20}/><span>Your screenshot</span></div><span className="wire-arrow">→</span><div className="wire-phone"><i/><div className="wire-screen"><i/><i/><i/></div><small>Your app</small></div></div>}
  {kind==='media'&&<div className="wire-media"><div className="wire-assets">{['Screenshot','Video','Image'].map((label,i)=><div key={label}><span>{i===0?<Smartphone size={18}/>:i===1?<Play size={18}/>:<Layers size={18}/>}</span><small>{label}</small></div>)}</div><div className="wire-audio"><Music2 size={15}/><span>{Array.from({length:27},(_,i)=><i key={i} style={{height:4+(i*7%19)}}/>)}</span><small>Audio</small></div></div>}
 </div>;
}
