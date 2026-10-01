#!/usr/bin/env node
/** Storyframe local identity capture. Read-only input. No dependencies or network. */
import {readdir,readFile,writeFile,stat,lstat} from 'node:fs/promises';
import path from 'node:path';
const args=process.argv.slice(2),outAt=args.indexOf('--out');
if(!args[0]||outAt<0||!args[outAt+1]){console.error('Usage: node capture-identity.mjs /path/to/app --out storyframe-identity.json');process.exit(1);}
const root=path.resolve(args[0]),out=path.resolve(args[outAt+1]);
if(!(await stat(root)).isDirectory())throw new Error('The input must be a codebase directory.');
const excluded=new Set(['node_modules','dist','build','coverage','vendor','Pods','android','ios','public','assets','media','video-archive']);
const sensitive=/(?:^|[-_.])(env|secrets?|credentials?|private|keystore|passwords?|auth|tokens?[-_.]?(?:access|refresh))(?:[-_.]|$)/i;
let examined=0,bytes=0;const files=[],colors=new Map(),fonts=new Set();let name=path.basename(root),description='',platforms=[];
const hex=/#(?:[a-f\d]{6}|[a-f\d]{3})\b/gi;
const normalize=c=>c.length===4?'#'+[...c.slice(1)].map(v=>v+v).join(''):c.toLowerCase();
try{const pkgPath=path.join(root,'package.json');const pkgStat=await lstat(pkgPath);if(!pkgStat.isFile()||pkgStat.isSymbolicLink()||pkgStat.size>200_000)throw new Error('Skip package metadata');const pkgText=await readFile(pkgPath,'utf8');if(pkgText.length<200_000){const pkg=JSON.parse(pkgText);name=String(pkg.name||name).slice(0,100);description=String(pkg.description||'').slice(0,1000);const deps={...pkg.dependencies,...pkg.devDependencies};const mobile=!!(deps.expo||deps['react-native']);if(mobile)platforms.push('mobile');if(deps.next||deps.vite||deps['react-dom']||deps['react-native-web']||(!mobile&&deps.react))platforms.push('web');}}catch{}
async function walk(dir,depth=0){if(depth>8||examined>=3000||bytes>=2_000_000)return;for(const entry of await readdir(dir,{withFileTypes:true})){if(++examined>3000||bytes>=2_000_000)break;if(entry.name.startsWith('.')||excluded.has(entry.name)||sensitive.test(entry.name)||entry.isSymbolicLink())continue;const file=path.join(dir,entry.name);if(entry.isDirectory()){await walk(file,depth+1);continue;}if(!entry.isFile()||!(/\.(css|scss)$/.test(entry.name)||(/(tailwind|theme|colors?|fonts?|design.?tokens|^tokens)/i.test(entry.name)&&/\.(json|js|ts|tsx|mjs|cjs)$/.test(entry.name))))continue;const info=await stat(file);if(info.size>200_000)continue;bytes+=info.size;const text=await readFile(file,'utf8');let found=false;for(const match of text.matchAll(hex)){const c=normalize(match[0]);colors.set(c,(colors.get(c)||0)+1);found=true;}for(const match of text.matchAll(/(?:font-family\s*:\s*['"]?|fontFamily\s*:\s*['"])([A-Za-z][A-Za-z0-9 -]{1,50})/gi)){fonts.add(match[1].trim());found=true;}if(found)files.push(path.relative(root,file));}}
await walk(root);
const palette=[...colors].sort((a,b)=>b[1]-a[1]).slice(0,12).map(([value,count])=>({value,count}));
const report={schema:'storyframe.identity.v1',capturedAt:new Date().toISOString(),name,description,platforms,brand:{...(fonts.size?{font:[...fonts][0]}:{})},colors:palette,fonts:[...fonts].slice(0,12),sources:files.slice(0,100),reviewRequired:true,notes:['Palette frequencies are candidates, not semantic colour roles.','Only selected stylesheet/theme files were scanned. Source code was not executed.','No environment files, credentials or image/video bytes are included.','Screenshots and product capabilities need separate review.'],limits:{entriesExamined:examined,bytesRead:bytes}};
await writeFile(out,JSON.stringify(report,null,2)+'\n',{flag:'wx'});
console.log('Identity report saved. Review it locally before importing into Storyframe.');
