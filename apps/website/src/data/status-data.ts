import type { ServiceStatusData, StatusLevel } from '@storyframe/ui';

export interface IncidentEvent {
  id: string;
  title: string;
  timestamp: string;
  status: 'resolved' | 'monitoring' | 'investigating';
  description: string;
}

export const SYSTEM_OVERALL_STATUS: StatusLevel = 'operational';
export const SYSTEM_OVERALL_STATUS_TEXT = 'All Systems Operational';

export const SYSTEM_SERVICES: ServiceStatusData[] = [
  {
    id: 'asset-sync',
    name: 'Asset Sync Engine',
    status: 'operational',
    uptimePercent: 99.98,
    description: 'Real-time synchronization between brand tokens, palettes, and storyboard assets.',
  },
  {
    id: 'video-pipeline',
    name: 'Video Rendering Pipeline',
    status: 'operational',
    uptimePercent: 99.95,
    description: 'Frame rendering, timeline playback, and multi-format video exports.',
  },
  {
    id: 'studio-web',
    name: 'Storyframe Studio Web App',
    status: 'operational',
    uptimePercent: 100.0,
    description: 'Web editor application hosting, workspace management, and canvas interaction.',
  },
  {
    id: 'brand-api',
    name: 'Brand Asset Storage & API',
    status: 'operational',
    uptimePercent: 99.99,
    description: 'High-availability storage for imported brand kits, fonts, and SVG mark vectors.',
  },
];

export const RECENT_INCIDENTS: IncidentEvent[] = [
  {
    id: 'inc-2026-10-01',
    title: 'Scheduled Maintenance: Video Rendering Cluster Upgrade',
    timestamp: '2026-10-01 02:00 UTC',
    status: 'resolved',
    description: 'Upgraded backend worker nodes for faster multi-track timeline preview compilation. Zero downtime observed.',
  },
  {
    id: 'inc-2026-09-24',
    title: 'Asset Sync Intermittent Latency',
    timestamp: '2026-09-24 14:12 UTC',
    status: 'resolved',
    description: 'Transient connection delay in cross-workspace sync during peak deployment. Automatically recovered within 4 minutes.',
  },
];
