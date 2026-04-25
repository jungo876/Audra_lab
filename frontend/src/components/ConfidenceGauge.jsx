import React, { useEffect, useState } from 'react';
import './ConfidenceGauge.css';

export default function ConfidenceGauge({ score, verdict }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Animate the score up to the target
    const duration = 1500; // 1.5 seconds
    const steps = 60;
    const stepTime = Math.abs(Math.floor(duration / steps));
    let current = 0;
    
    const timer = setInterval(() => {
      current += score / steps;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  // Use the human-friendly verdict labels
  let color = 'var(--color-warning)';
  if (verdict === 'REAL') {
    color = 'var(--color-success)';
  } else if (verdict === 'FAKE') {
    color = 'var(--color-danger)';
  }

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="confidence-gauge">
      <div className="gauge-svg-container">
        <svg width="160" height="160" viewBox="0 0 160 160">
          <circle
            className="gauge-background"
            cx="80" cy="80" r={radius}
            strokeWidth="12"
          />
          <circle
            className="gauge-progress"
            cx="80" cy="80" r={radius}
            strokeWidth="12"
            stroke={color}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset,
              transition: 'stroke-dashoffset 0.1s linear'
            }}
          />
        </svg>
        <div className="gauge-text" style={{ color }}>
          <span className="score">{animatedScore}</span>
          <span className="percent">%</span>
        </div>
      </div>
    </div>
  );
}
