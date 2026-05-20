import { useState, useEffect, useRef, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import LiveCamera from './components/LiveCamera';
import DetectionResult from './components/DetectionResult';
import FertilizerCard from './components/FertilizerCard';
import SoilMoistureCard from './components/SoilMoistureCard';
import StatusIndicator from './components/StatusIndicator';
import './App.css';

const API_BASE = 'http://localhost:8000';
const STREAM_URL = 'http://10.219.67.199:81/stream';

export default function App() {
  const [isDetecting, setIsDetecting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [detectionResult, setDetectionResult] = useState(null);
  const [moisture, setMoisture] = useState(null);
  const [moistureStatus, setMoistureStatus] = useState(null);
  const [detectionCount, setDetectionCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [error, setError] = useState(null);

  const moistureIntervalRef = useRef(null);
  const isDetectingRef = useRef(false);
  const detectionTimeoutRef = useRef(null);

  const fetchMoisture = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/moisture`);
      if (!res.ok) throw new Error('Moisture API failed');
      const data = await res.json();
      setMoisture(data.moisture);
      setMoistureStatus(data.status);
    } catch {
      // Intentionally ignoring minor sensor fetch errors to not pollute UI
    }
  }, []);

  const fetchStreamStatus = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/stream-status`);
      if (res.ok) {
        const data = await res.json();
        setConnectionStatus(data.status);
      } else {
        setConnectionStatus('failed');
      }
    } catch {
      setConnectionStatus('failed');
    }
  }, []);

  // Async lock mechanism loop for prediction
  const runDetectionLoop = useCallback(async () => {
    if (!isDetectingRef.current) return;
    
    setIsLoading(true);
    let success = false;
    let nextDelay = 3000;

    try {
      const res = await fetch(`${API_BASE}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stream_url: STREAM_URL }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Backend error');
      
      setDetectionResult({
        disease: data.disease,
        confidence: data.confidence,
        status: data.status,
        fertilizer: data.fertilizer,
        advice: data.advice,
      });
      setDetectionCount((c) => c + 1);
      setLastUpdate(Date.now());
      setError(null);
      setConnectionStatus('connected');
      success = true;
    } catch (err) {
      if (err.message === 'Failed to fetch') {
        setError('Backend error: Cannot connect to server');
        setConnectionStatus('failed');
      } else {
        setError(`Detection failed: ${err.message}`);
      }
      // Give the system a bit more time to recover from errors
      nextDelay = 5000;
    } finally {
      setIsLoading(false);
      
      // Request control: Only schedule next fetch AFTER previous is fully done
      if (isDetectingRef.current) {
        detectionTimeoutRef.current = setTimeout(runDetectionLoop, nextDelay);
      }
    }
  }, []);

  const handleStartDetection = useCallback(() => {
    setIsDetecting(true);
    isDetectingRef.current = true;
    setError(null);
    runDetectionLoop();
  }, [runDetectionLoop]);

  const handleStopDetection = useCallback(() => {
    setIsDetecting(false);
    isDetectingRef.current = false;
    if (detectionTimeoutRef.current) clearTimeout(detectionTimeoutRef.current);
  }, []);

  // Initial setup & moisture polling
  useEffect(() => {
    fetchStreamStatus();
    fetchMoisture();
    moistureIntervalRef.current = setInterval(fetchMoisture, 5000);
    return () => {
      if (moistureIntervalRef.current) clearInterval(moistureIntervalRef.current);
      if (detectionTimeoutRef.current) clearTimeout(detectionTimeoutRef.current);
    };
  }, [fetchStreamStatus, fetchMoisture]);

  return (
    <div className="app" id="app-root">
      <Sidebar isDetecting={isDetecting} connectionStatus={connectionStatus} />

      <main className="dashboard" id="dashboard-main">
        <header className="dashboard__header animate-fade-in">
          <div>
            <h1 className="dashboard__heading">Plant Health Dashboard</h1>
            <p className="dashboard__subheading">Real-time AI-powered plant disease detection & monitoring</p>
          </div>
          <div className="dashboard__header-actions">
            {error && (
              <div className="dashboard__error" id="error-banner">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}
          </div>
        </header>

        <div className="dashboard__grid">
          <div className="dashboard__col-left">
            <LiveCamera
              isDetecting={isDetecting}
              onStartDetection={handleStartDetection}
              onStopDetection={handleStopDetection}
            />
            <StatusIndicator
              isDetecting={isDetecting}
              detectionCount={detectionCount}
              lastUpdate={lastUpdate}
            />
          </div>

          <div className="dashboard__col-right">
            <DetectionResult result={detectionResult} isLoading={isLoading} />
            <FertilizerCard result={detectionResult} />
            <SoilMoistureCard moisture={moisture} moistureStatus={moistureStatus} />
          </div>
        </div>
      </main>
    </div>
  );
}
