import React, { useState } from 'react';
import { BlogIndexTemplate } from '../templates';
import {
  BlogPostCard,
  Button,
  type BlogPostData,
} from '@storyframe/ui';
import { BLOG_POSTS } from '../data/blog-data';

export function BlogIndexPage({
  onSelectPost,
  onNavigate,
}: {
  onSelectPost?: (slug: string) => void;
  onNavigate?: (path: string) => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Product Updates', 'Engineering', 'Announcements'];

  const filteredPosts =
    selectedCategory === 'All'
      ? BLOG_POSTS
      : BLOG_POSTS.filter(post => post.category === selectedCategory);

  return (
    <BlogIndexTemplate
      onNavigate={onNavigate}
      header={
        <div>
          <h1 className="sf-page-title">Storyframe Blog</h1>
          <p className="sf-page-subtitle">
            Product updates, engineering deep dives, and announcements from the Storyframe team.
          </p>
        </div>
      }
    >
      <div style={{ display: 'flex', gap: 'var(--sf-space-2)', marginBottom: 'var(--sf-space-6)' }}>
        {categories.map(cat => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sf-space-4)' }}>
        {filteredPosts.map((post: BlogPostData) => (
          <BlogPostCard
            key={post.id}
            post={post}
            onSelect={onSelectPost}
          />
        ))}
      </div>
    </BlogIndexTemplate>
  );
}
