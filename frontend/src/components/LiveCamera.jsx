import { useState, useRef } from 'react';
import './LiveCamera.css';

const STREAM_URL = 'http://10.219.67.199:81/stream';

export default function LiveCamera({ isDetecting, onStartDetection, onStopDetection }) {
  const [streamError, setStreamError] = useState(false);
  const [streamLoaded, setStreamLoaded] = useState(false);
  const imgRef = useRef(null);

  const handleStreamError = () => {
    setStreamError(true);
    setStreamLoaded(false);
  };

  const handleStreamLoad = () => {
    setStreamError(false);
    setStreamLoaded(true);
  };

  const handleRetry = () => {
    setStreamError(false);
    setStreamLoaded(false);
    if (imgRef.current) {
      imgRef.current.src = STREAM_URL + '?t=' + Date.now();
    }
  };

  return (
    <div className="live-camera glass" id="live-camera-section">
      <div className="live-camera__header">
        <div className="live-camera__title-group">
          <h2 className="live-camera__title">📹 Live Camera Feed</h2>
          <span className={`live-camera__badge ${streamLoaded ? 'live-camera__badge--live' : 'live-camera__badge--off'}`}>
            <span className="live-camera__badge-dot" />
            {streamLoaded ? 'LIVE' : streamError ? 'Offline' : 'Connecting…'}
          </span>
        </div>
        <span className="live-camera__source">ESP32-CAM • MJPEG Stream</span>
      </div>

      <div className="live-camera__viewport">
        {streamError ? (
          <div className="live-camera__error">
            <span className="live-camera__error-icon">📡</span>
            <p className="live-camera__error-title">Stream not reachable</p>
            <p className="live-camera__error-msg">Cannot connect to ESP32-CAM at {STREAM_URL}</p>
            <button className="live-camera__retry-btn" onClick={handleRetry} id="retry-stream-btn">
              ↻ Retry Connection
            </button>
          </div>
        ) : (
          <img
            ref={imgRef}
            src={STREAM_URL}
            alt="ESP32-CAM Live Stream"
            className="live-camera__stream"
            onError={handleStreamError}
            onLoad={handleStreamLoad}
          />
        )}

        {/* Overlay scan line effect when detecting */}
        {isDetecting && !streamError && (
          <div className="live-camera__scan-overlay">
            <div className="live-camera__scan-line" />
          </div>
        )}
      </div>

      <div className="live-camera__controls">
        {!isDetecting ? (
          <button
            className="live-camera__btn live-camera__btn--start"
            onClick={onStartDetection}
            id="start-detection-btn"
          >
            <span className="live-camera__btn-icon">▶</span>
            Start Detection
          </button>
        ) : (
          <button
            className="live-camera__btn live-camera__btn--stop"
            onClick={onStopDetection}
            id="stop-detection-btn"
          >
            <span className="live-camera__btn-icon">⏹</span>
            Stop Detection
          </button>
        )}
        <span className="live-camera__controls-hint">
          {isDetecting ? 'Predicting frames online…' : 'Click Start to begin AI analysis'}
        </span>
      </div>
    </div>
  );
}
