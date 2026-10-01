import React from 'react';
import {renderToString} from 'react-dom/server';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {COURSES} from '../src/data/learning';
import {App} from '../src/App';
import {metadata,staticPaths,structuredData,SITE_ORIGIN} from '../src/seo';
const dist=resolve('dist'),template=readFileSync(resolve(dist,'index.html'),'utf8');
const escape=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
for(const path of [...staticPaths,...COURSES.map(c=>'/tutorials/'+c.slug),'/404']){const meta=metadata(path);const head=`<title>${escape(meta.title)}</title><meta name="description" content="${escape(meta.description)}"><meta name="robots" content="${meta.noindex?'noindex,follow':'index,follow'}"><link rel="canonical" href="${SITE_ORIGIN+meta.path}"><meta property="og:title" content="${escape(meta.title)}"><meta property="og:description" content="${escape(meta.description)}"><meta property="og:url" content="${SITE_ORIGIN+meta.path}"><meta property="og:type" content="${meta.type==='Article'?'article':'website'}"><script type="application/ld+json" data-page-schema>${JSON.stringify(structuredData(meta)).replaceAll('<','\\u003c')}</script>`;const html=template.replace(/<title>[\s\S]*?<\/title>/,head).replace('<div id="root"></div>',`<div id="root">${renderToString(<App initialPath={path}/>)}</div><!--app-end-->`);const dest=resolve(dist,path==='/404'?'404.html':path==='/'?'index.html':path.slice(1)+'/index.html');mkdirSync(dirname(dest),{recursive:true});writeFileSync(dest,html)}
writeFileSync(resolve(dist,'community.html'),template.replace('<div id="root"></div>','<div id="root"></div><!--app-end-->'));
writeFileSync(resolve(dist,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${staticPaths.map(path=>`<url><loc>${SITE_ORIGIN+path}</loc></url>`).join('')}</urlset>`);
writeFileSync(resolve(dist,'robots.txt'),`User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /demo.html\nDisallow: /community.html\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`);
console.log(`Prerendered ${staticPaths.length} pages, 404, sitemap and robots.`);
