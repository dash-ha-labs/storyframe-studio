import {test} from 'node:test';
import assert from 'node:assert/strict';
import {seedSuite,makeVideo,parseBrandText,validSuite,newStoryboard,blankFrame,TOOLS,extractBrandTokens,brandFromTokens,safeHost} from '../src/suite-model';
import {validateProject} from '../src/model';
test('suite keeps product platforms separate from creation formats',()=>{const suite=seedSuite();assert.ok(validSuite(suite));const owner=suite.projects[0];const video=makeVideo(owner,'Landscape demo','16:9');assert.equal(video.outputFormat,'16:9');assert.ok(validateProject(video));assert.deepEqual(owner.apps.map(a=>a.platform),['mobile','web']);assert.equal(video.productName,owner.name);});
test('creating a video does not mutate shared project media',()=>{const owner=seedSuite().projects[0],count=owner.media.length;const video=makeVideo(owner,'New','1:1');assert.equal(owner.media.length,count);assert.equal(video.assets.length,count+1);assert.notEqual(video.assets,owner.media);assert.equal(video.scenes.length,1);assert.ok(!video.musicId);});
test('brand import supports semantic JSON and never executes Tailwind code',()=>{assert.equal(parseBrandText('{"brand":{"accent":"#123456","font":"Example Sans"}}','brand.json').accent,'#123456');const parsed=parseBrandText('throw new Error("do not execute"); export default { colors: { brand: "#c0ffee", ink: "#112233" } }','tailwind.config.ts');assert.equal(parsed.background,'#c0ffee');assert.equal(parsed.accent,'#112233');assert.throws(()=>parseBrandText('not JSON','brand.json'));});
test('video format validation rejects unsupported formats',()=>{const video=makeVideo(seedSuite().projects[0],'New','9:16');assert.ok(validateProject(video));assert.equal(validateProject({...video,outputFormat:'mobile'}),false);});
test('storyboard creation adds independent entity and validates',()=>{const suite=seedSuite();const sb=newStoryboard('Launch teaser');const next={...suite,storyboards:[sb,...suite.storyboards]};assert.equal(sb.frames.length,0);assert.ok(next.storyboards.length>suite.storyboards.length);assert.ok(validSuite(next));assert.equal(validSuite({...next,storyboards:[{...sb,frames:[blankFrame(0)]}]}),true);assert.equal(validSuite({...next,storyboards:[{...sb,frames:[{...blankFrame(0),durationSeconds:0}]}]}),false);});
test('project storyboardId must reference an existing storyboard',()=>{const suite=seedSuite();assert.ok(validSuite(suite));assert.equal(validSuite({...suite,projects:suite.projects.map(p=>({...p,storyboardId:'missing'}))}),false);const sb=newStoryboard('X');assert.ok(validSuite({...suite,storyboards:[sb],projects:suite.projects.map(p=>({...p,storyboardId:sb.id}))}));});
test('toolkit contains only core tools: video studio and brand assets',()=>{assert.deepEqual(TOOLS.map(t=>({id:t.id,name:t.name})),[{id:'video',name:'Video studio'},{id:'brand',name:'Brand Design'}]);});

test('brand URL import extracts palette, font and components from html+css',()=>{
 const html='<html><head><link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400&display=swap" rel="stylesheet"><style>.btn{color:#5B8DEF;background:#101418}.card{background:#101418;color:#F5F7FA}</style></head><body><button>Go</button><button>Stop</button><nav> x</nav><input placeholder="q"><div style="color:rgb(91,141,239)">hi</div></body></html>';
 const r=extractBrandTokens(html,['.a{background:#101418;color:#F5F7FA}.b{border-color:#5B8DEF}'],'https://acme.dev');
 assert.equal(r.sourceUrl,'https://acme.dev');
 assert.equal(r.colors.background,'#5B8DEF'); // light site: second-lightest real swatch (pure white text beats canvas claim)
 assert.equal(r.colors.ink,'#101418'); // darkest swatch inks on light canvas
 assert.equal(r.colors.accent,'#F5F7FA'); // remaining mid/high-contrast colour
 assert.equal(r.font,'Space Grotesk');
 assert.ok(r.components!.some(c=>c.name==='Buttons'&&c.type==='button'));
 assert.ok(r.components!.every(c=>!c.count));
});
test('brand URL import prefers dark theme background when html marks theme=dark',()=>{
 const html='<html theme="dark"><head><style>.x{background:#0B0D10;color:#E8ECF2}.y{background:#FFFFFF}</style></head></html>';
 const r=extractBrandTokens(html,[],'https://dark.io');
 assert.equal(r.colors.background,'#0B0D10');
 assert.equal(r.colors.ink,'#E8ECF2');
});
test('brandFromTokens stamps sourceUrl and component list without count leaks',()=>{
 const t=extractBrandTokens('<html><style>.a{color:#123456}</style><button>a</button></html>',[],'https://x.co');
 const b=brandFromTokens(t);
 assert.equal(b.sourceUrl,'https://x.co');
 assert.ok(b.source.startsWith('Imported · x.co'));
 assert.deepEqual(b.components!.map(c=>c.name),['Buttons']);
});
test('safeHost falls back to truncated raw string for invalid url',()=>{
 assert.equal(safeHost('https://ok.com/path'),'ok.com');
 assert.equal(safeHost('not a url'),'not a url');
});
