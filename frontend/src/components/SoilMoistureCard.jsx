import { useEffect, useState } from 'react';
import './SoilMoistureCard.css';

export default function SoilMoistureCard({ moisture, moistureStatus }) {
  const [displayValue, setDisplayValue] = useState(0);

  // Animate the value counting up
  useEffect(() => {
    if (moisture === null || moisture === undefined) return;
    const target = Math.round(moisture);
    let current = displayValue;

    const step = () => {
      const diff = target - current;
      if (Math.abs(diff) < 1) {
        setDisplayValue(target);
        return;
      }
      current += diff * 0.15;
      setDisplayValue(Math.round(current));
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [moisture]);

  const getStatusColor = () => {
    switch (moistureStatus) {
      case 'Dry':     return 'dry';
      case 'Optimal': return 'optimal';
      case 'Wet':     return 'wet';
      default:        return 'unknown';
    }
  };

  const getStatusIcon = () => {
    switch (moistureStatus) {
      case 'Dry':     return '🏜️';
      case 'Optimal': return '✨';
      case 'Wet':     return '💧';
      default:        return '❓';
    }
  };

  return (
    <div className="soil-moisture glass animate-fade-in" id="soil-moisture-card">
      <div className="soil-moisture__header">
        <h3 className="soil-moisture__title">🌊 Soil Moisture</h3>
        <span className={`soil-moisture__badge soil-moisture__badge--${getStatusColor()}`}>
          {getStatusIcon()} {moistureStatus || '—'}
        </span>
      </div>

      <div className="soil-moisture__gauge">
        <div className="soil-moisture__circle">
          <svg viewBox="0 0 120 120" className="soil-moisture__svg">
            {/* Background track */}
            <circle
              cx="60" cy="60" r="52"
              fill="none"
              stroke="var(--color-surface-2)"
              strokeWidth="8"
            />
            {/* Fill arc */}
            <circle
              cx="60" cy="60" r="52"
              fill="none"
              className={`soil-moisture__arc soil-moisture__arc--${getStatusColor()}`}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(displayValue / 100) * 327} 327`}
              transform="rotate(-90 60 60)"
            />
          </svg>
          <div className="soil-moisture__value-group">
            <span className="soil-moisture__value">{displayValue}</span>
            <span className="soil-moisture__unit">%</span>
          </div>
        </div>
      </div>

      {/* Progress bar (secondary) */}
      <div className="soil-moisture__bar-section">
        <div className="soil-moisture__bar-labels">
          <span>0%</span>
          <span>Dry</span>
          <span>Optimal</span>
          <span>Wet</span>
          <span>100%</span>
        </div>
        <div className="soil-moisture__bar">
          <div
            className={`soil-moisture__bar-fill soil-moisture__bar-fill--${getStatusColor()}`}
            style={{ width: `${displayValue}%` }}
          />
          {/* Zone markers */}
          <div className="soil-moisture__zone-marker" style={{ left: '30%' }} />
          <div className="soil-moisture__zone-marker" style={{ left: '70%' }} />
        </div>
      </div>

      <div className="soil-moisture__footer">
        <span className="soil-moisture__update-text">Auto-refreshes every 5 seconds</span>
      </div>
    </div>
  );
}
