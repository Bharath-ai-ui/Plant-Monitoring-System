import './FertilizerCard.css';

export default function FertilizerCard({ result }) {
  if (!result) {
    return (
      <div className="fertilizer-card glass animate-fade-in" id="fertilizer-card">
        <div className="fertilizer-card__header">
          <h3 className="fertilizer-card__title">💊 Fertilizer Recommendation</h3>
        </div>
        <div className="fertilizer-card__empty">
          <span className="fertilizer-card__empty-icon">🧪</span>
          <p>Awaiting detection results…</p>
        </div>
      </div>
    );
  }

  const isHealthy = result.status === 'Healthy';

  return (
    <div className="fertilizer-card glass animate-fade-in" id="fertilizer-card">
      <div className="fertilizer-card__header">
        <h3 className="fertilizer-card__title">💊 Fertilizer Recommendation</h3>
      </div>

      <div className="fertilizer-card__content">
        <div className={`fertilizer-card__name-badge ${isHealthy ? 'fertilizer-card__name-badge--healthy' : ''}`}>
          <span className="fertilizer-card__icon">{isHealthy ? '🌿' : '🧴'}</span>
          <span className="fertilizer-card__name">{result.fertilizer}</span>
        </div>

        <div className="fertilizer-card__advice">
          <span className="fertilizer-card__advice-label">Usage Instructions</span>
          <p className="fertilizer-card__advice-text">{result.advice}</p>
        </div>

        {!isHealthy && (
          <div className="fertilizer-card__warning">
            <span>⚡</span>
            <span>Apply as directed. Recheck after treatment period.</span>
          </div>
        )}
      </div>
    </div>
  );
}
