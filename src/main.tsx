import React, { useState } from 'react';
import {createRoot} from 'react-dom/client';
import Suite from './Suite';
import './style.css';
import './suite.css';

function App() {
  const [authed, setAuthed] = useState(localStorage.getItem('authed') === '1');
  const [showLogin, setShowLogin] = useState(false);

  if (authed) return <Suite />;

  return (
    <div style={{ height: '100vh', width: '100vw', background: '#000', color: '#fff', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' }}>
      <header style={{ padding: '20px', display: 'flex', justifyContent: 'flex-end' }}>
        <button 
          onClick={() => setShowLogin(!showLogin)} 
          style={{ background: 'transparent', color: '#888', border: 'none', cursor: 'pointer', fontSize: '14px' }}>
          Private login
        </button>
      </header>
      
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 300, letterSpacing: '0.1em', margin: '0 0 10px 0' }}>STORYFRAME</h1>
        <p style={{ color: '#888', letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.9rem' }}>Coming Soon</p>
        
        {showLogin && (
          <form 
            style={{ marginTop: '40px', display: 'flex', gap: '10px' }}
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
              style={{ padding: '8px 12px', background: '#111', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} 
            />
            <button 
              type="submit"
              style={{ padding: '8px 16px', background: '#fff', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Enter
            </button>
          </form>
        )}
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<App/>);
