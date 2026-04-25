import React from 'react';
import { ScanSearch, Mail, MapPin, Phone, ArrowUpRight, Fingerprint } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  const [theme, setTheme] = React.useState(localStorage.getItem('audra_theme') || 'light');

  React.useEffect(() => {
    // Apply initial theme
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  const changeTheme = (newTheme) => {
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('audra_theme', newTheme);
    setTheme(newTheme);
    window.dispatchEvent(new Event('theme-change'));
  };

  return (
    <footer className="site-footer">
      {/* Top Section: Newsletter */}
      <div className="footer-newsletter">
        <div className="newsletter-content">
          <h2>Stay ahead of misinformation.</h2>
          <p>Get weekly intelligence briefs on emerging deepfake threats and forensic techniques.</p>
          <div className="newsletter-form">
            <input type="email" placeholder="agent@organization.com" />
            <button>Subscribe <ArrowUpRight size={16} /></button>
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="footer-main">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-col brand-col">
            <div className="footer-logo">
              <Fingerprint size={28} />
              <span>Audra Labs</span>
            </div>
            <p className="brand-description">
              Next-generation forensic media intelligence platform. Empowering journalists and fact-checkers with AI-powered manipulation detection.
            </p>
            <div className="footer-badges">
              <span className="badge">Gemini 1.5 Pro</span>
              <span className="badge">Groq LPU</span>
              <span className="badge">Zero-Knowledge</span>
            </div>
            
            <div className="footer-theme-selector mt-4">
              <span className="theme-label">PLATFORM THEME:</span>
              <div className="theme-options">
                <button 
                  className={`theme-opt light ${theme === 'light' ? 'active' : ''}`}
                  onClick={() => changeTheme('light')}
                >LIGHT</button>
                <button 
                  className={`theme-opt black ${theme === 'black' ? 'active' : ''}`}
                  onClick={() => changeTheme('black')}
                >BLACK</button>
                <button 
                  className={`theme-opt solar ${theme === 'solar' ? 'active' : ''}`}
                  onClick={() => changeTheme('solar')}
                >SOLAR</button>
                <button 
                  className={`theme-opt dark ${theme === 'dark' ? 'active' : ''}`}
                  onClick={() => changeTheme('dark')}
                >DARK</button>
              </div>
            </div>
          </div>

          {/* Product Column */}
          <div className="footer-col">
            <h4>Product</h4>
            <ul>
              <li><a href="#section-08">Interactive Lab</a></li>
              <li><a href="#section-04">AI Engine</a></li>
              <li><a href="#section-10">Pricing</a></li>
              <li><a href="#section-09">Scalability</a></li>
              <li><a href="#">API Documentation</a></li>
              <li><a href="#">Changelog</a></li>
            </ul>
          </div>

          {/* Use Cases Column */}
          <div className="footer-col">
            <h4>Use Cases</h4>
            <ul>
              <li><a href="#">Newsroom Verification</a></li>
              <li><a href="#">Deepfake Detection</a></li>
              <li><a href="#">Social Media Audit</a></li>
              <li><a href="#">Legal Evidence</a></li>
              <li><a href="#">Election Monitoring</a></li>
              <li><a href="#">Academic Research</a></li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><a href="#section-11">Team</a></li>
              <li><a href="#section-12">Privacy & Security</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Careers <span className="hiring-badge">Hiring</span></a></li>
              <li><a href="#">Press Kit</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="footer-col">
            <h4>Contact</h4>
            <ul className="contact-list">
              <li>
                <Mail size={16} />
                <a href="mailto:intel@aiml007.io">intel@aiml007.io</a>
              </li>
              <li>
                <Phone size={16} />
                <a href="#">+1 (007) 007-0007</a>
              </li>
              <li>
                <MapPin size={16} />
                <span>New Delhi, India</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>© 2026 Audra Labs. All rights reserved. Built with intelligence.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms</a>
            <a href="#">Cookies</a>
            <a href="#">Status</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
