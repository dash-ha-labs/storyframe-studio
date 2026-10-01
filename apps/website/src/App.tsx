import React,{useEffect,useState} from 'react';
import {RoadmapPage,IdeaPage} from './pages/RoadmapPage';
import {StatusPage} from './pages/StatusPage';
import {BlogIndexPage} from './pages/BlogIndexPage';
import {BlogPostPage} from './pages/BlogPostPage';
import {FeaturesPage} from './pages/FeaturesPage';
import {TemplatesPage,TemplateDetailPage} from './pages/TemplatesPage';
import {ResourceCenterPage,ResourceDetailPage} from './pages/ResourceCenterPage';
import {TutorialsPage,TutorialPage,DocsPage} from './pages/LearningPages';
import {HomePage} from './HomePage';
import {LegalPage} from './pages/LegalPage';
import {NotFound} from './Content';
import {applyMetadata} from './seo';
export function normalizePath(path:string){const clean=path.split(/[?#]/)[0].replace(/\/$/,'')||'/';return clean==='/gallery'?'/tutorials':clean==='/guides'?'/docs':clean;}
export function App({initialPath}:{initialPath?:string}={}){const [path,setPath]=useState(()=>normalizePath(initialPath||(typeof window!=='undefined'?window.location.pathname:'/')));useEffect(()=>{const pop=()=>setPath(normalizePath(window.location.pathname));window.addEventListener('popstate',pop);if(['/gallery','/guides'].includes(window.location.pathname))window.history.replaceState({},'',path);return()=>window.removeEventListener('popstate',pop)},[]);useEffect(()=>{applyMetadata(path)},[path]);const navigate=(to:string)=>{window.history.pushState({},'',to);setPath(normalizePath(to));if(!to.includes('#'))window.scrollTo(0,0);else requestAnimationFrame(()=>document.getElementById(to.split('#')[1])?.scrollIntoView())};const props={onNavigate:navigate};const parts=path.split('/').filter(Boolean);if(path==='/')return <HomePage {...props}/>;if(path==='/legal')return <LegalPage {...props}/>;if(path==='/status')return <StatusPage {...props}/>;if(path==='/features')return <FeaturesPage {...props}/>;if(path==='/roadmap')return <RoadmapPage {...props}/>;if(parts[0]==='roadmap'&&parts[1]==='ideas'&&parts.length===3)return <IdeaPage key={path} slug={parts[2]} {...props}/>;if(path==='/templates')return <TemplatesPage {...props}/>;if(parts[0]==='templates'&&parts.length===2)return <TemplateDetailPage key={path} slug={parts[1]} {...props}/>;if(path==='/resources')return <ResourceCenterPage {...props}/>;if(parts[0]==='resources'&&parts.length===2)return <ResourceDetailPage slug={parts[1]} {...props}/>;if(path==='/tutorials')return <TutorialsPage {...props}/>;if(parts[0]==='tutorials'&&(parts.length===2||parts.length===3))return <TutorialPage courseSlug={parts[1]} lessonSlug={parts[2]} {...props}/>;if(path==='/docs')return <DocsPage {...props}/>;if(parts[0]==='docs'&&(parts.length===2||parts.length===3))return <DocsPage key={path} sectionSlug={parts[1]} articleSlug={parts[2]} {...props}/>;if(path==='/blog')return <BlogIndexPage {...props}/>;if(parts[0]==='blog'&&parts.length===2)return <BlogPostPage slug={parts[1]} {...props}/>;return <NotFound {...props}/>}
export default App;
