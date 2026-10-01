import {Asset, Project, validateProject} from './model';
import demoData from './demo.json';
export type ToolId='video'|'brand';
export type Platform='web'|'mobile';
export type OutputFormat='9:16'|'16:9'|'1:1'|'4:5';
export interface BrandComponent{name:string;type:string;previewUrl?:string}
export interface Brand{background:string;accent:string;ink:string;font:string;voice:string;source:string;sourceUrl?:string;components?:BrandComponent[]}
export interface BrandTokenExtractionResult{colors:{background:string;accent:string;ink:string;palette:string[]};font:string;components?:BrandComponent[];sourceUrl:string}
export interface SourceApp {id:string;name:string;platform:Platform;url:string;}
export interface SourceFile {name:string;kind:string;mediaId?:string;}
export interface Creation {id:string;tool:ToolId;name:string;format:string;brief:string;content:string;updated:string;video?:Project;}
export interface Frame {id:string;text:string;imageUrl:string;durationSeconds:number;order:number;}
export interface Storyboard {id:string;title:string;frames:Frame[];createdAt:string;}
export interface SuiteProject {id:string;folderId:string;name:string;description:string;apps:SourceApp[];brand:Brand;media:Asset[];sources:SourceFile[];creations:Creation[];storyboardId?:string;metrics:{date:string;visits:string;installs:string;notes:string}[];}
export interface SuiteState {version:1;folders:{id:string;name:string}[];projects:SuiteProject[];storyboards:Storyboard[];}
export const newStoryboard=(title:string):Storyboard=>({id:newId(),title:title.trim()||'Untitled storyboard',frames:[],createdAt:new Date().toISOString()});
export const blankFrame=(order:number):Frame=>({id:newId(),text:'',imageUrl:'',durationSeconds:4,order});
export const SUITE_KEY='storyframe.suite.v1';
export const TOOLS:{id:ToolId;name:string;description:string;label:string;formats:string[]}[]=[
{id:'video',name:'Video studio',description:'Product stories, with your real UI.',label:'Create video',formats:['9:16','16:9','1:1','4:5']},
{id:'brand',name:'Brand Design',description:'Build or refine your visual identity.',label:'Edit brand',formats:[]}
];
export const newId=()=>crypto.randomUUID();
export const blankBrand=():Brand=>({background:'#f4f1eb',accent:'#a6b5ff',ink:'#24262c',font:'System sans-serif',voice:'Clear, friendly and useful.',source:'Manual'});
export function seedSuite():SuiteState {
 let video=structuredClone(demoData) as Project;
 try {const previous=JSON.parse(localStorage.getItem('storyframe.project.v1')||'null');if(validateProject(previous))video=previous;}catch{}
 return {version:1,folders:[{id:'launches',name:'My products'}],storyboards:[],projects:[{id:'kurutu',folderId:'launches',name:'Kurutu',description:'A calmer grocery run. Shared lists, smart suggestions, loyalty cards and purchase records.',apps:[{id:'kurutu-mobile',name:'Kurutu mobile',platform:'mobile',url:''},{id:'kurutu-web',name:'Kurutu website',platform:'web',url:'https://kurutu.com'}],brand:{background:video.background,accent:video.accent,ink:'#282828',font:'Bricolage Grotesque',voice:'Warm, practical and quietly playful. Make everyday collaboration feel easy.',source:'Existing Kurutu campaign'},media:video.assets,sources:[{name:'Kurutu design system',kind:'Existing campaign reference'},{name:'App component captures',kind:'Fixture data · original UI'}],creations:[{id:'grocery-evolution',tool:'video',name:video.title,format:'9:16',brief:video.brief,content:'',updated:'2026-09-28',video}],metrics:[]}]};
}
export function validSuite(value:unknown):value is SuiteState {
 if(!value||typeof value!=='object')return false;const s=value as SuiteState;
 return s.version===1&&Array.isArray(s.folders)&&Array.isArray(s.projects)&&Array.isArray(s.storyboards)&&s.folders.every(f=>typeof f.id==='string'&&typeof f.name==='string')&&s.projects.every(p=>typeof p.id==='string'&&typeof p.name==='string'&&s.folders.some(f=>f.id===p.folderId)&&Array.isArray(p.apps)&&Array.isArray(p.media)&&Array.isArray(p.sources)&&Array.isArray(p.creations)&&Array.isArray(p.metrics)&&!!p.brand&&p.creations.every(c=>!c.video||validateProject(c.video))&&(!p.storyboardId||s.storyboards.some(sb=>sb.id===p.storyboardId))&&s.storyboards.every(sb=>sb&&typeof sb.id==='string'&&typeof sb.title==='string'&&typeof sb.createdAt==='string'&&Array.isArray(sb.frames)&&sb.frames.every(f=>f&&typeof f.id==='string'&&typeof f.text==='string'&&typeof f.imageUrl==='string'&&Number.isFinite(f.durationSeconds)&&f.durationSeconds>0&&Number.isInteger(f.order))));
}
export function loadSuite():SuiteState {try{const s=JSON.parse(localStorage.getItem(SUITE_KEY)||'null');if(s&&Array.isArray(s.projects)&&!Array.isArray(s.storyboards))s.storyboards=[];if(validSuite(s))return s;}catch{}return seedSuite();}
export function makeVideo(owner:SuiteProject,name:string,format:string):Project {
 const asset:Asset=owner.media.find(a=>a.id===`brand-canvas-${owner.id}`)||{id:`brand-canvas-${owner.id}`,name:'Brand canvas',type:'image',src:'/demo/brand-canvas.svg',duration:4,origin:'brand'};
 return {version:1,title:name,mode:'Manual',scenes:[{id:newId(),title:'Your opening',caption:'',duration:120,sourceIn:0,assetId:asset.id,kind:'endcard',captionPosition:'top',captionSize:66,captionVisible:true,scale:1,locked:false}],assets:owner.media.some(a=>a.id===asset.id)?[...owner.media]:[...owner.media,asset],musicId:null,musicVolume:.4,musicMuted:false,brief:'',background:owner.brand.background,accent:owner.brand.accent,outputFormat:format as OutputFormat,brandInk:owner.brand.ink,productName:owner.name,headline:'Your story starts here.',website:owner.apps.find(a=>a.platform==='web')?.url||''};
}
export function parseBrandText(text:string,filename:string):Partial<Brand>{
 if(text.length>2_000_000)throw new Error('Use a brand file under 2 MB.');
 const colors=[...new Set(text.match(/#[0-9a-fA-F]{6}\b/g)||[])].slice(0,12);
 let info:any;try{info=JSON.parse(text);}catch{if(filename.endsWith('.json'))throw new Error('This JSON could not be read.');}
 const b=info?.brand||info;
 const color=(v:unknown)=>typeof v==='string'&&/^#[0-9a-f]{6}$/i.test(v)?v:undefined;
 const brightness=(hex:string)=>{const [r,g,b]=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255);return .2126*r+.7152*g+.0722*b;};
 const ordered=[...colors].sort((a,b)=>brightness(a)-brightness(b));
 const light=ordered.at(-1),dark=ordered[0];
 const background=color(b?.background)||(light&&brightness(light)>.65?light:undefined);
 const accent=color(b?.accent)||colors.find(c=>c!==background)||colors[0];
 const ink=color(b?.ink)||(dark&&brightness(dark)<.35?dark:undefined);
 const font=typeof b?.font==='string'?b.font:typeof b?.fonts?.[0]==='string'?b.fonts[0]:text.match(/fontFamily\s*:\s*['"]([^'"]+)['"]/)?.[1];
 return {...(background?{background}:{}),...(accent?{accent}:{}),...(ink?{ink}:{}),...(font?{font:font.slice(0,100)}:{}),source:`Imported · ${filename}`};
}

// M3 URL import: extract brand tokens from fetched page HTML + CSS (brag-style inspection, read-only).
const hexBrightness=(hex:string)=>{const[r,g,b]=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255);return .2126*r+.7152*g+.0722*b};
export function extractBrandTokens(html:string,cssTexts:string[],sourceUrl:string):BrandTokenExtractionResult{
 const css=cssTexts.join('\n')+html;
 // Count color usage across CSS + inline styles; rgb()/rgba() converted, named colors ignored.
 const counter=new Map<string,number>();
 for(const m of css.matchAll(/(?:#(?:[0-9a-f]{3}|[0-9a-f]{6})\b|rgba?\([^)]*\))/gi)){
  const raw=m[0];let hex:string|null=null;
  if(raw[0]==='#'&&raw.length===4)hex=('#'+raw[1]+raw[1]+raw[2]+raw[2]+raw[3]+raw[3]).toUpperCase();
  else if(raw[0]==='#')hex=raw.toUpperCase();
  else{const n=[...raw.matchAll(/[\d.]+/g)].map(Number);if(n.length>=3&&n.slice(0,3).every(v=>v<=255))hex='#'+n.slice(0,3).map(v=>Math.round(v).toString(16).padStart(2,'0')).join('').toUpperCase();}
  if(hex)counter.set(hex,(counter.get(hex)||0)+1); // ponytail: named colors & usage-context weighting can refine later
 }
 const palette=[...counter.entries()].sort((a,b)=>b[1]-a[1]).map(([c])=>c).filter(c=>c!=='#FFFFFF'||counter.size<3).slice(0,8);
 const byLum=[...palette].sort((a,b)=>hexBrightness(a)-hexBrightness(b));
 const isDarkTheme=/<html[^>]*\stheme=["']?dark|<meta[^>]+color-scheme["']?\s*content=["']?dark/i.test(html);
 const light=byLum[byLum.length-1]||'#FFFFFF',dark=byLum[0]||'#24262C';
 const background=isDarkTheme?dark:(byLum.length>1?byLum[byLum.length-2]:light);
 const ink=isDarkTheme?(byLum.length>1?byLum[1]:light):dark;
 const accent=palette.find(c=>c!==background&&c!==ink&&Math.abs(hexBrightness(c)-hexBrightness(background))>.25)
  ||palette.find(c=>c!==background&&c!==ink)||palette[0]||'#a6b5ff';
 // Fonts: first Google Fonts family wins, else most common font-family in CSS.
 const google=[...html.matchAll(/fonts\.googleapis\.com\/css2\?[^"']*family=([^&"':]+)/gi)].map(m=>m[1].replace(/\+/g,' '));
 const famCount=new Map<string,number>();
 for(const m of css.matchAll(/font-family\s*:\s*([^;}]+)/gi)){const f=m[1].split(',')[0].replace(/["']/g,'').trim();if(f&&!/^inherit$/i.test(f))famCount.set(f,(famCount.get(f)||0)+1)}
 const cssFont=[...famCount.entries()].sort((a,b)=>b[1]-a[1]).map(([f])=>f).find(f=>!/^(system-ui|sans-serif|serif|monospace|inherit|ui-monospace|-ui|-apple-system)$/i.test(f)&&!/^(system-ui|sans-serif|serif|monospace)$/i.test(f));
 const font=(google[0]||cssFont||'System sans-serif').slice(0,100);
 // Components: notable UI element counts from markup, brag-style tokens.
 const tags=['header','nav','button','form','input','table','dialog','video','svg'];
 const components:BrandComponent[]=tags.flatMap(t=>{const n=(html.match(new RegExp(`<${t}[\\s>]`,'gi'))||[]).length;return n?[{name:`${t[0].toUpperCase()+t.slice(1)}s`,type:t,count:n}]:[]})
  .sort((a,b)=>b.count!-a.count!).slice(0,4).map(({name,type})=>({name,type}));
 return {colors:{background,accent,ink,palette:palette.length?palette:[background,accent,ink]},font,components:components.length?components:undefined,sourceUrl};
}

export function brandFromTokens(t:BrandTokenExtractionResult):Brand{
 return {...blankBrand(),background:t.colors.background,accent:t.colors.accent,ink:t.colors.ink,font:t.font,components:t.components,sourceUrl:t.sourceUrl,source:`Imported · ${safeHost(t.sourceUrl)}`};
}
export function safeHost(url:string){try{return new URL(url).host}catch{return url.slice(0,60)}}
export async function fetchBrandFromUrl(rawUrl:string):Promise<BrandTokenExtractionResult>{
 let url=rawUrl.trim();if(!/^https?:\/\//i.test(url))url='https://'+url;
 let parsed:URL;try{parsed=new URL(url)}catch{throw new Error('That does not look like a valid URL.')}
 const page=await fetch(parsed.href,{redirect:'follow'});
 if(!page.ok)throw new Error(`Could not load ${parsed.host} (${page.status}).`);
 const html=await page.text();
 const cssLinks=[...html.matchAll(/<link[^>]+rel=["']?stylesheet["']?[^>]*>/gi)].map(m=>m[0]).map(tag=>tag.match(/href=["']([^"']+)["']/i)?.[1]).filter((v):v is string=>!!v).slice(0,8)
  .map(href=>{try{return new URL(href,page.url||parsed.href).href}catch{return null}}).filter((v):v is string=>!!v);
 const cssTexts=await Promise.all(cssLinks.map(async link=>{try{const r=await fetch(link);return r.ok?await r.text():''}catch{return''}}));
 return extractBrandTokens(html,cssTexts,parsed.href);
}
