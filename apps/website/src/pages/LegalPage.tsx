import React from 'react';
import { ResourceHubTemplate } from '../templates';
export function LegalPage({onNavigate}:{onNavigate?:(path:string)=>void}) {
 return <ResourceHubTemplate onNavigate={onNavigate}><header className="sf-page-header"><span className="sf-mkt-eyebrow">Your projects</span><h1 className="sf-page-title">Keep control of your work.</h1><p className="sf-page-subtitle">Save your project files and keep your original media together.</p></header><div className="guide-list"><h2>Project files and originals</h2><p>Download an editable project JSON and keep your screenshots, footage and audio alongside it. Use separate filenames for each version you want to return to.</p><a className="text-cta" href="/guides">Read the project-saving guide ↗</a></div></ResourceHubTemplate>;
}
