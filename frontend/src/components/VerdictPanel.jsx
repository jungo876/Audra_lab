import React from 'react';
import { AlertTriangle, CheckCircle, HelpCircle, ShieldAlert, FileText, Volume2, X, Activity } from 'lucide-react';
import ConfidenceGauge from './ConfidenceGauge';
import './VerdictPanel.css';

export default function VerdictPanel({ result }) {
  const [isSpeaking, setIsSpeaking] = React.useState(false);

  if (!result) return null;

  const { verdict, confidence, reason, flags = [], nutritionalAnalysis, recommendations } = result;
  
  // Backward compatibility / Mapping
  const confidenceScore = confidence;
  const summary = reason;
  const techniques = flags;

  const handleListen = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    let speechText = `Forensic report for operative Gaurav. ${summary}`;
    if (result.nutritionalAnalysis?.isFood) {
      speechText += `. Nutritional intelligence confirmed. This media contains approximately ${result.nutritionalAnalysis.estimatedCalories}. ${result.nutritionalAnalysis.whyIsGood}.`;
    }

    const utterance = new SpeechSynthesisUtterance(speechText);
    
    // Find American Female voice - more robust selection
    const voices = window.speechSynthesis.getVoices();
    const usFemaleVoice = voices.find(v => (v.lang === 'en-US' || v.lang === 'en_US') && (v.name.toLowerCase().includes('samantha') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('female')));
    if (usFemaleVoice) utterance.voice = usFemaleVoice;

    utterance.onend = () => setIsSpeaking(false);
    utterance.rate = 1.0; 
    utterance.pitch = 1.0; 
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // Auto-speak disabled to prevent render interruption
  React.useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const getVerdictDetails = (v) => {
    switch (v) {
      case 'FAKE':
        return {
          icon: ShieldAlert,
          color: 'var(--color-danger)',
          text: '❌ THIS IMAGE LOOKS FAKE',
          subtitle: 'Signs of editing or AI generation detected'
        };
      case 'REAL':
        return {
          icon: CheckCircle,
          color: 'var(--color-success)',
          text: '✅ THIS IMAGE LOOKS REAL',
          subtitle: 'No signs of editing found'
        };
      default:
        return {
          icon: HelpCircle,
          color: 'var(--color-warning)',
          text: '⚠️ NOT SURE',
          subtitle: 'Some suspicious signs — verify manually'
        };
    }
  };

  const { icon: Icon, color, text, subtitle } = getVerdictDetails(verdict);

  // Label for gauge context
  const gaugeLabel = verdict === 'FAKE' ? 'suspicious' : verdict === 'REAL' ? 'genuine' : 'uncertain';

  return (
    <div className="verdict-panel">
      <div className="verdict-header" style={{ borderColor: color }}>
        <div className="verdict-title">
          <Icon size={32} color={color} />
          <div>
            <h2 style={{ color }}>{text}</h2>
            <p className="verdict-subtitle">{subtitle}</p>
          </div>
        </div>
      </div>

      <div className="verdict-grid">
        <div className="gauge-container card">
          <h3>AI Confidence</h3>
          <ConfidenceGauge score={confidenceScore} verdict={verdict} />
          <p className="gauge-label">{Math.round(confidenceScore)}% {gaugeLabel}</p>
        </div>

        <div className="summary-container card">
          <div className="summary-header">
            <h3>Summary</h3>
            <button 
              className={`voice-btn ${isSpeaking ? 'active' : ''}`} 
              onClick={handleListen}
              style={{ background: isSpeaking ? 'var(--color-danger)' : 'var(--color-primary)', color: '#000' }}
            >
              {isSpeaking ? <X size={14} /> : <Volume2 size={14} />}
              <span>{isSpeaking ? "MUTE" : "UNMUTE VOICE"}</span>
            </button>
          </div>
          <p className="summary-text" style={{ marginBottom: '2.5rem' }}>{summary}</p>
          
          {result.nutritionalAnalysis?.isFood && (
            <div className="nutrition-pane-premium" style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(var(--color-primary-rgb), 0.05)', borderRadius: '16px', border: '1px solid rgba(var(--color-primary-rgb), 0.2)' }}>
              <h4 style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Activity size={18} /> NUTRITIONAL INTELLIGENCE
              </h4>
              <div style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '1rem', fontFamily: 'Share Tech Mono' }}>
                {result.nutritionalAnalysis.estimatedCalories}
              </div>
              <p style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1.5rem', color: 'var(--color-text)' }}>
                {result.nutritionalAnalysis.whyIsGood}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Pros</div>
                  {result.nutritionalAnalysis.pros.map((pro, i) => (
                    <div key={i} style={{ color: 'var(--color-success)', fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.25rem' }}>+ {pro}</div>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Cons</div>
                  {result.nutritionalAnalysis.cons.map((con, i) => (
                    <div key={i} style={{ color: 'var(--color-danger)', fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.25rem' }}>- {con}</div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {techniques.length > 0 && (
            <div className="techniques-detected" style={{ marginTop: '3.5rem' }}>
              <h4 style={{ marginBottom: '1.5rem', color: 'var(--color-primary)', letterSpacing: '0.1em' }}>DETECTED_ANOMALOUS_TRAITS:</h4>
              <div className="tags">
                {techniques.map((tech, idx) => (
                  <span key={idx} className="tag">{tech}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {recommendations && (
        <div className="recommendations-container card">
          <h3><FileText size={18} /> Next Steps for Analyst</h3>
          <p>{recommendations}</p>
        </div>
      )}
    </div>
  );
}
