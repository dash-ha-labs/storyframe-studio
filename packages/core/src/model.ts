export interface Asset {
  id: string; name: string; type: 'video' | 'image' | 'audio'; src: string;
  poster?: string; duration: number; width?: number; height?: number;
  origin: 'generated' | 'real-ui' | 'imported' | 'brand';
}
export interface Scene {
  id: string; title: string; caption: string; duration: number; sourceIn: number;
  assetId: string; kind: 'footage' | 'product' | 'endcard';
  layout?: 'title'|'product'|'device'|'split'; motion?: 'fade'|'slide'|'zoom'|'none';
  phone?: string; captureTop?: number; captionPosition: 'top' | 'bottom';
  captionSize: number; captionVisible: boolean; scale: number; locked: boolean;
}
export interface Project {
  version: 1; outputFormat?: '9:16'|'16:9'|'1:1'|'4:5'; brandInk?: string; productName?: string; headline?: string; website?: string; title: string; mode: 'Manual' | 'Guided' | 'Autopilot';
  brandFont?: string; templateSlug?: string; generation?: {jobId:string;templateSlug:string;templateRevision:number};
  scenes: Scene[]; assets: Asset[]; musicId: string | null; musicVolume: number;
  musicMuted: boolean; brief: string; background: string; accent: string;
}
export const FPS = 30;
export const MAX_SCENES = 150;
export function layout(scenes: Scene[]) {
  let start = 0;
  return scenes.map(scene => { const item = {...scene, start, end: start + scene.duration}; start += scene.duration; return item; });
}
export function totalFrames(project: Project) {return project.scenes.reduce((n,s)=>n+s.duration,0);}
export function sceneAt(project: Project, frame: number) {const all=layout(project.scenes); return all.find(s=>frame>=s.start && frame<s.end) ?? all[all.length-1];}
export function timecode(frame: number) {const f=Math.max(0,Math.floor(frame));return `${String(Math.floor(f/1800)).padStart(2,'0')}:${String(Math.floor(f/30)%60).padStart(2,'0')}:${String(f%30).padStart(2,'0')}`;}
export function updateScene(project: Project, id: string, patch: Partial<Scene>): Project {
  const current=project.scenes.find(s=>s.id===id);
  if (!current || (current.locked && !('locked' in patch))) return project;
  let next={...current,...patch,id:current.id};
  next.duration=Math.max(15,Math.round(next.duration));
  next.sourceIn=Math.max(0,next.sourceIn);
  const asset=project.assets.find(a=>a.id===next.assetId);
  if(asset?.type==='video') {
    next.sourceIn=Math.min(next.sourceIn,Math.max(0,asset.duration-.5));
    next.duration=Math.min(next.duration,Math.max(15,Math.floor((asset.duration-next.sourceIn)*FPS)));
  }
  return {...project,scenes:project.scenes.map(s=>s.id===id?next:s)};
}
export function reorder(project: Project,id:string,target:string): Project {
  const from=project.scenes.findIndex(s=>s.id===id), to=project.scenes.findIndex(s=>s.id===target);
  if(from<0||to<0||from===to||project.scenes.slice(Math.min(from,to),Math.max(from,to)+1).some(s=>s.locked))return project;
  const scenes=[...project.scenes]; const [scene]=scenes.splice(from,1); scenes.splice(to,0,scene); return {...project,scenes};
}
export function splitScene(project:Project,id:string,offset:number,newId:string):Project {
  const at=project.scenes.findIndex(s=>s.id===id), s=project.scenes[at];
  if(!s||s.locked||!Number.isInteger(offset)||offset<15||s.duration-offset<15||project.scenes.length>=MAX_SCENES)return project;
  const left={...s,duration:offset}, right={...s,id:newId,title:`${s.title} · cut`,duration:s.duration-offset,sourceIn:s.sourceIn+offset/FPS};
  return {...project,scenes:[...project.scenes.slice(0,at),left,right,...project.scenes.slice(at+1)]};
}
export function validateProject(value: unknown): value is Project {
  if(!value||typeof value!=='object')return false;
  const p=value as Project;
  if(p.outputFormat&&!['9:16','16:9','1:1','4:5'].includes(p.outputFormat))return false;
  if(p.templateSlug!==undefined&&(typeof p.templateSlug!=='string'||! /^[a-z0-9-]{1,100}$/.test(p.templateSlug)))return false;
  if(p.brandFont!==undefined&&(typeof p.brandFont!=='string'||p.brandFont.length>100))return false;
  if(p.generation!==undefined&&(!p.generation||typeof p.generation.jobId!=='string'||p.generation.jobId.length>80||typeof p.generation.templateSlug!=='string'||!Number.isInteger(p.generation.templateRevision)))return false;
  if(p.version!==1||typeof p.title!=='string'||p.title.length>200||!Array.isArray(p.scenes)||!Array.isArray(p.assets)||p.assets.length>300||!p.scenes.length||p.scenes.length>MAX_SCENES)return false;
  if(!['Manual','Guided','Autopilot'].includes(p.mode)||typeof p.brief!=='string'||!/^#[\da-f]{6}$/i.test(p.background)||!/^#[\da-f]{6}$/i.test(p.accent))return false;
  if(!Number.isFinite(p.musicVolume)||p.musicVolume<0||p.musicVolume>1||typeof p.musicMuted!=='boolean')return false;
  const ids=new Set<string>();
  if(!p.assets.every(a=>a&&typeof a.id==='string'&&!ids.has(a.id)&&(ids.add(a.id),true)&&typeof a.name==='string'&&['video','image','audio'].includes(a.type)&&typeof a.src==='string'&&(/^\/demo\/[\w.-]+$/.test(a.src)||/^local:[\w-]+$/.test(a.src))&&Number.isFinite(a.duration)&&a.duration>=0))return false;
  if(p.musicId!==null&&!p.assets.some(a=>a.id===p.musicId&&a.type==='audio'))return false;
  const sceneIds=new Set<string>();
  return p.scenes.every(s=>{
    if(!(s&&typeof s.id==='string'&&!sceneIds.has(s.id)&&(sceneIds.add(s.id),true)&&ids.has(s.assetId)&&typeof s.title==='string'&&typeof s.caption==='string'&&s.caption.length<=1000&&Number.isInteger(s.duration)&&s.duration>=15&&s.duration<=18000&&Number.isFinite(s.sourceIn)&&s.sourceIn>=0&&['footage','product','endcard'].includes(s.kind)&&['top','bottom'].includes(s.captionPosition)&&Number.isFinite(s.captionSize)&&s.captionSize>=20&&s.captionSize<=160&&Number.isFinite(s.scale)&&s.scale>=.5&&s.scale<=2&&typeof s.locked==='boolean'&&typeof s.captionVisible==='boolean'&&(!s.phone||/^\/demo\/[\w.-]+$/.test(s.phone))))return false;
    if(s.layout!==undefined&&!['title','product','device','split'].includes(s.layout))return false;
    if(s.motion!==undefined&&!['fade','slide','zoom','none'].includes(s.motion))return false;
    const a=p.assets.find(a=>a.id===s.assetId)!;
    return a.type!=='audio' && (a.type!=='video'||s.sourceIn+s.duration/FPS<=a.duration+1e-4) && (s.captureTop===undefined||(Number.isFinite(s.captureTop)&&s.captureTop>=0&&s.captureTop<=1920));
  });
}
