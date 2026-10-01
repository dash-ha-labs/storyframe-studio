import React from 'react';
import { StatusTemplate } from '../templates';
import { SYSTEM_SERVICES } from '../data/status-data';

export function StatusPage({onNavigate}:{onNavigate?:(path:string)=>void}) {
 return <StatusTemplate onNavigate={onNavigate} systemStatusText="Service status" header={<div><span className="sf-mkt-eyebrow">System Status</span><h1 className="sf-page-title">Storyframe service status.</h1><p className="sf-page-subtitle">Service health and maintenance updates for your creative workspace.</p></div>}>
  <section className="guide-list" aria-label="Core services"><h2>Core services</h2>{SYSTEM_SERVICES.map(service=><div key={service.id}><h3>{service.name}</h3></div>)}</section>
 </StatusTemplate>;
}
