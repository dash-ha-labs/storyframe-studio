import {Asset, Project, validateProject} from './model';
import demoData from './demo.json';
export type ToolId='video'|'brand';
export type Platform='web'|'mobile';
export type OutputFormat='9:16'|'16:9'|'1:1'|'4:5';
export interface Brand {background:string;accent:string;ink:string;font:string;voice:string;source:string;}
export interface SourceApp {id:string;name:string;platform:Platform;url:string;}
export interface SourceFile {name:string;kind:string;mediaId?:string;}
export interface Creation {id:string;tool:ToolId;name:string;format:string;brief:string;content:string;updated:string;video?:Project;}
export interface SuiteProject {id:string;folderId:string;name:string;description:string;apps:SourceApp[];brand:Brand;media:Asset[];sources:SourceFile[];creations:Creation[];metrics:{date:string;visits:string;installs:string;notes:string}[];}
export interface SuiteState {version:1;folders:{id:string;name:string}[];projects:SuiteProject[];}
export const SUITE_KEY='storyframe.suite.v1';
export const TOOLS:{id:ToolId;name:string;description:string;label:string;formats:string[]}[]=[
{id:'video',name:'Video studio',description:'Product stories, with your real UI.',label:'Create video',formats:['9:16','16:9','1:1','4:5']},
{id:'brand',name:'Brand builder',description:'Build or refine your visual identity.',label:'Edit brand',formats:[]}
];
export const newId=()=>crypto.randomUUID();
export const blankBrand=():Brand=>({background:'#f4f1eb',accent:'#a6b5ff',ink:'#24262c',font:'System sans-serif',voice:'Clear, friendly and useful.',source:'Manual'});
export function seedSuite():SuiteState {
 let video=structuredClone(demoData) as Project;
 try {const previous=JSON.parse(localStorage.getItem('storyframe.project.v1')||'null');if(validateProject(previous))video=previous;}catch{}
 return {version:1,folders:[{id:'launches',name:'My products'}],projects:[{id:'kurutu',folderId:'launches',name:'Kurutu',description:'A calmer grocery run. Shared lists, smart suggestions, loyalty cards and purchase records.',apps:[{id:'kurutu-mobile',name:'Kurutu mobile',platform:'mobile',url:''},{id:'kurutu-web',name:'Kurutu website',platform:'web',url:'https://kurutu.com'}],brand:{background:video.background,accent:video.accent,ink:'#282828',font:'Bricolage Grotesque',voice:'Warm, practical and quietly playful. Make everyday collaboration feel easy.',source:'Existing Kurutu campaign'},media:video.assets,sources:[{name:'Kurutu design system',kind:'Existing campaign reference'},{name:'App component captures',kind:'Fixture data · original UI'}],creations:[{id:'grocery-evolution',tool:'video',name:video.title,format:'9:16',brief:video.brief,content:'',updated:'2026-09-28',video}],metrics:[]}]};
}
export function validSuite(value:unknown):value is SuiteState {
 if(!value||typeof value!=='object')return false;const s=value as SuiteState;
 return s.version===1&&Array.isArray(s.folders)&&Array.isArray(s.projects)&&s.folders.every(f=>typeof f.id==='string'&&typeof f.name==='string')&&s.projects.every(p=>typeof p.id==='string'&&typeof p.name==='string'&&s.folders.some(f=>f.id===p.folderId)&&Array.isArray(p.apps)&&Array.isArray(p.media)&&Array.isArray(p.sources)&&Array.isArray(p.creations)&&Array.isArray(p.metrics)&&!!p.brand&&p.creations.every(c=>!c.video||validateProject(c.video)));
}
export function loadSuite():SuiteState {try{const s=JSON.parse(localStorage.getItem(SUITE_KEY)||'null');if(validSuite(s))return s;}catch{}return seedSuite();}
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
