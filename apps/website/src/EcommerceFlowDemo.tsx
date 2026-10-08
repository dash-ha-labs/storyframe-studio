import React from 'react';
import { ArrowRight, Check, Heart, MessageCircle, Share2 } from 'lucide-react';

/**
 * Schematic auto-playing demo of the paste-URL-to-ad workflow for /ecommerce.
 * Pure CSS keyframe illustration (see `sf-eco-*` styles in website.css): it
 * never claims a backend request ran, the same rule as WorkflowPreview. The
 * reduced-motion fallback is the static composition (all three stages shown).
 */
export function EcommerceFlowDemo() {
  return (
    <div
      className="sf-eco-flow"
      role="img"
      aria-label="Animated demo: a Shopify product URL is pasted, the product is detected, and a vertical video ad is created automatically."
    >
      <div className="sf-eco-browser" aria-hidden="true">
        <span className="sf-eco-dots"><i /><i /><i /></span>
        <span className="sf-eco-url">
          <span className="sf-eco-url-text">my-store.myshopify.com/products/aurora-lamp</span>
          <i className="sf-eco-caret" />
        </span>
        <span className="sf-eco-go"><ArrowRight size={13} /></span>
      </div>
      <div className="sf-eco-stage" aria-hidden="true">
        <div className="sf-eco-found">
          <span className="sf-eco-found-badge"><Check size={11} />Product found</span>
          <strong>Aurora Desk Lamp</strong>
          <span className="sf-eco-found-meta">$49 · 4 photos · ★ 4.8</span>
        </div>
        <div className="sf-eco-loader">
          <i />
          <span>Creating your ad…</span>
        </div>
        <div className="sf-eco-phone">
          <div className="sf-eco-ad">
            <span className="sf-eco-ad-chip">AD · 0:09</span>
            <span className="sf-eco-ad-hook">50% off today</span>
            <strong>Aurora Desk Lamp</strong>
            <span className="sf-eco-ad-cta">Shop now</span>
            <i className="sf-eco-ad-progress" />
          </div>
          <span className="sf-eco-pills">
            <span><Heart size={10} />2.4k</span>
            <span><MessageCircle size={10} />318</span>
            <span><Share2 size={10} />96</span>
          </span>
        </div>
      </div>
    </div>
  );
}
