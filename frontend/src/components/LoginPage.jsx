import React, { useState, useEffect, useCallback } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import './LoginPage.css';

const THEMES = [
  { key: '', label: 'Green', color: '#00ff88' },
  { key: 'theme-red', label: 'Red', color: '#ff3250' },
  { key: 'theme-blue', label: 'Blue', color: '#00a0ff' },
  { key: 'theme-amber', label: 'Amber', color: '#ffb400' },
  { key: 'theme-violet', label: 'Violet', color: '#a050ff' },
];

export default function LoginPage({ onLogin }) {
  const [activeTab, setActiveTab] = useState('signin');
  const [theme, setTheme] = useState('');
  const [clock, setClock] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showRegPw, setShowRegPw] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPw, setRegPw] = useState('');
  const [btnState, setBtnState] = useState('idle');
  const [guestState, setGuestState] = useState('idle');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [shake, setShake] = useState(false);

  // Live clock
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setClock(now.toISOString().replace('T', ' · ').slice(0, 22) + ' UTC');
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard enter
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Enter' && activeTab === 'signin') handleLogin(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [email, password, activeTab]);

  const handleLogin = () => {
    if (!email || !password) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }
    setBtnState('loading');
    setTimeout(() => {
      setBtnState('granted');
      setTimeout(() => {
        onLogin({ email, name: email.split('@')[0] });
      }, 800);
    }, 1400);
  };

  const handleRegister = () => {
    if (!regName || !regEmail || !regPw) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }
    setBtnState('loading');
    setTimeout(() => {
      setBtnState('granted');
      setTimeout(() => {
        onLogin({ email: regEmail, name: regName });
      }, 800);
    }, 1400);
  };

  const handleGuest = () => {
    setGuestState('loading');
    setTimeout(() => {
      onLogin({ email: 'guest@aiml007.io', name: 'Agent' });
    }, 1200);
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      onLogin({
        email: user.email,
        name: user.displayName || user.email.split('@')[0],
        photoURL: user.photoURL,
        uid: user.uid
      });
    } catch (error) {
      console.error('Google sign-in error:', error);
      setGoogleLoading(false);
    }
  };

  return (
    <div className={`login-page ${theme}`}>
      {/* Loading bar */}
      <div className="load-bar"></div>

      {/* Background */}
      <div className="bg-layer"></div>
      <div className="scanlines"></div>
      <div className="corner corner-tl"></div>
      <div className="corner corner-tr"></div>
      <div className="corner corner-bl"></div>
      <div className="corner corner-br"></div>

      {/* Status Bar */}
      <div className="status-bar">
        <div><span className="status-dot"></span>SYSTEM ONLINE · NODE-07 · ENCRYPTED CHANNEL ACTIVE</div>
        <div className="clock-display">{clock}</div>
        <div>CLEARANCE: CLASS-3 · SECTOR Ω-7</div>
      </div>

      {/* Theme Switcher */}
      <div className="theme-switcher">
        <span className="ts-label">THEME</span>
        {THEMES.map((t) => (
          <div
            key={t.key}
            className={`t-btn ${theme === t.key ? 'active' : ''}`}
            style={{ background: t.color }}
            onClick={() => setTheme(t.key)}
            title={t.label}
          ></div>
        ))}
      </div>

      <div className="wrapper">
        <div className={`card ${shake ? 'shake' : ''}`}>
          <div className="card-corner cc-tl"></div>
          <div className="card-corner cc-tr"></div>
          <div className="card-corner cc-bl"></div>
          <div className="card-corner cc-br"></div>

          {/* Logo */}
          <div className="logo-wrap">
            <div className="logo-ring">
              <svg className="fingerprint-svg" viewBox="0 0 34 34" fill="none">
                <path d="M17 3C9.27 3 3 9.27 3 17" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M17 7C11.48 7 7 11.48 7 17" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M17 11C13.69 11 11 13.69 11 17" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M17 15C15.9 15 15 15.9 15 17C15 19.2 15.8 21.2 17 22.8" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M17 3C24.73 3 31 9.27 31 17" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M17 7C22.52 7 27 11.48 27 17" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M17 11C20.31 11 23 13.69 23 17C23 20.31 20.31 23 17 23" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M19 17C19 18.1 18.1 19 17 19" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M11 17C11 23.07 13.69 28.5 18 32" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M23 17C23 22 21.2 26.6 18 30" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="brand">AI ML <span>007</span></div>
            <div className="tagline">Forensic Media Intelligence</div>
          </div>

          {/* Google Sign-In */}
          <button
            className={`btn-google ${googleLoading ? 'loading' : ''}`}
            onClick={handleGoogleLogin}
            disabled={googleLoading}
          >
            {googleLoading ? (
              'AUTHENTICATING...'
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>

          <div className="or-divider">
            <div className="or-line"></div>
            <span className="or-text">OR</span>
            <div className="or-line"></div>
          </div>

          {/* Tabs */}
          <div className="tabs">
            <button
              className={`tab-btn ${activeTab === 'signin' ? 'active' : ''}`}
              onClick={() => setActiveTab('signin')}
            >Sign In</button>
            <button
              className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => setActiveTab('register')}
            >Register</button>
          </div>

          {/* SIGN IN */}
          {activeTab === 'signin' && (
            <div className="signin-panel">
              <div className="field">
                <label className="field-label">Email</label>
                <div className="field-wrap">
                  <input type="email" className="field-input" placeholder="agent@organization.com" autoComplete="off" value={email} onChange={e => setEmail(e.target.value)} />
                  <div className="field-bar"></div>
                </div>
              </div>
              <div className="field">
                <label className="field-label">Password</label>
                <div className="field-wrap">
                  <input type={showPw ? 'text' : 'password'} className="field-input" placeholder="••••••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                  <button className="eye-btn" onClick={() => setShowPw(!showPw)} tabIndex={-1} type="button">👁</button>
                  <div className="field-bar"></div>
                </div>
              </div>
              <button className="btn-main" onClick={handleLogin} style={btnState !== 'idle' ? { opacity: 0.7 } : {}}>
                {btnState === 'loading' ? 'AUTHENTICATING...' : btnState === 'granted' ? 'ACCESS GRANTED ✓' : <>Access Terminal <span className="btn-arrow">→</span></>}
              </button>
            </div>
          )}

          {/* REGISTER */}
          {activeTab === 'register' && (
            <div className="register-panel active">
              <div className="field">
                <label className="field-label">Agent Codename</label>
                <div className="field-wrap">
                  <input type="text" className="field-input" placeholder="AGENT-DESIGNATION" value={regName} onChange={e => setRegName(e.target.value)} />
                  <div className="field-bar"></div>
                </div>
              </div>
              <div className="field">
                <label className="field-label">Email</label>
                <div className="field-wrap">
                  <input type="email" className="field-input" placeholder="agent@organization.com" value={regEmail} onChange={e => setRegEmail(e.target.value)} />
                  <div className="field-bar"></div>
                </div>
              </div>
              <div className="field">
                <label className="field-label">Access Key</label>
                <div className="field-wrap">
                  <input type={showRegPw ? 'text' : 'password'} className="field-input" placeholder="Create secure key" value={regPw} onChange={e => setRegPw(e.target.value)} />
                  <button className="eye-btn" onClick={() => setShowRegPw(!showRegPw)} tabIndex={-1} type="button">👁</button>
                  <div className="field-bar"></div>
                </div>
              </div>
              <button className="btn-main" onClick={handleRegister}>
                Request Clearance <span className="btn-arrow">→</span>
              </button>
            </div>
          )}

          <div className="or-divider">
            <div className="or-line"></div>
            <span className="or-text">OR</span>
            <div className="or-line"></div>
          </div>

          <button className="btn-ghost" onClick={handleGuest}>
            <span className="ghost-icon">◎</span>
            {guestState === 'loading' ? 'Initiating guest session...' : 'Continue as Guest Agent'}
          </button>

          {/* Security Note */}
          <div className="security-note">
            <span className="lock">⬡</span> Secured with end-to-end encryption<br/>
            Zero-knowledge architecture · TLS 1.3 · AES-256
          </div>
        </div>
      </div>
    </div>
  );
}
