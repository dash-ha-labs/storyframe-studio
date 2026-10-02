import React, { useRef, useEffect } from 'react';
import { Clapperboard, Palette, Globe, Smartphone, X } from 'lucide-react';
import type { ToolId, Platform } from '@storyframe/core';

// The real deployed Studio app. Operator directive (t_3294f877): never invent app domains.
export const APP_SIGNUP_URL = 'https://studio.storyframe.yamu.app/';

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

export type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size'> & {
  variant?: 'primary' | 'secondary' | 'subtle';
  size?: 'sm' | 'md' | 'lg' | 'studio';
  href?: string;
};
export function Button({variant='primary',size='md',href,children,className='',type='button',...props}:ButtonProps) {
  const cls=`sf-button sf-button-${variant} sf-button-${size} ${className}`.trim();
  if(href)return <a href={href} className={cls} onClick={props.onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>} aria-label={props['aria-label']}>{children}</a>;
  return <button type={type} className={cls} {...props}>{children}</button>;
}

// Shared compact controls for Studio and administration; never restyle per page.
export function Field({children,className='',...props}:React.LabelHTMLAttributes<HTMLLabelElement>){return <label className={`sf-field ${className}`.trim()} {...props}>{children}</label>}
export function IconButton({label,children,active=false,className='',...props}:React.ButtonHTMLAttributes<HTMLButtonElement>&{label:string;active?:boolean}){return <Button variant="subtle" size="studio" className={`sf-icon-button ${active?'is-active':''} ${className}`} aria-label={label} title={label} {...props}>{children}</Button>}

/* Global Shared Chrome */

export interface NavLinkItem {
  label: string;
  href: string;
  id: string;
}

export const DEFAULT_NAV_LINKS: NavLinkItem[] = [
  { label: 'Features', href: '/features', id: 'features' },
  { label: 'Templates', href: '/templates', id: 'templates' },
  { label: 'Tutorials', href: '/tutorials', id: 'tutorials' },
  { label: 'Resources', href: '/resources', id: 'resources' },
];

export function GlobalNav({
  activeSection,
  onNavigate,
}: {
  activeSection?: string;
  onNavigate?: (path: string) => void;
}) {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (onNavigate && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
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
          href={APP_SIGNUP_URL}
        >
          Sign up free
        </Button>
      </div>
    </nav>
  );
}

export function GlobalFooter({
  systemStatus = 'operational',
  systemStatusText = 'Product status',
  onNavigate,
}: {
  systemStatus?: StatusLevel;
  systemStatusText?: string;
  onNavigate?: (path: string) => void;
}) {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (onNavigate && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
      e.preventDefault();
      onNavigate(href);
    }
  };

  return (
    <footer className="sf-footer">
      <div className="sf-footer-main">
        <div className="sf-footer-brand"><a href="/" onClick={e=>handleLinkClick(e,'/')}>Storyframe<span>.</span></a><p>AI-aided video creation. Built around your brand.</p></div>
        <div className="sf-footer-column"><h2>Product</h2><a href="/features" onClick={e=>handleLinkClick(e,'/features')}>Features</a><a href="/templates" onClick={e=>handleLinkClick(e,'/templates')}>Templates</a><a href="/tutorials" onClick={e=>handleLinkClick(e,'/tutorials')}>Tutorials</a><a href="/demo.html" target="_blank" rel="noreferrer">Try the studio ↗</a></div>
        <div className="sf-footer-column"><h2>Resources</h2><a href="/docs" onClick={e=>handleLinkClick(e,'/docs')}>Product docs</a><a href="/resources" onClick={e=>handleLinkClick(e,'/resources')}>Creative resources</a><a href="/blog" onClick={e=>handleLinkClick(e,'/blog')}>Blog</a></div>
        <div className="sf-footer-column"><h2>Storyframe</h2><a href="/roadmap" onClick={e=>handleLinkClick(e,'/roadmap')}>Product Roadmap</a><a href="/status" onClick={e=>handleLinkClick(e,'/status')}>Status Page</a><a href="/legal" onClick={e=>handleLinkClick(e,'/legal')}>Legal</a></div>
      </div>
      <div className="sf-footer-inner"><p>Storyframe © 2026</p><a href="/status" className="sf-footer-status" onClick={e=>handleLinkClick(e,'/status')}><span>{systemStatusText}</span></a></div>
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

/* Marketing Sections (token-driven; consumed by the website's master templates) */

export function Hero({
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  primaryCta?: { label: string; href?: string; onClick?: () => void };
  secondaryCta?: { label: string; href?: string; onClick?: () => void };
}) {
  return (
    <section className="sf-mkt-hero">
      {eyebrow && <Badge variant="accent" className="sf-mkt-hero-eyebrow">{eyebrow}</Badge>}
      <h1 className="sf-mkt-hero-title">{title}</h1>
      {subtitle && <p className="sf-mkt-hero-subtitle">{subtitle}</p>}
      <div className="sf-mkt-hero-actions">
        {primaryCta && (
          <Button
            variant="primary"
            size="lg"
            href={primaryCta.href}
            onClick={primaryCta.onClick}
          >
            {primaryCta.label}
          </Button>
        )}
        {secondaryCta && (
          <Button
            variant="secondary"
            size="lg"
            href={secondaryCta.href}
            onClick={secondaryCta.onClick}
          >
            {secondaryCta.label}
          </Button>
        )}
      </div>
    </section>
  );
}

export function AppCta({
  title,
  subtitle,
  label = 'Sign up free',
  onClick,
}: {
  title: string;
  subtitle?: string;
  label?: string;
  onClick?: () => void;
}) {
  return (
    <section className="sf-mkt-cta">
      <h2 className="sf-mkt-cta-title">{title}</h2>
      {subtitle && <p className="sf-mkt-cta-subtitle">{subtitle}</p>}
      <Button variant="primary" size="lg" href={APP_SIGNUP_URL} onClick={onClick}>
        {label}
      </Button>
      <p className="sf-signup-note">Free. No credit card required.</p>
    </section>
  );
}

export function FeatureZigzag({
  items,
}: {
  items: Array<{
    title: string;
    description: string;
    visual: React.ReactNode;
    flip?: boolean;
  }>;
}) {
  return (
    <section className="sf-mkt-zigzag">
      {items.map((item, i) => (
        <div key={i} className={`sf-mkt-zigzag-row${item.flip ? ' sf-mkt-zigzag-flip' : ''}`}>
          <div className="sf-mkt-zigzag-text">
            <h2 className="sf-mkt-zigzag-title">{item.title}</h2>
            <p className="sf-mkt-zigzag-desc">{item.description}</p>
          </div>
          <div className="sf-mkt-zigzag-visual">{item.visual}</div>
        </div>
      ))}
    </section>
  );
}

export function FeatureGrid({
  items,
}: {
  items: Array<{ icon?: React.ReactNode; title: string; description: string }>;
}) {
  return (
    <div className="sf-mkt-grid">
      {items.map((item, i) => (
        <Card key={i} className="sf-mkt-grid-card">
          {item.icon && <div className="sf-mkt-grid-icon">{item.icon}</div>}
          <h3 className="sf-mkt-grid-title">{item.title}</h3>
          <p className="sf-mkt-grid-desc">{item.description}</p>
        </Card>
      ))}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="sf-mkt-section-heading">
      {eyebrow && <span className="sf-mkt-eyebrow">{eyebrow}</span>}
      <h2 className="sf-mkt-section-title">{title}</h2>
      {subtitle && <p className="sf-mkt-section-subtitle">{subtitle}</p>}
    </div>
  );
}

export function FilterTags({
  tags,
  active,
  onSelect,
}: {
  tags: string[];
  active?: string;
  onSelect?: (tag: string) => void;
}) {
  return (
    <div className="sf-mkt-filter" role="tablist" aria-label="Filter by use case">
      {tags.map(tag => (
        <button
          key={tag}
          type="button"
          role="tab"
          aria-selected={tag === active}
          className={`sf-mkt-filter-tag${tag === active ? ' sf-mkt-filter-active' : ''}`}
          onClick={() => onSelect && onSelect(tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
