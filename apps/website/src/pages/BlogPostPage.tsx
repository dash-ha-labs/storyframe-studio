import React from 'react';
import { BlogPostTemplate } from '../templates';
import { Badge, Button } from '@storyframe/ui';
import { BLOG_POSTS } from '../data/blog-data';

export function BlogPostPage({
  slug,
  onNavigate,
}: {
  slug: string;
  onNavigate?: (path: string) => void;
}) {
  const post = BLOG_POSTS.find(p => p.slug === slug) || BLOG_POSTS[0];

  return (
    <BlogPostTemplate
      onNavigate={onNavigate}
      header={
        <div>
          <div style={{ marginBottom: 'var(--sf-space-4)' }}>
            <Button
              variant="subtle"
              size="sm"
              onClick={() => onNavigate && onNavigate('/blog')}
            >
              ← Back to all posts
            </Button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sf-space-3)', marginBottom: 'var(--sf-space-3)' }}>
            <Badge variant="accent">{post.category}</Badge>
            <span style={{ fontSize: '13px', color: 'var(--sf-color-text-subtle)' }}>{post.date}</span>
            <span style={{ fontSize: '13px', color: 'var(--sf-color-text-subtle)' }}>•</span>
            <span style={{ fontSize: '13px', color: 'var(--sf-color-text-subtle)' }}>{post.readTime}</span>
          </div>
          <h1 className="sf-page-title">{post.title}</h1>
          <div style={{ fontSize: '14px', color: 'var(--sf-color-text-muted)' }}>
            By {post.author}
          </div>
        </div>
      }
    >
      <div style={{ lineHeight: 1.8, fontSize: '15px', color: 'var(--sf-color-text-primary)' }}>
        {post.content?.split('\n\n').map((paragraph, index) => {
          if (paragraph.startsWith('### ')) {
            return (
              <h3
                key={index}
                style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  marginTop: 'var(--sf-space-6)',
                  marginBottom: 'var(--sf-space-2)',
                  color: 'var(--sf-color-text-primary)',
                }}
              >
                {paragraph.replace('### ', '')}
              </h3>
            );
          }
          if (paragraph.startsWith('# ')) {
            return null; // Skip main title as it is in header
          }
          if (paragraph.startsWith('- ')) {
            const items = paragraph.split('\n').filter(Boolean);
            return (
              <ul key={index} style={{ paddingLeft: 'var(--sf-space-6)', margin: 'var(--sf-space-3) 0' }}>
                {items.map((it, i) => (
                  <li key={i} style={{ marginBottom: 'var(--sf-space-1)', color: 'var(--sf-color-text-secondary)' }}>
                    {it.replace(/^- /, '')}
                  </li>
                ))}
              </ul>
            );
          }
          return (
            <p key={index} style={{ margin: 'var(--sf-space-3) 0', color: 'var(--sf-color-text-secondary)' }}>
              {paragraph}
            </p>
          );
        })}
      </div>
    </BlogPostTemplate>
  );
}
