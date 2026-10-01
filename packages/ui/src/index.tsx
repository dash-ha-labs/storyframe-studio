import React, { useRef, useEffect } from 'react';
import { Clapperboard, Palette, Globe, Smartphone, X } from 'lucide-react';
import type { ToolId, Platform } from '@storyframe/core';

export const toolIcons: Record<ToolId, React.ComponentType<{ size?: number }>> = {
  video: Clapperboard,
  brand: Palette,
};

export function ToolIcon({ tool, size = 20 }: { tool: ToolId; size?: number }) {
  const Icon = toolIcons[tool] || Clapperboard;
  return <Icon size={size} />;
}

export function PlatformBadge({ platform }: { platform: Platform }) {
  return (
    <span className="platform-badge">
      {platform === 'web' ? <Globe size={12} /> : <Smartphone size={12} />}{' '}
      {platform === 'web' ? 'Web' : 'Mobile'}
    </span>
  );
}

export function Dialog({
  title,
  children,
  onClose,
  wide = false,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
  }, []);
  return (
    <dialog
      ref={ref}
      className={`suite-dialog ${wide ? 'wide' : ''}`}
      onCancel={onClose}
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="dialog-title">
        <h2>{title}</h2>
        <button className="icon-button" aria-label="Close dialog" onClick={onClose}>
          <X size={18} />
        </button>
      </div>
      {children}
    </dialog>
  );
}

/* Base UI Components */

export type BadgeVariant =
  | 'planned'
  | 'in-progress'
  | 'shipped'
  | 'operational'
  | 'degraded'
  | 'outage'
  | 'neutral'
  | 'accent'
  | 'danger'
  | 'warning'
  | 'success';

export function Badge({
  variant = 'neutral',
  children,
  className = '',
  style,
}: {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={`sf-badge sf-badge-${variant} ${className}`.trim()}
      style={style}
    >
      {children}
    </span>
  );
}

export type StatusLevel =
  | 'operational'
  | 'degraded'
  | 'outage'
  | 'shipped'
  | 'in-progress'
  | 'planned';

export function StatusDot({
  status,
  size = 8,
}: {
  status: StatusLevel;
  size?: number;
}) {
  return (
    <span
      className={`sf-status-dot sf-status-dot-${status}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  );
}

export function Card({
  children,
  className = '',
  interactive = false,
  onClick,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`sf-card ${interactive ? 'sf-card-interactive' : ''} ${className}`.trim()}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
}

export function Button({
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  children,
  className = '',
}: {
  variant?: 'primary' | 'secondary' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  const cls = `sf-button sf-button-${variant} sf-button-${size} ${className}`.trim();
  if (href) {
    return (
      <a href={href} className={cls} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={cls} onClick={onClick}>
      {children}
    </button>
  );
}

/* Global Shared Chrome */

export interface NavLinkItem {
  label: string;
  href: string;
  id: string;
}

export const DEFAULT_NAV_LINKS: NavLinkItem[] = [
  { label: 'Features', href: '/features', id: 'features' },
  { label: 'Templates', href: '/templates', id: 'templates' },
  { label: 'Gallery', href: '/gallery', id: 'gallery' },
  { label: 'Resource Center', href: '/resources', id: 'resources' },
  { label: 'Guides', href: '/guides', id: 'guides' },
  { label: 'Blog', href: '/blog', id: 'blog' },
];

export function GlobalNav({
  activeSection,
  onNavigate,
}: {
  activeSection?: string;
  onNavigate?: (path: string) => void;
}) {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(href);
    }
  };

  return (
    <nav className="sf-nav">
      <a
        href="/"
        className="sf-nav-brand"
        onClick={e => handleLinkClick(e, '/')}
      >
        Storyframe
      </a>
      <ul className="sf-nav-links">
        {DEFAULT_NAV_LINKS.map(link => {
          const isActive = activeSection === link.id;
          return (
            <li key={link.id}>
              <a
                href={link.href}
                className={`sf-nav-link ${isActive ? 'sf-nav-link-active' : ''}`.trim()}
                onClick={e => handleLinkClick(e, link.href)}
              >
                {link.label}
              </a>
            </li>
          );
        })}
      </ul>
      <div className="sf-nav-actions">
        <Button
          variant="primary"
          size="sm"
          href="https://app.storyframe.com/signup"
        >
          Try Storyframe Studio
        </Button>
      </div>
    </nav>
  );
}

export function GlobalFooter({
  systemStatus = 'operational',
  systemStatusText = 'All Systems Operational',
  onNavigate,
}: {
  systemStatus?: StatusLevel;
  systemStatusText?: string;
  onNavigate?: (path: string) => void;
}) {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(href);
    }
  };

  return (
    <footer className="sf-footer">
      <div className="sf-footer-inner">
        <div className="sf-footer-links">
          <a href="/roadmap" onClick={e => handleLinkClick(e, '/roadmap')}>Product Roadmap</a>
          <a href="/status" onClick={e => handleLinkClick(e, '/status')}>Status Page</a>
          <a href="/legal" onClick={e => handleLinkClick(e, '/legal')}>Legal</a>
        </div>
        <a
          href="/status"
          className="sf-footer-status"
          style={{ textDecoration: 'none' }}
          onClick={e => handleLinkClick(e, '/status')}
        >
          <StatusDot status={systemStatus} />
          <span>{systemStatusText}</span>
        </a>
        <p style={{ margin: 0 }}>Storyframe © 2026. All rights reserved.</p>
      </div>
    </footer>
  );
}

/* Transparency Module Shared Components */

export interface RoadmapEvidence {
  id: number;
  product: string;
  quote: string;
  platform: string;
  url: string;
}

export interface RoadmapItemData {
  id: string;
  title: string;
  description: string;
  status: 'planned' | 'in-progress' | 'shipped';
  evidence: number[];
}

export function RoadmapCard({
  item,
  allEvidence = {},
}: {
  item: RoadmapItemData;
  allEvidence?: Record<number, RoadmapEvidence>;
}) {
  const statusLabel =
    item.status === 'in-progress'
      ? 'In Progress'
      : item.status.charAt(0).toUpperCase() + item.status.slice(1);

  return (
    <Card className="sf-roadmap-card">
      <div className="sf-roadmap-header">
        <h3 className="sf-roadmap-title">{item.title}</h3>
        <Badge variant={item.status}>{statusLabel}</Badge>
      </div>
      <p className="sf-roadmap-desc">{item.description}</p>
      {item.evidence && item.evidence.length > 0 && (
        <div className="sf-roadmap-evidence">
          <span className="sf-roadmap-evidence-label">Documented User Feedback:</span>
          <div className="sf-roadmap-evidence-list">
            {item.evidence.map(refId => {
              const ev = allEvidence[refId];
              return (
                <span
                  key={refId}
                  className="sf-evidence-chip"
                  title={ev ? `"${ev.quote}" — ${ev.product} (${ev.platform})` : `Complaint Ref #${refId}`}
                >
                  Ref #{refId}{ev ? `: ${ev.product}` : ''}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}

export interface ServiceStatusData {
  id: string;
  name: string;
  status: 'operational' | 'degraded' | 'outage';
  uptimePercent: number;
  description?: string;
}

export function ServiceStatusRow({
  service,
}: {
  service: ServiceStatusData;
}) {
  const statusLabel =
    service.status === 'operational'
      ? 'Operational'
      : service.status === 'degraded'
      ? 'Degraded'
      : 'Major Outage';

  return (
    <div className="sf-service-row">
      <div className="sf-service-info">
        <StatusDot status={service.status} />
        <span className="sf-service-name">{service.name}</span>
      </div>
      <div className="sf-service-metrics">
        <span className="sf-service-uptime">{service.uptimePercent}% uptime</span>
        <Badge variant={service.status}>{statusLabel}</Badge>
      </div>
    </div>
  );
}

export interface BlogPostData {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  content?: string;
}

export function BlogPostCard({
  post,
  onSelect,
}: {
  post: BlogPostData;
  onSelect?: (slug: string) => void;
}) {
  return (
    <Card
      interactive
      className="sf-blog-card"
      onClick={() => onSelect && onSelect(post.slug)}
    >
      <div className="sf-blog-meta">
        <Badge variant="accent">{post.category}</Badge>
        <span className="sf-blog-date">{post.date}</span>
        <span className="sf-blog-readtime">{post.readTime}</span>
      </div>
      <h3 className="sf-blog-title">
        <a
          href={`/blog/${post.slug}`}
          onClick={e => {
            if (onSelect) {
              e.preventDefault();
              onSelect(post.slug);
            }
          }}
        >
          {post.title}
        </a>
      </h3>
      <p className="sf-blog-excerpt">{post.excerpt}</p>
      <div className="sf-blog-author">
        <span>By {post.author}</span>
      </div>
    </Card>
  );
}
