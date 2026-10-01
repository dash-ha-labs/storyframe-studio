import React,{useState} from 'react';
import { GalleryItemTemplate } from '../templates';
import { Hero,FilterTags,APP_SIGNUP_URL } from '@storyframe/ui';
import { GalleryCards } from '../Collections';
export function GalleryPage({onNavigate}:{onNavigate?:(path:string)=>void}) {
 const [filter,setFilter]=useState('All');
 return <GalleryItemTemplate onNavigate={onNavigate}><Hero eyebrow="Gallery" title="See how a product story comes together." subtitle="App demos, phone mockups and storyboards. Explore the workflow, then try the real editor." primaryCta={{label:'Start building free',href:APP_SIGNUP_URL}}/><FilterTags tags={['All','Marketing Video','Storyboard','Social Reel']} active={filter} onSelect={setFilter}/><GalleryCards filter={filter}/></GalleryItemTemplate>;
}
