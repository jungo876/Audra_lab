import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LandingPage from './components/LandingPage';
import UploadZone from './components/UploadZone';
import VerdictPanel from './components/VerdictPanel';
import { Loader2 } from 'lucide-react';
import './App.css';

// Map backend verdicts to human-friendly labels
function humanizeVerdict(verdict) {
  if (!verdict) return 'NOT SURE';
  const v = verdict.toUpperCase().trim();
  if (v === 'FAKE' || v.includes('MANIPULATED')) return 'FAKE';
  if (v === 'REAL' || v.includes('AUTHENTIC') || v === 'VERIFIED') return 'REAL';
  if (v === 'SUSPICIOUS' || v === 'NOT SURE') return 'NOT SURE';
  return 'NOT SURE';
}

function App() {
  const [mediaUrl, setMediaUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [analysisLogs, setAnalysisLogs] = useState([]);
  const [history, setHistory] = useState([]);

  // Load history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const auth = JSON.parse(localStorage.getItem('audra_auth') || '{}');
        const config = auth.token ? { headers: { Authorization: `Bearer ${auth.token}` } } : {};

        if (!auth.token) throw new Error('No auth');

        const res = await axios.get('http://localhost:5001/api/history', config);
        if (res.data && Array.isArray(res.data)) {
          setHistory(res.data);
        }
      } catch (err) {
        console.warn('MongoDB history unavailable or not authenticated, using local storage');
        const saved = localStorage.getItem('audra_history');
        if (saved) {
          try { setHistory(JSON.parse(saved)); } catch (e) { }
        }
      }
    };
    fetchHistory();
  }, []);

  // Helper to create tiny base64 thumbnail
  const createThumbnail = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800; // Increased for better history viewing
        const scale = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.5));
      };
      img.onerror = () => resolve(null);
      img.src = url;
    });
  };

  const handleAnalyze = async (file, previewUrl, userInquiry = '') => {
    setResult(null); // Clear previous results immediately
    setMediaUrl(previewUrl);
    setIsAnalyzing(true);
    setError('');
    setAnalysisLogs([
      "Initiating multi-layer forensic ingest...",
      userInquiry ? `Targeting objective: "${userInquiry}"` : "Initializing generalized forensic scan..."
    ]);

    const formData = new FormData();
    formData.append('media', file);
    if (userInquiry) formData.append('inquiry', userInquiry);

    // Animate log steps while waiting for the real API
    const logSteps = [
      "Running Error Level Analysis (ELA)...",
      "Calculating compression variance map...",
      "Scanning for Neural Signatures (DALL-E/Midjourney)...",
      "Verifying metadata hash integrity...",
      "Analyzing lighting & shadow vectors...",
      "Generating final forensic verdict..."
    ];

    let stepIdx = 0;
    const logInterval = setInterval(() => {
      if (stepIdx < logSteps.length) {
        setAnalysisLogs(prev => [...prev, logSteps[stepIdx]]);
        stepIdx++;
      }
    }, 1500); // Slower, more deliberate forensic feel

    try {
      const response = await axios.post('http://localhost:5001/api/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Minimum wait of 10s for dramatic forensic build-up
      await new Promise(resolve => setTimeout(resolve, 10000));

      clearInterval(logInterval);
      // Show remaining log steps instantly
      setAnalysisLogs(prev => [...prev, ...logSteps.slice(stepIdx)]);

      // Map the verdict to human-friendly label
      const data = response.data;
      data.verdict = humanizeVerdict(data.verdict);
      
      // Ensure backward compatibility mapping
      data.confidenceScore = data.confidence;
      data.summary = data.reason;
      data.techniques = data.flags;

      // Save to history
      const thumb = await createThumbnail(previewUrl);
      const newEntry = {
        thumbnail: thumb,
        verdict: data.verdict,
        score: Math.round(data.confidenceScore),
        summary: data.summary,
        fullResult: data
      };

      try {
        const auth = JSON.parse(localStorage.getItem('audra_auth') || '{}');
        if (!auth.token) throw new Error('No token');

        const historyRes = await axios.post('http://localhost:5001/api/history', newEntry, {
          headers: { Authorization: `Bearer ${auth.token}` }
        });
        const updatedHistory = [historyRes.data, ...history].slice(0, 50);
        setHistory(updatedHistory);
      } catch (historyErr) {
        console.warn('Failed to save to MongoDB history, using local storage fallback');
        newEntry.id = Date.now();
        newEntry.date = new Date().toISOString();
        const updatedHistory = [newEntry, ...history].slice(0, 20);
        setHistory(updatedHistory);
        localStorage.setItem('audra_history', JSON.stringify(updatedHistory));
      }

      // ATOMIC REVEAL: Hand over from terminal to final report with zero gap
      // Map the verdict to human-friendly label and ensure mapping
      const finalData = { ...data };
      finalData.confidenceScore = data.confidence || data.confidenceScore;
      finalData.summary = data.reason || data.summary;
      finalData.techniques = data.flags || data.techniques;
      
      // Stop logs first
      clearInterval(logInterval);
      
      // Atomic state change: SET RESULT FIRST then DISABLE ANALYZING
      setResult(finalData);
      setIsAnalyzing(false);

    } catch (err) {
      clearInterval(logInterval);
      console.error('Analysis failed:', err);
      setError(
        err.response?.data?.error ||
        'Could not reach the Audra Intelligence Engine. Make sure the backend server is running on port 5000.'
      );
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setMediaUrl(null);
    setResult(null);
    setError('');
    setAnalysisLogs([]);
  };

  const loadHistoryItem = (item) => {
    setResult(item.fullResult);
    setMediaUrl(item.thumbnail); // Since we only saved the thumbnail, use it for preview
    setError('');
  };

  const formatHistoryDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const isToday = date.getDate() === today.getDate() && date.getMonth() === today.getMonth();
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return isToday ? `Today ${timeStr}` : `${date.toLocaleDateString()} ${timeStr}`;
  };

  const LiveToolComponent = (
    <div className="live-tool">
      <div className="main-content-area">
        {!mediaUrl && !isAnalyzing && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
            <UploadZone onAnalyze={handleAnalyze} />
            
            {/* Image History Display right below Upload Box */}
            {history.length > 0 && (
              <div className="history-inline-section mt-8" style={{ width: '100%', marginTop: '6rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '0.05em', color: 'var(--color-primary)' }}>RECENT_ANALYSIS_ARCHIVES</h3>
                  <button onClick={() => {
                    setHistory([]);
                    localStorage.removeItem('audra_history');
                  }} style={{ background: 'transparent', border: '1px solid var(--color-danger)', color: 'var(--color-danger)', padding: '0.4rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 800 }}>
                    CLEAR_ARCHIVES
                  </button>
                </div>
                
                <div className="history-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                  {history.map(item => (
                    <div key={item.id} className="history-card premium-card" style={{ 
                      position: 'relative', overflow: 'hidden', background: 'var(--card-bg)', 
                      borderRadius: '16px', border: '1px solid var(--color-border)',
                      display: 'flex', flexDirection: 'column'
                    }}>
                      <div style={{ position: 'relative', width: '100%', height: '160px', overflow: 'hidden', cursor: 'pointer' }} onClick={() => loadHistoryItem(item)}>
                        <img src={item.thumbnail} alt="Analysis thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(0.3)' }} />
                        <div style={{
                          position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                          opacity: 0, transition: 'all 0.3s ease', gap: '0.5rem'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.opacity = 1}
                        onMouseOut={(e) => e.currentTarget.style.opacity = 0}
                        >
                          <span style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--color-primary)', letterSpacing: '0.1em' }}>VIEW REPORT</span>
                        </div>
                      </div>
                      
                      <div className="history-info" style={{ padding: '1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                          <span style={{
                            padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 900,
                            backgroundColor: item.verdict === 'FAKE' ? 'rgba(255, 59, 48, 0.1)' : item.verdict === 'REAL' ? 'rgba(52, 199, 89, 0.1)' : 'rgba(255, 149, 0, 0.1)',
                            color: item.verdict === 'FAKE' ? 'var(--color-danger)' : item.verdict === 'REAL' ? 'var(--color-success)' : 'var(--color-warning)',
                            border: `1px solid ${item.verdict === 'FAKE' ? 'rgba(255, 59, 48, 0.2)' : item.verdict === 'REAL' ? 'rgba(52, 199, 89, 0.2)' : 'rgba(255, 149, 0, 0.2)'}`
                          }}>
                            {item.verdict === 'FAKE' ? '❌ FAKE' : item.verdict === 'REAL' ? '✅ REAL' : '⚠️ SUSPICIOUS'}
                          </span>
                          <span style={{ fontFamily: 'Share Tech Mono', fontSize: '1.1rem', fontWeight: 900, color: 'var(--color-primary)' }}>{Math.round(item.score)}%</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: '700', marginTop: '0.5rem' }}>
                          {formatHistoryDate(item.date)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {(isAnalyzing || result) && (
          <div className="lab-active-area fade-in">
            {isAnalyzing ? (
              <div className="analyzing-section side-by-side-lab">
                <div className="lab-visual-side">
                  <div className="media-scan-container">
                    {mediaUrl && (
                      <div className="preview-main">
                        <img src={mediaUrl} alt="Analyzing" />
                        <div className="scan-beam-cinematic"></div>
                      </div>
                    )}
                    <div className="scan-overlay-grid"></div>
                  </div>
                  <p className="analyzing-status-text">DEEP SCAN IN PROGRESS...</p>
                </div>

                <div className="lab-terminal-side">
                  <div className="terminal-log-container-premium">
                    <div className="terminal-header-tactical">
                      <div className="window-controls">
                        <span className="dot-red"></span>
                        <span className="dot-yellow"></span>
                        <span className="dot-green"></span>
                      </div>
                      <span className="term-title-bold">AUDRA_INTELLIGENCE_ENGINE.EXE</span>
                    </div>
                    <div className="terminal-body-forensic">
                      {analysisLogs.map((log, i) => (
                        <div key={i} className="log-line-tactical">
                          <span className="log-time">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                          <span className="log-arrow-green">»</span> {log}
                        </div>
                      ))}
                      <div className="log-cursor-blinking">_</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
            <div className="results-section fade-in" style={{ padding: '2rem 0', minHeight: '600px' }}>
              <div className="results-header" style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-end', 
                marginBottom: '2.5rem',
                borderBottom: '2px solid var(--color-primary)',
                paddingBottom: '1rem'
              }}>
                <div>
                  <div style={{ fontFamily: 'Share Tech Mono', fontSize: '0.7rem', color: 'var(--color-primary)', letterSpacing: '0.3em', marginBottom: '0.5rem' }}>// REPORT_GENERATED_SUCCESSFULLY</div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '0.05em', color: 'var(--color-text)', textTransform: 'uppercase', margin: 0 }}>FORENSIC_VERDICT</h2>
                </div>
                <button className="reset-btn" onClick={handleReset} style={{ 
                  padding: '0.6rem 1.5rem', 
                  borderRadius: '4px', 
                  background: 'var(--color-primary)', 
                  border: 'none', 
                  fontWeight: 900, 
                  fontSize: '0.8rem', 
                  color: 'var(--color-bg)', 
                  cursor: 'pointer', 
                  letterSpacing: '0.15em',
                  fontFamily: 'Share Tech Mono',
                  boxShadow: '0 0 20px rgba(var(--color-primary-rgb), 0.3)'
                }}>NEW_SCAN</button>
              </div>
              <div className="results-content" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3rem', alignItems: 'start' }}>
                <div className="media-preview-panel premium-card" style={{ 
                  borderRadius: '24px', 
                  overflow: 'hidden', 
                  border: '1px solid var(--color-border)', 
                  boxShadow: '0 40px 80px rgba(0,0,0,0.3)', 
                  background: '#000', 
                  position: 'sticky', 
                  top: '2rem',
                  minHeight: '400px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img src={mediaUrl} alt="Analyzed media" className="final-preview" style={{ width: '100%', height: 'auto', maxHeight: '70vh', objectFit: 'contain', display: 'block' }} />
                </div>
                <div className="report-data-panel">
                  <VerdictPanel result={result} />
                </div>
              </div>
            </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return <LandingPage
    toolComponent={LiveToolComponent}
    history={history}
    loadHistoryItem={loadHistoryItem}
    setHistory={setHistory}
    formatHistoryDate={formatHistoryDate}
  />;
}

export default App;
