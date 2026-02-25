export default function StatCard({ title, value, change, icon, color, suffix = "" }) {
  const positive = change >= 0;

  return (
    <>
      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-title">{title}</span>
          <span className="stat-icon" style={{ background: `${color}22`, color }}>
            {icon}
          </span>
        </div>
        <div className="stat-value">
          {typeof value === "number" ? value.toLocaleString() : value}
          {suffix && <span className="stat-suffix">{suffix}</span>}
        </div>
        {change !== undefined && (
          <div className={`stat-change ${positive ? "positive" : "negative"}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {positive
                ? <polyline points="18 15 12 9 6 15" />
                : <polyline points="6 9 12 15 18 9" />}
            </svg>
            <span>{Math.abs(change)}% vs last month</span>
          </div>
        )}
      </div>

      <style>{`
        .stat-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          transition: background 0.15s ease;
        }
        .stat-card:hover {
          background: var(--bg-card-hover);
        }
        .stat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .stat-title {
          font-size: 13px;
          color: var(--text-secondary);
          font-weight: 500;
        }
        .stat-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }
        .stat-value {
          font-size: 28px;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.5px;
          line-height: 1;
        }
        .stat-suffix {
          font-size: 16px;
          font-weight: 500;
          color: var(--text-secondary);
          margin-left: 4px;
        }
        .stat-change {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          font-weight: 500;
        }
        .stat-change.positive {
          color: var(--success);
        }
        .stat-change.negative {
          color: var(--danger);
        }
      `}</style>
    </>
  );
}
