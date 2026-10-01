import React, { useState } from 'react';
import { RoadmapTemplate } from '../templates';
import {
  RoadmapCard,
  Button,
  type RoadmapItemData,
} from '@storyframe/ui';
import { ROADMAP_ITEMS, ROADMAP_EVIDENCE } from '../data/roadmap-data';

export function RoadmapPage({
  onNavigate,
}: {
  onNavigate?: (path: string) => void;
}) {
  const [filter, setFilter] = useState<'all' | 'shipped' | 'in-progress' | 'planned'>('all');

  const filteredItems =
    filter === 'all'
      ? ROADMAP_ITEMS
      : ROADMAP_ITEMS.filter(item => item.status === filter);

  return (
    <RoadmapTemplate
      onNavigate={onNavigate}
      header={
        <div>
          <span className="sf-mkt-eyebrow">Public Product Roadmap</span>
          <h1 className="sf-page-title">What’s next for Storyframe.</h1>
          <p className="sf-page-subtitle">
            Follow the ideas taking shape in Storyframe, from small improvements to bigger possibilities. Plans can change as we learn.
          </p>
        </div>
      }
    >
      <div style={{ display: 'flex', gap: 'var(--sf-space-2)', marginBottom: 'var(--sf-space-6)' }}>
        <Button
          variant={filter === 'all' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All Features ({ROADMAP_ITEMS.length})
        </Button>
        <Button
          variant={filter === 'shipped' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setFilter('shipped')}
        >
          Shipped ({ROADMAP_ITEMS.filter(i => i.status === 'shipped').length})
        </Button>
        <Button
          variant={filter === 'in-progress' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setFilter('in-progress')}
        >
          In Progress ({ROADMAP_ITEMS.filter(i => i.status === 'in-progress').length})
        </Button>
        <Button
          variant={filter === 'planned' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setFilter('planned')}
        >
          Planned ({ROADMAP_ITEMS.filter(i => i.status === 'planned').length})
        </Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sf-space-4)' }}>
        {filteredItems.map((item: RoadmapItemData) => (
          <RoadmapCard
            key={item.id}
            item={item}
            allEvidence={ROADMAP_EVIDENCE}
          />
        ))}
      </div>
    </RoadmapTemplate>
  );
}
