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
