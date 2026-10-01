export type TemplateCategory = 'Launches'|'Product updates'|'Feature demos'|'Free trials'|'YouTube'|'Social ads'|'Websites'|'Mobile apps'|'Education'|'Customer stories';
export type CatalogTemplate = { slug:string; title:string; category:TemplateCategory; platform:'Web'|'Mobile'|'Any'; format:'16:9'|'9:16'|'1:1'; style:'Clean'|'Bold'|'Editorial'; description:string; proof:string; audience:string; scenes:{title:string;instruction:string;seconds:number}[]; duration:number; color:string; featured:boolean };
export const TEMPLATE_CATEGORIES:TemplateCategory[]=['Launches','Product updates','Feature demos','Free trials','YouTube','Social ads','Websites','Mobile apps','Education','Customer stories'];
// Each entry is an authored use case. Website recipes carry editable scene structure,
// not fabricated customer footage, usage metrics or generation results.
const entries = [
['Launches','SaaS product launch','Web','Introduce a new workspace','Show the first useful result in your dashboard'],
['Launches','Mobile app debut','Mobile','Introduce an app to first-time users','Show the main action on a real phone capture'],
['Launches','New website reveal','Web','Announce a redesigned website','Move from the homepage to the most useful page'],
['Launches','Product Hunt launch','Web','Give early adopters a clear reason to try','Demonstrate the differentiating workflow'],
['Launches','Beta invitation','Any','Invite a focused group of early testers','Show the task they can test today'],
['Launches','Founder introduction','Any','Explain why you built the product','Pair a founder introduction with a real product action'],
['Launches','Waitlist announcement','Any','Introduce a product before general access','Show the product promise with an actual prototype screen'],
['Launches','Desktop app launch','Web','Introduce a desktop workflow','Show the app window completing one task'],
['Launches','AI tool introduction','Web','Explain an AI-assisted workflow','Show an input and a reviewed output together'],
['Launches','Marketplace opening','Web','Introduce a new place to discover products','Browse a category and open one useful listing'],
['Product updates','Monthly release roundup','Any','Keep existing users up to date','Show three meaningful changes in sequence'],
['Product updates','One-feature announcement','Any','Make a new capability easy to understand','Compare the old task with the new control'],
['Product updates','Redesigned dashboard','Web','Orient users after a dashboard redesign','Point out the relocated controls with real captures'],
['Product updates','Integration announcement','Web','Show how two tools now work together','Follow one item from its source to its destination'],
['Product updates','Performance improvement','Any','Explain a measured workflow improvement','Use your own recorded timings and the same task'],
['Product updates','New mobile experience','Mobile','Introduce an updated mobile workflow','Show the updated screen and its primary action'],
['Product updates','Changelog highlight','Web','Turn one release note into a useful visual','Pair the release note with the changed interface'],
['Product updates','Accessibility update','Any','Explain a specific accessibility improvement','Demonstrate the interaction using the improved control'],
['Product updates','New language release','Any','Welcome users in a newly supported language','Show the language selector and localized interface'],
['Product updates','Workflow migration','Web','Help users move to a new workflow','Show where the old task now begins and ends'],
['Feature demos','Dashboard walkthrough','Web','Explain one dashboard task','Select a view and interpret the resulting information'],
['Feature demos','Search in action','Web','Help users find the right item','Enter a realistic query and narrow the results'],
['Feature demos','Collaboration demo','Any','Show how people work together','Add a comment and show how a teammate responds'],
['Feature demos','Automation walkthrough','Web','Explain a repeatable automation','Show the trigger, rule and resulting action'],
['Feature demos','Analytics explainer','Web','Make a report understandable','Choose a date range and explain one metric'],
['Feature demos','Import your data','Web','Reduce uncertainty around an import','Select a sample file and review the mapped fields'],
['Feature demos','Export a result','Web','Help users take their work elsewhere','Open export settings and show the saved result'],
['Feature demos','Keyboard shortcut spotlight','Web','Teach a faster way to perform one task','Show the shortcut beside its visible result'],
['Feature demos','Phone mockup showcase','Mobile','Present a mobile feature in context','Place an exact screenshot inside a phone frame'],
['Feature demos','Before and after workflow','Any','Explain how a task becomes simpler','Use the same task and comparable starting conditions'],
['Free trials','First session welcome','Web','Help a new trial user begin','Show the first action after opening the workspace'],
['Free trials','Your first project','Any','Get a trial user to a first saved project','Name a project and add its first piece of content'],
['Free trials','Activation checklist','Web','Guide the first useful setup steps','Show the short path from setup to first result'],
['Free trials','Invite your team','Web','Explain team onboarding','Open the invite flow using fictional sample accounts'],
['Free trials','Connect your first source','Web','Help users bring their own content','Choose a source and review the imported information'],
['Free trials','Trial value recap','Any','Help users recognize what they have made','Use their own project milestones without invented metrics'],
['Free trials','Return to your draft','Any','Bring users back to unfinished work','Open a saved draft at the next useful action'],
['Free trials','Explore a second feature','Any','Introduce a relevant next capability','Connect a completed task to its natural next step'],
['Free trials','Trial FAQ video','Web','Answer one common trial question','Show the exact screen that resolves the question'],
['Free trials','Aha moment demo','Any','Help a new user reach a meaningful result','Show the shortest repeatable path to that result'],
['YouTube','Product walkthrough video','Web','Create a focused long-form product tour','Move through a task with readable chapter breaks'],
['YouTube','Software tutorial intro','Web','Introduce a practical tutorial','Show the result viewers will learn to make'],
['YouTube','Feature comparison','Any','Compare two real approaches to a task','Use consistent examples and verified differences'],
['YouTube','Weekly build log','Any','Share progress on a product build','Show a shipped change and the decision behind it'],
['YouTube','Screen recording explainer','Web','Explain a recorded workflow','Pair a continuous action with concise captions'],
['YouTube','YouTube Shorts demo','Mobile','Teach one action in a vertical clip','Keep one phone-sized control and result in focus'],
['YouTube','Release notes video','Web','Turn a release into a chaptered video','Give each meaningful update its own short segment'],
['YouTube','Founder product breakdown','Any','Explain a product decision in context','Pair your explanation with the relevant app screen'],
['YouTube','Tutorial outro','Any','Give viewers a useful next step','Show the finished result and one related lesson'],
['YouTube','Webinar highlight','Web','Repurpose one useful webinar moment','Keep the question, demonstration and answer together'],
['Social ads','Vertical app ad','Mobile','Introduce one mobile benefit in a feed','Show the relevant action within the opening scene'],
['Social ads','Square product ad','Any','Present a product in a square placement','Keep the product and caption inside a square frame'],
['Social ads','LinkedIn product demo','Web','Explain a work-related product benefit','Demonstrate a realistic professional workflow'],
['Social ads','Instagram feature reel','Mobile','Make one feature clear on a phone','Use large interface crops and a short caption'],
['Social ads','Retargeting reminder','Any','Remind interested viewers of a useful capability','Return to the product action they already recognize'],
['Social ads','Offer announcement','Any','Explain a genuine product offer','Show the actual offer terms and relevant product value'],
['Social ads','Problem and solution ad','Any','Connect a recognizable problem to a product action','Show the problem briefly before demonstrating the solution'],
['Social ads','Carousel companion video','Any','Turn a static story into a short video','Follow the same sequence as the companion carousel'],
['Social ads','Event promotion','Web','Invite viewers to a product event','Show the topic, date and registration destination'],
['Social ads','App store campaign','Mobile','Help viewers understand the app before installing','Show real interface actions at a readable scale'],
['Websites','Homepage hero video','Web','Show product value beside a homepage headline','Demonstrate one core workflow without dense captions'],
['Websites','Landing page demo','Web','Support a focused campaign landing page','Match the product action to the page promise'],
['Websites','Pricing page explainer','Web','Explain a product option with context','Show a real workflow relevant to that option'],
['Websites','Feature page loop','Web','Give a feature page a concise demonstration','Start and end on a compatible interface state'],
['Websites','Checkout walkthrough','Web','Explain an online purchase flow','Use test data and show each required decision'],
['Websites','Portfolio project story','Web','Present the purpose of a portfolio project','Show the problem, your interface and its result'],
['Websites','Agency service demo','Web','Make a service tangible through its deliverable','Show an authorized example and explain the process'],
['Websites','Ecommerce product page','Web','Explain a product page interaction','Choose a variant and show its relevant details'],
['Websites','Booking flow demo','Web','Show how to book a service','Select an available slot using sample details'],
['Websites','Website redesign case','Web','Explain a design change through a user task','Compare the same task on both versions'],
['Mobile apps','App onboarding sequence','Mobile','Introduce the app without overwhelming users','Show the first meaningful setup action'],
['Mobile apps','One tap feature','Mobile','Highlight a simple mobile interaction','Hold on the control before showing its result'],
['Mobile apps','Mobile dashboard tour','Mobile','Orient viewers within a mobile dashboard','Show the primary screen and one useful detail'],
['Mobile apps','App notification flow','Mobile','Explain what happens after a notification','Show the notification and the destination screen'],
['Mobile apps','Mobile checkout demo','Mobile','Make a mobile purchase flow understandable','Use a test checkout with no personal payment data'],
['Mobile apps','Gesture walkthrough','Mobile','Teach a gesture through visible feedback','Show the gesture location and resulting interface state'],
['Mobile apps','App settings tip','Mobile','Help users personalize one setting','Open the setting and show its visible effect'],
['Mobile apps','Mobile search story','Mobile','Demonstrate search on a small screen','Enter a useful query and open one result'],
['Mobile apps','App sharing feature','Mobile','Show how to share product content','Use sample recipients and a non-sensitive example'],
['Mobile apps','Tablet app showcase','Mobile','Present a workflow on a larger touch screen','Show the layout and one touch interaction'],
['Education','Quick start lesson','Any','Teach the minimum steps to begin','Show a complete first task from an empty state'],
['Education','Three step how-to','Any','Explain a short repeatable task','Give each step one action and a visible outcome'],
['Education','Troubleshooting guide','Web','Resolve one concrete product problem','Show the symptom, the setting and the corrected result'],
['Education','Advanced workflow lesson','Web','Teach a workflow for experienced users','Name prerequisites before demonstrating the sequence'],
['Education','Safety settings guide','Any','Help users understand a privacy-related control','Explain the effect using a fictional project'],
['Education','Team training clip','Web','Teach a shared team convention','Demonstrate the agreed naming or review workflow'],
['Education','Import format guide','Web','Explain what an import file needs','Compare a small sample file with its mapped result'],
['Education','Template customization lesson','Any','Teach users to adapt a starter','Replace the example text and apply a project brand'],
['Education','Workflow checklist video','Any','Turn a checklist into a visual review','Show each check on the actual finished project'],
['Education','Help center answer','Web','Answer one support question visually','Open the relevant screen and perform the action'],
['Customer stories','Customer workflow story','Any','Explain an authorized customer use case','Show the actual task and a supported outcome'],
['Customer stories','Before and after case study','Any','Compare a real workflow change','Use evidence from both versions of the same task'],
['Customer stories','Customer quote highlight','Any','Share an approved customer quote','Pair the exact quote with the product feature discussed'],
['Customer stories','Team adoption story','Web','Show how a team adopted a product','Present the setup and a repeatable shared workflow'],
['Customer stories','Creator spotlight','Any','Show what a creator built','Feature their approved work and the relevant editing steps'],
['Customer stories','Agency project showcase','Web','Explain a client project with permission','Show the brief and authorized final deliverable'],
['Customer stories','Community use case','Any','Share a useful community workflow','Show the contributor-approved example and its steps'],
['Customer stories','Founder customer interview','Any','Turn an interview into a focused product story','Keep the customer question and demonstrated answer together'],
['Customer stories','Result breakdown','Web','Explain a verified project result','Show the original evidence with context and time period'],
['Customer stories','Customer tutorial','Any','Teach a workflow demonstrated by a customer','Use an approved recording and preserve its real interface'],
] as const;

export const TEMPLATES:CatalogTemplate[]=entries.map(([category,title,platform,audience,proof],i)=>{
 const format=category==='YouTube'&& !title.includes('Shorts')?'16:9':platform==='Mobile'?'9:16':title.includes('Square')?'1:1':'16:9';
 const teaching=category==='YouTube'||category==='Education';
 const sceneDefs=teaching?[
  ['The result',`Show what viewers will learn: ${audience.toLowerCase()}.`,5],
  ['Before you begin','Show the starting screen and name any prerequisites.',8],
  ['The walkthrough',proof+'.',20],
  ['Check your work','Hold on the result and explain how to recognize success.',10],
  ['Keep learning','End with one related action or lesson.',5],
 ]:category==='Customer stories'?[
  ['The context',audience+'.',5],['The workflow',proof+'.',12],['The evidence','Add a verified outcome or approved quote; keep its context.',8],['Try the workflow','Invite viewers to try the demonstrated task.',5],
 ]:[['The opening',audience+'.',4],['The product action',proof+'.',8],['The useful result','Hold on the actual result so the viewer can read it.',5],['The next step','Close with your product name and one clear invitation.',3]];
 const scenes=sceneDefs.map(([title,instruction,seconds])=>({title:String(title),instruction:String(instruction),seconds:Number(seconds)}));
 return {slug:title.toLowerCase().replace(/[^a-z0-9]+/g,'-'),title,category,platform,format,style:(['Clean','Bold','Editorial'] as const)[i%3],description:`${audience}. ${proof}.`,proof,audience,scenes,duration:scenes.reduce((n,s)=>n+s.seconds,0),color:['blue','mint','peach','lilac'][i%4],featured:i%10===0};
});
export type ResourceType='Brief'|'Brand kit'|'Checklist'|'Storyboard'|'Script'|'Prompt pack';
export type CatalogResource={slug:string;title:string;type:ResourceType;description:string;contents:string[];use:string;template:string;format:'TXT'|'JSON';downloadLabel:string;color:string;brand?:{background:string;accent:string;ink:string;font:string;voice:string}};
export const RESOURCES:CatalogResource[]=[
 {slug:'product-launch-brief',title:'Product launch brief',type:'Brief',description:'Turn a product idea into one audience, one proof point and a clear next step.',contents:['What are you launching? Write one sentence.','Who is it for? Name one specific audience.','What frustrating moment does it improve?','Which real product action proves the benefit?','What should the viewer do next?'],use:'Start a launch video with these questions in your creative brief.',template:'saas-product-launch',format:'TXT',downloadLabel:'Download brief',color:'blue'},
 {slug:'starter-brand-kit',title:'Starter brand kit',type:'Brand kit',description:'A readable palette, Inter typography and a concise voice for your next project.',contents:['White background · #ffffff','Cobalt accent · #2142e7','Navy text · #182b4e','Inter typography','Voice: clear, curious and useful.'],use:'Create a new branded project so your existing project colors stay intact.',template:'saas-product-launch',format:'JSON',downloadLabel:'Download brand kit',color:'lilac',brand:{background:'#ffffff',accent:'#2142e7',ink:'#182b4e',font:'Inter',voice:'Clear, curious and useful.'}},
 {slug:'product-demo-shot-list',title:'Product demo shot list',type:'Checklist',description:'Capture the screens you need for a clear product demo, from opening state to final result.',contents:['Product name or opening title','Starting screen showing the problem','Cursor or finger at the real control','The action recorded without interruption','The result held long enough to read','One useful caption in plain language','Closing frame with one next step'],use:'Add the checklist to the brief of a new walkthrough.',template:'product-walkthrough-video',format:'TXT',downloadLabel:'Download checklist',color:'mint'},
 {slug:'three-scene-storyboard',title:'Three-scene storyboard',type:'Storyboard',description:'Plan the problem, product action and result before opening the timeline.',contents:['The problem: show a recognizable starting state.','The action: demonstrate one useful product interaction.','The result: hold on the outcome and name the next step.'],use:'Create an editable storyboard with three independent frames.',template:'problem-and-solution-ad',format:'JSON',downloadLabel:'Download storyboard',color:'peach'},
 {slug:'feature-demo-script',title:'Feature demo script',type:'Script',description:'A short script that explains one feature without narrating every click.',contents:['Opening: Here is how to [complete the task].','Context: Start with [the required screen or content].','Action: Choose [the control] to [perform the action].','Result: You now have [the visible result].','Close: Try it with [a useful next input].'],use:'Create a feature video with the script ready in its brief.',template:'one-feature-announcement',format:'TXT',downloadLabel:'Download script',color:'blue'},
 {slug:'ai-scene-prompt-pack',title:'Product scene prompts',type:'Prompt pack',description:'Reusable prompts for thinking through a launch, a feature demo and a product update.',contents:['Plan a four-scene launch for [product] and [audience]. Use only these verified features: [list].','Suggest three ways to explain [feature] using this real screenshot: [reference].','Rewrite this caption in our brand voice without changing its claim: [caption].','Compare these scene ideas for clarity, product fidelity and reading time.'],use:'Keep the prompt collection in a new video brief; adapt it before making an AI request.',template:'ai-tool-introduction',format:'TXT',downloadLabel:'Download prompts',color:'lilac'},
 {slug:'vertical-video-checklist',title:'Vertical video checklist',type:'Checklist',description:'Check crops, captions and interface readability before publishing a portrait video.',contents:['Choose 9:16 before framing.','Keep the meaningful control large enough to read.','Keep captions clear of the captured action.','Check the start and end of every scene.','Preview on a phone-sized screen.'],use:'Start a portrait app video with the checklist attached to its brief.',template:'vertical-app-ad',format:'TXT',downloadLabel:'Download checklist',color:'mint'},
 {slug:'release-update-storyboard',title:'Release update storyboard',type:'Storyboard',description:'Give a release its own opening, feature proof and invitation to try.',contents:['What changed: name the update in plain language.','Where it lives: show the new control in context.','How it works: perform one useful action.','Try it: close on the result and next step.'],use:'Create a four-frame storyboard you can attach to a product project.',template:'monthly-release-roundup',format:'JSON',downloadLabel:'Download storyboard',color:'peach'},
 {slug:'customer-story-brief',title:'Customer story brief',type:'Brief',description:'Collect the context, permissions and evidence behind a useful customer story.',contents:['Who is the customer and who approved the story?','What task were they trying to complete?','Which recording demonstrates the real workflow?','What result can you support with evidence?','Which exact quote is approved for publication?'],use:'Start a customer-story edit with the evidence questions in its brief.',template:'customer-workflow-story',format:'TXT',downloadLabel:'Download brief',color:'blue'},
 {slug:'youtube-tutorial-script',title:'YouTube tutorial script',type:'Script',description:'An outcome-first outline for a tutorial with a clear beginning and useful chapters.',contents:['Show the finished result.','List the starting materials or settings.','Demonstrate the task in distinct steps.','Explain how to check the result.','Link to one next lesson.'],use:'Create a landscape tutorial edit with chapter-ready scenes.',template:'software-tutorial-intro',format:'TXT',downloadLabel:'Download script',color:'lilac'},
 {slug:'calm-brand-kit',title:'Calm brand kit',type:'Brand kit',description:'A white, evergreen and ink palette for thoughtful product demonstrations.',contents:['White background · #ffffff','Evergreen accent · #20816c','Ink text · #203c36','Inter typography','Voice: calm, specific and helpful.'],use:'Create a fresh project with this palette without changing an existing brand.',template:'homepage-hero-video',format:'JSON',downloadLabel:'Download brand kit',color:'mint',brand:{background:'#ffffff',accent:'#20816c',ink:'#203c36',font:'Inter',voice:'Calm, specific and helpful.'}},
 {slug:'caption-writing-prompts',title:'Caption writing prompts',type:'Prompt pack',description:'Write concise captions that explain value while leaving the interface room to speak.',contents:['Shorten this caption to one clear idea: [text].','Describe the visible result without narrating the click: [action].','Write three accurate opening captions for this product action: [context].','Check this caption against the screenshot. Remove anything the image does not support.'],use:'Add caption prompts to the brief of a new feature video.',template:'screen-recording-explainer',format:'TXT',downloadLabel:'Download prompts',color:'peach'},
];
export function resourceDownload(resource:CatalogResource):string {
 if(resource.type==='Brand kit')return JSON.stringify(resource.brand,null,2);
 if(resource.type==='Storyboard')return JSON.stringify({title:resource.title,frames:resource.contents.map((text,order)=>({text,durationSeconds:4,order}))},null,2);
 return `${resource.title.toUpperCase()}\n\n${resource.contents.map((text,i)=>`${i+1}. ${text}`).join('\n')}\n`;
}
export function filterTemplates(search:URLSearchParams):CatalogTemplate[] {
 const q=(search.get('q')||'').trim().toLowerCase();
 const matches=TEMPLATES.filter(t=>(!q||`${t.title} ${t.description} ${t.category} ${t.platform}`.toLowerCase().includes(q))&&(['category','platform','format','style'] as const).every(key=>!search.getAll(key).length||search.getAll(key).includes(t[key]))&&(!search.get('duration')||(search.get('duration')==='short'?t.duration<=30:t.duration>30)));
 const sort=search.get('sort');return [...matches].sort((a,b)=>sort==='name'?a.title.localeCompare(b.title):sort==='duration'?a.duration-b.duration||a.title.localeCompare(b.title):Number(b.featured)-Number(a.featured));
}
