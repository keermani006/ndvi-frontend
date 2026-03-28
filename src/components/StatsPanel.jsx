export default function StatsPanel({ stats, isProcessing }) {
  const statCards = [
    {
      label: 'Mean NDVI',
      key: 'mean',
      badge: 'AVG',
      badgeClass: 'blue',
      description: 'Average vegetation index across all pixels',
    },
    {
      label: 'Min NDVI',
      key: 'min',
      badge: 'MIN',
      badgeClass: 'red',
      description: 'Lowest NDVI value in the dataset',
    },
    {
      label: 'Max NDVI',
      key: 'max',
      badge: 'MAX',
      badgeClass: 'green',
      description: 'Highest NDVI value in the dataset',
    },
    {
      label: 'Vegetation %',
      key: 'vegetationPercent',
      badge: 'VEG',
      badgeClass: 'amber',
      description: 'Pixels with NDVI > 0.2 (vegetation threshold)',
      suffix: '%',
    },
  ]

  return (
    <div className="panel-card">
      <div className="panel-header">
        <h2>Statistics</h2>
        <p>Computed via lazy fold</p>
      </div>
      <div className="panel-body">
        {isProcessing ? (
          <div className="stats-empty">
            <div className="spinner"></div>
            <p>Computing statistics...</p>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
              Single-pass lazy fold in Haskell
            </p>
          </div>
        ) : stats ? (
          <div className="stats-grid">
            {statCards.map((card) => (
              <div className="stat-card" key={card.key} id={`stat-${card.key}`}>
                <div className="stat-card-header">
                  <span className="stat-label">{card.label}</span>
                  <span className={`stat-badge ${card.badgeClass}`}>{card.badge}</span>
                </div>
                <div className="stat-value">
                  {stats[card.key] !== undefined
                    ? card.suffix
                      ? stats[card.key].toFixed(1) + card.suffix
                      : stats[card.key].toFixed(4)
                    : '—'}
                </div>
                <div className="stat-description">{card.description}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="stats-empty">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}>
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            <p>No dataset loaded</p>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Process a dataset to see statistics
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
