import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Activity, BrainCircuit, Globe, Lock, ArrowRight, ScanSearch, Menu, Sun, Moon, Zap, User, Gift, Trees, LogOut, FileEdit, BookOpen, Settings, ShieldAlert, Cpu, Network, Database, Terminal, Radar } from 'lucide-react';
import SectionWrapper from './SectionWrapper';
import Pricing from './Pricing';
import Team from './Team';
import Footer from './Footer';
import Carousel from './Carousel';
import './LandingPage.css';

export default function LandingPage({ toolComponent, history = [], loadHistoryItem, setHistory, formatHistoryDate }) {
  const [isManualOpen, setIsManualOpen] = React.useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = React.useState(false);
  const [isFullWidth, setIsFullWidth] = React.useState(true);
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [taglineIdx, setTaglineIdx] = React.useState(0);
  const taglines = [
    "We catch fakes. You stay private.",
    "Fakes don't hide from us.",
    "The lie is in the pixels. We find it.",
    "Built to expose what AI tries to hide.",
    "No fake gets past us. No data leaves you."
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIdx(prev => (prev + 1) % taglines.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  const [theme, setTheme] = React.useState('light');
  const [userProfile, setUserProfile] = React.useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [weatherConfig, setWeatherConfig] = React.useState({ sun: true, rain: true, snow: true, festive: true });
  const userMenuRef = React.useRef(null);
  
  const auth = JSON.parse(localStorage.getItem('audra_auth') || '{}');
  const [userDisplayName, setUserDisplayName] = React.useState(localStorage.getItem('audra_user_name') || auth.user?.name || 'OPERATIVE_01');
  // Check if actually authenticated or just in offline preview
  const isActuallyOnline = !!auth.user;
  const userDisplayEmail = isActuallyOnline ? auth.user?.email : 'OFFLINE_PREVIEW';

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setUserDisplayName(newName);
    localStorage.setItem('audra_user_name', newName);
  };

  // Outside click listener for menu
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen]);

  // Initialize theme and profile from storage
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('audra_theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const savedProfile = localStorage.getItem('audra_user_profile');
    if (savedProfile) setUserProfile(savedProfile);
  }, []);

  const handleProfileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setUserProfile(base64);
        localStorage.setItem('audra_user_profile', base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleTheme = () => {
    // Play tactical click sound
    try {
      const audio = new Audio('https://www.soundjay.com/communication/sounds/mechanical-clic-1.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } catch (e) {}

    const themes = ['light', 'dark', 'solar'];
    const nextTheme = themes[(themes.indexOf(theme) + 1) % themes.length];
    setTheme(nextTheme);
    localStorage.setItem('audra_theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };
  const globalHubs = [
    'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=800&auto=format&fit=crop', // NYC
    'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop', // London
    'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=800&auto=format&fit=crop', // Tokyo
    'https://images.unsplash.com/photo-1467226632440-65f0b49574f9?q=80&w=800&auto=format&fit=crop', // Singapore
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=800&auto=format&fit=crop'  // Chicago
  ];
  const [scaleIdx, setScaleIdx] = React.useState(0);
  const dashCount = 20;

  React.useEffect(() => {
    const interval = setInterval(() => {
      setScaleIdx(prev => (prev + 1) % globalHubs.length);
    }, 12000); // Rotate every 12s
    return () => clearInterval(interval);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('audra_auth');
    window.location.reload();
  };

  React.useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollY / height;
      const idx = Math.min(dashCount - 1, Math.floor(progress * dashCount));
      setActiveIdx(idx);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const searchRef = React.useRef(null);

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="landing-container">
      {/* Dynamic Weather Overlays */}
      <div className="weather-overlay-system">
        {theme === 'dark' && weatherConfig.snow && (
          <div className="snow-container">
            {Array.from({ length: 50 }).map((_, i) => (
              <div key={i} className="snowflake"></div>
            ))}
            {weatherConfig.festive && <div className="festive-ornament left"><Trees size={60} color="#00ff88" opacity={0.3} /></div>}
            {weatherConfig.festive && <div className="festive-ornament right"><Gift size={60} color="#00ff88" opacity={0.3} /></div>}
          </div>
        )}
        {theme === 'solar' && weatherConfig.rain && (
          <div className="rain-container">
            {Array.from({ length: 80 }).map((_, i) => (
              <div key={i} className="raindrop"></div>
            ))}
            {weatherConfig.festive && <div className="festive-ornament left"><Gift size={60} color="#cb4b16" opacity={0.3} /></div>}
          </div>
        )}
        {theme === 'light' && weatherConfig.sun && (
          <div className="sun-container">
             <div className="sun-glow"></div>
             <div className="sun-rays"></div>
             {weatherConfig.festive && <div className="festive-ornament right"><Trees size={60} color="#000" opacity={0.1} /></div>}
          </div>
        )}
      </div>

      {/* Top Navigation */}
      {/* Top Navigation */}
      <div className="landing-top-nav">
        <div className="nav-left">
          {/* Logo Removed as per user request */}
        </div>

        <div className="nav-right">
          <div className="search-container">
            <ScanSearch size={16} className="search-icon" />
            <input 
              ref={searchRef}
              type="text" 
              placeholder="Search Archives... (⌘K)" 
              className="tactical-search"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  document.getElementById('section-08').scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />
          </div>
          <button className="menu-btn" onClick={toggleTheme} title={`Current Theme: ${theme}`}>
            {theme === 'light' && <Sun size={18} />}
            {theme === 'dark' && <Moon size={18} />}
            {theme === 'solar' && <Zap size={18} />}
            <span className="menu-label" style={{ textTransform: 'uppercase' }}>{theme}</span>
          </button>
          <div className="user-profile-tactical-container" 
            ref={userMenuRef}
            style={{ position: 'relative', marginLeft: '0.5rem' }}
          >
            <div className="user-icon-tactical" 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              style={{ 
                width: '42px', 
                height: '42px', 
                borderRadius: '50%', 
                background: userProfile ? 'transparent' : 'var(--color-primary)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'var(--color-bg)',
                border: userProfile ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: userProfile ? '0 0 15px rgba(var(--color-primary-rgb), 0.3)' : 'none'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(var(--color-primary-rgb), 0.5)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                e.currentTarget.style.boxShadow = userProfile ? '0 0 15px rgba(var(--color-primary-rgb), 0.3)' : 'none';
              }}
            >
              {userProfile ? (
                <img src={userProfile} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <User size={20} />
              )}
            </div>

            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div 
                  className="user-tactical-dropdown"
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.98 }}
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '1.5rem',
                    width: '420px',
                    background: 'rgba(34, 34, 36, 0.75)', 
                    backdropFilter: 'blur(40px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '32px',
                    padding: '3rem 2rem',
                    zIndex: 99999,
                    boxShadow: '0 50px 120px rgba(0,0,0,0.4)',
                    transformOrigin: 'top right'
                  }}
                >
                  <div className="operative-identity-section" style={{ padding: '0 0.5rem 1.5rem 0.5rem', borderBottom: '1px solid rgba(var(--color-text-rgb), 0.1)', marginBottom: '1.5rem' }}>
                    <input 
                      type="text" 
                      value={userDisplayName} 
                      onChange={handleNameChange}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.target.blur(); // Triggers save and visual commit
                        }
                      }}
                      style={{ 
                        fontSize: '1.8rem', 
                        fontWeight: '900', 
                        color: '#ffffff', 
                        fontFamily: 'Share Tech Mono', 
                        background: 'rgba(255, 255, 255, 0.05)', 
                        border: 'none', 
                        borderBottom: '2px dashed rgba(255, 255, 255, 0.3)',
                        width: '100%',
                        outline: 'none',
                        marginBottom: '0.5rem',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '8px'
                      }}
                      title="Press Enter to Save Tactical Callsign"
                    />
                    <div style={{ 
                      fontSize: '0.9rem', 
                      color: '#00c853', 
                      fontFamily: 'Inter, sans-serif', 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginTop: '0.5rem',
                      fontWeight: '600'
                    }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00c853' }}></div>
                      User Online
                    </div>
                  </div>

                  <div className="dropdown-label" style={{ fontSize: '1.2rem', color: '#ffffff', padding: '0 0.5rem 1.5rem 0.5rem', fontFamily: 'Share Tech Mono', letterSpacing: '0.1em', fontWeight: '900', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '1.5rem' }}>MISSION_CONTROL</div>
                  
                  <div className="weather-toggles" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '2rem' }}>
                    {[
                      { id: 'sun', label: 'SUNLIGHT' },
                      { id: 'rain', label: 'RAIN_FX' },
                      { id: 'snow', label: 'SNOWFALL' }
                    ].map(mode => (
                      <button 
                        key={mode.id}
                        onClick={() => setWeatherConfig(prev => ({ ...prev, [mode.id]: !prev[mode.id] }))}
                        style={{ 
                          fontSize: '0.85rem', 
                          padding: '1rem 0.5rem', 
                          background: weatherConfig[mode.id] ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)', 
                          border: 'none',
                          color: weatherConfig[mode.id] ? '#000' : '#ffffff', 
                          borderRadius: '12px', 
                          cursor: 'pointer', 
                          fontFamily: 'Inter, sans-serif', 
                          fontWeight: '800',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.4rem',
                          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                    
                    {/* Hacker Mode Switch */}
                    <div 
                      onClick={() => {
                        const newTheme = theme === 'hacker' ? 'dark' : 'hacker';
                        setTheme(newTheme);
                        document.documentElement.setAttribute('data-theme', newTheme);
                        localStorage.setItem('audra_theme', newTheme);
                      }}
                      style={{ 
                        gridColumn: 'span 2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1.15rem', 
                        background: theme === 'hacker' ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255,255,255,0.03)', 
                        borderRadius: '20px', 
                        cursor: 'pointer', 
                        transition: 'all 0.3s ease',
                        marginTop: '0.4rem',
                        border: theme === 'hacker' ? '1px solid #00ff88' : '1px solid rgba(255,255,255,0.05)'
                      }}
                    >
                      <span style={{ fontSize: '1rem', color: theme === 'hacker' ? '#00ff88' : '#ffffff', fontWeight: '800', fontFamily: 'Share Tech Mono', letterSpacing: '0.05em' }}>
                        HACKER_MODE
                      </span>
                      
                      <div style={{ 
                        width: '52px', 
                        height: '28px', 
                        background: theme === 'hacker' ? '#00ff88' : 'rgba(255,255,255,0.1)', 
                        borderRadius: '25px', 
                        position: 'relative',
                        transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                        padding: '4px'
                      }}>
                        <div style={{ 
                          width: '20px', 
                          height: '20px', 
                          background: '#ffffff', 
                          borderRadius: '50%', 
                          position: 'absolute',
                          left: theme === 'hacker' ? '28px' : '4px',
                          transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                        }} />
                      </div>
                    </div>

                    <div 
                      onClick={() => setIsFullWidth(!isFullWidth)}
                      style={{ 
                        gridColumn: 'span 2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1.15rem', 
                        background: 'rgba(255,255,255,0.03)', 
                        borderRadius: '20px', 
                        cursor: 'pointer', 
                        transition: 'all 0.3s ease',
                        marginTop: '0.4rem',
                        border: '1px solid rgba(255,255,255,0.05)'
                      }}
                    >
                      <span style={{ fontSize: '1rem', color: isFullWidth ? 'var(--color-primary)' : '#ffffff', fontWeight: '800', fontFamily: 'Share Tech Mono', letterSpacing: '0.05em' }}>
                        VIEWPORT: {isFullWidth ? 'FULL' : 'NORMAL'}
                      </span>
                      
                      <div style={{ 
                        width: '52px', 
                        height: '28px', 
                        background: isFullWidth ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)', 
                        borderRadius: '25px', 
                        position: 'relative',
                        transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                        padding: '4px'
                      }}>
                        <div style={{ 
                          width: '20px', 
                          height: '20px', 
                          background: '#ffffff', 
                          borderRadius: '50%', 
                          position: 'absolute',
                          left: isFullWidth ? '28px' : '4px',
                          transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                        }} />
                      </div>
                    </div>
                  
                  
                  <div style={{ height: '1px', background: 'rgba(var(--color-text-rgb), 0.1)', margin: '1.5rem 0' }}></div>
                  
                  <button 
                    className="dropdown-item-tactical logout" 
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setIsLogoutConfirmOpen(true);
                    }}
                    style={{ 
                      justifyContent: 'center', 
                      marginTop: '2rem', 
                      marginBottom: '1rem',
                      padding: '1rem 1.5rem',
                      background: 'transparent', 
                      border: '1px solid #ff3b30', 
                      fontWeight: '900', 
                      color: '#ff3b30',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      borderRadius: '12px'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 59, 48, 0.15)';
                      e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 59, 48, 0.3)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <LogOut size={18} /> SIGN OUT Audra
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Side Scroll Indicator */}
      <div className="landing-side-nav">
        {Array.from({ length: dashCount }).map((_, i) => (
          <div 
            key={i} 
            className={`landing-nav-dash ${activeIdx === i ? 'active' : ''}`}
            onClick={() => {
              const height = document.documentElement.scrollHeight - window.innerHeight;
              window.scrollTo({ top: (i / dashCount) * height, behavior: 'smooth' });
            }}
          />
        ))}
      </div>
      {/* 01: The Reveal */}
      <SectionWrapper className={`section-centered hero-section ${isFullWidth ? 'full-width' : ''}`} id="section-01">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <ScanSearch size={80} className="hero-icon" />
          <h1 className="text-hero" style={{ display: 'flex', justifyContent: 'center', gap: '0.1em' }}>
            {"Audra Labs".split("").map((char, i) => (
              <span 
                key={i} 
                className="hover-char"
                style={{ 
                  transition: 'color 0.3s ease, text-shadow 0.3s ease',
                  cursor: 'default',
                  display: char === " " ? "inline" : "inline-block",
                  minWidth: char === " " ? "0.3em" : "auto"
                }}
              >
                {char}
              </span>
            ))}
          </h1>
          <div className="audra-bookmark rainbow-text">Forensic Intelligence Platform</div>
          <motion.p 
            key={taglineIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-subtitle mt-2"
            style={{ fontWeight: '400', color: 'var(--color-text-muted)', fontSize: '1.4rem' }}
          >
            {taglines[taglineIdx]}
          </motion.p>
        </motion.div>
      </SectionWrapper>


      {/* 02: The Mission */}
      <SectionWrapper className={`section-centered ${isFullWidth ? 'full-width' : ''}`} id="section-02">
        <h2 className="text-title">The Mission</h2>
        <p className="text-body-large mt-2 max-w-800">
          In an era of synthetic media, seeing is no longer believing. We equip journalists, independent investigators, and global fact-checkers with military-grade AI to unmask sophisticated digital manipulation before it goes viral.
        </p>
        <p className="text-body-large mt-2 max-w-800">
          Our goal is to restore the "Noise-to-Signal" ratio in the global information ecosystem. By democratizing access to high-end forensic tools, we empower the guardians of truth to verify reality in real-time.
        </p>
      </SectionWrapper>

      {/* 03: The Threat */}
      <SectionWrapper className={`two-col ${isFullWidth ? 'full-width' : ''}`} id="section-03">
        <div className="col-content">
          <h2 className="text-title">The Threat</h2>
          <p className="text-body-large">
            Deepfakes, splicing, and AI-generated misinformation are proliferating at scale. Traditional verification methods—often relying on slow human oversight—cannot keep up with the exponential growth of generative models.
          </p>
          <p className="text-body-large mt-2">
            This "Generative Misinformation" threat bypasses standard filters, spreading across encrypted channels and social networks faster than corrections can be made. Audra Labs provides the defensive layer needed to stop this cycle.
          </p>
        </div>
        <div className="col-visual threat-visual">
          <div className="threat-img-container">
            <img 
              src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop"
              alt="The Threat - Digital Manipulation"
              className="threat-img"
            />
            <div className="threat-overlay"></div>
            <div className="threat-label">THREAT DETECTED</div>
          </div>
        </div>
      </SectionWrapper>

      {/* 03.5: Intelligence Feed */}
      <SectionWrapper className={`bg-alt ${isFullWidth ? 'full-width' : ''}`} id="section-intel">
        <div className="section-centered">
          <div className="tactical-label">GLOBAL INTELLIGENCE FEED</div>
          <h2 className="text-title">Active Counter-Measures</h2>
          <div className="intel-feed-container premium-card mt-3">
             <div className="intel-row">
               <span className="intel-time">[08:42:15]</span>
               <span className="intel-status status-alert">ALERT</span>
               <span className="intel-msg">Synthetic video detected in Southeast Asian election cycle. Deepfake suppressed.</span>
             </div>
             <div className="intel-row">
               <span className="intel-time">[08:31:04]</span>
               <span className="intel-status status-verify">VERIFY</span>
               <span className="intel-msg">Reuters Fact Check: Satellite imagery confirmed authentic via metadata hash.</span>
             </div>
             <div className="intel-row">
               <span className="intel-time">[08:15:22]</span>
               <span className="intel-status status-scan">SCAN</span>
               <span className="intel-msg">Batch scan complete: 4,200 assets analyzed. Neural signatures: 0.04% variance.</span>
             </div>
             <div className="intel-row">
               <span className="intel-time">[07:58:49]</span>
               <span className="intel-status status-alert">ALERT</span>
               <span className="intel-msg">Coordinated generative misinformation campaign identified in Eastern Europe.</span>
             </div>
          </div>
        </div>
      </SectionWrapper>


      {/* 05: Step 1 - Ingest */}
      <SectionWrapper className={`two-col-reverse ${isFullWidth ? 'full-width' : ''}`} id="section-05">
        <div className="col-visual ingest-visual">
          <img 
            src="https://picsum.photos/seed/audra_ingest_7/800/500" 
            alt="Forensic Ingest" 
            className="step-visual-img"
          />
        </div>
        <div className="col-content">
          <h3 className="step-label">Step 01</h3>
          <h2 className="text-title">Ingest</h2>
          <p className="text-body-large">
            Secure, drag-and-drop ingestion of images and video. We support high-resolution inputs and ensure local hashing before transmission.
          </p>
        </div>
      </SectionWrapper>

      {/* 06: Step 2 - Analyze */}
      <SectionWrapper className={`two-col ${isFullWidth ? 'full-width' : ''}`} id="section-06">
        <div className="col-content">
          <h3 className="step-label">Step 02</h3>
          <h2 className="text-title">Analyze</h2>
          <p className="text-body-large">
            The neural network scans the media pixel-by-pixel, extracting metadata and performing Error Level Analysis (ELA) to find hidden inconsistencies.
          </p>
        </div>
        <div className="col-visual analyze-visual">
          <div className="analysis-graph-container">
            <img 
              src="https://picsum.photos/seed/audra_analysis_9/800/500" 
              alt="Neural Analysis" 
              className="step-visual-img"
            />
            <div className="scanning-beam"></div>
            <div className="data-overlay-pulse">
              <Activity size={40} className="pulse-icon-mini" />
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* 07: Step 3 - Verdict */}
      <SectionWrapper className={`two-col-reverse ${isFullWidth ? 'full-width' : ''}`} id="section-07">
        <div className="col-visual verdict-visual">
          <div className="sample-verdict-card premium-card">
            <div className="verdict-card-header">
               <ShieldCheck size={24} className="glow-icon" />
               <span>FORENSIC VERDICT: MANIPULATED</span>
            </div>
            <div className="verdict-score-row">
              <span className="score-value">94.8%</span>
              <span className="score-label">CONFIDENCE SCORE</span>
            </div>
            <img 
              src="https://picsum.photos/seed/audra_verdict_7/600/350" 
              alt="Sample Forensic Report" 
              className="sample-report-img"
            />
          </div>
        </div>
        <div className="col-content">
          <h3 className="step-label">Step 03</h3>
          <h2 className="text-title">The Verdict</h2>
          <p className="text-body-large">
            A definitive, plain-English forensic report. Clear confidence scores, highlighted suspicious regions, and actionable next steps.
          </p>
        </div>
      </SectionWrapper>

      {/* Tactical Divider */}
      <div className="section-divider">
        <div className="divider-line"></div>
        <div className="divider-tag">DETECTION VECTORS</div>
        <div className="divider-line"></div>
      </div>

      {/* 07.5: Carousel Showcase */}
      <SectionWrapper className={`section-centered bg-alt ${isFullWidth ? 'full-width' : ''}`} id="section-showcase" style={{ padding: '2rem 0 4rem 0', maxWidth: '100%' }}>
        <div style={{ padding: '0 2rem', width: '100%', maxWidth: '1400px', textAlign: 'left', marginBottom: '1rem', margin: '0 auto' }}>
          <h2 className="text-title" style={{ fontSize: '2.5rem' }}>Detection Vectors</h2>
          <p className="text-body-large">Explore the intelligence engine's capabilities.</p>
        </div>
        <Carousel />
      </SectionWrapper>

      {/* 08: Interactive Lab (The App) */}
      <SectionWrapper className={`lab-section ${isFullWidth ? 'full-width' : ''}`} id="section-08">
        <div className="lab-header section-centered">
          <h2 className="text-title">Interactive Lab</h2>
          <p className="text-body-large">Test the intelligence engine live.</p>
        </div>
        <div className="lab-container">
          {toolComponent}
        </div>
      </SectionWrapper>

      {/* NEW: Image History (Repositioned for Operative Access) */}
      {history.length > 0 && (
        <SectionWrapper className={`bg-alt ${isFullWidth ? 'full-width' : ''}`} id="section-history" style={{ padding: '10rem 2rem' }}>
          <div className="section-container" style={{ padding: '6rem 4rem', width: '100%', maxWidth: '100%', margin: '0' }}>
            <h1 className="text-hero" style={{ fontSize: '4.5rem', marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>IMAGE HISTORY</h1>
            <p className="text-body-large mb-4" style={{ fontSize: '1.5rem', opacity: 0.8 }}>Archives of all previous forensic intelligence scans.</p>
            
            <div className="history-header" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '3rem', width: '100%' }}>
              <button className="clear-history-btn" style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem' }} onClick={() => {
                setHistory([]);
                localStorage.removeItem('audra_history');
              }}>Clear Archives</button>
            </div>

            <div className="history-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '3rem', width: '100%' }}>
              {history.map(item => (
                <div key={item.id} className="history-card premium-card" style={{ 
                  position: 'relative', 
                  overflow: 'hidden', 
                  cursor: 'default', 
                  background: 'var(--card-bg)', 
                  borderRadius: '24px', 
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'stretch'
                }}>
                  <div style={{ position: 'relative', width: '180px', flexShrink: 0, overflow: 'hidden', cursor: 'pointer' }} onClick={() => {
                    loadHistoryItem(item);
                    document.getElementById('section-08').scrollIntoView({ behavior: 'smooth' });
                  }}>
                    <img src={item.thumbnail} alt="Analysis thumbnail" className="history-thumb" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(0.3)' }} />
                    <div className="history-overlay-research" style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0,0,0,0.6)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'all 0.3s ease',
                      gap: '0.5rem'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.opacity = 1}
                    onMouseOut={(e) => e.currentTarget.style.opacity = 0}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                      <span style={{ fontSize: '0.7rem', fontWeight: '900', color: 'var(--color-primary)', letterSpacing: '0.1em' }}>VIEW & RESEARCH</span>
                    </div>
                  </div>
                  
                  <div className="history-info" style={{ padding: '1.25rem 1.75rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <span className="history-badge" style={{
                        padding: '0.4rem 0.8rem',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        fontWeight: 900,
                        backgroundColor: item.verdict === 'FAKE' ? 'rgba(255, 59, 48, 0.1)' : item.verdict === 'REAL' ? 'rgba(52, 199, 89, 0.1)' : 'rgba(255, 149, 0, 0.1)',
                        color: item.verdict === 'FAKE' ? 'var(--color-danger)' : item.verdict === 'REAL' ? 'var(--color-success)' : 'var(--color-warning)',
                        border: `1px solid ${item.verdict === 'FAKE' ? 'rgba(255, 59, 48, 0.2)' : item.verdict === 'REAL' ? 'rgba(52, 199, 89, 0.2)' : 'rgba(255, 149, 0, 0.2)'}`
                      }}>
                        {item.verdict === 'FAKE' ? '❌ FAKE' : item.verdict === 'REAL' ? '✅ REAL' : '⚠️ SUSPICIOUS'}
                      </span>
                      <span className="history-score" style={{ fontFamily: 'Share Tech Mono', fontSize: '1.2rem', fontWeight: 900, color: 'var(--color-primary)' }}>{Math.round(item.score)}%</span>
                    </div>

                    <p style={{ 
                      fontSize: '0.85rem', 
                      color: 'var(--color-text)', 
                      opacity: 0.8, 
                      lineHeight: '1.4', 
                      marginBottom: '1rem',
                      fontWeight: '600',
                      display: '-webkit-box',
                      WebkitLineClamp: '2',
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {item.summary || "Forensic analysis complete. Technical signatures verified."}
                    </p>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem' }}>
                      <span className="history-date" style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: '700' }}>{formatHistoryDate ? formatHistoryDate(item.date) : item.date}</span>
                      <a 
                        href={item.thumbnail} 
                        download={`audra-forensic-${item.id}.jpg`}
                        className="download-link"
                        style={{ 
                          color: 'var(--color-primary)', 
                          textDecoration: 'none', 
                          fontSize: '0.75rem', 
                          fontWeight: 900,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          background: 'rgba(var(--color-primary-rgb), 0.1)',
                          padding: '0.4rem 0.8rem',
                          borderRadius: '6px',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(var(--color-primary-rgb), 0.2)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(var(--color-primary-rgb), 0.1)'}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        EXPORT
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionWrapper>
      )}

      {/* 09: Scalability */}
      <SectionWrapper className={`two-col ${isFullWidth ? 'full-width' : ''}`} id="section-09">
        <div className="col-content">
          <Globe size={40} className="section-icon mb-1" />
          <h2 className="text-title">Global Scale</h2>
          <p className="text-body-large">
            Built on a serverless architecture designed for high-throughput newsrooms. Analyze thousands of images per hour with zero latency degradation.
          </p>
        </div>
         <div className="col-visual scale-visual">
            <img 
              src={globalHubs[scaleIdx]} 
              alt="Global Intelligence" 
              className="step-visual-img"
              key={scaleIdx}
            />
            <div className="grid-overlay"></div>
            <div className="scanning-beam"></div>
         </div>
      </SectionWrapper>

      {/* 10: Pricing */}
      <SectionWrapper className={`section-centered bg-alt ${isFullWidth ? 'full-width' : ''}`} id="section-10">
        <h2 className="text-title">Pricing</h2>
        <p className="text-body-large">Transparent tiers for verification at any scale.</p>
        <Pricing />
      </SectionWrapper>

      {/* 11: Team */}
      <SectionWrapper className={`section-centered ${isFullWidth ? 'full-width' : ''}`} id="section-11">
        <h2 className="text-title">The Operatives</h2>
        <p className="text-body-large">Meet the intelligence behind the platform.</p>
        <Team />
      </SectionWrapper>

      {/* 12: Integrity */}
      <SectionWrapper className={`two-col-reverse ${isFullWidth ? 'full-width' : ''}`} id="section-12">
        <div className="col-visual lock-visual">
           <Lock size={120} strokeWidth={1} className="lock-icon" />
        </div>
        <div className="col-content">
          <h2 className="text-title">Zero-Knowledge</h2>
          <p className="text-body-large">
            We don't train on your data. All uploaded media is processed in memory and immediately discarded. Your journalistic integrity remains uncompromised.
          </p>
        </div>
      </SectionWrapper>

      {/* 13: Case Studies */}
      <SectionWrapper className={`section-centered ${isFullWidth ? 'full-width' : ''}`} id="section-13">
        <div className="tactical-label">OPERATIONAL PARTNERS</div>
        <h2 className="text-title">Trusted By Global Newsrooms</h2>
        <div className="trusted-logos-marquee mt-4">
          <div className="marquee-content">
            <div className="logo-placeholder">Reuters Fact Check</div>
            <div className="logo-placeholder">AP News</div>
            <div className="logo-placeholder">Bellingcat</div>
            <div className="logo-placeholder">AFP Fact Check</div>
            <div className="logo-placeholder">Full Fact</div>
            <div className="logo-placeholder">BBC Verify</div>
            {/* Duplicate for infinite loop */}
            <div className="logo-placeholder">Reuters Fact Check</div>
            <div className="logo-placeholder">AP News</div>
            <div className="logo-placeholder">Bellingcat</div>
            <div className="logo-placeholder">AFP Fact Check</div>
            <div className="logo-placeholder">Full Fact</div>
            <div className="logo-placeholder">BBC Verify</div>
          </div>
        </div>
      </SectionWrapper>

      {/* Sections 09-12 omitted for brevity as they are already in the file */}

      {/* 13.7: Final Mission Statement */}
      <SectionWrapper className={`section-centered ${isFullWidth ? 'full-width' : ''}`} id="section-mission-final">
        <div className="mission-container" style={{ padding: '4rem', background: 'var(--color-bg-alt)', borderRadius: '32px', border: '1px solid var(--color-border)', width: '100%' }}>
          <div className="tactical-label">[ MISSION_PROTOCOL ]</div>
          <h2 className="text-hero" style={{ fontSize: '3rem', margin: '1rem 0' }}>Defending the Information Ecosystem</h2>
          <p className="text-body-large mx-auto" style={{ maxWidth: '900px' }}>
            In a world where AI can fabricate reality, truth remains the ultimate currency. 
            Audra Labs is the defensive layer for truth, ensuring that every piece of media 
            can be verified, authenticated, and trusted.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', marginTop: '3rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--color-primary)', fontFamily: 'Orbitron' }}>900%</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Attack Rise</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--color-primary)', fontFamily: 'Orbitron' }}>0.04ms</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Scan Latency</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--color-primary)', fontFamily: 'Orbitron' }}>∞</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Verified Trust</div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* 14: Final Verdict (CTA) */}
      <SectionWrapper className={`section-centered footer-section ${isFullWidth ? 'full-width' : ''}`} id="section-14">
        <div className="cta-cinematic-bg">
          <div className="scanning-beam-horizontal"></div>
          <div className="forensic-grid-pattern"></div>
        </div>
        <div className="cta-content-wrapper">
          <ShieldCheck size={80} className="section-icon mb-2 glow-icon" />
          <h2 className="text-title display-large">Ready for the truth?</h2>
          <p className="text-body-large mb-3">Join the global network of truth-seekers and journalists.</p>
          <button 
            className="cta-button-premium mt-3"
            onClick={() => document.getElementById('section-08').scrollIntoView({ behavior: 'smooth' })}
          >
            START INVESTIGATING <ArrowRight size={20} />
          </button>
        </div>
      </SectionWrapper>

      {/* 15: Hackathon Special */}
      <SectionWrapper className={`section-centered bg-alt ${isFullWidth ? 'full-width' : ''}`} id="section-hackathon" style={{ padding: '8rem 2rem' }}>
        <div className="tactical-label">AUDRA_HACK_v1.0</div>
        <h2 className="text-hero" style={{ fontSize: '4rem', color: 'var(--color-primary)' }}>Hackathon Intelligence</h2>
        <div className="hackathon-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '4rem', width: '100%' }}>
           <div className="premium-card" style={{ padding: '2rem', textAlign: 'left' }}>
             <Zap className="mb-1" style={{ color: 'var(--color-primary)' }} />
             <h3>Rapid Deployment</h3>
             <p>Optimized for real-time demonstration. Zero-latency analysis pipelines built for high-pressure environments.</p>
           </div>
           <div className="premium-card" style={{ padding: '2rem', textAlign: 'left' }}>
             <Activity className="mb-1" style={{ color: 'var(--color-primary)' }} />
             <h3>Stress Tested</h3>
             <p>Reliable forensic scanning even under extreme network load. Built for global newsrooms and hackathon judges alike.</p>
           </div>
           <div className="premium-card" style={{ padding: '2rem', textAlign: 'left' }}>
             <BrainCircuit className="mb-1" style={{ color: 'var(--color-primary)' }} />
             <h3>Visionary AI</h3>
             <p>Powered by the latest Gemini 1.5 Flash models for precise detection of AI-generated artifacts.</p>
           </div>
        </div>
      </SectionWrapper>

      {/* Footer */}
      <Footer />
      
      {/* Privacy & Terms Links (Tactical Overlay for easy access) */}
      <div className="tactical-footer-links" style={{ 
        padding: '2rem 3rem', 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '2rem',
        fontSize: '0.8rem',
        fontFamily: 'Share Tech Mono, monospace',
        color: 'var(--color-text-muted)',
        borderTop: '1px solid var(--color-border)',
        background: 'var(--color-bg)'
      }}>
        <a href="#" style={{ color: 'inherit' }}>PRIVACY_PROTOCOL.PDF</a>
        <a href="#" style={{ color: 'inherit' }}>TERMS_OF_SERVICE.MD</a>
        <a href="#" style={{ color: 'inherit' }}>COMPLIANCE_v1.0.7</a>
      </div>

      {/* Floating Manual Trigger */}
      <div className="landing-floating-controls">
        <button 
          className="manual-trigger-btn"
          onClick={() => setIsManualOpen(true)}
          title="Open Operational Manual"
        >
          <span className="manual-label">OPERATIONAL MANUAL</span>
          <div className="manual-dot"></div>
        </button>
      </div>

      {/* Notion-Style Sidebar */}
      <AnimatePresence>
        {isManualOpen && (
          <div className="manual-overlay" onClick={() => setIsManualOpen(false)}>
            <motion.div 
              className="manual-sidebar"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="manual-close" onClick={() => setIsManualOpen(false)}>✕</button>
              <div className="notion-style-content">
                <div className="ns-header">
                  <span className="ns-emoji">📄</span>
                  <h2 className="ns-title">Audra Labs: Operational Manual</h2>
                </div>
                <div className="ns-body">
                  <h3>01: How It Works</h3>
                  <p>Audra Labs utilizes multi-modal neural networks to analyze media assets in real-time. Our engine scans for temporal inconsistencies, lighting deviations, and GAN-specific neural signatures.</p>
                  <ul>
                    <li><strong>Ingest:</strong> Secure drag-and-drop or encrypted URL import.</li>
                    <li><strong>Scan:</strong> Pixel-by-pixel Error Level Analysis (ELA).</li>
                    <li><strong>Verdict:</strong> Verifiable forensic report with confidence scoring.</li>
                  </ul>
                  
                  <h3>02: Data Security & Privacy</h3>
                  <p><strong>ZERO DATA LEAK POLICY:</strong> We operate on a zero-knowledge architecture. All uploaded media is processed in volatile memory and immediately purged upon session termination.</p>
                  <ul>
                    <li>No assets are stored on our servers post-analysis.</li>
                    <li>No user data is used for model training.</li>
                    <li>All transmissions are secured via TLS 1.3 & AES-256.</li>
                  </ul>
                  
                  <h3>03: Terms & Conditions</h3>
                  <p>By accessing the Audra Labs terminal, you agree to utilize these forensic tools for verification and truth-seeking purposes only. Commercial exploitation of generative detection results is subject to enterprise licensing.</p>
                  
                  <h3>04: Privacy Policy</h3>
                  <p>We do not track operative identities. Your IP address and metadata are stripped at the edge layer. We collect only anonymized telemetry to optimize detection accuracy across the network.</p>
                  
                  <div className="ns-footer">
                    <p>Clearance: Class-3 Operative</p>
                    <p>Terminal: Node-07 [Active]</p>
                    <p>© 2024 Audra Labs · Forensic Intelligence</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sign Out Confirmation Modal */}
      <AnimatePresence>
        {isLogoutConfirmOpen && (
          <div style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            zIndex: 99999, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            backdropFilter: 'blur(30px) saturate(150%)', 
            WebkitBackdropFilter: 'blur(30px) saturate(150%)',
            background: 'rgba(0,0,0,0.6)' 
          }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              style={{ 
                width: '100%',
                maxWidth: '500px', 
                padding: '3.5rem', 
                textAlign: 'center',
                background: 'rgba(var(--color-text-rgb), 0.05)',
                backdropFilter: 'blur(60px)',
                WebkitBackdropFilter: 'blur(60px)',
                borderRadius: '32px',
                border: '1px solid rgba(var(--color-primary-rgb), 0.2)',
                boxShadow: '0 60px 120px rgba(0,0,0,0.9)',
                margin: '2rem'
              }}
            >
              <LogOut size={64} color="var(--color-primary)" style={{ marginBottom: '2.5rem' }} />
              <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', marginBottom: '3rem', lineHeight: '1.8', fontFamily: 'Inter, sans-serif' }}>
                Are you sure you want to sign out from <strong style={{ color: 'var(--color-text)' }}>Audra Lab</strong>? 
                <br/>All active forensic telemetry will be safely encrypted.
              </p>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <button 
                  onClick={() => setIsLogoutConfirmOpen(false)}
                  style={{ flex: 1, padding: '1.25rem', background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontFamily: 'Share Tech Mono', fontWeight: '500', fontSize: '0.9rem', transition: 'all 0.2s ease' }}
                  onMouseOver={(e) => { e.currentTarget.style.color = 'var(--color-text)'; e.currentTarget.style.textDecoration = 'underline'; }}
                  onMouseOut={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.textDecoration = 'none'; }}
                >
                  CANCEL
                </button>
                <button 
                  onClick={handleSignOut}
                  style={{ 
                    flex: 1.5, 
                    padding: '1.25rem', 
                    background: 'var(--color-primary)', 
                    border: 'none', 
                    color: '#000', // High contrast black text on bright primary
                    borderRadius: '14px', 
                    cursor: 'pointer', 
                    fontFamily: 'Share Tech Mono', 
                    fontWeight: '900', 
                    fontSize: '1.1rem', 
                    transition: 'all 0.2s ease', 
                    boxShadow: '0 15px 40px rgba(var(--color-primary-rgb), 0.4)' 
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.filter = 'brightness(1.1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.filter = 'none';
                  }}
                >
                  AGREE
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
