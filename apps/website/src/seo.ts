import {TEMPLATES,RESOURCES} from './data/catalog';
import {COURSES,DOC_SECTIONS} from './data/learning';
import {BLOG_POSTS} from './data/blog-data';
export const SITE_ORIGIN='https://storyframe.yamu.app';
export type PageMetadata={title:string;description:string;path:string;type:string;noindex?:boolean;schema?:Record<string,unknown>};
const indexPages:Record<string,[string,string]>={
 '/':['From your idea to a video in minutes','An AI-aided, brand-aware video builder. Bring screenshots and footage, plan a storyboard and edit every scene. Free signup, no credit card required.'],
 '/features':['Video creation features','Explore brand design, storyboards, scene editing, AI workflows and product video creation in Storyframe.'],
 '/templates':['Free video templates','Browse 100 editable templates for product launches, mobile apps, websites, YouTube tutorials and social ads. Find your format and start free.'],
 '/resources':['Free creative resources','Download briefs, scripts, brand kits, checklists, storyboards and prompt packs, or use them in a Storyframe project.'],
 '/tutorials':['Product video tutorials','Learn Storyframe through practical courses in video editing, storyboarding, brand design, social formats and AI scene planning.'],
 '/docs':['Storyframe product documentation','Find guides for getting started, projects, branding, templates, video editing, media, AI requests, saving, accounts and billing.'],
 '/blog':['Ideas for better product videos','Explore product video techniques, creative workflows and practical ways to show what your app can do.'],
 '/roadmap':['Product roadmap & community ideas','See what is next for Storyframe. Share a proposal, vote for useful improvements and follow selected ideas onto the product timeline.'],
 '/status':['Product status','Find the status of Storyframe product capabilities.'],
 '/legal':['Legal information','Storyframe legal information and policy contacts.'],
 '/ecommerce':['Shopify URL or product photo to a viral ad','Paste a Shopify URL or upload a product photo, and AI instantly creates a viral TikTok or Facebook ad. Built for e-commerce sellers and dropshippers.'],
 '/real-estate':['Zillow link to a cinematic virtual tour','Paste a Zillow listing URL and Storyframe builds a cinematic virtual tour realtors, property managers and Airbnb hosts can share anywhere. Join the early-access waitlist.'],
};
export function metadata(path:string):PageMetadata{let title='',description='',type='WebPage',schema:Record<string,unknown>|undefined;const t=TEMPLATES.find(t=>path===`/templates/${t.slug}`),r=RESOURCES.find(r=>path===`/resources/${r.slug}`),post=BLOG_POSTS.find(p=>path===`/blog/${p.slug}`),doc=DOC_SECTIONS.flatMap(s=>s.articles.map(a=>({a,path:`/docs/${s.slug}/${a.slug}`}))).find(d=>d.path===path),course=COURSES.find(c=>path===`/tutorials/${c.slug}`||c.lessons.some(l=>path===`/tutorials/${c.slug}/${l.slug}`));
 if(indexPages[path]){[title,description]=indexPages[path];if(['/templates','/resources','/tutorials','/blog','/docs'].includes(path))type='CollectionPage'}
 else if(t){title=t.title+' template';description=t.description;type='CreativeWork';schema={genre:t.category,learningResourceType:'Video template',isAccessibleForFree:true}}
 else if(r){title=r.title;description=r.description;type='CreativeWork';schema={genre:r.type,isAccessibleForFree:true}}
 else if(post){title=post.title;description=post.excerpt;type='Article';schema={headline:post.title,datePublished:post.date,author:{'@type':'Organization',name:'Storyframe'}}}
 else if(DOC_SECTIONS.some(s=>path==='/docs/'+s.slug)){const section=DOC_SECTIONS.find(s=>path==='/docs/'+s.slug)!;title=section.title;description=section.description;type='CollectionPage'}
 else if(doc){title=doc.a.title;description=doc.a.summary;type='TechArticle';schema={headline:title}}
 else if(course){const lesson=course.lessons.find(l=>path.endsWith('/'+l.slug))||course.lessons[0];title=lesson.title+' · '+course.title;description=lesson.goal+' '+course.description;type='LearningResource';schema={learningResourceType:'Lesson',isPartOf:{'@type':'Course',name:course.title,description:course.description}};path=`/tutorials/${course.slug}/${lesson.slug}`}
 else if(/^\/roadmap\/ideas\/[a-z0-9-]+$/.test(path)){title='Community proposal';description='Read and vote on this Storyframe community proposal.'}
 else return {title:'Page not found · Storyframe',description:'Explore Storyframe templates, resources, tutorials and product guides.',path,type,noindex:true};
 return {title:title+' · Storyframe',description,path,type,schema};
}
export const staticPaths=[...Object.keys(indexPages),...TEMPLATES.map(t=>'/templates/'+t.slug),...RESOURCES.map(r=>'/resources/'+r.slug),...COURSES.flatMap(c=>c.lessons.map(l=>`/tutorials/${c.slug}/${l.slug}`)),...DOC_SECTIONS.map(s=>'/docs/'+s.slug),...DOC_SECTIONS.flatMap(s=>s.articles.map(a=>`/docs/${s.slug}/${a.slug}`)),...BLOG_POSTS.map(p=>'/blog/'+p.slug)];
export function structuredData(meta:PageMetadata){const sections=meta.path.split('/').filter(Boolean);const breadcrumbs=sections.map((part,i)=>({'@type':'ListItem',position:i+2,name:i===sections.length-1?meta.title.replace(/ · Storyframe$/,''):part[0].toUpperCase()+part.slice(1).replaceAll('-',' '),item:SITE_ORIGIN+'/'+sections.slice(0,i+1).join('/')}));return [{'@context':'https://schema.org','@type':meta.type,name:meta.title,description:meta.description,url:SITE_ORIGIN+meta.path,...meta.schema},{'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Storyframe',item:SITE_ORIGIN},...breadcrumbs]}]}
export function applyMetadata(path:string,override:Partial<PageMetadata>={}){const meta={...metadata(path),...override};document.title=meta.title;function tag(selector:string,attributes:Record<string,string>){let el=document.head.querySelector(selector);if(!el){el=document.createElement(selector.startsWith('link')?'link':'meta');document.head.append(el)}Object.entries(attributes).forEach(([k,v])=>el!.setAttribute(k,v))}tag('meta[name="description"]',{name:'description',content:meta.description});tag('meta[name="robots"]',{name:'robots',content:meta.noindex?'noindex,follow':'index,follow'});tag('link[rel="canonical"]',{rel:'canonical',href:SITE_ORIGIN+meta.path});for(const [key,value] of Object.entries({title:meta.title,description:meta.description,url:SITE_ORIGIN+meta.path,type:meta.type==='Article'?'article':'website'}))tag(`meta[property="og:${key}"]`,{property:`og:${key}`,content:value});let ld=document.head.querySelector('script[data-page-schema]');if(!ld){ld=document.createElement('script');ld.setAttribute('type','application/ld+json');ld.setAttribute('data-page-schema','');document.head.append(ld)}ld.textContent=JSON.stringify(structuredData(meta));}
