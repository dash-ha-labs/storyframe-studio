// Offline technical smoke test. No provider request, no claim of subjective/parity review.
import {resolve} from 'node:path';
import {randomUUID} from 'node:crypto';
import {makeVideo,blankBrand} from '../../packages/core/src/suite-model.ts';
import {renderProject} from '../../services/brag/render.mjs';
const owner={id:'offline-fixture',folderId:'test',name:'Sample product',description:'Illustrative render fixture',brand:{...blankBrand(),background:'#ffffff',accent:'#2142e7',ink:'#182b4e'},apps:[],media:[],sources:[],creations:[],metrics:[]};
const project=makeVideo(owner,'Offline rendering check','16:9');project.scenes=Array.from({length:2},(_,i)=>({...project.scenes[0],id:'fixture-'+i,title:i?'Second scene':'First scene',caption:i?'Edit every scene.':'From idea to video.',captionVisible:true,layout:'title',motion:'slide',duration:60}));
const outputRoot=resolve('data/render-verification'),id=randomUUID();
console.log('Output:',resolve(outputRoot,id));
console.log(await renderProject({id,project,media:{},outputRoot,onStage:console.log}));
