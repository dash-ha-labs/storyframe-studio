import React from 'react';
import { StatusTemplate } from '../templates';
import {
  ServiceStatusRow,
  Card,
  Badge,
  StatusDot,
  type ServiceStatusData,
} from '@storyframe/ui';
import {
  SYSTEM_OVERALL_STATUS,
  SYSTEM_OVERALL_STATUS_TEXT,
  SYSTEM_SERVICES,
  RECENT_INCIDENTS,
} from '../data/status-data';

export function StatusPage({
  onNavigate,
}: {
  onNavigate?: (path: string) => void;
}) {
  return (
    <StatusTemplate
      onNavigate={onNavigate}
      systemStatus={SYSTEM_OVERALL_STATUS}
      systemStatusText={SYSTEM_OVERALL_STATUS_TEXT}
      header={
        <div>
          <h1 className="sf-page-title">System Status</h1>
          <p className="sf-page-subtitle">
            Current service availability, component health, and incident history for Storyframe Studio services.
          </p>
        </div>
      }
    >
      <Card style={{ marginBottom: 'var(--sf-space-6)', padding: 'var(--sf-space-6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sf-space-3)' }}>
          <StatusDot status={SYSTEM_OVERALL_STATUS} size={14} />
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: 'var(--sf-color-text-primary)' }}>
            {SYSTEM_OVERALL_STATUS_TEXT}
          </h2>
        </div>
        <p style={{ margin: 'var(--sf-space-2) 0 0 0', color: 'var(--sf-color-text-muted)', fontSize: '13px' }}>
          All systems are running normally. Average uptime across all services over the past 90 days is 99.98%.
        </p>
      </Card>

      <div style={{ marginBottom: 'var(--sf-space-8)' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: 'var(--sf-space-4)', color: 'var(--sf-color-text-primary)' }}>
          Core Services
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sf-space-3)' }}>
          {SYSTEM_SERVICES.map((service: ServiceStatusData) => (
            <ServiceStatusRow key={service.id} service={service} />
          ))}
        </div>
      </div>

      <div>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: 'var(--sf-space-4)', color: 'var(--sf-color-text-primary)' }}>
          Past Incidents & Maintenance
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sf-space-4)' }}>
          {RECENT_INCIDENTS.map(incident => (
            <Card key={incident.id}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sf-space-2)' }}>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: 'var(--sf-color-text-primary)' }}>
                  {incident.title}
                </h3>
                <Badge variant={incident.status === 'resolved' ? 'shipped' : 'planned'}>
                  {incident.status}
                </Badge>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--sf-color-text-subtle)', marginBottom: 'var(--sf-space-2)', fontFamily: 'var(--sf-font-mono)' }}>
                {incident.timestamp}
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--sf-color-text-muted)', lineHeight: 1.5 }}>
                {incident.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </StatusTemplate>
  );
}
