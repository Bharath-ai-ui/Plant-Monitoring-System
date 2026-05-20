import './DetectionResult.css';

export default function DetectionResult({ result, isLoading }) {
  if (!result && !isLoading) {
    return (
      <div className="detection-result glass animate-fade-in" id="detection-result-card">
        <div className="detection-result__header">
          <h3 className="detection-result__title">🔬 Disease Detection</h3>
        </div>
        <div className="detection-result__empty">
          <span className="detection-result__empty-icon">🌱</span>
          <p>Start detection to analyze plant health</p>
        </div>
      </div>
    );
  }

  const confidence = result ? Math.round(result.confidence * 100) : 0;
  const isHealthy = result?.status === 'Healthy';

  return (
    <div className="detection-result glass animate-fade-in" id="detection-result-card">
      <div className="detection-result__header">
        <h3 className="detection-result__title">🔬 Disease Detection</h3>
        {isLoading && (
          <span className="detection-result__loading">
            <span className="detection-result__spinner" />
            Analyzing…
          </span>
        )}
      </div>

      {result && (
        <div className="detection-result__content">
          {/* Status badge */}
          <div className={`detection-result__status ${isHealthy ? 'detection-result__status--healthy' : 'detection-result__status--infected'}`}>
            <span className="detection-result__status-icon">{isHealthy ? '✅' : '⚠️'}</span>
            <span className="detection-result__status-text">{result.status}</span>
          </div>

          {/* Disease name */}
          <div className="detection-result__disease">
            <span className="detection-result__label">Detected Condition</span>
            <span className="detection-result__value">{result.disease}</span>
          </div>

          {/* Confidence bar */}
          <div className="detection-result__confidence">
            <div className="detection-result__confidence-header">
              <span className="detection-result__label">Confidence</span>
              <span className="detection-result__confidence-pct">{confidence}%</span>
            </div>
            <div className="detection-result__bar">
              <div
                className={`detection-result__bar-fill ${isHealthy ? 'detection-result__bar-fill--healthy' : 'detection-result__bar-fill--infected'}`}
                style={{ width: `${confidence}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
