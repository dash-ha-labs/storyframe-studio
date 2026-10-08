import React, { useState } from 'react';
import { FeatureTemplate } from '../templates';
import { Button, FeatureZigzag } from '@storyframe/ui';
import { RealEstateStudioReplicas } from '../RealEstateStudioReplicas';
import { WorkflowPreview } from '../WorkflowPreview';

export const REAL_ESTATE_VIDEO_SRC = '/media/realtor-tour-placeholder.webm';
export const REAL_ESTATE_VIDEO_CREDIT = 'Herrick Spencer · CC BY 3.0, via Wikimedia Commons';

const ZILLOW_URL_PATTERN = /^https?:\/\/(www\.)?zillow\.com\/.+/i;

export function RealEstatePage({ onNavigate }: { onNavigate?: (path: string) => void }) {
  const [step, setStep] = useState<'url' | 'email' | 'done'>('url');
  const [listingUrl, setListingUrl] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const submitListingUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ZILLOW_URL_PATTERN.test(listingUrl.trim())) {
      setError('Paste a Zillow listing link, e.g. https://www.zillow.com/homedetails/…');
      return;
    }
    setError('');
    setStep('email');
  };

  const submitEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Enter a valid email address so we can send your tour.');
      return;
    }
    setError('');
    setStep('done');
  };

  return (
    <FeatureTemplate onNavigate={onNavigate}>
      <section className="re-hero">
        <video
          className="re-hero-video"
          src={REAL_ESTATE_VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
        <div className="re-hero-copy">
          <h1 className="re-hero-title">
            Turn a Zillow link into a <span>cinematic virtual tour</span>.
          </h1>
          <p className="re-hero-subtitle">
            Paste any Zillow listing and Storyframe builds a cinematic virtual tour
            that realtors, property managers and Airbnb hosts can share anywhere.
            No cameras, no editing experience needed.
          </p>
          <p className="re-hero-credit">Tour footage placeholder: {REAL_ESTATE_VIDEO_CREDIT}</p>
        </div>
      </section>

      <section className="re-capture" id="start" aria-label="Start your virtual tour">
        {step === 'done' ? (
          <div className="re-capture-card">
            <h2 className="re-capture-title">You're on the list.</h2>
            <p className="re-capture-text">
              We'll email <strong>{email.trim()}</strong> the moment your tour of
              this listing is ready. Early access is free — no credit card required.
            </p>
            <Button variant="secondary" onClick={() => { setStep('url'); setListingUrl(''); setEmail(''); }}>
              Generate another tour
            </Button>
          </div>
        ) : (
          <div className="re-capture-card">
            <ol className="re-steps" aria-label="How it works">
              <li className={step === 'url' ? 're-step-active' : ''}>Paste your Zillow link</li>
              <li aria-hidden="true" className="re-step-arrow">→</li>
              <li className={step === 'email' ? 're-step-active' : ''}>Get your tour by email</li>
            </ol>
            {step === 'url' ? (
              <form className="re-form" onSubmit={submitListingUrl} noValidate>
                <label className="sf-field re-field" htmlFor="re-listing-url">
                  Zillow listing URL
                </label>
                <div className="re-form-row">
                  <input
                    id="re-listing-url"
                    className="re-input"
                    type="url"
                    inputMode="url"
                    autoComplete="url"
                    placeholder="https://www.zillow.com/homedetails/…"
                    value={listingUrl}
                    onChange={e => { setListingUrl(e.target.value); if (error) setError(''); }}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? 're-error' : undefined}
                  />
                  <Button variant="primary" type="submit">Generate tour</Button>
                </div>
              </form>
            ) : (
              <form className="re-form" onSubmit={submitEmail} noValidate>
                <label className="sf-field re-field" htmlFor="re-email">
                  Where should we send your tour?
                </label>
                <div className="re-form-row">
                  <input
                    id="re-email"
                    className="re-input"
                    type="email"
                    autoComplete="email"
                    placeholder="you@brokerage.com"
                    value={email}
                    onChange={e => { setEmail(e.target.value); if (error) setError(''); }}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? 're-error' : undefined}
                  />
                  <Button variant="primary" type="submit">Join waitlist</Button>
                </div>
                <p className="re-form-note">Listing: {listingUrl.trim()}</p>
              </form>
            )}
            {error && (
              <p className="re-error" id="re-error" role="alert">
                {error}
              </p>
            )}
            <p className="sf-signup-note">Free during early access. No credit card required.</p>
          </div>
        )}
      </section>

      <div id="how">
        <FeatureZigzag
          items={[
            {
              title: 'Paste the listing, keep the truth',
              description:
                'Storyframe reads the listing photos, facts and description you already have on Zillow — nothing to reshoot and nothing invented.',
              visual: <RealEstateStudioReplicas kind="paste" />,
            },
            {
              flip: true,
              title: 'A tour that feels like a film',
              description:
                'AI plans the scene order, adds motion and captions, and applies your agency brand so every tour looks like it came from one studio.',
              visual: <RealEstateStudioReplicas kind="storyboard" />,
            },
            {
              title: 'Ready for every channel',
              description:
                'Export the full tour for your listing site, plus vertical cuts for Instagram Reels and TikTok that stop the scroll.',
              visual: <WorkflowPreview kind="generate" />,
            },
            {
              flip: true,
              title: 'Edit any scene, stay in control',
              description:
                'Every scene stays editable in Storyframe. Fix a caption, swap music or reorder rooms without starting over.',
              visual: <WorkflowPreview kind="editor" />,
            },
          ]}
        />
      </div>
    </FeatureTemplate>
  );
}
