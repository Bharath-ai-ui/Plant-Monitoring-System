import './StatusIndicator.css';

export default function StatusIndicator({ isDetecting, detectionCount, lastUpdate }) {
  return (
    <div className="status-indicator glass animate-fade-in" id="status-indicator">
      <div className="status-indicator__header">
        <h3 className="status-indicator__title">📡 System Status</h3>
      </div>

      <div className="status-indicator__grid">
        <div className="status-indicator__item">
          <span className="status-indicator__item-icon">🤖</span>
          <div className="status-indicator__item-info">
            <span className="status-indicator__item-label">AI Engine</span>
            <span className={`status-indicator__item-value ${isDetecting ? 'status-indicator__item-value--active' : ''}`}>
              {isDetecting ? 'Running' : 'Idle'}
            </span>
          </div>
          <span className={`status-indicator__dot ${isDetecting ? 'status-indicator__dot--active' : 'status-indicator__dot--idle'}`} />
        </div>

        <div className="status-indicator__item">
          <span className="status-indicator__item-icon">🔢</span>
          <div className="status-indicator__item-info">
            <span className="status-indicator__item-label">Scans</span>
            <span className="status-indicator__item-value">{detectionCount}</span>
          </div>
        </div>

        <div className="status-indicator__item">
          <span className="status-indicator__item-icon">🕐</span>
          <div className="status-indicator__item-info">
            <span className="status-indicator__item-label">Last Update</span>
            <span className="status-indicator__item-value">
              {lastUpdate ? new Date(lastUpdate).toLocaleTimeString() : '—'}
            </span>
          </div>
        </div>

        <div className="status-indicator__item">
          <span className="status-indicator__item-icon">🌡️</span>
          <div className="status-indicator__item-info">
            <span className="status-indicator__item-label">Model</span>
            <span className="status-indicator__item-value">MobileNetV2</span>
          </div>
        </div>
      </div>
    </div>
  );
}
