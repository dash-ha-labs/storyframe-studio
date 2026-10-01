import React, { useState } from 'react';
import {createRoot} from 'react-dom/client';
import Suite from './Suite';
import './style.css';
import './suite.css';
import './studio-ui.css';

function App() {
  const [authed, setAuthed] = useState(localStorage.getItem('authed') === '1');
  const [showLogin, setShowLogin] = useState(false);

  if (authed) return <Suite />;

  return (
    <div className="studio">
      <header className="appbar">
        <div className="app-actions">
          <button className="button" onClick={() => setShowLogin(!showLogin)}>
            Private login
          </button>
        </div>
      </header>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <h1 style={{ fontFamily: 'var(--sf-font-sans)', fontSize: '42px', fontWeight: 600, letterSpacing: '-1px', margin: '0 0 12px 0' }}>
          Storyframe
        </h1>
        <p style={{ color: 'var(--muted)', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '11px' }}>
          Coming Soon
        </p>

        {showLogin && (
          <form
            style={{ marginTop: '32px', display: 'flex', gap: '8px', background: 'var(--panel)', padding: '20px', borderRadius: '7px', border: '1px solid var(--sf-color-border)', boxShadow: '0 12px 35px #182b4e12' }}
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              const pwd = new FormData(e.currentTarget).get('pwd');
              if (pwd === 'secret') {
                localStorage.setItem('authed', '1');
                setAuthed(true);
              } else {
                alert('Invalid');
              }
            }}>
            <input
              name="pwd"
              type="password"
              placeholder="Password"
              autoFocus
              style={{ padding: '0 12px', background: 'var(--field)', border: '1px solid var(--sf-color-border)', color: 'inherit', borderRadius: '4px', height: '32px', fontSize: '12px', outline: 'none' }}
            />
            <button type="submit" className="button primary">
              Enter
            </button>
          </form>
        )}
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<App/>);
